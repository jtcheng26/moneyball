import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { GameConfig } from "../../configs/gameConfig.types";
import { useTailwind } from "tailwind-rn/dist";
import GameCard from "../lib/cards/GameCard";
import Icon from "../lib/buttons/icon-button/Icon";
import LabelText from "../lib/text/LabelText";
import { THEME_COLORS } from "../../theme";
import ConfirmationDialog from "../lib/dialogs/ConfirmationDialog";
import TicketText from "../lib/text/TicketText";
import GameConfirmDialog from "../lib/dialogs/GameConfirmDialog";
import DarkenedModal from "../lib/dialogs/DarkenedModal";
import ButtonText from "../lib/text/ButtonText";
import SuccessDialog from "../lib/dialogs/SuccessDialog";
import FailureDialog from "../lib/dialogs/FailureDialog";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BigNumber, ethers } from "ethers";
import { ticketABI } from "../../hooks/api/ticketContract";
import { tokenABI } from "../../hooks/api/tokenABI";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import useUserData from "../../hooks/useUserData";
import useTickets from "../../hooks/useTickets";
import APP_ENV from "../../../env";
import { parseEther } from "ethers/lib/utils";
import LoadingDialog from "../lib/dialogs/LoadingDialog";
import createCourt from "../../hooks/api/create";
import CreateCourtDialog, { LandArgs } from "../lib/dialogs/CreateCourtDialog";
import { resolve } from "url";

type Props = {
  price: number;
  width?: number | string;
  onPurchase?: () => void;
};

const PurchaseLand = ({ width, price, onPurchase }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);
  const [waiting, setWaiting] = useState<false | "approval" | "purchase">(
    false
  );

  const connector = useWalletConnect();
  async function buy(lat: string, long: string, name: string, image: string) {
    return new Promise(async (resolve, reject) => {
      try {
        // const keepAlive = setInterval(() => {
        //   console.log("Keep alive");
        // }, 2000);
        if (!connector.connected) return false;
        const provide = new WalletConnectProvider({
          rpc: {
            5: APP_ENV.RPC_PROVIDER,
            // ...
          },
          chainId: 5,
          connector: connector,
          qrcode: true,
          qrcodeModalOptions: {
            mobileLinks: ["metamask"],
          },
        });

        await provide.enable();

        const ethers_provider = new ethers.providers.Web3Provider(provide);
        const signer = ethers_provider.getSigner();
        const contrToken = new ethers.Contract(
          APP_ENV.TOKEN_CONTRACT,
          tokenABI,
          ethers_provider
        );

        const connToken = contrToken.connect(signer);

        setTimeout(async () => {
          setWaiting("approval");
          connToken.functions
            .transfer(APP_ENV.ADMIN_ADDR, parseEther(price + ".0"), {
              gasLimit: await connToken.estimateGas.transfer(
                APP_ENV.ADMIN_ADDR,
                parseEther(price + ".0")
              ),
              gasPrice: await ethers_provider.getGasPrice(),
            })
            .then(async (res) => {
              await res.wait();
              setWaiting(false);
              setTimeout(() => {
                buyIt();
              }, 700);
            })
            .catch((err) => {
              console.log(err);
              setWaiting(false);
              setTimeout(() => {
                resolve(false);
              }, 700);
            });
        }, 500);

        async function buyIt() {
          setWaiting("purchase");
          createCourt(lat, long, name, image)
            .then((r) => {
              // clearInterval(keepAlive);

              setWaiting(false);
              setTimeout(() => {
                if (r && r["result"] === "success") resolve(true);
                else {
                  console.log(r);
                  resolve(false);
                }
              }, 500);
            })
            .catch((err) => {
              console.error(err);
              setWaiting(false);
              setTimeout(() => {
                resolve(false);
              }, 500);
            });
        }
      } catch (err) {
        console.error(err);
      }
    });
    // console.log(amount, price, currency);
  }
  return (
    <>
      <DarkenedModal visible={showModal} onDismiss={() => setShowModal(false)}>
        <CreateCourtDialog
          title="New Court Location"
          onCancel={() => setShowModal(false)}
          onConfirm={(args: LandArgs) => {
            setShowModal(false);
            (async () => {
              const success = await buy(
                args.latitude,
                args.longitude,
                args.name,
                args.image
              );
              setTimeout(() => {
                if (success) setSuccessModal(true);
                else setFailureModal(true);
              }, 500);
            })();
          }}
        />
      </DarkenedModal>
      <DarkenedModal
        visible={successModal}
        onDismiss={() => {
          setSuccessModal(false);
        }}
      >
        <SuccessDialog
          title="Purchase Successful!"
          onConfirm={() => {
            if (onPurchase) {
              onPurchase();
            }
            setSuccessModal(false);
          }}
        />
      </DarkenedModal>
      <DarkenedModal visible={!!waiting}>
        <LoadingDialog
          title={
            waiting === "approval"
              ? "Waiting for approval..."
              : "Processing transaction..."
          }
          body="This may take a minute."
        />
      </DarkenedModal>
      <DarkenedModal
        visible={failureModal}
        onDismiss={() => setFailureModal(false)}
      >
        <FailureDialog
          title="Sorry, something went wrong."
          body="Transaction canceled."
          onConfirm={() => {
            setFailureModal(false);
          }}
        />
      </DarkenedModal>
      <GameCard
        color={THEME_COLORS.dark[500]}
        width={width || 300}
        height={250}
        buttonText={"$BTT " + price}
        buttonColor={THEME_COLORS.dark[0]}
        centered
        pressable
        noUnderline
        onPress={() => setShowModal(true)}
      >
        <View style={styles.center}>
          <Icon
            name={"Crown"}
            fill={THEME_COLORS.dark[800].color}
            width={100}
            height={100}
          />
          <View style={styles.entryFee}>
            <ButtonText
              text={"New Court Location"}
              color={THEME_COLORS.dark[800]}
            />
          </View>
        </View>
      </GameCard>
    </>
  );
};

export default PurchaseLand;

const styles = StyleSheet.create({
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "relative",
    backgroundColor: THEME_COLORS.theme[50].color,
    borderBottomColor: THEME_COLORS.theme[50].underline,
    borderBottomWidth: 10,
  },
  entryFee: {
    position: "absolute",
    left: 15,
    bottom: 10,
  },
});
