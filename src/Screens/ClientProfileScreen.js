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
    Image,
    Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper function to get user token (to be implemented with actual auth)
const getUserToken = () => {
    // This should return the actual JWT token from your auth system
    // For now, returning a placeholder
    return 'your-jwt-token-here';
};

// Profile List Item Component
const ProfileListItem = ({ icon, title, subtitle, onPress, showChevron = true, rightComponent, iconColor }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Animated.View style={[styles.profileListItem, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.profileListItemContent}
            >
                <View style={styles.profileListItemLeft}>
                    <View style={[styles.profileListItemIcon, { backgroundColor: iconColor || theme.colors.primaryLight }]}>
                        <Feather name={icon} size={20} color={theme.colors.text.white} />
                    </View>
                    <View style={styles.profileListItemText}>
                        <Text style={styles.profileListItemTitle}>{title}</Text>
                        {subtitle && <Text style={styles.profileListItemSubtitle}>{subtitle}</Text>}
                    </View>
                </View>
                <View style={styles.profileListItemRight}>
                    {rightComponent}
                    {showChevron && (
                        <Feather name="chevron-right" size={20} color={theme.colors.text.light} />
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Section Header Component
const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
);

// Main Profile Screen
const ClientProfileScreen = ({ navigation, route, userRole = 'client', userId = 'default-client-id' }) => {
    const [currentScreen, setCurrentScreen] = useState('main');
    const [fadeAnim] = useState(new Animated.Value(1));

    // Check for route params
    const targetScreen = route?.params?.screen;

    useEffect(() => {
        // If targetScreen is provided, navigate to that screen
        if (targetScreen) {
            navigateToScreen(targetScreen);
        }
    }, [targetScreen]);

    const navigateToScreen = (screenName) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setCurrentScreen(screenName);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleBack = () => {
        if (currentScreen === 'main') {
            navigation.goBack();
        } else {
            navigateToScreen('main');
        }
    };

    const handleSignOut = () => {
        // Navigate to sign in screen or handle sign out logic
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const handleDeleteAccount = () => {
        // Navigate to sign in screen after account deletion
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'myProfile':
                return <MyProfileScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'changePassword':
                return <ChangePasswordScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'cardRegistration':
                return <CardRegistrationScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'callHistory':
                return <CallHistoryScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'paymentHistory':
                return <PaymentHistoryScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'languageCoverage':
                return <LanguageCoverageScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'about':
                return <AboutScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'terms':
                return <TermsScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'privacy':
                return <PrivacyPolicyScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'contact':
                return <ContactUsScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'version':
                return <VersionScreen onBack={handleBack} userRole={userRole} userId={userId} />;
            case 'signOut':
                return <SignOutConfirmationScreen onBack={handleBack} onSignOut={handleSignOut} userRole={userRole} userId={userId} />;
            case 'deleteAccount':
                return <DeleteAccountScreen onBack={handleBack} onDeleteAccount={handleDeleteAccount} userRole={userRole} userId={userId} />;
            default:
                return <MainProfileScreen onNavigate={navigateToScreen} onBack={handleBack} userRole={userRole} userId={userId} />;
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {renderScreen()}
        </Animated.View>
    );
};

// My Profile Screen
const MyProfileScreen = ({ onBack, userRole = 'client', userId }) => {
    const [formData, setFormData] = useState({
        firstName: userRole === 'client' ? 'John' : 'Maria',
        lastName: userRole === 'client' ? 'Anderson' : 'Rodriguez',
        email: userRole === 'client' ? 'john.anderson@company.com' : 'maria.rodriguez@languageaccess.com',
        phone: '+1 (555) 123-4567',
        company: userRole === 'client' ? 'Tech Solutions Inc.' : '',
        jobTitle: userRole === 'client' ? 'Operations Manager' : 'Certified Spanish Interpreter',
        // Interpreter-specific fields
        specialty: userRole === 'interpreter' ? 'Legal & Medical Interpretation' : '',
        languages: userRole === 'interpreter' ? ['Spanish', 'English'] : [],
        certifications: userRole === 'interpreter' ? ['State Certified', 'Medical Certified'] : [],
        experience: userRole === 'interpreter' ? '8 years' : '',
        hourlyRate: userRole === 'interpreter' ? 75 : 0,
        availability: userRole === 'interpreter' ? '24/7' : '',
        notifications: true,
        emailUpdates: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const scrollY = useRef(new Animated.Value(0)).current;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        // Role-specific validations
        if (userRole === 'interpreter') {
            if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
            if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
            if (!formData.hourlyRate || formData.hourlyRate <= 0) newErrors.hourlyRate = 'Valid hourly rate is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                // Backend API call based on user role
                const endpoint = userRole === 'client' ? '/api/client/profile' : '/api/interpreter/profile';
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getUserToken()}`,
                    },
                    body: JSON.stringify({
                        userId: userId,
                        ...formData
                    })
                });

                if (response.ok) {
                    setIsEditing(false);
                    Alert.alert('Success', 'Profile updated successfully!');
                } else {
                    Alert.alert('Error', 'Failed to update profile. Please try again.');
                }
            } catch (error) {
                console.error('Profile update error:', error);
                Alert.alert('Error', 'Network error. Please check your connection.');
            }
        }
    };

    // Load user profile data on component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const endpoint = userRole === 'client' ? '/api/client/profile' : '/api/interpreter/profile';
                const response = await fetch(`${endpoint}/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken()}`,
                    }
                });

                if (response.ok) {
                    const profileData = await response.json();
                    setFormData(profileData);
                }
            } catch (error) {
                console.error('Profile load error:', error);
            }
        };

        if (userId) {
            loadProfile();
        }
    }, [userId, userRole]);

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="My Profile"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.profileEditHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Feather
                                name={userRole === 'interpreter' ? "mic" : "user"}
                                size={40}
                                color={theme.colors.text.white}
                            />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Feather name="camera" size={16} color={theme.colors.text.white} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.editButton, { backgroundColor: isEditing ? theme.colors.error : theme.colors.accent }]}
                        onPress={() => setIsEditing(!isEditing)}
                    >
                        <Feather name={isEditing ? "x" : "edit-2"} size={20} color={theme.colors.text.white} />
                        <Text style={[styles.editButtonText, { color: theme.colors.text.white }]}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>First Name</Text>
                        <TextInput
                            style={[styles.textInput, !isEditing && styles.textInputDisabled, errors.firstName && styles.textInputError]}
                            value={formData.firstName}
                            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                            editable={isEditing}
                            placeholderTextColor={theme.colors.text.light}
                        />
                        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        <TextInput
                            style={[styles.textInput, !isEditing && styles.textInputDisabled, errors.lastName && styles.textInputError]}
                            value={formData.lastName}
                            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                            editable={isEditing}
                            placeholderTextColor={theme.colors.text.light}
                        />
                        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={[styles.textInput, !isEditing && styles.textInputDisabled, errors.email && styles.textInputError]}
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            editable={isEditing}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={theme.colors.text.light}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            editable={isEditing}
                            keyboardType="phone-pad"
                            placeholderTextColor={theme.colors.text.light}
                        />
                    </View>

                    {/* Role-specific fields */}
                    {userRole === 'client' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Company</Text>
                                <TextInput
                                    style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                                    value={formData.company}
                                    onChangeText={(text) => setFormData({ ...formData, company: text })}
                                    editable={isEditing}
                                    placeholderTextColor={theme.colors.text.light}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Job Title</Text>
                                <TextInput
                                    style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                                    value={formData.jobTitle}
                                    onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
                                    editable={isEditing}
                                    placeholderTextColor={theme.colors.text.light}
                                />
                            </View>
                        </>
                    )}

                    {userRole === 'interpreter' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Specialty</Text>
                                <TextInput
                                    style={[styles.textInput, !isEditing && styles.textInputDisabled, errors.specialty && styles.textInputError]}
                                    value={formData.specialty}
                                    onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                                    editable={isEditing}
                                    placeholderTextColor={theme.colors.text.light}
                                />
                                {errors.specialty && <Text style={styles.errorText}>{errors.specialty}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Languages (comma separated)</Text>
                                <TextInput
                                    style={[styles.textInput, !isEditing && styles.textInputDisabled, errors.languages && styles.textInputError]}
                                    value={formData.languages.join(', ')}
                                    onChangeText={(text) => setFormData({ ...formData, languages: text.split(',').map(lang => lang.trim()) })}
                                    editable={isEditing}
                                    placeholderTextColor={theme.colors.text.light}
                                />
                                {errors.languages && <Text style={styles.errorText}>{errors.languages}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Experience</Text>
                                <TextInput
                                    style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                                    value={formData.experience}
                                    onChangeText={(text) => setFormData({ ...formData, experience: text })}
                                    editable={isEditing}
                                    placeholderTextColor={theme.colors.text.light}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
                                <TextInput
                                    style={[styles.textInput, !isEditing && styles.textInputDisabled, errors.hourlyRate && styles.textInputError]}
                                    value={formData.hourlyRate.toString()}
                                    onChangeText={(text) => setFormData({ ...formData, hourlyRate: parseFloat(text) || 0 })}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                    placeholderTextColor={theme.colors.text.light}
                                />
                                {errors.hourlyRate && <Text style={styles.errorText}>{errors.hourlyRate}</Text>}
                            </View>
                        </>
                    )}
                </View>

                <SectionHeader title="Notification Preferences" />
                <View style={styles.section}>
                    <View style={styles.switchItem}>
                        <View style={styles.switchItemContent}>
                            <Text style={styles.switchItemTitle}>Push Notifications</Text>
                            <Text style={styles.switchItemSubtitle}>
                                {userRole === 'client' ? 'Receive notifications about your calls' : 'Receive notifications about interpretation requests'}
                            </Text>
                        </View>
                        <Switch
                            value={formData.notifications}
                            onValueChange={(value) => setFormData({ ...formData, notifications: value })}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                            thumbColor={formData.notifications ? theme.colors.primary : theme.colors.text.light}
                        />
                    </View>

                    <View style={styles.switchItem}>
                        <View style={styles.switchItemContent}>
                            <Text style={styles.switchItemTitle}>Email Updates</Text>
                            <Text style={styles.switchItemSubtitle}>
                                {userRole === 'client' ? 'Receive updates via email' : 'Receive earnings and performance updates via email'}
                            </Text>
                        </View>
                        <Switch
                            value={formData.emailUpdates}
                            onValueChange={(value) => setFormData({ ...formData, emailUpdates: value })}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                            thumbColor={formData.emailUpdates ? theme.colors.primary : theme.colors.text.light}
                        />
                    </View>
                </View>

                {isEditing && (
                    <View style={styles.saveButtonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Feather name="check" size={20} color={theme.colors.text.white} />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Change Password Screen
const ChangePasswordScreen = ({ onBack, userRole = 'client', userId }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const scrollY = useRef(new Animated.Value(0)).current;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
        if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                // Backend API call for password change
                const endpoint = `/api/auth/change-password`;
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getUserToken()}`,
                    },
                    body: JSON.stringify({
                        userId: userId,
                        userRole: userRole,
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    })
                });

                if (response.ok) {
                    Alert.alert('Success', 'Password changed successfully!');
                    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } else {
                    const errorData = await response.json();
                    Alert.alert('Error', errorData.message || 'Failed to change password.');
                }
            } catch (error) {
                console.error('Password change error:', error);
                Alert.alert('Error', 'Network error. Please check your connection.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Change Password"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.passwordGuidance}>
                    <Feather name="shield" size={48} color={theme.colors.success} />
                    <Text style={styles.guidanceTitle}>Secure Your Account</Text>
                    <Text style={styles.guidanceText}>
                        Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                    </Text>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Current Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.passwordInput, errors.currentPassword && styles.textInputError]}
                                value={formData.currentPassword}
                                onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                                secureTextEntry={!showPasswords.current}
                                placeholder="Enter current password"
                                placeholderTextColor={theme.colors.text.light}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                style={styles.passwordToggle}
                            >
                                <Feather name={showPasswords.current ? "eye-off" : "eye"} size={20} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                        {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.passwordInput, errors.newPassword && styles.textInputError]}
                                value={formData.newPassword}
                                onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                                secureTextEntry={!showPasswords.new}
                                placeholder="Enter new password"
                                placeholderTextColor={theme.colors.text.light}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                style={styles.passwordToggle}
                            >
                                <Feather name={showPasswords.new ? "eye-off" : "eye"} size={20} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.passwordInput, errors.confirmPassword && styles.textInputError]}
                                value={formData.confirmPassword}
                                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                                secureTextEntry={!showPasswords.confirm}
                                placeholder="Confirm new password"
                                placeholderTextColor={theme.colors.text.light}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                style={styles.passwordToggle}
                            >
                                <Feather name={showPasswords.confirm ? "eye-off" : "eye"} size={20} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>
                </View>

                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.success }]} onPress={handleSubmit}>
                        <Feather name="shield" size={20} color={theme.colors.text.white} />
                        <Text style={styles.saveButtonText}>Update Password</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Card Registration Screen
