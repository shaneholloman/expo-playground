import { View, Text, Pressable, Dimensions, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import Animated, { FadeIn, FadeOut, FadeInDown, useAnimatedStyle, withSpring } from "react-native-reanimated";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "expo-router";
import { shadowPresets } from "@/utils/useShadow";
import { StatusBar } from "expo-status-bar";

type GradientTheme = 'charcoal' | 'winter' | 'night' | 'spring';

interface ThemeData {
    key: GradientTheme;
    name: string;
    description: string;
    colors: readonly [string, string, string];
    isLight: boolean;
}

const THEMES: ThemeData[] = [
    { key: 'charcoal', name: 'Charcoal', description: 'Dark charcoal', colors: ['#2c3e50', '#1a252f', '#0d1520'], isLight: false },
    { key: 'winter', name: 'Winter', description: 'Cool light blues', colors: ['#e0eafc', '#cfdef3', '#a8c0d8'], isLight: true },
    { key: 'night', name: 'Night', description: 'Ocean depths', colors: ['#2d5f6f', '#1a3a4a', '#0a1f2e'], isLight: false },
    { key: 'spring', name: 'Spring', description: 'Soft pastel tones', colors: ['#a8edea', '#fed6e3', '#fbc2eb'], isLight: true },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_SPACING = 10;

const GradientScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const activeTheme = THEMES[activeIndex];

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
        setActiveIndex(index);
    };

    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setActiveIndex(index);
    };

    return (
        <View className="flex-1" style={{ paddingTop: insets.top }}>
            <StatusBar style={activeTheme.isLight ? 'dark' : 'light'} />
            <View className="px-4 flex-row relative z-40 pt-2">
                <Pressable onPress={() => navigation.goBack()}>
                    <Feather
                        name="arrow-left"
                        size={24}
                        color={activeTheme.isLight ? '#000' : '#fff'}
                    />
                </Pressable>
            </View>
            {/* Animated gradient background */}
            <Animated.View
                key={activeTheme.key}
                entering={FadeIn.duration(600)}
                exiting={FadeOut.duration(400)}
                style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/0 z-20" />
                <LinearGradient colors={activeTheme.colors} style={{ flex: 1 }} />
            </Animated.View>

            <View className="flex-1 justify-between" style={{ paddingBottom: insets.bottom + 20 }}>

                {/* Carousel */}
                <View className="flex-1 justify-center items-center">
                    <FlatList
                        ref={flatListRef}
                        data={THEMES}
                        horizontal
                        className="pt-40"
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + CARD_SPACING}
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
                        }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => (
                            <ThemeCard
                                theme={item}
                                index={index}
                                activeIndex={activeIndex}
                            />
                        )}
                        keyExtractor={(item) => item.key}
                    />
                </View>

                {/* Dot indicator */}
                <View className="flex-row justify-center items-center mb-6">
                    {THEMES.map((_, index) => (
                        <DotIndicator
                            key={index}
                            index={index}
                            activeIndex={activeIndex}
                            isLight={activeTheme.isLight}
                            onPress={() => scrollToIndex(index)}
                        />
                    ))}
                </View>

                {/* Save button */}
                <Animated.View
                    entering={FadeInDown.delay(400)}
                    className="px-8"
                >
                    <Pressable
                        className={`py-4 rounded-2xl ${activeTheme.isLight ? 'bg-black' : 'bg-white'
                            }`}
                    >
                        <Text
                            className={`text-center text-lg font-bold ${activeTheme.isLight ? 'text-white' : 'text-black'
                                }`}
                        >
                            Save Theme
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
};

const ThemeCard = ({
    theme,
    index,
    activeIndex,
}: {
    theme: ThemeData;
    index: number;
    activeIndex: number;
}) => {
    const isActive = index === activeIndex;

    const animatedCardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(isActive ? 1 : 0.85, {
                        damping: 100,
                        stiffness: 900,
                    }),
                },
            ],
            opacity: withSpring(isActive ? 1 : 0.5, {
                damping: 15,
                stiffness: 150,
            }),
        };
    });

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={{ width: CARD_WIDTH, marginHorizontal: CARD_SPACING / 2 }}
        >
            <Animated.View
                className={`border ${theme.isLight ? 'border-white' : 'border-white/10'}`}
                style={[
                    {
                        height: 280,
                        borderRadius: 40,
                        ...shadowPresets.card,
                        
                    },
                    animatedCardStyle,
                ]}
            >
                <LinearGradient
                    colors={theme.colors}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ flex: 1, padding: 26, borderRadius: 40 }}
                >
                    
                    <View className="flex-row gap-2">
                        <Text className={`text-xl font-bold opacity-20 mr-auto ${theme.isLight ? 'text-black' : 'text-white'}`}>0{index + 1}</Text>
                        {theme.colors.map((color, i) => (
                            <View
                                key={i}
                                className={`w-6 h-6 rounded-full border ${theme.isLight ? 'border-black/20' : 'border-white/20'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </View>
                    <View className="flex-1 justify-end">
                        <Text
                            className={`text-4xl font-bold ${theme.isLight ? 'text-black' : 'text-white'
                                }`}
                        >
                            {theme.name}
                        </Text>
                        <Text
                            className={`text-lg ${theme.isLight ? 'text-black opacity-70' : 'text-white opacity-70'
                                }`}
                        >
                            {theme.description}
                        </Text>
                    </View>
                </LinearGradient>
            </Animated.View>
        </Animated.View>
    );
};

const DotIndicator = ({
    index,
    activeIndex,
    isLight,
    onPress,
}: {
    index: number;
    activeIndex: number;
    isLight: boolean;
    onPress: () => void;
}) => {
    const isActive = index === activeIndex;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(isActive ? 32 : 8, {
                damping: 100,
                stiffness: 900,
            }),
            opacity: withSpring(isActive ? 1 : 0.3, {
                damping: 100,
                stiffness: 900,
            }),
        };
    });

    return (
        <Pressable onPress={onPress} className="mx-1">
            <Animated.View
                style={[
                    {
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: isLight ? '#000' : '#fff',
                    },
                    animatedStyle,
                ]}
            />
        </Pressable>
    );
};

export default GradientScreen;