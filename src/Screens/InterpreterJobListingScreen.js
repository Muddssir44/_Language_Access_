import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    Animated,
    Dimensions,
    Alert,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'available', label: 'Available Jobs', icon: 'briefcase' },
        { id: 'applied', label: 'Applied', icon: 'send' },
        { id: 'completed', label: 'Completed', icon: 'check-circle' }
    ];

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[
                        styles.tabButton,
                        activeTab === tab.id && styles.tabButtonActive
                    ]}
                    onPress={() => onTabChange(tab.id)}
                    activeOpacity={0.8}
                >
                    <Feather
                        name={tab.icon}
                        size={18}
                        color={activeTab === tab.id ? theme.colors.primary : theme.colors.text.secondary}
                    />
                    <Text style={[
                        styles.tabButtonText,
                        activeTab === tab.id && styles.tabButtonTextActive
                    ]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Helper Text Component
const HelperText = ({ text, icon = 'info' }) => (
    <View style={styles.helperContainer}>
        <Feather name={icon} size={16} color={theme.colors.primary} />
        <Text style={styles.helperText}>{text}</Text>
    </View>
);

// Available Job Card Component
const AvailableJobCard = ({ job, onApply, index }) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 100,
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 100,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    const getMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'video call': return 'video';
            case 'audio call': return 'phone';
            case 'zoom': return 'monitor';
            case 'onsite': return 'map-pin';
            default: return 'phone';
        }
    };

    return (
        <Animated.View
            style={[
                styles.jobCard,
                { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
            ]}
        >
            <View style={styles.jobCardHeader}>
                <Text style={styles.jobCardTitle} numberOfLines={2}>{job.title}</Text>
                <View style={styles.urgencyBadge}>
                    <Text style={styles.urgencyText}>{job.isASAP ? 'ASAP' : 'Scheduled'}</Text>
                </View>
            </View>

            <View style={styles.jobCardContent}>
                <View style={styles.jobCardRow}>
                    <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.languagePair}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="bookmark" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.domain}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name={getMethodIcon(job.method)} size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.method}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="clock" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.date}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="dollar-sign" size={16} color={theme.colors.success} />
                    <Text style={[styles.jobCardDetail, { color: theme.colors.success, fontWeight: '600' }]}>
                        ${job.budget}
                    </Text>
                </View>
            </View>

            <Text style={styles.jobDescription} numberOfLines={2}>
                {job.description}
            </Text>

            <View style={styles.jobCardFooter}>
                <View>
                    <Text style={styles.postedDate}>Posted {job.postedDate}</Text>
                    <Text style={styles.applicationsCount}>{job.applications} applications</Text>
                </View>
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => onApply(job)}
                    activeOpacity={0.8}
                >
                    <Feather name="send" size={18} color={theme.colors.text.white} />
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// Applied Job Card Component
const AppliedJobCard = ({ job, index }) => {
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            delay: index * 100,
            useNativeDriver: false,
        }).start();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return theme.colors.warning;
            case 'reviewed': return theme.colors.secondary;
            case 'accepted': return theme.colors.success;
            case 'rejected': return theme.colors.error;
            default: return theme.colors.text.secondary;
        }
    };

    return (
        <Animated.View style={[styles.jobCard, { opacity: opacityAnim }]}>
            <View style={styles.jobCardHeader}>
                <Text style={styles.jobCardTitle} numberOfLines={2}>{job.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                    <Text style={styles.statusText}>{job.status}</Text>
                </View>
            </View>

            <View style={styles.jobCardContent}>
                <View style={styles.jobCardRow}>
                    <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.languagePair}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="calendar" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>Applied {job.appliedDate}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="dollar-sign" size={16} color={theme.colors.success} />
                    <Text style={[styles.jobCardDetail, { color: theme.colors.success, fontWeight: '600' }]}>
                        ${job.budget}
                    </Text>
                </View>
            </View>

            {job.status === 'pending' && (
                <TouchableOpacity style={styles.withdrawButton} activeOpacity={0.8}>
                    <Text style={styles.withdrawButtonText}>Withdraw Application</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

// Completed Job Card Component
const CompletedJobCard = ({ job, index }) => {
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            delay: index * 100,
            useNativeDriver: false,
        }).start();
    }, []);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Feather
                key={i}
                name="star"
                size={14}
                color={i < rating ? theme.colors.accent : theme.colors.border}
                style={{ marginRight: 2 }}
            />
        ));
    };

    return (
        <Animated.View style={[styles.jobCard, { opacity: opacityAnim }]}>
            <View style={styles.jobCardHeader}>
                <Text style={styles.jobCardTitle} numberOfLines={2}>{job.title}</Text>
                <View style={styles.completedBadge}>
                    <Feather name="check-circle" size={16} color={theme.colors.success} />
                    <Text style={styles.completedText}>Completed</Text>
                </View>
            </View>

            <View style={styles.jobCardContent}>
                <View style={styles.jobCardRow}>
                    <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.languagePair}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="calendar" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>Completed {job.completedDate}</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="clock" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.jobCardDetail}>{job.duration} minutes</Text>
                </View>

                <View style={styles.jobCardRow}>
                    <Feather name="dollar-sign" size={16} color={theme.colors.success} />
                    <Text style={[styles.jobCardDetail, { color: theme.colors.success, fontWeight: '600' }]}>
                        ${job.earnings} earned
                    </Text>
                </View>

                <View style={styles.ratingRow}>
                    <Text style={styles.ratingLabel}>Client Rating:</Text>
                    <View style={styles.starsContainer}>
                        {renderStars(job.rating)}
                        <Text style={styles.ratingText}>({job.rating}/5)</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

