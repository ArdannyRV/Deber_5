import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BlobConfig {
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  txDuration: number;
  tyDuration: number;
  scaleDuration: number;
}

const blobs: BlobConfig[] = [
  { size: 320, color: '#C7D2FE', initialX: -60, initialY: -80, txDuration: 4000, tyDuration: 5000, scaleDuration: 6000 },
  { size: 280, color: '#BAE6FD', initialX: SCREEN_WIDTH - 200, initialY: -40, txDuration: 5000, tyDuration: 6000, scaleDuration: 7000 },
  { size: 260, color: '#DDD6FE', initialX: -80, initialY: SCREEN_HEIGHT * 0.5, txDuration: 6000, tyDuration: 7000, scaleDuration: 5000 },
  { size: 300, color: '#A5F3FC', initialX: SCREEN_WIDTH - 220, initialY: SCREEN_HEIGHT * 0.6, txDuration: 7000, tyDuration: 8000, scaleDuration: 6000 },
];

function Blob({ config }: { config: BlobConfig }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(30, { duration: config.txDuration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(40, { duration: config.tyDuration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.05, { duration: config.scaleDuration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
          left: config.initialX,
          top: config.initialY,
        },
        animStyle,
      ]}
    />
  );
}

export default function AnimatedBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      {blobs.map((config, i) => (
        <Blob key={i} config={config} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F4FF',
    zIndex: -1,
  },
  blob: {
    position: 'absolute',
    opacity: 0.6,
  },
});
