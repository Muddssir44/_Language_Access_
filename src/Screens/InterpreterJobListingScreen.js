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

const InterpreterJobListingScreen = ({ navigation }) => {
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
                <Text style={styles.headerTitle}>Job Listings</Text>
                <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                    <Feather name="filter" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Jobs</Text>

                    {/* Job Card Example */}
                    <View style={styles.jobCard}>
                        <View style={styles.jobHeader}>
                            <Text style={styles.jobTitle}>Medical Consultation</Text>
                            <Text style={styles.jobRate}>$45/hour</Text>
                        </View>
                        <Text style={styles.jobDescription}>
                            Spanish-English interpretation needed for medical consultation
                        </Text>
                        <View style={styles.jobDetails}>
                            <View style={styles.jobDetail}>
                                <Feather name="clock" size={16} color={theme.colors.text.secondary} />
                                <Text style={styles.jobDetailText}>2 hours</Text>
                            </View>
                            <View style={styles.jobDetail}>
                                <Feather name="calendar" size={16} color={theme.colors.text.secondary} />
                                <Text style={styles.jobDetailText}>Tomorrow, 2:00 PM</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
                            <Text style={styles.applyButtonText}>Apply Now</Text>
                        </TouchableOpacity>
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
    jobCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    jobTitle: {
        ...theme.typography.h4,
        color: theme.colors.text.primary,
        flex: 1,
    },
    jobRate: {
        ...theme.typography.bodyMedium,
        color: theme.colors.interpreter.primary,
        fontWeight: '600',
    },
    jobDescription: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    jobDetails: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
    },
    jobDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing.lg,
    },
    jobDetailText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    applyButton: {
        backgroundColor: theme.colors.interpreter.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
    },
    applyButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
});

export default InterpreterJobListingScreen;