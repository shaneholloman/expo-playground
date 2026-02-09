import { View, Text, ScrollView } from 'react-native';

export default function CloudTab() {
    return (
        <ScrollView
            className="flex-1 bg-black"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 120 }}
        >
            <View className="px-6 pt-16 mb-8">
                <Text className="text-4xl font-bold text-white">Cloud</Text>
                <Text className="text-white/50 mt-2">
                    Your cloud storage and sync
                </Text>
            </View>

            <View className="px-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <View key={i} className="bg-neutral-800 rounded-2xl p-4 mb-3 flex-row items-center">
                        <View className="w-10 h-10 rounded-xl bg-neutral-700 mr-3" />
                        <View className="flex-1">
                            <Text className="text-white text-lg">Document {i + 1}</Text>
                            <Text className="text-white/40 text-sm">Synced</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
