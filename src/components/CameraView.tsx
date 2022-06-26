import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { useTailwind } from "tailwind-rn/dist";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const TensorCamera = cameraWithTensors(Camera);
const tensorDims = {
  width: 416,
  height: 416,
  depth: 3,
};

enum DetectionClass {
  Basketball = 0,
  Hoop = 1,
}

interface DetectionResult {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
  class: DetectionClass;
}

async function interpret_predictions(prediction: tf.Tensor<tf.Rank>) {
  const boxes_raw = prediction.slice([0, 0, 0], [-1, -1, 4]);
  const scores_raw = prediction.slice([0, 0, 4], [-1, -1, -1]);

  const boxes = boxes_raw.reshape([-1, 4]) as tf.Tensor<tf.Rank.R2>;
  const scores = tf.tidy(
    () => scores_raw.max(2).reshape([-1]) as tf.Tensor<tf.Rank.R1>
  );
  const classes = tf.tidy(
    () => scores_raw.argMax(2).reshape([-1]) as tf.Tensor<tf.Rank.R1>
  );

  const res = await tf.image.nonMaxSuppressionAsync(
    boxes,
    scores,
    50,
    0.5,
    0.2
  );
  const selected_boxes = res;

  const b = await selected_boxes.data();
  const boxes_data = await boxes.data();
  const scores_data = await scores.data();
  const classes_data = await classes.data();

  let boxes_final: Array<Uint8Array | Float32Array | Int32Array> = [];
  b.forEach((i) => boxes_final.push(boxes_data.slice(4 * i, 4 * i + 4)));
  const scores_final = scores_data.filter((x, i) => i in b);
  const classes_final = classes_data.filter((x, i) => i in b);

  tf.dispose(prediction);
  tf.dispose(boxes_raw);
  tf.dispose(scores_raw);
  tf.dispose(boxes);
  tf.dispose(classes);
  tf.dispose(scores);
  tf.dispose(selected_boxes);

  return [boxes_final, scores_final, classes_final];
}

function imgTransform(img: tf.Tensor) {
  img = img.resizeBilinear([416, 416]).div(tf.scalar(255));
  img = tf.cast(img, "float32");

  /*mean of natural image*/
  let meanRgb = { red: 0.485, green: 0.456, blue: 0.406 };

  /* standard deviation of natural image*/
  let stdRgb = { red: 0.229, green: 0.224, blue: 0.225 };

  let indices = [
    tf.tensor1d([0], "int32"),
    tf.tensor1d([1], "int32"),
    tf.tensor1d([2], "int32"),
  ];

  /* sperating tensor channelwise and applyin normalization to each chanel seperately */
  let centeredRgb = {
    red: tf
      .gather(img, indices[0], 2)
      .sub(tf.scalar(meanRgb.red))
      .div(tf.scalar(stdRgb.red))
      .reshape([416, 416]),

    green: tf
      .gather(img, indices[1], 2)
      .sub(tf.scalar(meanRgb.green))
      .div(tf.scalar(stdRgb.green))
      .reshape([416, 416]),

    blue: tf
      .gather(img, indices[2], 2)
      .sub(tf.scalar(meanRgb.blue))
      .div(tf.scalar(stdRgb.blue))
      .reshape([416, 416]),
  };

  /* combining seperate normalized channels*/
  let processedImg = tf
    .stack([centeredRgb.red, centeredRgb.green, centeredRgb.blue])
    .expandDims();

  processedImg = processedImg.reshape([-1, 416, 416, 3]);

  return processedImg;
}

function processTestImage(imageData: tf.Tensor) {
  const imageTensor = imgTransform(imageData);

  return imageTensor;
}

interface CameraViewProps {
  close: () => void;
}

