import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import CameraView from "../components/camera-view/VisionCameraView";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Web3 from "web3";
import useBalance from "../hooks/useBalance";

export default function Home() {
  const tailwind = useTailwind();
  const connector = useWalletConnect();

  const [msg, setMsg] = useState("");
  const [balance, refreshBalance] = useBalance(connector.accounts[0]);
  // const web3 = new Web3(
  //   new Web3.providers.HttpProvider("https://pre-rpc.bt.io/")
  // );
  // // const req = new web3.eth.BatchRequest()
  // // req.add()
  // const contract = new web3.eth.Contract(
  //   [],
  //   "0x0000000000000000000000000000000000001010"
  // );
  // console.log(contract.methods);

  // console.log(web3.);

  // console.log(
  //   web3.eth.getBalance("0xA3D199F96535c98c716BbfD7F5A1A94FCB8170be")
  // );

  // console.log(web3.eth.accounts.);

  useEffect(() => {
    (async () => {
      // const signedMessage = await connector.signPersonalMessage([
      //   "Hello",
      //   connector.accounts[0],
      //   "",
      // ]);
      // setMsg(signedMessage);
    })();
  }, []);
  return (
    <View
      style={tailwind(
        "h-full w-full flex items-center justify-center bg-white"
      )}
    >
      <Text>{balance}</Text>
    </View>
  );
}

const buttonStyle = StyleSheet.create({
  button: {
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "black",
    shadowOpacity: 0.4,
    backgroundColor: "#2af",
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    padding: 10,
    borderRadius: 10,
  },
});