const CardRegistrationScreen = ({ onBack, userRole = 'client', userId }) => {
    const [cards, setCards] = useState([]);

    // Load user's cards on component mount
    useEffect(() => {
        const loadCards = async () => {
            try {
                const endpoint = `/api/${userRole}/payment-methods/${userId}`;
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken()}`,
                    }
                });

                if (response.ok) {
                    const cardsData = await response.json();
                    setCards(cardsData);
                }
            } catch (error) {
                console.error('Cards load error:', error);
            }
        };

        if (userId) {
            loadCards();
        }
    }, [userId, userRole]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });
    const scrollY = useRef(new Animated.Value(0)).current;

    const getCardIcon = (type) => {
        switch (type) {
            case 'visa': return 'credit-card';
            case 'mastercard': return 'credit-card';
            default: return 'credit-card';
        }
    };

    const getCardIconColor = (type) => {
        switch (type) {
            case 'visa': return theme.colors.primary;
            case 'mastercard': return theme.colors.accent;
            default: return theme.colors.secondary;
        }
    };

    const handleAddCard = async () => {
        try {
            const endpoint = `/api/${userRole}/payment-methods`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getUserToken()}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    ...newCard
                })
            });

            if (response.ok) {
                const savedCard = await response.json();
                setCards([...cards, savedCard]);
                setNewCard({ number: '', expiry: '', cvv: '', name: '' });
                setShowAddModal(false);
                Alert.alert('Success', 'Card added successfully!');
            } else {
                Alert.alert('Error', 'Failed to add card. Please try again.');
            }
        } catch (error) {
            console.error('Add card error:', error);
            Alert.alert('Error', 'Network error. Please check your connection.');
        }
    };

    const handleDeleteCard = (cardId) => {
        Alert.alert(
            'Delete Card',
            'Are you sure you want to remove this card?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const endpoint = `/api/${userRole}/payment-methods/${cardId}`;
                            const response = await fetch(endpoint, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${getUserToken()}`,
                                }
                            });

                            if (response.ok) {
                                setCards(cards.filter(card => card.id !== cardId));
                                Alert.alert('Success', 'Card removed successfully.');
                            } else {
                                Alert.alert('Error', 'Failed to remove card.');
                            }
                        } catch (error) {
                            console.error('Delete card error:', error);
                            Alert.alert('Error', 'Network error. Please check your connection.');
                        }
                    }
                }
            ]
        );
    };

    const renderCard = ({ item }) => (
        <View style={styles.cardItem}>
            <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                    <Feather name={getCardIcon(item.type)} size={24} color={getCardIconColor(item.type)} />
                    <View style={styles.cardDetails}>
                        <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
                        <Text style={styles.cardExpiry}>Expires {item.expiryMonth}/{item.expiryYear}</Text>
                    </View>
                </View>
                <View style={styles.cardRight}>
                    {item.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={() => handleDeleteCard(item.id)}
                        style={styles.deleteButton}
                    >
                        <Feather name="trash-2" size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Payment Methods"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <View style={[styles.content, { paddingTop: getHeaderHeight() }]}>
                <Animated.FlatList
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    ListHeaderComponent={() => (
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardHeaderTitle}>Saved Payment Methods</Text>
                            <Text style={styles.cardHeaderSubtitle}>Manage your payment cards securely</Text>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <TouchableOpacity
                            style={[styles.addCardButton, { borderColor: theme.colors.accent }]}
                            onPress={() => setShowAddModal(true)}
                        >
                            <Feather name="plus" size={20} color={theme.colors.accent} />
                            <Text style={[styles.addCardText, { color: theme.colors.accent }]}>Add New Card</Text>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                />

                {/* Add Card Modal */}
                <Modal
                    visible={showAddModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Add New Card</Text>
                            <TouchableOpacity onPress={handleAddCard}>
                                <Text style={styles.modalSave}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Card Number</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={newCard.number}
                                    onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                                    placeholder="1234 5678 9012 3456"
                                    keyboardType="numeric"
                                    maxLength={19}
                                    placeholderTextColor={theme.colors.text.light}
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.md }]}>
                                    <Text style={styles.inputLabel}>Expiry Date</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={newCard.expiry}
                                        onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                                        placeholder="MM/YY"
                                        keyboardType="numeric"
                                        maxLength={5}
                                        placeholderTextColor={theme.colors.text.light}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.inputLabel}>CVV</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={newCard.cvv}
                                        onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                                        placeholder="123"
                                        keyboardType="numeric"
                                        maxLength={4}
                                        secureTextEntry
                                        placeholderTextColor={theme.colors.text.light}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Cardholder Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={newCard.name}
                                    onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                                    placeholder="John Anderson"
                                    autoCapitalize="words"
                                    placeholderTextColor={theme.colors.text.light}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

