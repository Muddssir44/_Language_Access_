import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../Components/theme';

const NotificationScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                    <Feather name="settings" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Notifications</Text>

                    {/* Notification Item Example */}
                    <View style={styles.notificationCard}>
                        <View style={styles.notificationIcon}>
                            <Feather name="message-circle" size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>New Message</Text>
                            <Text style={styles.notificationDescription}>
                                You have received a new message from a client
                            </Text>
                            <Text style={styles.notificationTime}>2 minutes ago</Text>
                        </View>
                    </View>

                    <View style={styles.notificationCard}>
                        <View style={styles.notificationIcon}>
                            <Feather name="calendar" size={20} color={theme.colors.success} />
                        </View>
                        <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>Session Reminder</Text>
                            <Text style={styles.notificationDescription}>
                                Your interpretation session starts in 30 minutes
                            </Text>
                            <Text style={styles.notificationTime}>30 minutes ago</Text>
                        </View>
                    </View>

                    <View style={styles.notificationCard}>
                        <View style={styles.notificationIcon}>
                            <Feather name="dollar-sign" size={20} color={theme.colors.accent} />
                        </View>
                        <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>Payment Received</Text>
                            <Text style={styles.notificationDescription}>
                                Payment of $120 has been credited to your account
                            </Text>
                            <Text style={styles.notificationTime}>1 hour ago</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight || theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
    },
    backButton: {
        padding: theme.spacing.sm,
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },
    headerButton: {
        padding: theme.spacing.sm,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
    },
    section: {
        marginVertical: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    notificationDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
        lineHeight: 18,
    },
    notificationTime: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
});

export default NotificationScreen;