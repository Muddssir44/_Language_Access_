import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    Platform,
    StatusBar,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VerificationRequestScreen = ({ navigation, onBack }) => {
    const [formData, setFormData] = useState({
        fullName: 'Maria Rodriguez',
        certificationNumber: '',
        certificationBody: '',
        yearsOfExperience: '',
        specializations: '',
        additionalInfo: '',
    });

    const [documents, setDocuments] = useState([]);
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('none'); // none, pending, approved, rejected

    const certificationBodies = [
        'National Board of Certification for Medical Interpreters',
        'Certification Commission for Healthcare Interpreters',
        'American Translators Association',
        'Registry of Interpreters for the Deaf',
        'Court Interpreters Certification',
        'Other'
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation) {
            navigation.goBack();
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.certificationNumber.trim()) newErrors.certificationNumber = 'Certification number is required';
        if (!formData.certificationBody.trim()) newErrors.certificationBody = 'Certification body is required';
        if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = 'Years of experience is required';
        if (documents.length === 0) newErrors.documents = 'At least one document is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDocumentPick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.cancelled) {
                const newDocument = {
                    id: Date.now().toString(),
                    name: result.name,
                    type: result.type,
                    size: result.size,
                    uri: result.uri,
                };
                setDocuments([...documents, newDocument]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const removeDocument = (documentId) => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Simulate submission
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                setVerificationStatus('pending');
            }, 2000);
        }
    };

    const renderDocumentItem = (document) => (
        <View key={document.id} style={styles.documentItem}>
            <View style={styles.documentInfo}>
                <Feather name="file" size={20} color={theme.colors.primary} />
                <View style={styles.documentDetails}>
                    <Text style={styles.documentName}>{document.name}</Text>
                    <Text style={styles.documentSize}>{(document.size / 1024 / 1024).toFixed(2)} MB</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => removeDocument(document.id)} style={styles.removeButton}>
                <Feather name="x" size={16} color={theme.colors.error} />
            </TouchableOpacity>
        </View>
    );

    const renderStatusBanner = () => {
        if (verificationStatus === 'none') return null;

        const statusConfig = {
            pending: {
                icon: 'clock',
                title: 'Verification Pending',
                message: 'Your verification request is being reviewed. We\'ll notify you within 3-5 business days.',
                color: theme.colors.warning,
            },
            approved: {
                icon: 'check-circle',
                title: 'Verification Approved',
                message: 'Congratulations! Your professional verification has been approved.',
                color: theme.colors.success,
            },
            rejected: {
                icon: 'x-circle',
                title: 'Verification Rejected',
                message: 'Your verification request needs additional documentation. Please review and resubmit.',
                color: theme.colors.error,
            },
        };

        const config = statusConfig[verificationStatus];

        return (
            <View style={[styles.statusBanner, { backgroundColor: config.color }]}>
                <Feather name={config.icon} size={24} color={theme.colors.text.white} />
                <View style={styles.statusContent}>
                    <Text style={styles.statusTitle}>{config.title}</Text>
                    <Text style={styles.statusMessage}>{config.message}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Professional Verification"
                onBack={handleBack}
            />

            <ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
            >
                {renderStatusBanner()}

                <View style={styles.infoSection}>
                    <Feather name="shield-check" size={48} color={theme.colors.success} />
                    <Text style={styles.infoTitle}>Get Verified as a Professional</Text>
                    <Text style={styles.infoText}>
                        Professional verification enhances your credibility, increases client trust, and allows you to earn higher rates.
                    </Text>
                </View>

                <View style={styles.benefitsList}>
                    <View style={styles.benefitItem}>
                        <Feather name="check" size={16} color={theme.colors.success} />
                        <Text style={styles.benefitText}>Earn up to 30% higher rates</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Feather name="check" size={16} color={theme.colors.success} />
                        <Text style={styles.benefitText}>Priority in client matching</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Feather name="check" size={16} color={theme.colors.success} />
                        <Text style={styles.benefitText}>Professional badge on profile</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Feather name="check" size={16} color={theme.colors.success} />
                        <Text style={styles.benefitText}>Access to premium clients</Text>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Verification Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Legal Name</Text>
                        <TextInput
                            style={[styles.textInput, errors.fullName && styles.textInputError]}
                            value={formData.fullName}
                            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                            placeholder="Enter your full legal name"
                            placeholderTextColor={theme.colors.text.light}
                        />
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Certification Number</Text>
                        <TextInput
                            style={[styles.textInput, errors.certificationNumber && styles.textInputError]}
                            value={formData.certificationNumber}
                            onChangeText={(text) => setFormData({ ...formData, certificationNumber: text })}
                            placeholder="Enter your certification number"
                            placeholderTextColor={theme.colors.text.light}
                        />
                        {errors.certificationNumber && <Text style={styles.errorText}>{errors.certificationNumber}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Certification Body</Text>
                        <TouchableOpacity
                            style={[styles.textInput, styles.dropdownButton, errors.certificationBody && styles.textInputError]}
                            onPress={() => {
                                Alert.alert(
                                    'Select Certification Body',
                                    'Choose your certification body',
                                    certificationBodies.map(body => ({
                                        text: body,
                                        onPress: () => setFormData({ ...formData, certificationBody: body })
                                    }))
                                );
                            }}
                        >
                            <Text style={[styles.dropdownText, !formData.certificationBody && styles.placeholderText]}>
                                {formData.certificationBody || 'Select certification body'}
                            </Text>
                            <Feather name="chevron-down" size={20} color={theme.colors.text.light} />
                        </TouchableOpacity>
                        {errors.certificationBody && <Text style={styles.errorText}>{errors.certificationBody}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Years of Experience</Text>
                        <TextInput
                            style={[styles.textInput, errors.yearsOfExperience && styles.textInputError]}
                            value={formData.yearsOfExperience}
                            onChangeText={(text) => setFormData({ ...formData, yearsOfExperience: text })}
                            placeholder="Enter years of experience"
                            keyboardType="numeric"
                            placeholderTextColor={theme.colors.text.light}
                        />
                        {errors.yearsOfExperience && <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Specializations (Optional)</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.specializations}
                            onChangeText={(text) => setFormData({ ...formData, specializations: text })}
                            placeholder="e.g., Medical, Legal, Conference..."
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            placeholderTextColor={theme.colors.text.light}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Additional Information (Optional)</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={formData.additionalInfo}
                            onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
                            placeholder="Any additional relevant information..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            placeholderTextColor={theme.colors.text.light}
                        />
                    </View>
                </View>

                <View style={styles.documentsSection}>
                    <Text style={styles.sectionTitle}>Required Documents</Text>
                    <Text style={styles.sectionSubtitle}>
                        Please upload clear copies of your certification documents
                    </Text>

                    <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
                        <Feather name="upload" size={24} color={theme.colors.primary} />
                        <Text style={styles.uploadButtonText}>Upload Documents</Text>
                        <Text style={styles.uploadButtonSubtext}>PDF or Image files accepted</Text>
                    </TouchableOpacity>

                    {errors.documents && <Text style={styles.errorText}>{errors.documents}</Text>}

                    {documents.length > 0 && (
                        <View style={styles.documentsContainer}>
                            <Text style={styles.documentsTitle}>Uploaded Documents</Text>
                            {documents.map(renderDocumentItem)}
                        </View>
                    )}
                </View>

                {verificationStatus === 'none' && (
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Feather name="send" size={20} color={theme.colors.text.white} />
                        <Text style={styles.submitButtonText}>Submit for Verification</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Success Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.successModal}>
                    <View style={styles.successContent}>
                        <Feather name="check-circle" size={64} color={theme.colors.success} />
                        <Text style={styles.successTitle}>Verification Submitted!</Text>
                        <Text style={styles.successText}>
                            Your verification request has been submitted successfully. We'll review your documents and get back to you within 3-5 business days.
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
    },

    // Status Banner
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    statusContent: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    statusTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginBottom: theme.spacing.xs,
    },
    statusMessage: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        opacity: 0.9,
    },

    // Info Section
    infoSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    infoTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    infoText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // Benefits List
    benefitsList: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    benefitText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // Form Section
    formSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    sectionSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.lg,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    inputLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    textInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.surface,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    textInputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        flex: 1,
    },
    placeholderText: {
        color: theme.colors.text.light,
    },

    // Documents Section
    documentsSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
    },
    uploadButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        marginTop: theme.spacing.sm,
    },
    uploadButtonSubtext: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    },
    documentsContainer: {
        marginTop: theme.spacing.lg,
    },
    documentsTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    documentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    documentDetails: {
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
    documentName: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    documentSize: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    removeButton: {
        padding: theme.spacing.sm,
    },

    // Submit Button
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.success,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    submitButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
    },

    // Success Modal
    successModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        margin: theme.spacing.lg,
        maxWidth: 350,
    },
    successTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    successText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // Bottom Spacing
    bottomSpacing: {
        height: 140,
    },
});

export default VerificationRequestScreen;