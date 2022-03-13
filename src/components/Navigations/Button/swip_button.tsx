import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Up_icon} from '../../Screens/assets/Index';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BUTTON_HEIGHT = windowHeight * 0.4;
const BUTTON_WIDTH = windowWidth * 0.2;
const BUTON_PADDING = 10;
const SWIPEABLE_DIMENSON = BUTTON_WIDTH - 2 * BUTON_PADDING;
const V_SWIPE_RANGE = BUTTON_HEIGHT - 2 * BUTON_PADDING - SWIPEABLE_DIMENSON;

export interface HorizontalImageSwipeButtonProps {
  imageSource: any;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  onFinish: () => void;
}

const HorizontalImageSwipeButton: React.FC<
  HorizontalImageSwipeButtonProps
> = props => {
  const {imageSource, buttonContainerStyle, onFinish} = props;

  const Y = useSharedValue(50);

  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: e => {
      Y.value = e.translationY;
    },
    onEnd: () => {

      if (Y.value < -100) {
        Y.value = withSpring(-V_SWIPE_RANGE);
        runOnJS(onFinish)();
      } else {
        Y.value = withSpring(50);
      }
    },
  });

  const InterpolateYInput = [-V_SWIPE_RANGE - 370, 0];

  const AnimatedStyle = {
    swipeable: useAnimatedStyle(() => {
      return {
        transform: [{translateY: Y.value}],
      };
    }),
    swipeArrow: useAnimatedStyle(() => {
      return {
        transform: [{translateY: -370 + Y.value}],
        opacity: interpolate(-370 + Y.value, InterpolateYInput, [0, 2]),
      };
    }),
  };

  return (
    <View style={styles.buttonContainer}>
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeAgent, AnimatedStyle.swipeable]}>
          <Image source={imageSource} />
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[AnimatedStyle.swipeArrow, styles.swipeArrow]}>
        <Image source={Up_icon} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTON_PADDING,
  },
  swipeAgent: {
    position: 'absolute',
    bottom: BUTON_PADDING,
    zIndex: 2,
  },
  swipeArrow: {
    marginTop: windowHeight * 0.6,
    alignSelf: 'center',
    zIndex: 3,
  },
});

export default HorizontalImageSwipeButton;