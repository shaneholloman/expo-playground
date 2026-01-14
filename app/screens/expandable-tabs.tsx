import Header from "@/components/Header";
import { View, Text, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shadowPresets } from "@/utils/useShadow";
import Feather from "@expo/vector-icons/Feather";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import useThemeColors from "@/app/contexts/ThemeColors";

const MENU_LINKS = [
    { icon: "settings", label: "Settings", description: "Manage your preferences" },
    { icon: "bell", label: "Notifications", description: "View your alerts" },
    { icon: "heart", label: "Favorites", description: "Your saved items" },
    { icon: "log-out", label: "Logout", description: "Sign out of your account" },
];

export default function ExpandableTabs() {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const { height: windowHeight } = useWindowDimensions();
    const isExpanded = useSharedValue(0);

    const toggleExpand = () => {
        isExpanded.value = withSpring(isExpanded.value === 0 ? 1 : 0, {
            damping: 100,
            stiffness: 600,
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
            } else if (delta > threshold && isExpanded.value > 0) {
                // Dragged down significantly from expanded - collapse
                isExpanded.value = withSpring(0, {
                    damping: 100,
                    stiffness: 600,
                });
            } else {
                // Didn't drag far enough - snap back to current state
                if (isExpanded.value > 0.5) {
                    isExpanded.value = withSpring(1, {
                        damping: 100,
                        stiffness: 600,
                    });
                } else {
                    isExpanded.value = withSpring(0, {
                        damping: 100,
                        stiffness: 600,
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

    return (
        <GestureHandlerRootView>
            <Header showBackButton />
            <View className="flex-1 bg-background">
                <ScrollView className="flex-1 px-6 pt-6">
                    <View className="flex-row flex-wrap gap-3">
                        {[...Array(8)].map((_, index) => (
                            <View
                                key={index}
                                className="w-[48%] h-60 bg-secondary rounded-2xl"
                            />
                        ))}
                    </View>
                </ScrollView>
                <Animated.View
                    className="absolute bottom-0 left-0 bg-secondary w-full"
                    style={[
                        {
                            paddingBottom: insets.bottom,
                            ...shadowPresets.card,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        },
                        containerAnimatedStyle,
                    ]}
                >
                    <GestureDetector gesture={panGesture}>
                        <View className="w-full justify-center items-center pt-2 pb-2">
                            <View className="w-20 h-2 rounded-full bg-background" />
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
                                <Text className="text-invert text-xl font-bold">JD</Text>
                            </View>
                            <View>
                                <Text className="text-text text-xl font-bold">John Doe</Text>
                                <Text className="text-text opacity-50">john.doe@example.com</Text>
                            </View>
                        </View>

                        {/* Menu links */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {MENU_LINKS.map((link, index) => (
                                <Pressable
                                    key={index}
                                    className="flex-row items-center py-4 px-4 mb-2 rounded-2xl bg-background"
                                >
                                    <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center mr-4">
                                        <Feather name={link.icon as any} size={18} color={colors.icon} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-text text-base font-semibold">{link.label}</Text>
                                        <Text className="text-text text-sm opacity-50">{link.description}</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color={colors.icon} opacity={0.3} />
                                </Pressable>
                            ))}
                            <View className="h-20" />
                        </ScrollView>
                    </Animated.View>

                    {/* Bottom tab bar */}
                    <View className="absolute bottom-0 left-0 right-0 " style={{ paddingBottom: insets.bottom }}>
                        <View className="flex-row w-full">
                            <Animated.View
                                className="w-1/5"
                                style={tabIconsAnimatedStyle}
                            >
                                <Pressable className="py-4 items-center justify-center">
                                    <Feather name="home" size={22} color={colors.icon} />
                                </Pressable>
                            </Animated.View>
                            <Animated.View
                                className="w-1/5"
                                style={tabIconsAnimatedStyle}
                            >
                                <Pressable className="py-4 items-center justify-center">
                                    <Feather name="bookmark" size={22} color={colors.icon} />
                                </Pressable>
                            </Animated.View>
                            <Animated.View
                                className="w-1/5"
                                style={tabIconsAnimatedStyle}
                            >
                                <Pressable className="py-4 items-center justify-center">
                                    <Feather name="camera" size={22} color={colors.icon} />
                                </Pressable>
                            </Animated.View>
                            <Animated.View
                                className="w-1/5"
                                style={tabIconsAnimatedStyle}
                            >
                                <Pressable className="py-4 items-center justify-center">
                                    <Feather name="user" size={22} color={colors.icon} />
                                </Pressable>
                            </Animated.View>
                            <View className="w-1/5">
                                <Pressable onPress={toggleExpand} className="py-4 items-center justify-center">
                                    <Animated.View style={plusIconAnimatedStyle}>
                                        <Feather name="plus" size={22} color={colors.icon} />
                                    </Animated.View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </GestureHandlerRootView>
    );
}