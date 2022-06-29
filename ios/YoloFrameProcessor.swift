//
//  YoloFrameProcessor.swift
//  eagleapp2
//
//  Created by Jeffrey Cheng on 6/24/22.
//

import Foundation
import TensorFlowLite
import CoreImage
import VideoToolbox

extension UIImage {
    public convenience init?(pixelBuffer: CVPixelBuffer) {
        var cgImage: CGImage?
        VTCreateCGImageFromCVPixelBuffer(pixelBuffer, options: nil, imageOut: &cgImage)

        guard let cgImage = cgImage else {
            return nil
        }

        self.init(cgImage: cgImage)
    }
}

@objc(YoloFrameProcessor)
public class YoloFrameProcessor: NSObject, FrameProcessorPluginBase {
  
  static var detector: Interpreter?
  static var scale: CGFloat = 1.0
  static var aspectRatio: CGFloat = 1.0
  static var gaming: Bool = false;
  static var written: Int = 0;
  static var inputSize: Int = 416;
  
  public static func resize(sourceImage: CIImage) -> CIImage {
    let resizeFilter = CIFilter(name:"CILanczosScaleTransform")!
    
    YoloFrameProcessor.scale = CGFloat(YoloFrameProcessor.inputSize) / sourceImage.extent.height
    YoloFrameProcessor.aspectRatio = CGFloat(YoloFrameProcessor.inputSize) / (sourceImage.extent.width * scale)

    // Apply resizing
    resizeFilter.setValue(sourceImage, forKey: kCIInputImageKey)
    resizeFilter.setValue(YoloFrameProcessor.scale, forKey: kCIInputScaleKey)
    resizeFilter.setValue(YoloFrameProcessor.aspectRatio, forKey: kCIInputAspectRatioKey)
    let outputImage = resizeFilter.outputImage
    
    return outputImage!
  }
  
  public static func prepareInput(ciImage: CIImage) -> Data {
    let CGcontext = CIContext(options: nil)

    let image : CGImage = CGcontext.createCGImage(ciImage, from: ciImage.extent)!

    let context = CGContext(
        data: nil,
        width: YoloFrameProcessor.inputSize, height: YoloFrameProcessor.inputSize,
        bitsPerComponent: 8, bytesPerRow: YoloFrameProcessor.inputSize * 4,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
    )!

    context.draw(image, in: CGRect(x: 0, y: 0, width: YoloFrameProcessor.inputSize, height: YoloFrameProcessor.inputSize))
    let imageData = context.data!

    var inputData = Data()
    for row in 0 ..< YoloFrameProcessor.inputSize {
        for col in 0 ..< YoloFrameProcessor.inputSize {
            let offset = 4 * (row * context.width + col)
            // (Ignore offset 0, the unused alpha channel)
            let red = imageData.load(fromByteOffset: offset+1, as: UInt8.self)
            let green = imageData.load(fromByteOffset: offset+2, as: UInt8.self)
            let blue = imageData.load(fromByteOffset: offset+3, as: UInt8.self)

            // Normalize channel values to [0.0, 1.0].
            var normalizedRed = Float32(red) / 255.0
            var normalizedGreen = Float32(green) / 255.0
            var normalizedBlue = Float32(blue) / 255.0

            // Append normalized values to Data object in RGB order.
            let elementSize = MemoryLayout.size(ofValue: normalizedRed)

            var bytes = [UInt8](repeating: 0, count: elementSize)
            memcpy(&bytes, &normalizedRed, elementSize)
            inputData.append(&bytes, count: elementSize)
            memcpy(&bytes, &normalizedGreen, elementSize)
            inputData.append(&bytes, count: elementSize)
            memcpy(&bytes, &normalizedBlue, elementSize)
            inputData.append(&bytes, count: elementSize)
      }
    }
    
    return inputData
  }
  