// Call History Screen
const CallHistoryScreen = ({ onBack, userRole = 'client', userId }) => {
    const [callHistory, setCallHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load call history based on user role
    useEffect(() => {
        const loadCallHistory = async () => {
            try {
                const endpoint = `/api/${userRole}/call-history/${userId}`;
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken()}`,
                    }
                });

                if (response.ok) {
                    const historyData = await response.json();
                    setCallHistory(historyData);
                } else {
                    console.error('Failed to load call history');
                }
            } catch (error) {
                console.error('Call history load error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadCallHistory();
        }
    }, [userId, userRole]);

    const scrollY = useRef(new Animated.Value(0)).current;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return theme.colors.success;
            case 'Missed': return theme.colors.error;
            case 'Refunded': return theme.colors.warning;
            default: return theme.colors.text.secondary;
        }
    };

    const renderCallItem = ({ item }) => (
        <View style={styles.callHistoryItem}>
            <View style={styles.callHistoryHeader}>
                <View style={styles.callHistoryLeft}>
                    <Text style={styles.callHistoryDate}>{new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={styles.callHistoryTime}>{item.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.callHistoryDetails}>
                <View style={styles.callHistoryRow}>
                    <Feather name="user" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.callHistoryLabel}>
                        {userRole === 'client' ? 'Interpreter:' : 'Client:'}
                    </Text>
                    <Text style={styles.callHistoryValue}>
                        {userRole === 'client' ? item.interpreterName : item.clientName}
                    </Text>
                </View>
                <View style={styles.callHistoryRow}>
                    <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.callHistoryLabel}>Language:</Text>
                    <Text style={styles.callHistoryValue}>{item.language}</Text>
                </View>
                <View style={styles.callHistoryRow}>
                    <Feather name="clock" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.callHistoryLabel}>Duration:</Text>
                    <Text style={styles.callHistoryValue}>{item.duration}</Text>
                </View>
                <View style={styles.callHistoryRow}>
                    <Feather name="dollar-sign" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.callHistoryLabel}>
                        {userRole === 'client' ? 'Cost:' : 'Earnings:'}
                    </Text>
                    <Text style={styles.callHistoryPrice}>
                        ${userRole === 'client' ? item.totalCost?.toFixed(2) : item.earnings?.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Call History"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.FlatList
                data={callHistory}
                renderItem={renderCallItem}
                keyExtractor={(item) => item.id}
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                ListHeaderComponent={() => (
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyHeaderTitle}>
                            {userRole === 'client' ? 'Your Interpretation Calls' : 'Your Completed Sessions'}
                        </Text>
                        <Text style={styles.historyHeaderSubtitle}>
                            {userRole === 'client' ? 'View all your past calls and their details' : 'View all your completed interpretation sessions'}
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Payment History Screen
const PaymentHistoryScreen = ({ onBack, userRole = 'client', userId }) => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load payment history based on user role
    useEffect(() => {
        const loadPaymentHistory = async () => {
            try {
                const endpoint = `/api/${userRole}/payment-history/${userId}`;
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken()}`,
                    }
                });

                if (response.ok) {
                    const historyData = await response.json();
                    setPaymentHistory(historyData);
                } else {
                    console.error('Failed to load payment history');
                }
            } catch (error) {
                console.error('Payment history load error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadPaymentHistory();
        }
    }, [userId, userRole]);

    const scrollY = useRef(new Animated.Value(0)).current;

    const renderPaymentItem = ({ item }) => (
        <View style={styles.paymentHistoryItem}>
            <View style={styles.paymentHistoryHeader}>
                <View style={styles.paymentHistoryLeft}>
                    <Text style={styles.paymentHistoryDate}>{new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={styles.paymentHistoryDescription}>{item.description}</Text>
                    <Text style={styles.paymentHistoryMethod}>{item.method}</Text>
                </View>
                <View style={styles.paymentHistoryRight}>
                    <Text style={[
                        styles.paymentHistoryAmount,
                        {
                            color: userRole === 'client'
                                ? (item.amount >= 0 ? theme.colors.text.primary : theme.colors.success)
                                : (item.amount >= 0 ? theme.colors.success : theme.colors.text.primary)
                        }
                    ]}>
                        {userRole === 'client'
                            ? (item.amount >= 0 ? '+' : '')
                            : (item.amount >= 0 ? '+' : '-')
                        }${Math.abs(item.amount).toFixed(2)}
                    </Text>
                    <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: item.status === 'Paid' || item.status === 'Received' ? theme.colors.success : theme.colors.warning }
                    ]}>
                        <Text style={styles.paymentStatusText}>{item.status}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.transactionId}>Transaction ID: {item.transactionId}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title={userRole === 'client' ? 'Payment History' : 'Earnings History'}
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.FlatList
                data={paymentHistory}
                renderItem={renderPaymentItem}
                keyExtractor={(item) => item.id}
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                ListHeaderComponent={() => (
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyHeaderTitle}>
                            {userRole === 'client' ? 'Payment Transactions' : 'Earnings Transactions'}
                        </Text>
                        <Text style={styles.historyHeaderSubtitle}>
                            {userRole === 'client' ? 'View all your billing history and transactions' : 'View all your earnings and payouts'}
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Language Coverage Screen
const LanguageCoverageScreen = ({ onBack, userRole = 'client', userId }) => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollY = useRef(new Animated.Value(0)).current;

    // Load language coverage data
    useEffect(() => {
        const loadLanguageCoverage = async () => {
            try {
                const endpoint = `/api/${userRole}/language-coverage`;
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken()}`,
                    }
                });

                if (response.ok) {
                    const languageData = await response.json();
                    setLanguages(languageData);
                } else {
                    console.error('Failed to load language coverage');
                }
            } catch (error) {
                console.error('Language coverage load error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLanguageCoverage();
    }, [userRole]);

    const renderLanguageItem = ({ item }) => (
        <View style={styles.languageItem}>
            <View style={styles.languageItemContent}>
                <View style={styles.languageItemHeader}>
                    <Text style={styles.languagePair}>{item.from} → {item.to}</Text>
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: item.availability === '24/7' ? theme.colors.success : theme.colors.warning }
                    ]}>
                        <Text style={styles.availabilityText}>{item.availability}</Text>
                    </View>
                </View>
                <View style={styles.languageItemDetails}>
                    <View style={styles.languageItemRow}>
                        <Feather name="users" size={14} color={theme.colors.text.secondary} />
                        <Text style={styles.interpreterCount}>
                            {userRole === 'client'
                                ? `${item.interpreters} interpreters available`
                                : `${item.currentDemand} current demand level`
                            }
                        </Text>
                    </View>
                    {userRole === 'interpreter' && item.averageRate && (
                        <View style={styles.languageItemRow}>
                            <Feather name="dollar-sign" size={14} color={theme.colors.text.secondary} />
                            <Text style={styles.interpreterCount}>
                                Average rate: ${item.averageRate}/hour
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Language Coverage"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.FlatList
                data={languages}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item.id}
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                ListHeaderComponent={() => (
                    <View style={styles.coverageHeader}>
                        <Text style={styles.coverageHeaderTitle}>
                            {userRole === 'client' ? 'Available Language Pairs' : 'Language Market Overview'}
                        </Text>
                        <Text style={styles.coverageHeaderSubtitle}>
                            {userRole === 'client'
                                ? 'All supported languages and their availability'
                                : 'Market demand and rates for different language pairs'
                            }
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// About Screen
const AboutScreen = ({ onBack, userRole = 'client', userId }) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="About LanguageAccess"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.aboutHeader}>
                    <View style={[styles.appIconContainer, { backgroundColor: theme.colors.secondary }]}>
                        <Feather name="globe" size={48} color={theme.colors.text.white} />
                    </View>
                    <Text style={styles.appName}>LanguageAccess</Text>
                    <Text style={styles.appVersion}>Version 1.2.3</Text>
                </View>

                <View style={styles.aboutContent}>
                    <Text style={styles.aboutTitle}>Breaking Language Barriers</Text>
                    <Text style={styles.aboutText}>
                        LanguageAccess is an enterprise-grade multilingual interpretation platform that connects clients with professional interpreters worldwide. Our mission is to eliminate communication barriers and enable seamless cross-cultural interactions.
                    </Text>

                    <Text style={styles.aboutSubtitle}>Key Features</Text>
                    <View style={styles.featureList}>
                        <View style={styles.featureItem}>
                            <Feather name="phone" size={20} color={theme.colors.primary} />
                            <Text style={styles.featureText}>Real-time interpretation calls</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="message-circle" size={20} color={theme.colors.secondary} />
                            <Text style={styles.featureText}>Secure messaging platform</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="users" size={20} color={theme.colors.accent} />
                            <Text style={styles.featureText}>Professional interpreter network</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="clock" size={20} color={theme.colors.success} />
                            <Text style={styles.featureText}>24/7 availability for major languages</Text>
                        </View>
                    </View>

                    <Text style={styles.aboutSubtitle}>Our Commitment</Text>
                    <Text style={styles.aboutText}>
                        We are committed to providing high-quality interpretation services with the utmost confidentiality and professionalism. Our certified interpreters undergo rigorous training and background checks to ensure reliable service delivery.
                    </Text>
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Terms Screen
const TermsScreen = ({ onBack, userRole = 'client', userId }) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Terms of Use"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.legalContent}>
                    <Text style={styles.legalTitle}>Terms of Use</Text>
                    <Text style={styles.lastUpdated}>Last updated: June 1, 2024</Text>

                    <Text style={styles.legalSection}>1. Acceptance of Terms</Text>
                    <Text style={styles.legalText}>
                        By accessing and using LanguageAccess, you accept and agree to be bound by the terms and provision of this agreement.
                    </Text>

                    <Text style={styles.legalSection}>2. Use License</Text>
                    <Text style={styles.legalText}>
                        Permission is granted to temporarily download one copy of LanguageAccess per device for personal, non-commercial transitory viewing only.
                    </Text>

                    <Text style={styles.legalSection}>3. Service Description</Text>
                    <Text style={styles.legalText}>
                        LanguageAccess provides interpretation services connecting clients with professional interpreters through our platform.
                    </Text>

                    <Text style={styles.legalSection}>4. User Responsibilities</Text>
                    <Text style={styles.legalText}>
                        Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
                    </Text>

                    <Text style={styles.legalSection}>5. Payment Terms</Text>
                    <Text style={styles.legalText}>
                        Payment for interpretation services is due immediately upon completion of the service. Rates vary by language pair and interpreter expertise.
                    </Text>

                    <Text style={styles.legalSection}>6. Privacy and Confidentiality</Text>
                    <Text style={styles.legalText}>
                        All interpretation sessions are strictly confidential. We maintain strict privacy standards as outlined in our Privacy Policy.
                    </Text>

                    <Text style={styles.legalSection}>7. Limitation of Liability</Text>
                    <Text style={styles.legalText}>
                        LanguageAccess shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                    </Text>

                    <Text style={styles.legalSection}>8. Contact Information</Text>
                    <Text style={styles.legalText}>
                        For questions about these Terms of Use, please contact us at legal@languageaccess.com
                    </Text>
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Privacy Policy Screen
const PrivacyPolicyScreen = ({ onBack, userRole = 'client', userId }) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Privacy Policy"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.legalContent}>
                    <Text style={styles.legalTitle}>Privacy Policy</Text>
                    <Text style={styles.lastUpdated}>Last updated: June 1, 2024</Text>

                    <Text style={styles.legalSection}>Information We Collect</Text>
                    <Text style={styles.legalText}>
                        We collect information you provide directly to us, such as when you create an account, request interpretation services, or contact us for support.
                    </Text>

                    <Text style={styles.legalSection}>How We Use Your Information</Text>
                    <Text style={styles.legalText}>
                        We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                    </Text>

                    <Text style={styles.legalSection}>Information Sharing</Text>
                    <Text style={styles.legalText}>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                    </Text>

                    <Text style={styles.legalSection}>Data Security</Text>
                    <Text style={styles.legalText}>
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </Text>

                    <Text style={styles.legalSection}>Interpretation Session Privacy</Text>
                    <Text style={styles.legalText}>
                        All interpretation sessions are strictly confidential. Our interpreters are bound by professional confidentiality agreements.
                    </Text>

                    <Text style={styles.legalSection}>Your Rights</Text>
                    <Text style={styles.legalText}>
                        You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
                    </Text>

                    <Text style={styles.legalSection}>Contact Us</Text>
                    <Text style={styles.legalText}>
                        If you have questions about this Privacy Policy, please contact us at privacy@languageaccess.com
                    </Text>
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Contact Us Screen
const ContactUsScreen = ({ onBack, userRole = 'client', userId }) => {
    const [contactForm, setContactForm] = useState({
        subject: '',
        message: '',
        priority: 'normal',
        category: userRole === 'client' ? 'general' : 'interpreter'
    });
    const [showThankYou, setShowThankYou] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleSubmit = async () => {
        if (contactForm.subject.trim() && contactForm.message.trim()) {
            try {
                const response = await fetch('/api/support/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getUserToken()}`,
                    },
                    body: JSON.stringify({
                        userId: userId,
                        userRole: userRole,
                        ...contactForm
                    })
                });

                if (response.ok) {
                    setShowThankYou(true);
                    setTimeout(() => {
                        setShowThankYou(false);
                        setContactForm({
                            subject: '',
                            message: '',
                            priority: 'normal',
                            category: userRole === 'client' ? 'general' : 'interpreter'
                        });
                    }, 2000);
                } else {
                    Alert.alert('Error', 'Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                Alert.alert('Error', 'Network error. Please check your connection.');
            }
        } else {
            Alert.alert('Required Fields', 'Please fill in both subject and message fields.');
        }
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Contact Us"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.contactHeader}>
                    <Feather name="headphones" size={48} color={theme.colors.accent} />
                    <Text style={styles.contactTitle}>We're Here to Help</Text>
                    <Text style={styles.contactSubtitle}>
                        {userRole === 'client'
                            ? 'Get in touch with our support team for any questions or assistance'
                            : 'Connect with our interpreter support team for guidance and assistance'
                        }
                    </Text>
                </View>

                <View style={styles.contactInfo}>
                    <View style={styles.contactItem}>
                        <Feather name="mail" size={20} color={theme.colors.primary} />
                        <View style={styles.contactItemContent}>
                            <Text style={styles.contactItemTitle}>Email Support</Text>
                            <Text style={styles.contactItemValue}>
                                {userRole === 'client' ? 'support@languageaccess.com' : 'interpreters@languageaccess.com'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.contactItem}>
                        <Feather name="phone" size={20} color={theme.colors.secondary} />
                        <View style={styles.contactItemContent}>
                            <Text style={styles.contactItemTitle}>Phone Support</Text>
                            <Text style={styles.contactItemValue}>
                                {userRole === 'client' ? '+1 (800) 555-0123' : '+1 (800) 555-0124'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.contactItem}>
                        <Feather name="clock" size={20} color={theme.colors.accent} />
                        <View style={styles.contactItemContent}>
                            <Text style={styles.contactItemTitle}>Support Hours</Text>
                            <Text style={styles.contactItemValue}>
                                {userRole === 'client' ? '24/7 for urgent issues' : 'Mon-Fri 8AM-8PM EST'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contactForm}>
                    <Text style={styles.formTitle}>Send us a message</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Subject</Text>
                        <TextInput
                            style={styles.textInput}
                            value={contactForm.subject}
                            onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                            placeholder="What can we help you with?"
                            placeholderTextColor={theme.colors.text.light}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Message</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={contactForm.message}
                            onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                            placeholder={
                                userRole === 'client'
                                    ? "Please describe your question or issue in detail..."
                                    : "Please describe your question, technical issue, or feedback..."
                            }
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            placeholderTextColor={theme.colors.text.light}
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Feather name="send" size={20} color={theme.colors.text.white} />
                        <Text style={styles.submitButtonText}>Send Message</Text>
                    </TouchableOpacity>
                </View>

                {/* Thank You Modal */}
                <Modal
                    visible={showThankYou}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.thankYouModal}>
                        <View style={styles.thankYouContent}>
                            <Feather name="check-circle" size={48} color={theme.colors.success} />
                            <Text style={styles.thankYouTitle}>Message Sent!</Text>
                            <Text style={styles.thankYouText}>
                                {userRole === 'client'
                                    ? "We'll get back to you within 24 hours."
                                    : "Our interpreter support team will respond within 24 hours."
                                }
                            </Text>
                        </View>
                    </View>
                </Modal>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Version Screen