// Empty State Component
const EmptyState = ({ type }) => {
    const bounceAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0.95,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const getEmptyStateContent = () => {
        switch (type) {
            case 'available':
                return {
                    icon: 'search',
                    title: 'No jobs available right now',
                    subtitle: 'Check back later for new interpretation opportunities that match your skills.',
                };
            case 'applied':
                return {
                    icon: 'send',
                    title: "You haven't applied to any jobs yet",
                    subtitle: "Explore the 'Available Jobs' tab to find the right opportunity and start your interpretation journey!",
                };
            case 'completed':
                return {
                    icon: 'award',
                    title: 'No completed jobs yet',
                    subtitle: 'Once you complete your first interpretation job, it will appear here with client feedback.',
                };
            default:
                return { icon: 'inbox', title: 'Nothing here', subtitle: '' };
        }
    };

    const content = getEmptyStateContent();

    return (
        <View style={styles.emptyState}>
            <Animated.View
                style={[
                    styles.emptyStateIcon,
                    { transform: [{ scale: bounceAnim }] }
                ]}
            >
                <Feather name={content.icon} size={64} color={theme.colors.text.light} />
            </Animated.View>
            <Text style={styles.emptyStateTitle}>{content.title}</Text>
            <Text style={styles.emptyStateSubtitle}>{content.subtitle}</Text>
        </View>
    );
};

