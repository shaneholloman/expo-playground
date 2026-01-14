import { View, Text, Pressable, ScrollView, useWindowDimensions, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shadowPresets } from "@/utils/useShadow";
import Feather from "@expo/vector-icons/Feather";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Easing, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";

const MENU_LINKS = [
    { icon: "settings", label: "Settings", description: "Manage your preferences" },
    { icon: "bell", label: "Notifications", description: "View your alerts" },
    { icon: "heart", label: "Favorites", description: "Your saved items" },
    { icon: "log-out", label: "Logout", description: "Sign out of your account" },
];

const TAB_ICONS = [
    { icon: "home" },
    { icon: "bookmark" },
    { icon: "camera" },
    { icon: "user" },
] as const;

export default function ExpandableTabs() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const isExpanded = useSharedValue(0);
    const imageScale = useSharedValue(1.3);

    const toggleExpand = () => {
        isExpanded.value = withSpring(isExpanded.value === 0 ? 1 : 0, {
            damping: 100,
            stiffness: 600,
        });

        // Animate image scale with custom timing
        imageScale.value = withTiming(imageScale.value === 1.3 ? 1 : 1.3, {
            duration: 900,
            easing: Easing.out(Easing.cubic),
        });
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            const delta = event.translationY;

            // When expanded, allow dragging down with spring/bounce feel
            if (isExpanded.value > 0) {
                if (delta > 0) {
                    // Dragging down to collapse - use spring for bouncy feel
                    const maxExpandedHeight = windowHeight / 1.7;
                    const collapsedHeight = 70 + insets.bottom;
                    const progress = 1 - (delta / (maxExpandedHeight - collapsedHeight));
                    isExpanded.value = Math.max(progress, 0);
                }
            }
        })
        .onEnd((event) => {
            const threshold = 100;
            const delta = event.translationY;

            if (delta < -threshold) {
                // Dragged up significantly - expand
                isExpanded.value = withSpring(1, {
                    damping: 100,
                    stiffness: 600,
                });
                imageScale.value = withTiming(1, {
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                });
            } else if (delta > threshold && isExpanded.value > 0) {
                // Dragged down significantly from expanded - collapse
                isExpanded.value = withSpring(0, {
                    damping: 100,
                    stiffness: 600,
                });
                imageScale.value = withTiming(1.3, {
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                });
            } else {
                // Didn't drag far enough - snap back to current state
                if (isExpanded.value > 0.5) {
                    isExpanded.value = withSpring(1, {
                        damping: 100,
                        stiffness: 600,
                    });
                    imageScale.value = withTiming(1, {
                        duration: 800,
                        easing: Easing.out(Easing.cubic),
                    });
                } else {
                    isExpanded.value = withSpring(0, {
                        damping: 100,
                        stiffness: 600,
                    });
                    imageScale.value = withTiming(1.3, {
                        duration: 800,
                        easing: Easing.out(Easing.cubic),
                    });
                }
            }
        });

    const containerAnimatedStyle = useAnimatedStyle(() => {
        const height = interpolate(
            isExpanded.value,
            [0, 0.3, 1],
            [70 + insets.bottom, 70 + insets.bottom, windowHeight / 1.6]
        );
        return { height };
    });

    const tabIconsAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(isExpanded.value, [0, 0.3, 1], [0, 20, 20]);
        const opacity = interpolate(isExpanded.value, [0, 0.3, 1], [1, 0, 0]);
        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    const plusIconAnimatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(isExpanded.value, [0, 1], [0, 135]);
        return {
            transform: [{ rotate: `${rotate}deg` }],
        };
    });

    const expandedContentAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(isExpanded.value, [0, 0.3, 0.6, 1], [0, 0, 0, 1]);
        const translateY = interpolate(isExpanded.value, [0, 0.3, 0.6, 1], [20, 20, 20, 0]);
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: imageScale.value }],
        };
    });

    const handleAnimatedStyle = useAnimatedStyle(() => {
        const width = interpolate(isExpanded.value, [0, 1], [0, 80]);
        const opacity = interpolate(isExpanded.value, [0, 0.5, 1], [0, 0.5, 0.2]);
        return {
            width,
            opacity,
        };
    });

    return (
        <GestureHandlerRootView>
            <View className="flex-1 bg-background">
                <StatusBar style="light" />
                <View className="w-full px-8 absolute top-0 left-0 right-0 z-10" style={{ paddingTop: insets.top + 10 }}>
                    <BlurView
                        intensity={80}
                        tint="light"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            //backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Pressable className="w-10 h-10 rounded-full items-center justify-center" onPress={() => navigation.goBack()}>
                            <Feather
                                name="arrow-left"
                                size={20}
                                color="white"
                            />
                        </Pressable>
                    </BlurView>
                </View>
                <View className="w-full h-full relative">
                    <Animated.View className="h-full w-full" style={imageAnimatedStyle}>
                        <Image source={require("@/assets/img/scify-4.jpg")} className="w-full h-full" />
                    </Animated.View>
                </View>
                <Animated.View
                    className="absolute bottom-0 left-0 w-full"
                    style={[
                        {
                            paddingBottom: insets.bottom,
                        },
                        containerAnimatedStyle,
                    ]}
                >
                    {/* BlurView background that expands */}
                    <BlurView
                        intensity={80}
                        tint="light"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Semi-transparent overlay for better contrast */}
                        <View
                            style={{
                                ...shadowPresets.card,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                            className="border border-white/20 border-b-0"
                        />
                    </BlurView>

                    <GestureDetector gesture={panGesture}>
                        <View className="w-full justify-center items-center pt-3 pb-2">
                            <Animated.View className="h-1.5 rounded-full bg-white" style={handleAnimatedStyle} />
                        </View>
                    </GestureDetector>

                    {/* Expanded content */}
                    <Animated.View
                        className="flex-1 pt-8 px-6"
                        style={expandedContentAnimatedStyle}
                        pointerEvents={isExpanded.value > 0.5 ? "auto" : "none"}
                    >
                        {/* User profile header */}
                        <View className="flex-row items-center mb-8">
                            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mr-4">
                                <Text className="text-white text-xl font-bold">JD</Text>
                            </View>
                            <View>
                                <Text className="text-white text-xl font-bold">John Doe</Text>
                                <Text className="text-white opacity-70">john.doe@example.com</Text>
                            </View>
                        </View>

                        {/* Menu links */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {MENU_LINKS.map((link, index) => (
                                <Pressable
                                    key={index}
                                    className="flex-row items-center py-4 px-4 mb-2 rounded-3xl"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', ...shadowPresets.card }}
                                >
                                    <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                        <Feather name={link.icon as any} size={18} color="white" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-base font-semibold">{link.label}</Text>
                                        <Text className="text-white text-sm opacity-60">{link.description}</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="white" opacity={0.4} />
                                </Pressable>
                            ))}
                            <View className="h-20" />
                        </ScrollView>
                    </Animated.View>

                    {/* Bottom tab bar */}
                    <View className="absolute bottom-0 left-0 right-0" style={{ paddingBottom: insets.bottom }}>
                        <View className="flex-row w-full px-2">
                            {TAB_ICONS.slice(0, 2).map((tab, index) => (
                                <Animated.View
                                    key={index}
                                    className="w-1/5 items-center justify-center"
                                    style={tabIconsAnimatedStyle}
                                >
                                    <Pressable className="rounded-full items-center justify-center">
                                        <Feather name={tab.icon as any} size={22} color="white" />
                                    </Pressable>
                                </Animated.View>
                            ))}
                            <View className="w-1/5 items-center justify-center">
                                <Pressable onPress={toggleExpand} className="w-14 h-14 border-t rounded-full bg-white/10 border-r border-white/20  items-center justify-center">
                                    <Animated.View style={plusIconAnimatedStyle}>
                                        <Feather name="plus" size={22} color="white" />
                                    </Animated.View>
                                </Pressable>
                            </View>
                            {TAB_ICONS.slice(2, 4).map((tab, index) => (
                                <Animated.View
                                    key={index + 2}
                                    className="w-1/5 items-center justify-center"
                                    style={tabIconsAnimatedStyle}
                                >
                                    <Pressable className="rounded-full items-center justify-center">
                                        <Feather name={tab.icon as any} size={22} color="white" />
                                    </Pressable>
                                </Animated.View>
                            ))}
                        </View>
                    </View>
                </Animated.View>
            </View>
        </GestureHandlerRootView>
    );
}