const VersionScreen = ({ onBack, userRole = 'client', userId }) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="App Version"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={styles.versionHeader}>
                    <View style={[styles.appIconLarge, { backgroundColor: theme.colors.accent }]}>
                        <Feather name="smartphone" size={64} color={theme.colors.text.white} />
                    </View>
                    <Text style={styles.appNameLarge}>LanguageAccess</Text>
                    <Text style={styles.currentVersion}>Version 1.2.3</Text>
                    <Text style={styles.buildNumber}>Build 2024.06.15</Text>
                </View>
                <View style={styles.versionInfo}>
                    <View style={styles.versionItem}>
                        <Text style={styles.versionLabel}>Release Date</Text>
                        <Text style={styles.versionValue}>June 15, 2024</Text>
                    </View>
                    <View style={styles.versionItem}>
                        <Text style={styles.versionLabel}>Platform</Text>
                        <Text style={styles.versionValue}>React Native (Expo)</Text>
                    </View>
                    <View style={styles.versionItem}>
                        <Text style={styles.versionLabel}>Minimum OS</Text>
                        <Text style={styles.versionValue}>iOS 12.0, Android 8.0</Text>
                    </View>
                </View>
                <View style={styles.whatsNewSection}>
                    <Text style={styles.whatsNewTitle}>What's New in 1.2.3</Text>
                    <View style={styles.changelogItem}>
                        <Feather name="check" size={16} color={theme.colors.success} />
                        <Text style={styles.changelogText}>Improved call quality and stability</Text>
                    </View>
                    <View style={styles.changelogItem}>
                        <Feather name="check" size={16} color={theme.colors.primary} />
                        <Text style={styles.changelogText}>Enhanced profile management features</Text>
                    </View>
                    <View style={styles.changelogItem}>
                        <Feather name="check" size={16} color={theme.colors.secondary} />
                        <Text style={styles.changelogText}>Bug fixes and security improvements</Text>
                    </View>
                </View>
                <View style={styles.legalNotice}>
                    <Text style={styles.legalNoticeText}>
                        © 2024 LanguageAccess. All rights reserved.
                    </Text>
                </View>
                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

