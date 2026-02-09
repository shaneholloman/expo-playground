import { View, Text, ScrollView } from 'react-native';

export default function PluginsTab() {
    return (
        <ScrollView
            className="flex-1 bg-black"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 120 }}
        >
            <View className="px-6 pt-16 mb-8">
                <Text className="text-4xl font-bold text-white">Plugins</Text>
                <Text className="text-white/50 mt-2">
                    Browse and manage your plugins
                </Text>
            </View>

            <View className="px-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <View key={i} className="bg-neutral-800 rounded-2xl p-4 mb-3">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-xl bg-neutral-700 mr-3" />
                            <View className="flex-1">
                                <Text className="text-white text-lg">Plugin {i + 1}</Text>
                                <Text className="text-white/40 text-sm">v1.{i}.0</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
