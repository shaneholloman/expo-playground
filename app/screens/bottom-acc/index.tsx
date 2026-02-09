import { router } from 'expo-router';
import Feather from "@expo/vector-icons/Feather";
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import Header from '@/components/Header';

export default function CreateTab() {
    return (
        <>
            <Header showBackButton={true} />
            <ScrollView
                className="flex-1 bg-black px-4"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                <View className="px-6 pt-16 mb-8">
                    <Text className="text-4xl font-bold text-white">Create</Text>
                    <Text className="text-white/50 mt-2">
                        Scroll down to see the tab bar collapse
                    </Text>
                </View>

                {/* Grid of placeholder cards - more items for scrolling */}
                <Image source={require('@/assets/img/scify.jpg')} className="w-full h-[700px] rounded-3xl mb-4" />
                <Image source={require('@/assets/img/scify-4.jpg')} className="w-full h-[400px] rounded-3xl" />
                <Image source={require('@/assets/img/scify.jpg')} className="w-full h-[400px] rounded-3xl mb-4" />
                <Image source={require('@/assets/img/scify-4.jpg')} className="w-full h-[400px] rounded-3xl" />
            </ScrollView>
        </>
    );
}