// Sign Out Confirmation Screen
const SignOutConfirmationScreen = ({ onBack, onSignOut, userRole = 'client', userId }) => {
    const [showModal, setShowModal] = useState(true);

    const handleSignOut = async () => {
        try {
            // Backend API call to invalidate session
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getUserToken()}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    userRole: userRole
                })
            });

            if (response.ok) {
                setShowModal(false);
                setTimeout(() => {
                    Alert.alert('Signed Out', 'You have been successfully signed out.');
                    onSignOut && onSignOut();
                }, 300);
            } else {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
        } catch (error) {
            console.error('Sign out error:', error);
            // Still proceed with local sign out even if API fails
            setShowModal(false);
            setTimeout(() => {
                Alert.alert('Signed Out', 'You have been successfully signed out.');
                onSignOut && onSignOut();
            }, 300);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        onBack();
    };

    return (
        <Modal
            visible={showModal}
            transparent
            animationType="fade"
        >
            <View style={styles.confirmationModal}>
                <View style={styles.confirmationContent}>
                    <View style={styles.confirmationIcon}>
                        <Feather name="log-out" size={48} color={theme.colors.accent} />
                    </View>

                    <Text style={styles.confirmationTitle}>Sign Out</Text>
                    <Text style={styles.confirmationMessage}>
                        {userRole === 'client'
                            ? "Are you sure you want to sign out of your account? You'll need to sign in again to access your account."
                            : "Are you sure you want to sign out? You'll need to sign in again to access your interpreter dashboard and receive new requests."
                        }
                    </Text>

                    <View style={styles.confirmationButtons}>
                        <TouchableOpacity
                            style={[styles.confirmationButton, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmationButton, styles.signOutButton]}
                            onPress={handleSignOut}
                        >
                            <Text style={styles.signOutButtonText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Delete Account Screen
const DeleteAccountScreen = ({ onBack, onDeleteAccount, userRole = 'client', userId }) => {
    const [showModal, setShowModal] = useState(true);
    const [confirmationText, setConfirmationText] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        setIsConfirmed(confirmationText.toLowerCase() === 'delete my account');
    }, [confirmationText]);

    const handleDeleteAccount = async () => {
        if (!isConfirmed) {
            Alert.alert('Confirmation Required', 'Please type "DELETE MY ACCOUNT" to confirm.');
            return;
        }

        try {
            // Backend API call to delete account
            const response = await fetch('/api/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getUserToken()}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    userRole: userRole,
                    confirmation: confirmationText
                })
            });

            if (response.ok) {
                setShowModal(false);
                setTimeout(() => {
                    Alert.alert(
                        'Account Deletion Initiated',
                        userRole === 'client'
                            ? 'Your account deletion request has been submitted. You will receive a confirmation email within 24 hours.'
                            : 'Your interpreter account deletion request has been submitted. All pending sessions will be completed before deletion. You will receive a confirmation email within 24 hours.',
                        [{ text: 'OK', onPress: () => onDeleteAccount && onDeleteAccount() }]
                    );
                }, 300);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Failed to delete account. Please try again.');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            Alert.alert('Error', 'Network error. Please try again later.');
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        onBack();
    };

    const getWarningItems = () => {
        const baseItems = [
            { icon: 'user', text: 'Your profile and personal information', color: theme.colors.error },
            { icon: 'message-circle', text: 'Saved messages and conversations', color: theme.colors.accent },
            { icon: 'credit-card', text: 'Saved payment methods', color: theme.colors.secondary }
        ];

        if (userRole === 'client') {
            return [
                ...baseItems,
                { icon: 'phone', text: 'All call and payment history', color: theme.colors.warning }
            ];
        } else {
            return [
                ...baseItems,
                { icon: 'phone', text: 'All session and earnings history', color: theme.colors.warning },
                { icon: 'star', text: 'Your ratings and reviews', color: theme.colors.primary },
                { icon: 'award', text: 'Professional certifications and verifications', color: theme.colors.success }
            ];
        }
    };

    return (
        <Modal
            visible={showModal}
            transparent
            animationType="fade"
        >
            <View style={styles.confirmationModal}>
                <View style={[styles.confirmationContent, { maxHeight: screenHeight * 0.7 }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.confirmationIcon}>
                            <Feather name="alert-triangle" size={48} color={theme.colors.error} />
                        </View>

                        <Text style={styles.confirmationTitle}>Delete Account</Text>
                        <Text style={styles.confirmationMessage}>
                            This action cannot be undone. Deleting your {userRole} account will permanently remove:
                        </Text>

                        <View style={styles.deleteWarningList}>
                            {getWarningItems().map((item, index) => (
                                <View key={index} style={styles.deleteWarningItem}>
                                    <Feather name={item.icon} size={16} color={item.color} />
                                    <Text style={styles.deleteWarningText}>{item.text}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.confirmationInput}>
                            <Text style={styles.inputLabel}>
                                Type "DELETE MY ACCOUNT" to confirm:
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    { borderColor: isConfirmed ? theme.colors.success : theme.colors.border }
                                ]}
                                value={confirmationText}
                                onChangeText={setConfirmationText}
                                placeholder="Type here to confirm"
                                placeholderTextColor={theme.colors.text.light}
                                autoCapitalize="characters"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.confirmationButtons}>
                        <TouchableOpacity
                            style={[styles.confirmationButton, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.confirmationButton,
                                styles.deleteButton,
                                { opacity: isConfirmed ? 1 : 0.5 }
                            ]}
                            onPress={handleDeleteAccount}
                            disabled={!isConfirmed}
                        >
                            <Text style={styles.deleteButtonText}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Main Profile Screen Component
const MainProfileScreen = ({ onNavigate, onBack, userRole = 'client', userId = 'default-client-id' }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    // Dynamic user data state - this would typically come from your backend/API
    const [userData, setUserData] = useState({
        firstName: userRole === 'client' ? 'John' : 'Maria',
        lastName: userRole === 'client' ? 'Anderson' : 'Rodriguez',
        email: userRole === 'client' ? 'john.anderson@company.com' : 'maria.rodriguez@languageaccess.com',
        company: userRole === 'client' ? 'Tech Solutions Inc.' : '',
        jobTitle: userRole === 'client' ? 'Operations Manager' : 'Certified Spanish Interpreter',
        profileCompletion: 85,
        isVerified: true,
        memberSince: '2023',
        totalCalls: 24,
        rating: 4.8,
        avatar: null, // Could be an image URL from backend
        status: 'active', // active, busy, offline
        lastActive: 'Now'
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();

        // Load user profile data from backend
        const loadUserProfile = async () => {
            try {
                const endpoint = userRole === 'client' ? '/api/client/profile' : '/api/interpreter/profile';
                const response = await fetch(`${endpoint}/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${getUserToken()}`,
                    }
                });

                if (response.ok) {
                    const profileData = await response.json();
                    setUserData(profileData);
                }
            } catch (error) {
                console.error('User profile load error:', error);
            }
        };

        if (userId) {
            loadUserProfile();
        }
    }, [userId, userRole]);

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => onNavigate('signOut') }
            ]
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return theme.colors.success;
            case 'busy': return theme.colors.warning;
            case 'offline': return theme.colors.text.light;
            default: return theme.colors.text.light;
        }
    };

    const getCompletionColor = (percentage) => {
        if (percentage >= 80) return theme.colors.success;
        if (percentage >= 60) return theme.colors.warning;
        return theme.colors.error;
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <DynamicHeader
                type="back"
                title="Profile"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {/* Enhanced User Profile Header */}
                <View style={styles.enhancedProfileHeader}>
                    {/* Background Gradient Effect */}
                    <View style={styles.profileHeaderBackground} />

                    <View style={styles.profileHeaderContent}>
                        {/* Left Section - Avatar and Basic Info */}
                        <View style={styles.profileHeaderLeft}>
                            <View style={styles.compactAvatarContainer}>
                                <View style={styles.compactAvatar}>
                                    {userData.avatar ? (
                                        <Image source={{ uri: userData.avatar }} style={styles.avatarImage} />
                                    ) : (
                                        <Text style={styles.avatarText}>
                                            {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                                        </Text>
                                    )}
                                </View>

                                {/* Status Indicator */}
                                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(userData.status) }]} />

                                {/* Edit Avatar Button */}
                                <TouchableOpacity style={styles.compactEditAvatarButton}>
                                    <Feather name="camera" size={12} color={theme.colors.text.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileBasicInfo}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.compactProfileName}>
                                        {userData.firstName} {userData.lastName}
                                    </Text>
                                    {userData.isVerified && (
                                        <Feather name="check-circle" size={16} color={theme.colors.success} style={styles.verifiedIcon} />
                                    )}
                                </View>
                                <Text style={styles.compactProfileEmail} numberOfLines={1}>
                                    {userData.email}
                                </Text>
                                <Text style={styles.compactProfileCompany} numberOfLines={1}>
                                    {userData.jobTitle} • {userData.company}
                                </Text>
                            </View>
                        </View>

                        {/* Right Section - Stats and Actions */}
                        <View style={styles.profileHeaderRight}>
                            {/* Profile Completion */}
                            <View style={styles.profileCompletionContainer}>
                                <View style={styles.profileCompletionHeader}>
                                    <Text style={styles.completionLabel}>Profile</Text>
                                    <Text style={[styles.completionPercentage, { color: getCompletionColor(userData.profileCompletion) }]}>
                                        {userData.profileCompletion}%
                                    </Text>
                                </View>
                                <View style={styles.progressBarContainer}>
                                    <View style={styles.progressBarBackground} />
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            {
                                                width: `${userData.profileCompletion}%`,
                                                backgroundColor: getCompletionColor(userData.profileCompletion)
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* Quick Stats */}
                            <View style={styles.quickStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{userData.totalCalls}</Text>
                                    <Text style={styles.statLabel}>Calls</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <View style={styles.ratingContainer}>
                                        <Text style={styles.statValue}>{userData.rating}</Text>
                                        <Feather name="star" size={12} color={theme.colors.accent} />
                                    </View>
                                    <Text style={styles.statLabel}>Rating</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{userData.memberSince}</Text>
                                    <Text style={styles.statLabel}>Since</Text>
                                </View>
                            </View>

                            {/* Quick Actions */}
                            <View style={styles.quickActions}>
                                <TouchableOpacity
                                    style={styles.quickActionButton}
                                    onPress={() => onNavigate('myProfile')}
                                >
                                    <Feather name="edit-3" size={14} color={theme.colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.quickActionButton}
                                    onPress={() => onNavigate('callHistory')}
                                >
                                    <Feather name="phone" size={14} color={theme.colors.secondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Last Active Status */}
                    <View style={styles.lastActiveContainer}>
                        <View style={styles.lastActiveContent}>
                            <Feather name="clock" size={12} color={theme.colors.text.light} />
                            <Text style={styles.lastActiveText}>
                                Last active: {userData.lastActive}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Profile Settings Section */}
                <SectionHeader title="Profile Settings" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="user"
                        title="My Profile"
                        subtitle="Edit personal information"
                        onPress={() => onNavigate('myProfile')}
                        iconColor={theme.colors.primary}
                    />
                    <ProfileListItem
                        icon="lock"
                        title="Change Password"
                        subtitle="Update your password"
                        onPress={() => onNavigate('changePassword')}
                        iconColor={theme.colors.secondary}
                    />
                </View>

                {/* Payment Settings Section */}
                <SectionHeader title="Payment Settings" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="credit-card"
                        title="Card Registration"
                        subtitle="Manage payment methods"
                        onPress={() => onNavigate('cardRegistration')}
                        iconColor={theme.colors.success}
                    />
                    <ProfileListItem
                        icon="phone"
                        title="Call History"
                        subtitle="View past interpretation calls"
                        onPress={() => onNavigate('callHistory')}
                        iconColor={theme.colors.accent}
                    />
                    <ProfileListItem
                        icon="dollar-sign"
                        title="Payment History"
                        subtitle="View billing and transactions"
                        onPress={() => onNavigate('paymentHistory')}
                        iconColor={theme.colors.warning}
                    />
                </View>

                {/* About LanguageAccess Section */}
                <SectionHeader title="About LanguageAccess" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="globe"
                        title="Language Coverage"
                        subtitle="Available language pairs"
                        onPress={() => onNavigate('languageCoverage')}
                        iconColor={theme.colors.secondary}
                    />
                    <ProfileListItem
                        icon="info"
                        title="About"
                        subtitle="Learn more about our platform"
                        onPress={() => onNavigate('about')}
                        iconColor={theme.colors.primary}
                    />
                    <ProfileListItem
                        icon="file-text"
                        title="Terms of Use"
                        subtitle="Read our terms and conditions"
                        onPress={() => onNavigate('terms')}
                        iconColor={theme.colors.accent}
                    />
                    <ProfileListItem
                        icon="shield"
                        title="Privacy Policy"
                        subtitle="How we protect your data"
                        onPress={() => onNavigate('privacy')}
                        iconColor={theme.colors.success}
                    />
                    <ProfileListItem
                        icon="mail"
                        title="Contact Us"
                        subtitle="Get help and support"
                        onPress={() => onNavigate('contact')}
                        iconColor={theme.colors.warning}
                    />
                    <ProfileListItem
                        icon="smartphone"
                        title="App Version"
                        subtitle="Version 1.2.3"
                        onPress={() => onNavigate('version')}
                        iconColor={theme.colors.secondary}
                    />
                </View>

                {/* Account Settings Section */}
                <SectionHeader title="Account Settings" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="log-out"
                        title="Sign Out"
                        subtitle="Sign out of your account"
                        onPress={handleSignOut}
                        showChevron={false}
                        iconColor={theme.colors.warning}
                    />
                    <ProfileListItem
                        icon="trash-2"
                        title="Delete Account"
                        subtitle="Permanently delete your account"
                        onPress={() => onNavigate('deleteAccount')}
                        showChevron={false}
                        iconColor={theme.colors.error}
                    />
                </View>

                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </Animated.View>
    );
};

