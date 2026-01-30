import { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, Dimensions, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import Header from '@/components/Header';
import Feather from '@expo/vector-icons/Feather';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Note {
    id: string;
    title: string;
    content?: string;
    date: string;
    image?: any;
}

const NOTES: Note[] = [
    {
        id: '1',
        title: 'Meeting Notes from San Diego',
        content: 'Discuss Q2 roadmap with the team. Review last quarter performance and set new goals.',
        date: 'Friday, January 31',
    },
    {
        id: '2',
        title: 'Art Gallery Tomorrow Night',
        content: 'Front street, San Diego. Don\'t forget to bring the wine.',
        date: 'Thursday, January 30',
        image: require('@/assets/img/user-1.jpg'),
    },
    {
        id: '3',
        title: 'App Idea',
        content: 'Habit tracker with streaks, daily reminders, and progress charts. Consider gamification elements.',
        date: 'Tuesday, January 28',
    },
    {
        id: '4',
        title: 'Quick reminder',
        date: 'Tuesday, January 28',
    },
    {
        id: '5',
        title: 'Birthday Gift',
        content: 'Something for Sarah',
        date: 'Tuesday, January 28',
        image: require('@/assets/img/user-1.jpg'),
    },
    {
        id: '6',
        title: 'Workout Plan',
        content: 'Mon: Legs, Wed: Arms, Fri: Cardio',
        date: 'Monday, January 27',
    },
    {
        id: '7',
        title: 'Travel Ideas',
        content: 'Japan in spring for cherry blossoms. Iceland for northern lights. New Zealand for hiking.',
        date: 'Sunday, January 26',
        image: require('@/assets/img/bg.webp'),
    },
    {
        id: '8',
        title: 'Book List',
        content: 'Atomic Habits, Deep Work',
        date: 'Saturday, January 25',
    },
];

interface CardLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

function NoteCard({
    note,
    onPress,
    isHidden,
}: {
    note: Note;
    onPress: (layout: CardLayout) => void;
    isHidden: boolean;
}) {
    const cardRef = useRef<View>(null);
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (isHidden) {
            opacity.value = 0;
        } else {
            opacity.value = withTiming(1, { duration: 150 });
        }
    }, [isHidden]);

    const handlePress = () => {
        cardRef.current?.measureInWindow((x, y, width, height) => {
            onPress({ x, y, width, height });
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Pressable onPress={handlePress}>
            <View
                ref={cardRef}
                className="bg-secondary rounded-2xl mb-3 overflow-hidden"
            >
                {note.image && (
                    <Image
                        source={note.image}
                        className="w-full"
                        style={{ height: 176 }}
                        resizeMode="cover"
                    />
                )}
                <View className="p-6">
                    <Text className="text-text font-bold text-xl leading-tight">
                        {note.title}
                    </Text>
                    {note.content && (
                        <Text numberOfLines={1} className="text-text text-sm mt-1 opacity-70">
                            {note.content}
                        </Text>
                    )}
                    <Text className="text-text text-sm mt-24 opacity-40">
                        {note.date}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const EXPAND_DURATION = 280;
const TEXT_FADE_DURATION = 200;

function NoteModal({
    note,
    layout,
    onClose,
}: {
    note: Note;
    layout: CardLayout;
    onClose: () => void;
}) {
    const progress = useSharedValue(0);
    const expandedTextOpacity = useSharedValue(0);
    const smallTextOpacity = useSharedValue(1); // Start visible, fade out on expand
    const [isClosing, setIsClosing] = useState(false);

    // Target dimensions (centered modal)
    const targetWidth = SCREEN_WIDTH - 32;
    const targetHeight = SCREEN_HEIGHT * 0.75;
    const targetX = 16;
    const targetY = (SCREEN_HEIGHT - targetHeight) / 2;

    useEffect(() => {
        // 1. Fade out small text immediately
        smallTextOpacity.value = withTiming(0, { duration: 100 });
        // 2. Expand card after small text fades
        progress.value = withDelay(
            100,
            withTiming(1, {
                duration: EXPAND_DURATION,
                easing: Easing.out(Easing.cubic),
            })
        );
        // 3. Fade in expanded text after expansion completes
        expandedTextOpacity.value = withDelay(
            100 + EXPAND_DURATION,
            withTiming(1, { duration: TEXT_FADE_DURATION, easing: Easing.out(Easing.ease) })
        );
    }, []);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);

        // 1. Fade out expanded text immediately
        expandedTextOpacity.value = withTiming(0, {
            duration: 100,
            easing: Easing.in(Easing.ease),
        });
        // 2. Shrink card after text fades
        progress.value = withDelay(
            100,
            withTiming(0, { duration: 250, easing: Easing.inOut(Easing.cubic) })
        );
        // 3. Fade in small text after shrinking completes
        smallTextOpacity.value = withDelay(
            100 + 250,
            withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
        );
        // Close modal after all animations complete
        setTimeout(onClose, 550);
    };

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 1]),
    }));

    const cardStyle = useAnimatedStyle(() => {
        const x = interpolate(progress.value, [0, 1], [layout.x, targetX]);
        const y = interpolate(progress.value, [0, 1], [layout.y, targetY]);
        const width = interpolate(progress.value, [0, 1], [layout.width, targetWidth]);
        const height = interpolate(progress.value, [0, 1], [layout.height, targetHeight]);
        const borderRadius = interpolate(progress.value, [0, 1], [16, 24]);

        return {
            position: 'absolute',
            left: x,
            top: y,
            width,
            height,
            borderRadius,
            overflow: 'hidden',
        };
    });

    // Image scales from card size to modal size
    const imageStyle = useAnimatedStyle(() => {
        const imageHeight = interpolate(progress.value, [0, 1], [176, 350]);
        return {
            width: '100%',
            height: imageHeight,
        };
    });

    const expandedTextStyle = useAnimatedStyle(() => ({
        opacity: expandedTextOpacity.value,
        transform: [
            { translateY: interpolate(expandedTextOpacity.value, [0, 1], [8, 0]) },
        ],
    }));

    const smallTextStyle = useAnimatedStyle(() => {
        // Position below the image (which animates from 176 to 224)
        const top = note.image ? interpolate(progress.value, [0, 1], [176, 224]) : 0;
        return {
            opacity: smallTextOpacity.value,
            top,
        };
    });

    return (
        <Modal transparent visible statusBarTranslucent>
            {/* Backdrop */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    },
                    backdropStyle,
                ]}
            >
                <Pressable style={{ flex: 1 }} onPress={handleClose} />
            </Animated.View>

            {/* Animated Card */}
            <Animated.View style={cardStyle} className="bg-secondary">
                {note.image && (
                    <Animated.Image
                        source={note.image}
                        style={imageStyle}
                        resizeMode="cover"
                        className="mb-10"
                    />
                )}

                {/* Small text (visible at start and end) - matches NoteCard styling exactly */}
                <Animated.View style={[smallTextStyle, { position: 'absolute', left: 0, right: 0, zIndex: 10 }]} className="p-6">
                    <Text className="text-text font-bold text-xl leading-tight">
                        {note.title}
                    </Text>
                    {note.content && (
                        <Text numberOfLines={1} className="text-text text-sm mt-1 opacity-70">
                            {note.content}
                        </Text>
                    )}
                    <Text className="text-text text-sm mt-24 opacity-40">
                        {note.date}
                    </Text>
                </Animated.View>

                {/* Expanded text (visible when fully expanded) */}
                <Animated.View style={[expandedTextStyle, { zIndex: 20 }]} className="p-10 flex-1 justify-center">
                    <Text className="text-text font-bold text-4xl leading-tight">
                        {note.title}
                    </Text>
                    {note.content && (
                        <Text className="text-text text-lg mt-4 mb-20 opacity-70 leading-relaxed">
                            {note.content}
                        </Text>
                    )}
                    {/*<Text className="text-text text-xs opacity-40">
                        {note.date}
                    </Text>*/}
                </Animated.View>

                {/* Close button */}
                {!isClosing && (
                    <Pressable
                        onPress={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/20 rounded-full z-20 items-center justify-center"
                    >
                        <Feather name="x" size={20} color="white" />
                    </Pressable>
                )}
            </Animated.View>
        </Modal>
    );
}

