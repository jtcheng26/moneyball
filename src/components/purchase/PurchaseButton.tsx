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
import { ethers } from "ethers";
import { ticketABI } from "../../hooks/api/ticketContract";
import { tokenABI } from "../../hooks/api/tokenABI";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import useUserData from "../../hooks/useUserData";
import useTickets from "../../hooks/useTickets";

type Props = {
  amount: number;
  price: number;
  currency: "BTT" | "BALL";
  width?: number | string;
  onPurchase?: () => void;
};

const PurchaseButton = ({
  width,
  amount,
  price,
  currency,
  onPurchase,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);
  const connector = useWalletConnect();
  async function buy() {
    return new Promise(async (resolve, reject) => {
      try {
        const keepAlive = setInterval(() => {
          console.log("Keep alive");
        }, 2000);
        if (!connector.connected) return false;
        const provide = new WalletConnectProvider({
          rpc: {
            5: "https://goerli.infura.io/v3/14dd41f30d274433a4bd818422e079b5",
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
        // const contr = new ethers.Contract(
        //   "0xA0Fbd0cDDdE9fb2F91327f053448a0F3319552F7",
        //   tokenABI,
        //   ethers_provider
        // );
        const contr2 = new ethers.Contract(
          "0x88E49F80e9799Be6E400EdF90adA244C15feB1F0",
          ticketABI,
          ethers_provider
        );
        // const conn = contr.connect(signer);
        const conn2 = contr2.connect(signer);
        // await conn.functions
        //   .approve(
        //     "0x6841e5c93DdFDe42D0d6B6bf7F1fE45207dB21c0",
        //     ethers.BigNumber.from("1000000000000000000000")
        //   )
        //   .catch((err) => {
        //     console.error(err);
        //   })
        //   .then((res) => {
        //     console.log(res);
        //   });

        if (currency === "BTT") {
          conn2.functions
            .buyTicketsWithBTT(
              // await signer.getAddress(),
              amount
            )
            .catch((err) => {
              console.error(err);
              clearInterval(keepAlive);
              resolve(false);
            })
            .then((r) => {
              clearInterval(keepAlive);
              resolve(true);
            });
        } else {
          conn2.functions
            .buyTicketsWithBALL(
              // await signer.getAddress(),
              amount
            )
            .catch((err) => {
              clearInterval(keepAlive);
              console.error(err);
              resolve(false);
            })
            .then((r) => {
              clearInterval(keepAlive);
              resolve(true);
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
        <ConfirmationDialog
          title="Buy Tickets?"
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            (async () => {
              const success = await buy();
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
        onDismiss={() => setSuccessModal(false)}
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
        buttonText={"$" + currency + " " + price}
        buttonColor={THEME_COLORS.dark[0]}
        centered
        pressable
        noUnderline
        onPress={() => setShowModal(true)}
      >
        <View style={styles.center}>
          <Icon
            name={"Ticket"}
            fill={THEME_COLORS.dark[800].color}
            width={100}
            height={100}
          />
          <View style={styles.entryFee}>
            <ButtonText text={"x" + amount} color={THEME_COLORS.dark[800]} />
          </View>
        </View>
      </GameCard>
    </>
  );
};

export default PurchaseButton;

const styles = StyleSheet.create({
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "relative",
    backgroundColor: THEME_COLORS.theme[400].color,
    borderBottomColor: THEME_COLORS.theme[400].underline,
    borderBottomWidth: 10,
  },
  entryFee: {
    position: "absolute",
    left: 15,
    bottom: 10,
  },
});