// Apply Job Modal Component
const ApplyJobModal = ({ visible, job, onClose, onSubmit }) => {
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 100,
                friction: 8,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [visible]);

    const handleSubmit = () => {
        if (!coverLetter.trim()) {
            Alert.alert('Required', 'Please write a brief cover letter to introduce yourself.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit(job, coverLetter);
            setIsSubmitting(false);
            setCoverLetter('');
            Alert.alert('Application Sent!', 'Your application has been sent to the client. You\'ll receive updates on the status.');
        }, 1500);
    };

    if (!job) return null;

    return (
        <Modal visible={visible} animationType="none" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.applyModalContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <Feather name="x" size={24} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Apply for Job</Text>
                        <View style={styles.modalHeaderSpacer} />
                    </View>

                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        {/* Job Summary */}
                        <View style={styles.jobSummarySection}>
                            <Text style={styles.sectionTitle}>Job Details</Text>
                            <View style={styles.jobSummaryCard}>
                                <Text style={styles.jobSummaryTitle}>{job.title}</Text>
                                <Text style={styles.jobSummaryDetail}>
                                    {job.languagePair} • {job.method} • ${job.budget}
                                </Text>
                                <Text style={styles.jobSummaryDescription}>
                                    {job.description}
                                </Text>
                            </View>
                        </View>

                        {/* Application Tips */}
                        <View style={styles.tipsSection}>
                            <Text style={styles.sectionTitle}>Application Tips</Text>
                            <View style={styles.tipItem}>
                                <Feather name="check-circle" size={16} color={theme.colors.success} />
                                <Text style={styles.tipText}>Highlight your relevant experience in this domain</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Feather name="check-circle" size={16} color={theme.colors.success} />
                                <Text style={styles.tipText}>Mention your availability for the scheduled time</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Feather name="check-circle" size={16} color={theme.colors.success} />
                                <Text style={styles.tipText}>Be professional and concise in your introduction</Text>
                            </View>
                        </View>

                        {/* Cover Letter */}
                        <View style={styles.coverLetterSection}>
                            <Text style={styles.sectionTitle}>Cover Letter</Text>
                            <TextInput
                                style={styles.coverLetterInput}
                                value={coverLetter}
                                onChangeText={setCoverLetter}
                                placeholder="Introduce yourself and explain why you're the right fit for this job..."
                                placeholderTextColor={theme.colors.text.light}
                                multiline={true}
                                numberOfLines={6}
                                textAlignVertical="top"
                            />
                            <Text style={styles.characterCount}>
                                {coverLetter.length} characters
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            activeOpacity={0.8}
                        >
                            {isSubmitting ? (
                                <Text style={styles.submitButtonText}>Sending Application...</Text>
                            ) : (
                                <>
                                    <Feather name="send" size={20} color={theme.colors.text.white} />
                                    <Text style={styles.submitButtonText}>Send Application</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

// Main InterpreterJobListingScreen Component
const InterpreterJobListingScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('available');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Sample data
    const [availableJobs] = useState([
        {
            id: '1',
            title: 'Legal Contract Review Session',
            languagePair: 'English ↔ Spanish',
            domain: 'Legal',
            method: 'Video call',
            date: 'Dec 22, 2:00 PM',
            budget: '75',
            description: 'Need interpretation for a legal contract review session between English and Spanish speaking parties.',
            postedDate: '2 hours ago',
            applications: 3,
            isASAP: false,
        },
        {
            id: '2',
            title: 'ASAP Medical Consultation',
            languagePair: 'English ↔ French',
            domain: 'Medical',
            method: 'Audio call',
            date: 'ASAP',
            budget: '100',
            description: 'Urgent medical consultation interpretation needed for patient-doctor communication.',
            postedDate: '30 minutes ago',
            applications: 1,
            isASAP: true,
        },
    ]);

    const [appliedJobs] = useState([
        {
            id: '3',
            title: 'Business Meeting Interpretation',
            languagePair: 'English ↔ German',
            budget: '120',
            appliedDate: '2 days ago',
            status: 'Pending',
        },
    ]);

    const [completedJobs] = useState([
        {
            id: '4',
            title: 'Academic Conference Session',
            languagePair: 'English ↔ Chinese',
            completedDate: '1 week ago',
            duration: 90,
            earnings: '150',
            rating: 5,
        },
    ]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleApplyToJob = (job) => {
        setSelectedJob(job);
        setShowApplyModal(true);
    };

    const handleSubmitApplication = (job, coverLetter) => {
        console.log('Application submitted for:', job.title, 'Cover letter:', coverLetter);
        setShowApplyModal(false);
    };

    const getHelperText = () => {
        switch (activeTab) {
            case 'available':
                return 'These are open jobs from clients. Apply to ones that match your expertise and availability.';
            case 'applied':
                return 'Track your applications here. You\'ll receive notifications when clients review your proposals.';
            case 'completed':
                return 'View your interpretation history and client feedback to build your professional reputation.';
            default:
                return '';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'available':
                return availableJobs.length > 0 ? (
                    <FlatList
                        data={availableJobs}
                        renderItem={({ item, index }) => (
                            <AvailableJobCard
                                job={item}
                                onApply={handleApplyToJob}
                                index={index}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.jobsList}
                    />
                ) : (
                    <EmptyState type="available" />
                );

            case 'applied':
                return appliedJobs.length > 0 ? (
                    <FlatList
                        data={appliedJobs}
                        renderItem={({ item, index }) => (
                            <AppliedJobCard job={item} index={index} />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.jobsList}
                    />
                ) : (
                    <EmptyState type="applied" />
                );

            case 'completed':
                return completedJobs.length > 0 ? (
                    <FlatList
                        data={completedJobs}
                        renderItem={({ item, index }) => (
                            <CompletedJobCard job={item} index={index} />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.jobsList}
                    />
                ) : (
                    <EmptyState type="completed" />
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                title="Job Opportunities"
                onBack={() => navigation.goBack()}
            />
            <View style={{ flex: 1, paddingTop: getHeaderHeight() }}>
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <HelperText text={getHelperText()} />

                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {renderContent()}
                </Animated.View>
            </View>
            <ApplyJobModal
                visible={showApplyModal}
                job={selectedJob}
                onClose={() => setShowApplyModal(false)}
                onSubmit={handleSubmitApplication}
            />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    headerButton: {
        padding: theme.spacing.sm,
    },

    // Tab Navigation Styles
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        marginHorizontal: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
    },
    tabButtonActive: {
        backgroundColor: theme.colors.surfaceLight,
    },
    tabButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    tabButtonTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },

    // Helper Text Styles
    helperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    helperText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // Content Styles
    content: {
        flex: 1,
    },
    jobsList: {
        padding: theme.spacing.md,
    },

    // Job Card Styles
    jobCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    jobCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    jobCardTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    urgencyBadge: {
        backgroundColor: theme.colors.warning,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    urgencyText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    completedText: {
        ...theme.typography.small,
        color: theme.colors.success,
        fontWeight: '600',
        marginLeft: theme.spacing.xs,
    },
    jobCardContent: {
        marginBottom: theme.spacing.md,
    },
    jobCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    jobCardDetail: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
    },
    jobDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
    },
    jobCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    postedDate: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    applicationsCount: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    },
    applyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    applyButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        fontWeight: '600',
        marginLeft: theme.spacing.xs,
    },
    withdrawButton: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    withdrawButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
    },
    ratingLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        marginRight: theme.spacing.sm,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },

    // Empty State Styles
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyStateIcon: {
        marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    emptyStateSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    applyModalContainer: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        marginTop: 80,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalCloseButton: {
        padding: theme.spacing.sm,
    },
    modalTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    modalHeaderSpacer: {
        width: 40,
    },
    modalScroll: {
        flex: 1,
        padding: theme.spacing.md,
    },
    modalFooter: {
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    sectionTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    jobSummarySection: {
        marginBottom: theme.spacing.lg,
    },
    jobSummaryCard: {
        backgroundColor: theme.colors.surfaceLight,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    jobSummaryTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    jobSummaryDetail: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
    },
    jobSummaryDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
    },
    tipsSection: {
        marginBottom: theme.spacing.lg,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    tipText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
    coverLetterSection: {
        marginBottom: theme.spacing.lg,
    },
    coverLetterInput: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.typography.body,
        color: theme.colors.text.primary,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    characterCount: {
        ...theme.typography.small,
        color: theme.colors.text.light,
        textAlign: 'right',
        marginTop: theme.spacing.xs,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.md,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonDisabled: {
        backgroundColor: theme.colors.text.light,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
    },
});

export default InterpreterJobListingScreen;