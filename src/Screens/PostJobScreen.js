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
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Job Card Component
const JobCard = ({ job, onPress, index }) => {
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

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return theme.colors.success;
            case 'filled': return theme.colors.primary;
            case 'expired': return theme.colors.error;
            default: return theme.colors.text.secondary;
        }
    };

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
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(job)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={styles.jobCardHeader}>
                    <View style={styles.jobCardTitleContainer}>
                        <Text style={styles.jobCardTitle} numberOfLines={2}>
                            {job.title}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                            <Text style={styles.statusText}>{job.status}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.jobCardContent}>
                    <View style={styles.jobCardRow}>
                        <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                        <Text style={styles.jobCardDetail}>{job.languagePair}</Text>
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
                        <Feather name="dollar-sign" size={16} color={theme.colors.text.secondary} />
                        <Text style={styles.jobCardDetail}>${job.budget}</Text>
                    </View>
                </View>

                <View style={styles.jobCardFooter}>
                    <Text style={styles.jobCardDate}>Posted {job.postedDate}</Text>
                    <Text style={styles.jobCardApplications}>{job.applications} applications</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Empty State Component
const EmptyState = ({ onCreateJob }) => {
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

    return (
        <View style={styles.emptyState}>
            <Animated.View
                style={[
                    styles.emptyStateIcon,
                    { transform: [{ scale: bounceAnim }] }
                ]}
            >
                <Feather name="clipboard" size={64} color={theme.colors.text.light} />
            </Animated.View>
            <Text style={styles.emptyStateTitle}>No jobs posted yet</Text>
            <Text style={styles.emptyStateSubtitle}>
                Create your first job posting to connect with skilled interpreters
            </Text>
            <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={onCreateJob}
                activeOpacity={0.8}
            >
                <Feather name="plus" size={20} color={theme.colors.text.white} />
                <Text style={styles.emptyStateButtonText}>Post Your First Job</Text>
            </TouchableOpacity>
        </View>
    );
};

