import {
    Canvas,
    Group,
    Circle,
    Skia,
    TileMode,
} from '@shopify/react-native-skia';
import { View, Pressable, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
    useSharedValue,
    withSpring,
    useDerivedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import Header from '@/components/Header';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

// All positions explicit — no derived constants
const CANVAS_W = 240;
const CANVAS_H = 100;
const CY = 40; // vertical center for all circles

// Plus circle
const PLUS_CX = 120;
const PLUS_R_COLLAPSED = 32;
const PLUS_R_EXPANDED = 22;

// Side circles
const CIRCLE_R = 28;
const CIRCLE1_CX_EXPANDED = 52;   // image — left
const CIRCLE2_CX_EXPANDED = 188;  // camera — right

const SPRING = { damping: 70, stiffness: 600 };

// ── Shadow config — tweak these ──────────────────────────
const SHADOW = {
    dx: 0,          // horizontal offset
    dy: 10,          // vertical offset
    sigmaX: 5,     // horizontal blur radius
    sigmaY: 5,     // vertical blur radius
    color: Skia.Color('rgba(0,0,0,0.03)'),
};
// ─────────────────────────────────────────────────────────

const shadowPaint = (() => {
    const paint = Skia.Paint();
    paint.setImageFilter(
        Skia.ImageFilter.MakeDropShadow(
            SHADOW.dx, SHADOW.dy,
            SHADOW.sigmaX, SHADOW.sigmaY,
            SHADOW.color,
            null, null
        )
    );
    return paint;
})();

const gooeyPaint = (() => {
    const paint = Skia.Paint();
    const blur = Skia.ImageFilter.MakeBlur(10, 10, TileMode.Clamp, null, null);
    const colorFilter = Skia.ColorFilter.MakeMatrix([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 20, -9,
    ]);
    const colorEffect = Skia.ImageFilter.MakeColorFilter(colorFilter, null, null);
    paint.setImageFilter(Skia.ImageFilter.MakeCompose(colorEffect, blur));
    return paint;
})();

export default function GooeyScreen() {
    const insets = useSafeAreaInsets();
    const isExpanded = useSharedValue(0);
    const router = useRouter();
    const plusR = useDerivedValue(() => {
        'worklet';
        return withSpring(isExpanded.value === 1 ? PLUS_R_EXPANDED : PLUS_R_COLLAPSED, SPRING);
    });

    const circle1X = useDerivedValue(() => {
        'worklet';
        return withSpring(isExpanded.value === 1 ? CIRCLE1_CX_EXPANDED : PLUS_CX, SPRING);
    });

    const circle2X = useDerivedValue(() => {
        'worklet';
        return withSpring(isExpanded.value === 1 ? CIRCLE2_CX_EXPANDED : PLUS_CX, SPRING);
    });

    const iconsOpacity = useDerivedValue(() => {
        'worklet';
        return withSpring(isExpanded.value, SPRING);
    });

    const plusRotation = useDerivedValue(() => {
        'worklet';
        return withSpring(isExpanded.value * 135, SPRING);
    });

    const plusStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${plusRotation.value}deg` }],
    }));

    const circle1IconStyle = useAnimatedStyle(() => ({
        position: 'absolute' as const,
        left: circle1X.value - 12,
        top: CY - 12,
        opacity: iconsOpacity.value,
        width: 24,
        height: 24,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    }));

    const circle2IconStyle = useAnimatedStyle(() => ({
        position: 'absolute' as const,
        left: circle2X.value - 12,
        top: CY - 12,
        opacity: iconsOpacity.value,
        width: 24,
        height: 24,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    }));

    return (
        <View className="flex-1 bg-neutral-800">
            <ImageBackground source={require('@/assets/img/scify.jpg')} className="flex-1">
            <View className='px-global' style={{ paddingTop: insets.top + 10 }}>
                <Feather name="arrow-left" size={24} color="white" onPress={() => router.back()} />
            </View>
                <View
                    className="flex-1 items-center justify-end"
                    //style={{ paddingBottom: insets.bottom }}
                >
                    <Pressable onPress={() => { isExpanded.value = isExpanded.value === 0 ? 1 : 0; }}>
                        <View style={{ width: CANVAS_W, height: CANVAS_H }}>
                            <Canvas style={{ position: 'absolute', width: CANVAS_W, height: CANVAS_H }}>
                                <Group layer={shadowPaint}>
                                    <Group layer={gooeyPaint}>
                                        <Circle cx={circle1X} cy={CY} r={CIRCLE_R} color="white" />
                                        <Circle cx={circle2X} cy={CY} r={CIRCLE_R} color="white" />
                                        <Circle cx={PLUS_CX} cy={CY} r={plusR} color="white" />
                                    </Group>
                                </Group>
                            </Canvas>

                            {/* Plus / X */}
                            <View style={{
                                position: 'absolute',
                                left: PLUS_CX - 12,
                                top: CY - 12,
                                width: 24,
                                height: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Animated.View style={plusStyle}>
                                    <Feather name="plus" size={20} color="#111" />
                                </Animated.View>
                            </View>

                            {/* Image icon */}
                            <Animated.View style={circle1IconStyle}>
                                <MaterialIcons name="image" size={19} color="#111" />
                            </Animated.View>

                            {/* Camera icon */}
                            <Animated.View style={circle2IconStyle}>
                                <MaterialIcons name="camera-alt" size={19} color="#111" />
                            </Animated.View>
                        </View>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>

    );
}
