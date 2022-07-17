import { ListRenderItem, StyleSheet, Text, View } from "react-native";
import React from "react";
import PaddedView from "../../spacing/PaddedView";
import TitleText from "../../text/TitleText";
import Carousel from "react-native-snap-carousel";

type Props = {
  title: string;
  data: any[];
  renderItem: ListRenderItem<any> &
    ((item: { item: any; index: number }) => React.ReactNode);
};

const CardCarousel = (props: Props) => {
  return (
    <View>
      <PaddedView>
        <TitleText text={props.title} size={36} />
      </PaddedView>
      <Carousel
        itemWidth={240}
        sliderWidth={480}
        containerCustomStyle={{
          marginLeft: -70,
        }}
        enableSnap={true}
        inactiveSlideScale={1}
        inactiveSlideOpacity={0.3}
        data={props.data}
        renderItem={props.renderItem}
      />
    </View>
  );
};

export default CardCarousel;

const styles = StyleSheet.create({});
