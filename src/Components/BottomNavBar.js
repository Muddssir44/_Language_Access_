import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,

    StyleSheet,

} from 'react-native';

const BottomNavBar = ({ activeTab, onTabPress }) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'messages', icon: MessageCircle, label: 'Messages' },
        { id: 'find', icon: Users, label: 'Find' },
        { id: 'jobs', icon: Briefcase, label: 'Jobs' }
    ];

    return (
        <View style={styles.bottomNav}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.navTab}
                        onPress={() => onTabPress(tab.id)}
                    >
                        <Icon
                            size={24}
                            color={isActive ? theme.primary : theme.text.light}
                        />
                        <Text style={[
                            styles.navTabLabel,
                            { color: isActive ? theme.primary : theme.text.light }
                        ]}>
                            {tab.label}
                        </Text>
                        {isActive && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({


    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingBottom: 20,
        paddingTop: 8,
        ...theme.shadow,
    },
    navTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        position: 'relative',
    },
    navTabLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    activeTabIndicator: {
        position: 'absolute',
        top: -8,
        width: 32,
        height: 3,
        backgroundColor: theme.primary,
        borderRadius: 2,
    },

    bottomPadding: {
        height: 20,
    },
});
export default BottomNavBar;