  public static func initDetector(fileName: String, fileExt: String) {
    if YoloFrameProcessor.detector == nil {
      let modelFileName = fileName
      let modelFileExt = fileExt
      
      let modelPath = Bundle.main.path(
        forResource: modelFileName,
        ofType: modelFileExt
      )
    
      do {
        YoloFrameProcessor.detector = try Interpreter(modelPath: modelPath!)
        try YoloFrameProcessor.detector?.allocateTensors()
      } catch let error {
        print("Failed to create the interpreter with error: \(error.localizedDescription)")
      }
      
      print("Successfully created interpreter!")
    }
  }
  
  public static func interpretOutput(boxesXYWH: Tensor, scoresData: Tensor,side:Int) -> (Array<Float32>, Array<Float32>, Array<Int>, Int) {
    let boxesBuffer = UnsafeMutableBufferPointer<Float32>.allocate(capacity: 10140)
    let scoresBuffer = UnsafeMutableBufferPointer<Float32>.allocate(capacity: 2535)

    boxesXYWH.data.copyBytes(to:boxesBuffer)
    scoresData.data.copyBytes(to:scoresBuffer)
    
    let boxesUnfiltered = Array(boxesBuffer)
    let scoresUnfiltered = Array(scoresBuffer)
    
    print(scoresUnfiltered)
    
    var filteredIndices: Array<Int> = []
    let SCORE_THRESHOLD = Float32(0.4)
    for i in 0 ..< scoresUnfiltered.count {
      if scoresUnfiltered[i] > SCORE_THRESHOLD {
        filteredIndices.append(i)
      }
    }
    
    var boxes: Array<Float32> = []
    var scores: Array<Float32> = []
    var classes: Array<Int> = []
    var numDetections = 0
    
    print(filteredIndices)
    
    for i in filteredIndices {
      let w = boxesUnfiltered[4 * i+2] / Float(YoloFrameProcessor.inputSize) / 2
      let h = boxesUnfiltered[4 * i+3] / Float(YoloFrameProcessor.inputSize) / 2
      let x = side == 0 ? boxesUnfiltered[4 * i] / Float(YoloFrameProcessor.inputSize) / 2 : 0.5 + (boxesUnfiltered[4*i] / Float(YoloFrameProcessor.inputSize) / 2)
      let y = boxesUnfiltered[4 * i+1] / Float(YoloFrameProcessor.inputSize) / 2
      
      // camera should not be that close to the basket
      if w < 0.26 && h < 0.26 && (boxes.count < 4 || w * h < boxes[2] * boxes[3]) {
        numDetections += 1
        boxes = [x, y, w, h]
        // only 1 class
        scores = [scoresUnfiltered[i]]
        classes = [0]
      }
    }
    
    return (boxes, scores, classes, numDetections)
  }
  
  @objc
  public static func detect(ciImage: CIImage, width: Int, height: Int, orientation: UIImage.Orientation) -> Array<Float32>? {
    initDetector(fileName: "hoops_final", fileExt: "tflite")

    // preprocess
    var rawBoxes: Array<Array<Float32> > = []
    var rawScores: Array<Array<Float32> > = []
    var rawClasses: Array<Array<Float32> > = []
    var rawNumDetections: Array<Float32> = []
    
    for i in 0..<2 {
      let w = orientation == UIImage.Orientation.up ? width : height
      let h = orientation == UIImage.Orientation.up ? height: width
      var cropped: CIImage
      if i == 0 {
        cropped = ciImage.cropped(to: CGRect(x:0, y:h/2, width:w / 2, height:h / 2))
      } else {
        // TODO: figure out orientation
        cropped = ciImage.cropped(to: CGRect(x:w/2,y:h/2,width:w/2,height:h/2))
      }
      let resizedCIImage = resize(sourceImage: cropped)
      let inputData = prepareInput(ciImage: resizedCIImage)

      do {
        // run
        try YoloFrameProcessor.detector?.copy(inputData, toInputAt:0)
        try YoloFrameProcessor.detector?.invoke()

        let outputBoxes = try YoloFrameProcessor.detector?.output(at:0)
        let outputPreds = try YoloFrameProcessor.detector?.output(at:1)

        // postprocess
        let (boxes, scores, classes, numDetections) = interpretOutput(boxesXYWH: outputBoxes!, scoresData: outputPreds!, side:i)
  //
        print("detections", i)
        print(boxes)
  //      print(scores)
  //      print(classes)
  //      print(numDetections)

        // format output
//        var output: Array<Float32> = []
        if (boxes.count > 0) {
          rawNumDetections += [Float32(numDetections)]
  //        output.append(Float32(numDetections))
          rawBoxes.append(boxes)
          rawScores.append(scores)
          rawClasses.append(classes.map({ Float32($0) }))
        }
//        output += boxes + scores
//        output += classes.map({ Float32($0) })

//        return output
      } catch let error {
        print("Failed to run interpreter with error: \(error.localizedDescription)")
        return nil
      }
    }
    if (rawScores.count > 1 && rawBoxes[0][2] * rawBoxes[0][3] < rawBoxes[1][2] * rawBoxes[1][3]) {
      return [rawNumDetections[1]] + rawBoxes[1] + rawScores[1] + rawClasses[1]
    } else if (rawScores.count == 1) {
      return [rawNumDetections[0]] + rawBoxes[0] + rawScores[0] + rawClasses[0]
    }
    return [0]
  }

