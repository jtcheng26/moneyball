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
  
  public static func resize(sourceImage: CIImage) -> CIImage {
    let resizeFilter = CIFilter(name:"CILanczosScaleTransform")!
    
    YoloFrameProcessor.scale = 416 / sourceImage.extent.height
    YoloFrameProcessor.aspectRatio = 416 / (sourceImage.extent.width * scale)

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
        width: 416, height: 416,
        bitsPerComponent: 8, bytesPerRow: 416 * 4,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
    )!

    context.draw(image, in: CGRect(x: 0, y: 0, width: 416, height: 416))
    let imageData = context.data!

    var inputData = Data()
    for row in 0 ..< 416 {
        for col in 0 ..< 416 {
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
  
  public static func interpretOutput(boxesXYWH: Tensor, scoresData: Tensor) -> (Array<Float32>, Array<Float32>, Array<Int>, Int) {
    let boxesBuffer = UnsafeMutableBufferPointer<Float32>.allocate(capacity: 10140)
    let scoresBuffer = UnsafeMutableBufferPointer<Float32>.allocate(capacity: 5070)

    boxesXYWH.data.copyBytes(to:boxesBuffer)
    scoresData.data.copyBytes(to:scoresBuffer)
    
    let boxesUnfiltered = Array(boxesBuffer)
    let scoresUnfiltered = Array(scoresBuffer)
    
    var filteredIndices: Array<Int> = []
    let SCORE_THRESHOLD = Float32(0.5)
    for i in 0 ..< scoresUnfiltered.count/2 {
      if scoresUnfiltered[2*i] > SCORE_THRESHOLD || scoresUnfiltered[2*i+1] > SCORE_THRESHOLD {
        filteredIndices.append(i)
      }
    }
    
    var boxes: Array<Float32> = []
    var scores: Array<Float32> = []
    var classes: Array<Int> = []
    let numDetections = filteredIndices.count
    
    print(filteredIndices)
    
    for i in filteredIndices {
      let x = boxesUnfiltered[4 * i] / 416
      let y = boxesUnfiltered[4 * i+1] / 416
      let w = boxesUnfiltered[4 * i+2] / 416
      let h = boxesUnfiltered[4 * i+3] / 416
      
//      boxes.append(x-w/2) // left
//      boxes.append(y-h/2) // top
//      boxes.append(x+w/2) // right
//      boxes.append(y+h/2) // bottom
      boxes.append(x)
      boxes.append(y)
      boxes.append(w)
      boxes.append(h)
      
      // only 2 classes
      if scoresUnfiltered[2 * i] > scoresUnfiltered[2 * i+1] {
        scores.append(scoresUnfiltered[2 * i])
        classes.append(2 * i % 2)
      } else {
        scores.append(scoresUnfiltered[2 * i+1])
        classes.append((2 * i+1) % 2)
      }
    }
    
    return (boxes, scores, classes, numDetections)
  }
  
  @objc
  public static func detect(ciImage: CIImage) -> Array<Float32>? {
    initDetector(fileName: "yolov4-416-tiny", fileExt: "tflite")

    // preprocess
    let resizedCIImage = resize(sourceImage: ciImage)
    let inputData = prepareInput(ciImage: resizedCIImage)

    do {
      // run
      try YoloFrameProcessor.detector?.copy(inputData, toInputAt:0)
      try YoloFrameProcessor.detector?.invoke()

      let outputBoxes = try YoloFrameProcessor.detector?.output(at:0)
      let outputPreds = try YoloFrameProcessor.detector?.output(at:1)

      // postprocess
      let (boxes, scores, classes, numDetections) = interpretOutput(boxesXYWH: outputBoxes!, scoresData: outputPreds!)
//
//      print(boxes)
//      print(scores)
//      print(classes)
//      print(numDetections)

      // format output
      var output: Array<Float32> = []
      output.append(Float32(numDetections))
      output += boxes + scores
      output += classes.map({ Float32($0) })

      return output
    } catch let error {
      print("Failed to run interpreter with error: \(error.localizedDescription)")
      return nil
    }
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
//   NSLog("ExamplePlugin: \(CVPixelBufferGetWidth(imageBuffer)) x \(CVPixelBufferGetHeight(imageBuffer)) Image. Logging \(args.count) parameters:")
   
//   let ciImage = CIImage(cvPixelBuffer: imageBuffer)
   let uiImage = UIImage(pixelBuffer: imageBuffer)!
   YoloFrameProcessor.written += 1
//   print(uiImage.cgImage?.colorSpace?.name)
//   print(uiImage.cgImage?.bitmapInfo.rawValue)
//   print(uiImage.cgImage?.alphaInfo.rawValue)
//   print(uiImage.cgImage?.bitsPerComponent.description)
//   print(uiImage.cgImage?.bytesPerRow.description)
//   UIImageWriteToSavedPhotosAlbum(uiImage, nil, nil, nil);
   
   var detectionResult: Array<Float> = []
   
   if args.count == 1 && args[0] as! Bool == true {
     detectionResult = [0.0] + (OpenCVWrapper.updateBackground(uiImage, leftArg: 400, topArg: 400, rightArg: 600, bottomArg: 600) as! Array<Float>);
//     if YoloFrameProcessor.written == 100 {
//       let testUIImage = OpenCVWrapper.testFunc2();
//       UIImageWriteToSavedPhotosAlbum(testUIImage, nil, nil, nil);
//       YoloFrameProcessor.written += 1
//     } else if (YoloFrameProcessor.written < 100) {
//       YoloFrameProcessor.written += 1
//     }
     gaming = true;
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
