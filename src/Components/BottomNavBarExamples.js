// BottomNavBar Integration Examples
// This file shows how to integrate the BottomNavBar component into various screens

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BottomNavBar from './BottomNavBar';

// Example 1: Messages Screen Integration
export const MessagesScreenWithNavBar = ({ navigation, userRole = 'client' }) => {
    return (
        <View style={styles.container}>
            {/* Your Messages screen content here */}

            <BottomNavBar
                navigation={navigation}
                activeTab="Messages"
                userRole={userRole}
            />
        </View>
    );
};

// Example 2: FindInterpreter Screen Integration  
export const FindInterpreterScreenWithNavBar = ({ navigation, userRole = 'client' }) => {
    return (
        <View style={styles.container}>
            {/* Your FindInterpreter screen content here */}

            <BottomNavBar
                navigation={navigation}
                activeTab="FindInterpreter"
                userRole={userRole}
            />
        </View>
    );
};

// Example 3: PostJob Screen Integration (Client only)
export const PostJobScreenWithNavBar = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Your PostJob screen content here */}

            <BottomNavBar
                navigation={navigation}
                activeTab="PostJob"
                userRole="client"
            />
        </View>
    );
};

// Example 4: InterpreterJobListing Screen Integration (Interpreter only)
export const InterpreterJobListingWithNavBar = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Your InterpreterJobListing screen content here */}

            <BottomNavBar
                navigation={navigation}
                activeTab="JobListings"
                userRole="interpreter"
            />
        </View>
    );
};

// Example 5: Custom Tab Press Handler
export const ScreenWithCustomTabHandler = ({ navigation, userRole = 'client' }) => {
    const handleTabPress = (tab) => {
        console.log('Custom tab press:', tab.id);

        // Add custom logic before navigation
        switch (tab.id) {
            case 'Messages':
                // Mark notifications as read
                console.log('Marking messages as read...');
                break;
            case 'JobListings':
                // Refresh job listings
                console.log('Refreshing job listings...');
                break;
            default:
                break;
        }

        // Navigate to the screen
        navigation.navigate(tab.screen);
    };

    return (
        <View style={styles.container}>
            {/* Your screen content here */}

            <BottomNavBar
                navigation={navigation}
                activeTab="Home"
                userRole={userRole}
                onTabPress={handleTabPress}
            />
        </View>
    );
};

// Example 6: With ScrollView (recommended pattern)
export const ScrollableScreenWithNavBar = ({ navigation, userRole = 'client' }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Your scrollable content here */}
            </ScrollView>

            <BottomNavBar
                navigation={navigation}
                activeTab="Home"
                userRole={userRole}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100, // Space for bottom navigation
        padding: 16,
    },
});

export default {
    MessagesScreenWithNavBar,
    FindInterpreterScreenWithNavBar,
    PostJobScreenWithNavBar,
    InterpreterJobListingWithNavBar,
    ScreenWithCustomTabHandler,
    ScrollableScreenWithNavBar,
};