  public static func loadImageFromBundle(fileName: String, fileExt: String) -> UIImage? {
    let path = Bundle.main.path(
      forResource: fileName,
      ofType: fileExt
    )!;
    let image = UIImage(contentsOfFile: path);
    return image;
  }

 @objc
 public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
   let startDate = Date()
   guard let imageBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
     return nil
   }
//
   NSLog("ExamplePlugin: \(CVPixelBufferGetWidth(imageBuffer)) x \(CVPixelBufferGetHeight(imageBuffer)) Image. Logging \(args.count) parameters:")
   
//   let ciImage = CIImage(cvPixelBuffer: imageBuffer)
   let uiImage = UIImage(pixelBuffer: imageBuffer)!
//   YoloFrameProcessor.written += 1
//   print(uiImage.cgImage?.colorSpace?.name)
//   print(uiImage.cgImage?.bitmapInfo.rawValue)
//   print(uiImage.cgImage?.alphaInfo.rawValue)
//   print(uiImage.cgImage?.bitsPerComponent.description)
//   print(uiImage.cgImage?.bytesPerRow.description)
//   UIImageWriteToSavedPhotosAlbum(uiImage, nil, nil, nil);
   
//   let ciiImage = CIImage(cgImage: uiImage.cgImage!)
//   let cp = ciiImage.cropped(to: CGRect(x:0, y:0, width:Int(uiImage.size.width / 2), height:Int(uiImage.size.height / 2)))
//   let cp2 = ciiImage.cropped(to:CGRect(x:Int(uiImage.size.width/2),y:0,width:Int(uiImage.size.width/2),height:Int(uiImage.size.height/2)))
//   let context = CIContext()
//   let cgImage = context.createCGImage(cp, from: cp.extent)!
//   UIImageWriteToSavedPhotosAlbum(UIImage(cgImage: cgImage), nil, nil, nil)
//   let context2 = CIContext()
//   let cgImage2 = context2.createCGImage(cp2, from: cp2.extent)!
//   UIImageWriteToSavedPhotosAlbum(UIImage(cgImage: cgImage2), nil, nil, nil)
   
   var detectionResult: Array<Float> = []
   
   if args.count == 1 && args[0] as! Bool == true {
     print(uiImage.size.width)
     print(uiImage.size.height)
     if YoloFrameProcessor.written >= 10 {
       let ciImage = CIImage(cgImage: uiImage.cgImage!)
//       let cp = ciImage.cropped(to: CGRect(x:0, y:0, width:Int(uiImage.size.width / 2), height:Int(uiImage.size.height / 2)))
//       let cp2 = ciImage.cropped(to:CGRect(x:Int(uiImage.size.width/2),y:0,width:Int(uiImage.size.width/2),height:Int(uiImage.size.height/2)))
//       UIImageWriteToSavedPhotosAlbum(UIImage(ciImage: cp), nil, nil, nil)
//       UIImageWriteToSavedPhotosAlbum(UIImage(ciImage: cp2), nil, nil, nil)
       let hoops = YoloFrameProcessor.detect(ciImage:ciImage, width:Int(uiImage.size.width), height:Int(uiImage.size.height),orientation: uiImage.imageOrientation)!
  //     print(hoops)
       if hoops[0] > 0 {
         let portrait = uiImage.imageOrientation == UIImage.Orientation.up
         let fw = portrait ? Float32(uiImage.size.width) : Float32(uiImage.size.height)
         let fh = portrait ? Float32(uiImage.size.height) : Float32(uiImage.size.width)
         let w = hoops[3] * fw
         let h = hoops[4] * fh
         let l = hoops[1] * fw - w / 2 // top-left instead of center
         let t = hoops[2] * fh - h / 2 // ditto
         let r = l + w
         let b = t + h
         detectionResult = [0.0] + (OpenCVWrapper.updateBackground(uiImage, leftArg: Int32(l), topArg: Int32(t), rightArg: Int32(r), bottomArg: Int32(b)) as! Array<Float>);
         let testUIImage = OpenCVWrapper.testFunc2();
         UIImageWriteToSavedPhotosAlbum(testUIImage, nil, nil, nil);
         gaming = true
       } else {
         detectionResult = [0]
       }
       YoloFrameProcessor.written = 0
     } else {
       YoloFrameProcessor.written += 1
     }
   } else if (YoloFrameProcessor.gaming) {
     detectionResult = OpenCVWrapper.processFrame(uiImage) as! Array<Float> + detectionResult;
//     if (YoloFrameProcessor.written % 5 == 0) {
//       let testUIImage = OpenCVWrapper.testFunc(uiImage)
//       let testUIImage2 = OpenCVWrapper.testFunc2()
//       let testUIImage3 = OpenCVWrapper.testFunc3(uiImage)
//       let testUIImage4 = OpenCVWrapper.testFunc4(uiImage);
//       UIImageWriteToSavedPhotosAlbum(uiImage, nil, nil, nil);
//       UIImageWriteToSavedPhotosAlbum(testUIImage, nil, nil, nil);
//       UIImageWriteToSavedPhotosAlbum(testUIImage2, nil, nil, nil)
//       UIImageWriteToSavedPhotosAlbum(testUIImage4, nil, nil, nil)
//       YoloFrameProcessor.written += 1;
//     }
     
     if detectionResult[0] == 1 {
       UIImageWriteToSavedPhotosAlbum(uiImage, nil, nil, nil);
       let testUIImage4 = OpenCVWrapper.testFunc4(uiImage);
       UIImageWriteToSavedPhotosAlbum(testUIImage4, nil, nil, nil)
     }
     
//     if YoloFrameProcessor.written % 50 == 0 {
//       let testUIImage4 = OpenCVWrapper.testFunc4(loadImageFromBundle(fileName: "IMG_4537", fileExt: "JPG")!)
//       UIImageWriteToSavedPhotosAlbum(testUIImage4, nil, nil, nil)
//     }
   } else {
     detectionResult = [0]
   }

//   if (!YoloFrameProcessor.written) {
//     YoloFrameProcessor.written = true;
//     let testImageBg = loadImageFromBundle(fileName: "img_203", fileExt: "jpg")!;
//     let testImageNames = ["img_212", "img_249", "img_250", "img_251", "img_252", "img_253", "img_254"];
//     OpenCVWrapper.updateBackground(testImageBg, leftArg: 600, topArg: 175, rightArg: 645, bottomArg: 213);
//     let res = OpenCVWrapper.processFrame(testImageBg);
//     print(res);
//
//     let testImages = testImageNames.map {loadImageFromBundle(fileName: $0, fileExt: "jpg")!}
//     testImages.forEach {
//       let testRes = OpenCVWrapper.testFunc($0);
//         UIImageWriteToSavedPhotosAlbum(testRes, nil, nil, nil);
//     }
//
//   }
   
   let interval = Date().timeIntervalSince(startDate) * 1000
   print(interval)
   
   return detectionResult
 }
}