export default function CameraView({ close }: CameraViewProps) {
  const tailwind = useTailwind();
  const [ready, setReady] = useState(false);
  const [model, setModel] = useState<tf.GraphModel>();
  const hoopDetection = useSharedValue<DetectionResult | null>(null);
  const ballDetection = useSharedValue<DetectionResult | null>(null);

  const hoopStyles = useAnimatedStyle(() => {
    if (hoopDetection.value) {
      console.log(
        hoopDetection.value.box.x,
        hoopDetection.value.box.y,
        hoopDetection.value.box.width,
        hoopDetection.value.box.height
      );
      return {
        left:
          100 *
            (hoopDetection.value.box.x - hoopDetection.value.box.width / 2) +
          "%",
        top:
          100 *
            (hoopDetection.value.box.y - hoopDetection.value.box.height / 2) +
          "%",
        width: hoopDetection.value.box.width * 100 + "%",
        height: hoopDetection.value.box.height * 100 + "%",
        // position: "absolute",
        borderWidth: 5,
        borderColor: "red",
        backgroundColor: "transparent",
        borderRadius: 5,
      };
    }
    return {};
  });
  // x * h = y
  // x * w = y
  const ballStyles = useAnimatedStyle(() => {
    if (ballDetection.value) {
      console.log(
        ballDetection.value.box.x,
        ballDetection.value.box.y,
        ballDetection.value.box.width,
        ballDetection.value.box.height
      );
      return {
        left:
          100 *
            (ballDetection.value.box.x - ballDetection.value.box.width / 2) +
          "%",
        top:
          100 *
            (ballDetection.value.box.y -
              (ballDetection.value.box.height * (1080 / 1920)) / 2) +
          "%",
        width: ballDetection.value.box.width * 100 + "%",
        height: ballDetection.value.box.height * 100 * (1080 / 1920) + "%",
        // position: "absolute",
        borderWidth: 5,
        borderColor: "green",
        backgroundColor: "transparent",
        borderRadius: 5,
      };
    }
    return {};
  });

  const [platformDims, setPlatformDims] = useState<{
    height: number;
    width: number;
  }>({
    height: 1920,
    width: 1080,
  });

  async function load_model() {
    // It's possible to load the model locally or from a repo
    // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json"     just set it before in your https server
    const model = await tf.loadGraphModel(
      "http://192.168.0.104:8080/model.json"
    );
    return model;
  }

  async function detect(imageTensor: tf.Tensor, model: tf.GraphModel) {
    const prediction = (await model?.executeAsync(imageTensor)) as tf.Tensor;
    const [boxes, scores, classes] = await interpret_predictions(prediction);

    tf.dispose(prediction);
    return [boxes, scores, classes];
  }

  useEffect(() => {
    (async () => {
      await tf.ready();
      setModel(await load_model());
      setReady(true);
    })();

    if (Platform.OS == "ios") {
      setPlatformDims({ height: 1920, width: 1080 });
    } else {
      setPlatformDims({ height: 1200, width: 1600 });
    }
  }, []);

  let requestAnimationFrameId = 0;

  async function detectFromTensor(
    imageTensor: tf.Tensor,
    model: tf.GraphModel
  ) {
    const imageTensorProcessed = tf.tidy(() => processTestImage(imageTensor));
    const [boxes, scores, classes] = await detect(imageTensorProcessed, model);
    tf.dispose(imageTensorProcessed);

    console.log(boxes);

    const ret: DetectionResult[] = [];
    boxes.forEach((b, i) => {
      const bb = b as Float32Array;
      ret.push({
        box: {
          x: bb[0],
          y: bb[1],
          width: bb[2],
          height: bb[3],
        },
        score: scores[i] as number,
        class: classes[i] as number,
      });
    });

    return ret;
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  function handleCameraStream(imageAsTensors: IterableIterator<tf.Tensor3D>) {
    if (!imageAsTensors) {
      console.log("Image not found!");
    }
    let frameCount = 0;
    const predictionFrameRate = 5;
    let prevTensors = 0;
    const loop = async () => {
      if (frameCount % predictionFrameRate === 0) {
        const nextTensor = imageAsTensors.next();
        const imageTensor = nextTensor.value;

        if (!nextTensor.done && model) {
          const st = performance.now();
          const detections = await detectFromTensor(imageTensor, model);
          if (detections.length > 0) {
            function bestScore(
              detections: DetectionResult[],
              category: DetectionClass
            ) {
              const best = detections.reduce((prev, now) => {
                if (now.class === category) {
                  if (prev.class !== category || now.score > prev.score) {
                    return now;
                  }
                }
                return prev;
              });

              return best.class === category ? best : null;
            }

            const basketball = bestScore(detections, DetectionClass.Basketball);
            const hoop = bestScore(detections, DetectionClass.Hoop);
            if (basketball) ballDetection.value = basketball;
            else ballDetection.value = null;
            if (hoop) hoopDetection.value = hoop;
            else hoopDetection.value = null;
          } else {
            ballDetection.value = null;
            hoopDetection.value = null;
          }
          console.log(performance.now() - st);
        }

        const numTensors = tf.memory().numTensors;
        if (prevTensors > 0 && numTensors > prevTensors) {
          console.log("Mem leak:", numTensors - prevTensors, "tensors gained.");
        }
        prevTensors = numTensors;

        tf.dispose(imageTensor);
      }

      frameCount += 1;
      frameCount = frameCount % predictionFrameRate;
      requestAnimationFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  return (
    <View>
      {ready ? (
        <>
          <View style={cameraStyles.cameraContainer}>
            <TensorCamera
              style={cameraStyles.camera}
              type={Camera.Constants.Type.back}
              zoom={0}
              cameraTextureHeight={platformDims.height}
              cameraTextureWidth={platformDims.width}
              resizeHeight={tensorDims.height}
              resizeWidth={tensorDims.width}
              resizeDepth={tensorDims.depth}
              onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
              autorender={true}
              useCustomShadersToResize={false}
            />
          </View>
          <View style={cameraStyles.overlay}>
            <Animated.View style={hoopStyles} />
            <Animated.View style={ballStyles} />
            <Pressable onPress={close} style={cameraStyles.button}>
              <Text style={tailwind("text-xl text-white font-bold")}>
                Close
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const cameraStyles = StyleSheet.create({
  camera: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  overlay: {
    zIndex: 1000,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
  },
  button: {
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "black",
    shadowOpacity: 0.4,
    backgroundColor: "#f64",
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    padding: 10,
    borderRadius: 10,
  },
});