export default function NotesScreen() {
    const insets = useSafeAreaInsets();
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [cardLayout, setCardLayout] = useState<CardLayout | null>(null);

    const handleNotePress = (note: Note, layout: CardLayout) => {
        setCardLayout(layout);
        setSelectedNote(note);
    };

    const handleClose = () => {
        setSelectedNote(null);
        setCardLayout(null);
    };

    const leftColumn = NOTES.filter((_, i) => i % 2 === 0);
    const rightColumn = NOTES.filter((_, i) => i % 2 === 1);

    return (
        <View className="flex-1 bg-background">
            <Header showBackButton />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: insets.bottom + 16,
                }}
            >
                <View className="px-4 py-16">
                    <Text className="text-text text-5xl pl-3 font-bold">Notes</Text>
                </View>
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        {leftColumn.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onPress={(layout) => handleNotePress(note, layout)}
                                isHidden={selectedNote?.id === note.id}
                            />
                        ))}
                    </View>
                    <View className="flex-1">
                        {rightColumn.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onPress={(layout) => handleNotePress(note, layout)}
                                isHidden={selectedNote?.id === note.id}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {selectedNote && cardLayout && (
                <NoteModal
                    note={selectedNote}
                    layout={cardLayout}
                    onClose={handleClose}
                />
            )}
        </View>
    );
}