// Complete StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
    },

    // Profile List Styles
    profileSection: {
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    sectionHeader: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.surfaceLight,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    profileItemIcon: {
        marginRight: theme.spacing.md,
    },
    profileItemContent: {
        flex: 1,
    },
    profileItemTitle: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    profileItemSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    profileItemChevron: {
        marginLeft: theme.spacing.sm,
    },

    // My Profile Screen Styles
    profileHeader: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '600',
        color: theme.colors.text.white,
    },
    profileName: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    profileEmail: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    editProfileText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.xs,
    },

    // Form Styles
    formSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
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
        height: 120,
        textAlignVertical: 'top',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Card Registration Styles
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardIcon: {
        marginRight: theme.spacing.md,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardNumber: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    cardExpiry: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        marginLeft: theme.spacing.sm,
        padding: theme.spacing.sm,
    },
    cardHeader: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    cardHeaderTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    cardHeaderSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.lg,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
        marginTop: theme.spacing.md,
    },
    addCardText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingTop: Platform.OS === 'ios' ? 50 : theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    modalCancel: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    modalSave: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.lg,
    },

    // Call History Styles
    callHistoryItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    callHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    callHistoryLeft: {
        flex: 1,
    },
    callHistoryDate: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    callHistoryTime: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    callHistoryDetails: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
    },
    callHistoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    callHistoryLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        minWidth: 80,
    },
    callHistoryValue: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        flex: 1,
    },
    callHistoryPrice: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
        flex: 1,
    },

    // Payment History Styles
    paymentHistoryItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    paymentHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    paymentHistoryLeft: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    paymentHistoryDate: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    paymentHistoryDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginBottom: 2,
    },
    paymentHistoryMethod: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    paymentHistoryRight: {
        alignItems: 'flex-end',
    },
    paymentHistoryAmount: {
        ...theme.typography.bodyMedium,
        fontWeight: '600',
        marginBottom: 4,
    },
    paymentStatusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    paymentStatusText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    transactionId: {
        ...theme.typography.small,
        color: theme.colors.text.light,
        marginTop: theme.spacing.xs,
    },

    // History Header Styles
    historyHeader: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
    },
    historyHeaderTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    historyHeaderSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    // Language Coverage Styles
    languageItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
    languageItemContent: {
        padding: theme.spacing.md,
    },
    languageItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    languagePair: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        flex: 1,
    },
    availabilityBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    availabilityText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    languageItemDetails: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
    },
    languageItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interpreterCount: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
    },
    coverageHeader: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
    },
    coverageHeaderTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    coverageHeaderSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    // About Screen Styles
    aboutHeader: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    appIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
    },
    appName: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    appVersion: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    aboutContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    aboutTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    aboutSubtitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    aboutText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        lineHeight: 24,
        marginBottom: theme.spacing.md,
    },
    featureList: {
        marginBottom: theme.spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    featureText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.md,
        flex: 1,
    },

    // Legal Content Styles
    legalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    legalTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    lastUpdated: {
        ...theme.typography.caption,
        color: theme.colors.text.light,
        marginBottom: theme.spacing.lg,
    },
    legalSection: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    legalText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        lineHeight: 22,
        marginBottom: theme.spacing.md,
    },

    // Contact Screen Styles
    contactHeader: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    contactTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    contactSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    contactInfo: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    contactItemContent: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    contactItemTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    contactItemValue: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    contactForm: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    formTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    submitButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
    },

    // Thank You Modal Styles
    thankYouModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thankYouContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        margin: theme.spacing.lg,
        maxWidth: 300,
    },
    thankYouTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    thankYouText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    // Version Screen Styles
    versionHeader: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    appIconLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
    appNameLarge: {
        ...theme.typography.h1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    currentVersion: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    buildNumber: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    versionInfo: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    versionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    versionLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    versionValue: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    whatsNewSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    whatsNewTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    changelogItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    changelogText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
    legalNotice: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
    },
    legalNoticeText: {
        ...theme.typography.caption,
        color: theme.colors.text.light,
        textAlign: 'center',
    },

    // Confirmation Modal Styles
    confirmationModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmationContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        margin: theme.spacing.lg,
        maxWidth: 400,
        width: '90%',
    },
    confirmationIcon: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    confirmationTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    confirmationMessage: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing.lg,
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    confirmationButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cancelButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    signOutButton: {
        backgroundColor: theme.colors.warning,
    },
    signOutButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
    },
    deleteButton: {
        backgroundColor: theme.colors.error,
    },
    deleteButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
    },

    // Delete Account Warning Styles
    deleteWarningList: {
        marginBottom: theme.spacing.lg,
    },
    deleteWarningItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    deleteWarningText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
    confirmationInput: {
        marginBottom: theme.spacing.lg,
    },

    // Profile List Item Styles
    profileListItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        overflow: 'hidden',
    },
    profileListItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    profileListItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileListItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    profileListItemText: {
        flex: 1,
    },
    profileListItemTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    profileListItemSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    profileListItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Section Styles
    section: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },
    sectionHeaderText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
    },

    // Avatar Styles
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: theme.colors.surface,
    },

    // Form Styles
    profileEditHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.lg,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    editButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        marginLeft: theme.spacing.xs,
    },
    textInputDisabled: {
        backgroundColor: theme.colors.surfaceLight,
        color: theme.colors.text.secondary,
    },
    textInputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },
    saveButtonContainer: {
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.md,
    },
    saveButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
    },

    // Switch Item Styles
    switchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    switchItemContent: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    switchItemTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    switchItemSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Password Input Styles
    passwordGuidance: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    guidanceTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    guidanceText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.surface,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    passwordToggle: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },

    // Card Styles
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardDetails: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    defaultBadge: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
    },
    defaultText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },

    // Input Row Styles
    inputRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },

    // Bottom Spacing
    bottomSpacing: {
        height: theme.spacing.xl,
    },

    // Enhanced User Profile Styles
    enhancedProfileHeader: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileHeaderBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '75%',
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
    },
    profileHeaderContent: {
        flexDirection: 'row',
        padding: theme.spacing.lg,
        alignItems: 'flex-start',
        minHeight: 120,
    },
    profileHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    compactAvatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    compactAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: theme.colors.surface,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text.white,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    compactEditAvatarButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    profileBasicInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    compactProfileName: {
        ...theme.typography.h3,
        color: theme.colors.text.white,
        fontWeight: '700',
    },
    verifiedIcon: {
        marginLeft: theme.spacing.xs,
    },
    compactProfileEmail: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        opacity: 0.9,
        marginBottom: 2,
    },
    compactProfileCompany: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        opacity: 0.8,
    },
    profileHeaderRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        minHeight: 70,
    },
    profileCompletionContainer: {
        alignItems: 'flex-end',
        marginBottom: theme.spacing.sm,
        minWidth: 80,
    },
    profileCompletionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    completionLabel: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.9,
        marginRight: theme.spacing.xs,
    },
    completionPercentage: {
        ...theme.typography.bodyMedium,
        fontWeight: '700',
    },
    progressBarContainer: {
        width: 60,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },
    progressBarBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    quickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    statItem: {
        alignItems: 'center',
        minWidth: 35,
    },
    statValue: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
        fontSize: 14,
    },
    statLabel: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.8,
        fontSize: 10,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: theme.spacing.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    quickActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    lastActiveContainer: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        paddingTop: theme.spacing.xs,
    },
    lastActiveContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastActiveText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
});

export default ClientProfileScreen;

// Export reusable components for InterpreterProfileScreen
export {
    MyProfileScreen,
    ChangePasswordScreen,
    CardRegistrationScreen,
    CallHistoryScreen,
    PaymentHistoryScreen,
    LanguageCoverageScreen,
    AboutScreen,
    TermsScreen,
    PrivacyPolicyScreen,
    ContactUsScreen,
    VersionScreen,
    SignOutConfirmationScreen,
    DeleteAccountScreen,
    DynamicHeader,
    ProfileListItem,
    SectionHeader
};