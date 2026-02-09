import { Platform, View, Text, Image, } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Square, MoreHorizontal } from 'lucide-react-native';

function BottomAccessoryContent() {
    const placement = NativeTabs.BottomAccessory.usePlacement();

    // Inline placement - compact when collapsed
    if (placement === 'inline') {
        return (
            <View className="flex-row items-center px-4 py-2.5  rounded-2xl">
                <View className="overflow-hidden mr-3">
                    <Image
                        source={require('../../../assets/img/user-1.jpg')}
                        className="w-9 h-9 rounded-xl"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-semibold text-sm" numberOfLines={1}>
                        Hey guys! How it is going today?
                    </Text>
                    <Text className="text-white/60 text-xs">2 min ago</Text>
                </View>
            </View>
        );
    }

    // Regular placement - floating above tabs (native will apply liquid glass)
    return (
        <View className="flex-row items-center px-4 py-2.5  rounded-2xl">
            <View className="overflow-hidden mr-3">
                <Image
                    source={require('../../../assets/img/user-1.jpg')}
                    className="w-9 h-9 rounded-xl"
                />
            </View>
            <View className="flex-1">
                <Text className="text-white font-semibold text-sm" numberOfLines={1}>
                    Hey guys! How it is going today?
                </Text>
                <Text className="text-white/60 text-xs">2 min ago</Text>
            </View>
            <MoreHorizontal size={18} color="white" />
        </View>
    );
}

export default function BottomAccLayout() {
    if (Platform.OS !== 'ios') {
        return (
            <View className="flex-1 bg-background items-center justify-center px-6">
                <Text className="text-text text-xl font-bold text-center">
                    Bottom Accessory requires iOS 26+
                </Text>
                <Text className="text-text/50 text-center mt-2">
                    Features: Liquid glass tabs, minimize on scroll, floating accessory
                </Text>
            </View>
        );
    }

    return (
        <NativeTabs minimizeBehavior="onScrollDown" tintColor="white">
            <NativeTabs.BottomAccessory>
                <BottomAccessoryContent />
            </NativeTabs.BottomAccessory>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Icon
                src={{
                    default: require('../../../assets/img/home.png'),
                    selected: require('../../../assets/img/home.png'),
                  }}
                />
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="plugins">
                <NativeTabs.Trigger.Icon 
                
                src={{
                    default: require('../../../assets/img/map.png'),
                    selected: require('../../../assets/img/map.png'),
                  }}
                />
                <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="cloud">
            <NativeTabs.Trigger.Badge>1</NativeTabs.Trigger.Badge>
                <NativeTabs.Trigger.Icon 
                src={{
                    default: require('../../../assets/img/mail.png'),
                    selected: require('../../../assets/img/mail.png'),
                  }}
                />
                <NativeTabs.Trigger.Label>Chat</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="settings" role="search">
                <NativeTabs.Trigger.Icon />
                <NativeTabs.Trigger.Label hidden>Settings</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