// Floating Action Button
const FloatingActionButton = ({ onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shadowAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.9,
                useNativeDriver: false,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: false,
            }),
            Animated.timing(shadowAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return (
        <Animated.View
            style={[
                styles.fab,
                {
                    transform: [{ scale: scaleAnim }],
                    shadowOpacity: shadowAnim,
                }
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.fabButton}
            >
                <Feather name="plus" size={24} color={theme.colors.text.white} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Job Creation Modal Component
const JobCreationModal = ({ visible, onClose, onSubmit, isUrgent, interpreterId, isInstantBook }) => {
    const [formData, setFormData] = useState({
        title: '',
        languageFrom: 'English',
        languageTo: 'Spanish',
        domain: 'General',
        method: 'Video call',
        isASAP: false,
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        budget: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
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

    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic'];
    const domains = ['General', 'Legal', 'Medical', 'Business', 'Technical', 'Academic'];
    const methods = ['Video call', 'Audio call', 'Zoom', 'Onsite'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
        if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) newErrors.budget = 'Please enter a valid budget';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (formData.description.length < 50) newErrors.description = 'Description should be at least 50 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const jobData = {
                ...formData,
                languagePair: `${formData.languageFrom} ↔ ${formData.languageTo}`,
                id: Date.now().toString(),
                status: 'Open',
                postedDate: 'just now',
                applications: 0,
            };

            onSubmit(jobData);
            setIsSubmitting(false);

            // Reset form
            setFormData({
                title: '',
                languageFrom: 'English',
                languageTo: 'Spanish',
                domain: 'General',
                method: 'Video call',
                isASAP: false,
                date: new Date().toISOString().split('T')[0],
                time: '14:00',
                budget: '',
                description: '',
            });
            setErrors({});
        }, 1500);
    };

    const MethodSelector = () => (
        <View style={styles.methodSelector}>
            {methods.map((method) => (
                <TouchableOpacity
                    key={method}
                    style={[
                        styles.methodButton,
                        formData.method === method && styles.methodButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, method })}
                    activeOpacity={0.8}
                >
                    <Feather
                        name={method === 'Video call' ? 'video' : method === 'Audio call' ? 'phone' : method === 'Zoom' ? 'monitor' : 'map-pin'}
                        size={20}
                        color={formData.method === method ? theme.colors.text.white : theme.colors.text.secondary}
                    />
                    <Text style={[
                        styles.methodButtonText,
                        formData.method === method && styles.methodButtonTextActive
                    ]}>
                        {method}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                                <Feather name="x" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Create Job Post</Text>
                            <View style={styles.modalHeaderSpacer} />
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {/* Job Guidance */}
                            <View style={styles.guidanceSection}>
                                <View style={styles.guidanceItem}>
                                    <Feather name="info" size={20} color={theme.colors.primary} />
                                    <Text style={styles.guidanceText}>Be specific about your interpretation needs</Text>
                                </View>
                                <View style={styles.guidanceItem}>
                                    <Feather name="clock" size={20} color={theme.colors.primary} />
                                    <Text style={styles.guidanceText}>Include timezone and scheduling preferences</Text>
                                </View>
                                <View style={styles.guidanceItem}>
                                    <Feather name="users" size={20} color={theme.colors.primary} />
                                    <Text style={styles.guidanceText}>Clear job descriptions get better applications</Text>
                                </View>
                            </View>

                            {/* Job Title */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Job Title</Text>
                                <TextInput
                                    style={[styles.textInput, errors.title && styles.textInputError]}
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                                    placeholder="e.g., Legal Document Translation Session"
                                    placeholderTextColor={theme.colors.text.light}
                                />
                                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                            </View>

                            {/* Language Pair */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Language Pair</Text>
                                <View style={styles.languageSelector}>
                                    <View style={styles.languageDropdown}>
                                        <Text style={styles.languageText}>{formData.languageFrom}</Text>
                                        <Feather name="chevron-down" size={16} color={theme.colors.text.secondary} />
                                    </View>
                                    <Feather name="arrow-right" size={20} color={theme.colors.text.secondary} />
                                    <View style={styles.languageDropdown}>
                                        <Text style={styles.languageText}>{formData.languageTo}</Text>
                                        <Feather name="chevron-down" size={16} color={theme.colors.text.secondary} />
                                    </View>
                                </View>
                            </View>

                            {/* Domain */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Domain Expertise</Text>
                                <TouchableOpacity style={styles.dropdown}>
                                    <Text style={styles.dropdownText}>{formData.domain}</Text>
                                    <Feather name="chevron-down" size={16} color={theme.colors.text.secondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Interpretation Method */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Interpretation Method</Text>
                                <MethodSelector />
                            </View>

                            {/* Schedule */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Schedule</Text>
                                <TouchableOpacity
                                    style={[styles.toggleButton, formData.isASAP && styles.toggleButtonActive]}
                                    onPress={() => setFormData({ ...formData, isASAP: !formData.isASAP })}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.toggleIndicator, formData.isASAP && styles.toggleIndicatorActive]} />
                                    <Text style={[styles.toggleText, formData.isASAP && styles.toggleTextActive]}>
                                        ASAP (As soon as possible)
                                    </Text>
                                </TouchableOpacity>

                                {!formData.isASAP && (
                                    <View style={styles.dateTimeContainer}>
                                        <View style={styles.dateTimeInput}>
                                            <Text style={styles.dateTimeLabel}>Date</Text>
                                            <TextInput
                                                style={styles.dateTimeField}
                                                value={formData.date}
                                                onChangeText={(text) => setFormData({ ...formData, date: text })}
                                                placeholder="YYYY-MM-DD"
                                                placeholderTextColor={theme.colors.text.light}
                                            />
                                        </View>
                                        <View style={styles.dateTimeInput}>
                                            <Text style={styles.dateTimeLabel}>Time</Text>
                                            <TextInput
                                                style={styles.dateTimeField}
                                                value={formData.time}
                                                onChangeText={(text) => setFormData({ ...formData, time: text })}
                                                placeholder="HH:MM"
                                                placeholderTextColor={theme.colors.text.light}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Budget */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Budget (USD)</Text>
                                <TextInput
                                    style={[styles.textInput, errors.budget && styles.textInputError]}
                                    value={formData.budget}
                                    onChangeText={(text) => setFormData({ ...formData, budget: text })}
                                    placeholder="Enter hourly rate or total budget"
                                    placeholderTextColor={theme.colors.text.light}
                                    keyboardType="numeric"
                                />
                                {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
                            </View>

                            {/* Description */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Job Description</Text>
                                <TextInput
                                    style={[styles.textArea, errors.description && styles.textInputError]}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    placeholder="Describe your interpretation needs, context, any specific requirements..."
                                    placeholderTextColor={theme.colors.text.light}
                                    multiline={true}
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                />
                                <View style={styles.characterCounter}>
                                    <Text style={styles.characterCountText}>
                                        {formData.description.length} characters
                                    </Text>
                                </View>
                                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                            </View>
                        </ScrollView>

                        {/* Submit Button */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                activeOpacity={0.8}
                            >
                                {isSubmitting ? (
                                    <Text style={styles.submitButtonText}>Posting Job...</Text>
                                ) : (
                                    <>
                                        <Feather name="send" size={20} color={theme.colors.text.white} />
                                        <Text style={styles.submitButtonText}>Post Job</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Animated.View>
            </View>
        </Modal>
    );
};

// Main Post Job Screen Component
const PostJobScreen = ({ navigation, route }) => {
    const [jobs, setJobs] = useState([
        {
            id: '1',
            title: 'Legal Contract Review Session',
            languagePair: 'English ↔ Spanish',
            method: 'Video call',
            status: 'Open',
            date: 'Dec 20, 2:00 PM',
            budget: '75',
            postedDate: '2 days ago',
            applications: 5,
        },
        {
            id: '2',
            title: 'Medical Consultation Interpretation',
            languagePair: 'English ↔ French',
            method: 'Audio call',
            status: 'Filled',
            date: 'Dec 18, 10:00 AM',
            budget: '100',
            postedDate: '1 week ago',
            applications: 12,
        },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Check for route params
    const isUrgent = route?.params?.urgent || false;
    const interpreterId = route?.params?.interpreterId;
    const isInstantBook = route?.params?.instantBook || false;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();

        // If urgent booking or instant book, show modal immediately
        if (isUrgent || isInstantBook) {
            setShowCreateModal(true);
        }
    }, [isUrgent, isInstantBook]);

    const handleCreateJob = () => {
        setShowCreateModal(true);
    };

    const handleJobPress = (job) => {
        // Navigate to job details or applications
        console.log('View job details:', job.title);
        // Could navigate to a job details screen
        // navigation.navigate('JobDetails', { jobId: job.id });
    };

    const handleJobSubmit = (jobData) => {
        setJobs([jobData, ...jobs]);
        setShowCreateModal(false);
        Alert.alert('Success!', 'Your job has been posted successfully.');

        // If this was an urgent booking, navigate back to home
        if (isUrgent) {
            navigation.navigate('ClientHome');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleNotification = () => {
        // Navigate to notifications
        navigation.navigate('Notifications');
        console.log('Open notifications');
    };

    const handleProfile = () => {
        navigation.navigate('ClientProfile');
    };

    const renderJobItem = ({ item, index }) => (
        <JobCard
            job={item}
            onPress={handleJobPress}
            index={index}
        />
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title={isUrgent ? "Urgent Booking" : "Post a Job"}
                onBack={handleBack}
                onBell={handleNotification}
                onProfile={handleProfile}
                showBell={true}
                showProfile={true}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim, paddingTop: getHeaderHeight() }]}>
                {jobs.length === 0 ? (
                    <EmptyState onCreateJob={handleCreateJob} />
                ) : (
                    <FlatList
                        data={jobs}
                        renderItem={renderJobItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.jobsList}
                    />
                )}
            </Animated.View>

            {jobs.length > 0 && (
                <FloatingActionButton onPress={handleCreateJob} />
            )}

            <JobCreationModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleJobSubmit}
                isUrgent={isUrgent}
                interpreterId={interpreterId}
                isInstantBook={isInstantBook}
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

    // Content Styles
    content: {
        flex: 1,
    },

    // Job List Styles
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
        marginBottom: theme.spacing.md,
    },
    jobCardTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobCardTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        flex: 1,
        marginRight: theme.spacing.sm,
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
    jobCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    jobCardDate: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    jobCardApplications: {
        ...theme.typography.small,
        color: theme.colors.primary,
        fontWeight: '600',
    },


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
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    emptyStateSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 24,
    },
    emptyStateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    emptyStateButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
    },

    // Floating Action Button Styles
    fab: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        marginTop: 50,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
    },
    modalContent: {
        flex: 1,
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

    // Guidance Section Styles
    guidanceSection: {
        backgroundColor: theme.colors.surfaceLight,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
    },
    guidanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    guidanceText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // Input Section Styles
    inputSection: {
        marginBottom: theme.spacing.lg,
    },
    inputLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    textInput: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.typography.body,
        color: theme.colors.text.primary,
    },
    textInputError: {
        borderColor: theme.colors.error,
    },
    textArea: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.typography.body,
        color: theme.colors.text.primary,
        minHeight: 120,
    },
    errorText: {
        ...theme.typography.small,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },

    // Language Selector Styles
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    languageDropdown: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
    languageText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
    },

    // Dropdown Styles
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
    dropdownText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
    },

    // Method Selector Styles
    methodSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    methodButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    methodButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
    },
    methodButtonTextActive: {
        color: theme.colors.text.white,
    },

    // Toggle Button Styles
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    toggleButtonActive: {
        backgroundColor: theme.colors.primaryLight,
        borderColor: theme.colors.primary,
    },
    toggleIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.border,
        marginRight: theme.spacing.sm,
    },
    toggleIndicatorActive: {
        backgroundColor: theme.colors.primary,
    },
    toggleText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    toggleTextActive: {
        color: theme.colors.text.primary,
        fontWeight: '600',
    },

    // Date Time Styles
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    dateTimeInput: {
        flex: 1,
    },
    dateTimeLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    dateTimeField: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.typography.body,
        color: theme.colors.text.primary,
    },

    // Character Counter Styles
    characterCounter: {
        alignItems: 'flex-end',
        marginTop: theme.spacing.xs,
    },
    characterCountText: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },

    // Submit Button Styles
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

export default PostJobScreen;