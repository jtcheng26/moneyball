import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { useTailwind } from "tailwind-rn/dist";

const TensorCamera = cameraWithTensors(Camera);
const tensorDims = {
  width: 416,
  height: 416,
  depth: 3,
};

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

  const b = selected_boxes.dataSync();
  const boxes_data = boxes.dataSync();
  const scores_data = scores.dataSync();
  const classes_data = classes.dataSync();

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
        if (!nextTensor.done) {
          const imageTensor = nextTensor.value;
          if (model) {
            const imageTensorProcessed = tf.tidy(() =>
              processTestImage(imageTensor)
            );
            const [boxes, scores, classes] = await detect(
              imageTensorProcessed,
              model
            );
            console.log(boxes, scores, classes);
            tf.dispose(imageTensorProcessed);
            tf.dispose(imageTensor);
          }
        }

        const numTensors = tf.memory().numTensors;
        if (prevTensors > 0 && numTensors > prevTensors) {
          console.log("Mem leak:", numTensors - prevTensors, "tensors gained.");
        }
        prevTensors = numTensors;
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
          <Pressable
            onPress={close}
            style={tailwind("px-5 py-3 bg-blue-400 rounded-md")}
          >
            <Text style={tailwind("text-xl text-white font-bold")}>Close</Text>
          </Pressable>
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
    top: 60,
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
    height: "85%",
    backgroundColor: "#fff",
  },
});
