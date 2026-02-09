import { View, Text, ScrollView } from 'react-native';

export default function SettingsTab() {
    return (
        <ScrollView
            className="flex-1 bg-black"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 120 }}
        >
            <View className="px-6 pt-16 mb-8">
                <Text className="text-4xl font-bold text-white">Settings</Text>
                <Text className="text-white/50 mt-2">
                    Configure your preferences
                </Text>
            </View>

            {/* Settings list */}
            <View className="px-4">
                {['Account', 'Notifications', 'Privacy', 'Appearance', 'Storage', 'Help', 'About', 'Feedback'].map((item, i) => (
                    <View key={i} className="bg-neutral-800 rounded-2xl p-4 mb-3">
                        <Text className="text-white text-lg">{item}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
