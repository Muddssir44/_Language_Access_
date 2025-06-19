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
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../Components/theme';

const InterpreterHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Interpreter Dashboard</Text>
                <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                    <Feather name="bell" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Welcome Section */}
                <LinearGradient
                    colors={theme.colors.interpreter.gradient}
                    style={styles.welcomeCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.welcomeContent}>
                        <Feather name="globe" size={32} color={theme.colors.text.white} />
                        <Text style={styles.welcomeTitle}>Welcome, Interpreter!</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Your interpreter dashboard is ready for bookings
                        </Text>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                            <Feather name="calendar" size={24} color={theme.colors.interpreter.primary} />
                            <Text style={styles.actionTitle}>My Schedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                            <Feather name="briefcase" size={24} color={theme.colors.interpreter.primary} />
                            <Text style={styles.actionTitle}>Job Listings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                            <Feather name="dollar-sign" size={24} color={theme.colors.interpreter.primary} />
                            <Text style={styles.actionTitle}>Earnings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                            <Feather name="user" size={24} color={theme.colors.interpreter.primary} />
                            <Text style={styles.actionTitle}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Status Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Today's Overview</Text>
                    <View style={styles.statusGrid}>
                        <View style={styles.statusCard}>
                            <Text style={styles.statusNumber}>3</Text>
                            <Text style={styles.statusLabel}>Sessions Today</Text>
                        </View>
                        <View style={styles.statusCard}>
                            <Text style={styles.statusNumber}>$245</Text>
                            <Text style={styles.statusLabel}>Today's Earnings</Text>
                        </View>
                        <View style={styles.statusCard}>
                            <Text style={styles.statusNumber}>4.9</Text>
                            <Text style={styles.statusLabel}>Rating</Text>
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
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        fontWeight: '700',
    },
    headerButton: {
        padding: theme.spacing.sm,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
    },
    welcomeCard: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        marginVertical: theme.spacing.lg,
        ...theme.shadows.md,
    },
    welcomeContent: {
        alignItems: 'center',
    },
    welcomeTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.white,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    section: {
        marginVertical: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    actionTitle: {
        ...theme.typography.captionMedium,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },
    statusGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginHorizontal: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    statusNumber: {
        ...theme.typography.h2,
        color: theme.colors.interpreter.primary,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    statusLabel: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
});

export default InterpreterHomeScreen;