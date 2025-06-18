import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Animated,
    Dimensions,
    Alert,
    Image,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import LanguagePairModal from '../Components/LanguagePairModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Consistent theme from previous screens
const theme = {
    colors: {
        primary: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceLight: '#F8FAFC',
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            light: '#9CA3AF',
            white: '#FFFFFF',
        },
        border: '#E5E7EB',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '700' },
        h2: { fontSize: 24, fontWeight: '600' },
        h3: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400' },
        bodyMedium: { fontSize: 16, fontWeight: '500' },
        caption: { fontSize: 14, fontWeight: '400' },
        small: { fontSize: 12, fontWeight: '400' },
    },
};

// Sample interpreter data
const interpretersData = [
    {
        id: '1',
        name: 'Maria Rodriguez',
        rating: 4.9,
        reviewCount: 127,
        languages: ['English', 'Spanish', 'Portuguese'],
        expertise: ['Legal', 'Business', 'Medical'],
        pricePerMinute: 2.50,
        status: 'online',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332-b3.jpg?w=150&h=150&fit=crop&crop=face',
        responseTime: '< 5 min',
        completedJobs: 340,
        yearsExperience: 8,
        description: 'Certified legal interpreter with 8+ years of experience in court proceedings and business negotiations.',
    },
    {
        id: '2',
        name: 'Dr. Ahmad Hassan',
        rating: 2.0,
        reviewCount: 89,
        languages: ['English', 'Arabic', 'French'],
        expertise: ['Medical', 'Academic', 'Technical'],
        pricePerMinute: 3.75,
        status: 'online',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        responseTime: '< 2 min',
        completedJobs: 256,
        yearsExperience: 12,
        description: 'Medical interpreter specializing in patient consultations and medical document translation.',
    },
    {
        id: '3',
        name: 'Sophie Chen',
        rating: 4.7,
        reviewCount: 203,
        languages: ['English', 'Mandarin', 'Cantonese'],
        expertise: ['Business', 'Technical', 'General'],
        pricePerMinute: 2.25,
        status: 'offline',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        responseTime: '< 10 min',
        completedJobs: 445,
        yearsExperience: 6,
        description: 'Business interpreter with expertise in tech startups and international trade negotiations.',
    },
    {
        id: '4',
        name: 'Jean-Pierre Dubois',
        rating: 2.9,
        reviewCount: 156,
        languages: ['English', 'French', 'German'],
        expertise: ['Legal', 'Academic', 'General'],
        pricePerMinute: 3.00,
        status: 'online',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        responseTime: '< 3 min',
        completedJobs: 289,
        yearsExperience: 10,
        description: 'Experienced legal interpreter with specialization in international law and academic conferences.',
    },
];

// Reusable Dynamic Header Component
const DynamicHeader = ({
    type = 'back',
    title = 'Find an Interpreter',
    onBack,
    onBell,
    onProfile,
    onFavorite,
    showFavorite = false
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, []);

    const renderHeaderContent = () => {
        switch (type) {
            case 'home':
                return (
                    <>
                        <Text style={styles.headerTitle}>LanguageAccess</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerButton} onPress={onBell} activeOpacity={0.7}>
                                <Feather name="bell" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton} onPress={onProfile} activeOpacity={0.7}>
                                <Feather name="user" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        </View>
                    </>
                );
            case 'back':
                return (
                    <>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.headerButton} onPress={onBack} activeOpacity={0.7}>
                                <Feather name="chevron-left" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitleSecondary}>{title}</Text>
                        </View>
                        {showFavorite && (
                            <TouchableOpacity style={styles.headerButton} onPress={onFavorite} activeOpacity={0.7}>
                                <Feather name="star" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        )}
                    </>
                );
            default:
                return <Text style={styles.headerTitleSecondary}>{title}</Text>;
        }
    };

    return (
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
            {renderHeaderContent()}
        </Animated.View>
    );
};

// Top Prompt Bar Component
const TopPromptBar = ({ onPostJob }) => {
    const slideAnim = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.promptBar,
                { transform: [{ translateY: slideAnim }] }
            ]}
        >
            <View style={styles.promptContent}>
                <Feather name="lightbulb" size={20} color={theme.colors.accent} />
                <Text style={styles.promptText}>
                    Want interpreters to come to you instead?
                </Text>
            </View>
            <TouchableOpacity
                style={styles.promptButton}
                onPress={onPostJob}
                activeOpacity={0.8}
            >
                <Text style={styles.promptButtonText}>Post a Job</Text>
                <Feather name="arrow-right" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Smart Search Bar Component
const SmartSearchBar = ({ searchText, onSearchChange, onClear }) => {
    const [isFocused, setIsFocused] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const borderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: isFocused ? 1.02 : 1,
                useNativeDriver: false,
            }),
            Animated.timing(borderAnim, {
                toValue: isFocused ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [isFocused]);

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.border, theme.colors.primary],
    });

    return (
        <Animated.View
            style={[
                styles.searchContainer,
                {
                    transform: [{ scale: scaleAnim }],
                    borderColor: borderColor,
                }
            ]}
        >
            <Feather name="search" size={20} color={theme.colors.text.secondary} />
            <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={onSearchChange}
                placeholder="Search by name, language, domain..."
                placeholderTextColor={theme.colors.text.light}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
                    <Feather name="x" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

// Filter Section Component
const FilterSection = ({
    filters,
    onFilterChange,
    showFilters,
    onToggleFilters,
    onLanguagePairPress
}) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: showFilters ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [showFilters]);

    const filterHeight = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
    });

    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Portuguese'];
    const expertiseOptions = ['All', 'Legal', 'Medical', 'Business', 'Technical', 'Academic', 'General'];

    return (
        <View style={styles.filterSection}>
            <TouchableOpacity
                style={styles.filterToggle}
                onPress={onToggleFilters}
                activeOpacity={0.8}
            >
                <View style={styles.filterToggleLeft}>
                    <Feather name="filter" size={20} color={theme.colors.text.primary} />
                    <Text style={styles.filterToggleText}>Filters</Text>
                </View>
                <Feather
                    name={showFilters ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.colors.text.secondary}
                />
            </TouchableOpacity>

            <Animated.View style={[styles.filterContent, { height: filterHeight }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Language Pair Filter */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Language Pair</Text>
                        <TouchableOpacity
                            style={styles.languagePairContainer}
                            onPress={onLanguagePairPress}
                            activeOpacity={0.8}
                        >
                            <View style={styles.languageSelector}>
                                <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                                <Text style={styles.languageSelectorText}>{filters.languageFrom}</Text>
                                <Feather name="chevron-down" size={16} color={theme.colors.text.secondary} />
                            </View>
                            <Feather name="arrow-right" size={16} color={theme.colors.text.secondary} />
                            <View style={styles.languageSelector}>
                                <Text style={styles.languageSelectorText}>{filters.languageTo}</Text>
                                <Feather name="chevron-down" size={16} color={theme.colors.text.secondary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Status Filter */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Availability</Text>
                        <View style={styles.statusToggle}>
                            <TouchableOpacity
                                style={[
                                    styles.statusOption,
                                    filters.status === 'all' && styles.statusOptionActive
                                ]}
                                onPress={() => onFilterChange('status', 'all')}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.statusOptionText,
                                    filters.status === 'all' && styles.statusOptionTextActive
                                ]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.statusOption,
                                    filters.status === 'online' && styles.statusOptionActive
                                ]}
                                onPress={() => onFilterChange('status', 'online')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.onlineIndicator} />
                                <Text style={[
                                    styles.statusOptionText,
                                    filters.status === 'online' && styles.statusOptionTextActive
                                ]}>Online</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.statusOption,
                                    filters.status === 'offline' && styles.statusOptionActive
                                ]}
                                onPress={() => onFilterChange('status', 'offline')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.offlineIndicator} />
                                <Text style={[
                                    styles.statusOptionText,
                                    filters.status === 'offline' && styles.statusOptionTextActive
                                ]}>Offline</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Expertise Filter */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Expertise</Text>
                        <View style={styles.expertiseContainer}>
                            {expertiseOptions.map((expertise) => (
                                <TouchableOpacity
                                    key={expertise}
                                    style={[
                                        styles.expertiseChip,
                                        filters.expertise === expertise && styles.expertiseChipActive
                                    ]}
                                    onPress={() => onFilterChange('expertise', expertise)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.expertiseChipText,
                                        filters.expertise === expertise && styles.expertiseChipTextActive
                                    ]}>
                                        {expertise}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
        </View>
    );
};

// Sorting Dropdown Component
const SortingDropdown = ({ sortBy, onSortChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const sortOptions = [
        { value: 'rating', label: 'Top Rated', icon: 'star' },
        { value: 'experience', label: 'Most Experienced', icon: 'award' },
        { value: 'price', label: 'Lowest Rate', icon: 'dollar-sign' },
        { value: 'newest', label: 'Newest Interpreters', icon: 'clock' },
    ];

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: showDropdown ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [showDropdown]);

    const dropdownHeight = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, sortOptions.length * 50],
    });

    const getCurrentSortLabel = () => {
        const current = sortOptions.find(option => option.value === sortBy);
        return current ? current.label : 'Top Rated';
    };

    return (
        <View style={styles.sortingContainer}>
            <TouchableOpacity
                style={styles.sortingButton}
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={0.8}
            >
                <Text style={styles.sortingButtonText}>{getCurrentSortLabel()}</Text>
                <Feather
                    name={showDropdown ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={theme.colors.text.secondary}
                />
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.sortingDropdown,
                    {
                        height: dropdownHeight,
                        opacity: slideAnim,
                        display: showDropdown ? 'flex' : 'none'
                    }
                ]}
            >
                {sortOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.sortingOption,
                            sortBy === option.value && showDropdown && styles.sortingOptionActive
                        ]}
                        onPress={() => {
                            onSortChange(option.value);
                            setShowDropdown(false);
                        }}
                        activeOpacity={0.8}
                    >
                        <Feather
                            name={option.icon}
                            size={16}
                            color={sortBy === option.value && showDropdown ? theme.colors.primary : theme.colors.text.secondary}
                        />
                        <Text style={[
                            styles.sortingOptionText,
                            sortBy === option.value && showDropdown && styles.sortingOptionTextActive
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
};

// Interpreter Profile Card Component
const InterpreterCard = ({ interpreter, onMessage, onAudioCall, onVideoCall, index }) => {
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
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                delay: index * 100,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

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

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <View key={i} style={{ position: 'relative' }}>
                    <Feather name="star" size={12} color={theme.colors.border} style={{ position: 'absolute' }} />
                    <Feather name="star" size={12} color={theme.colors.accent} />
                </View>
            );
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(
                <View key="half" style={{ position: 'relative' }}>
                    <Feather name="star" size={12} color={theme.colors.border} style={{ position: 'absolute' }} />
                    <View style={{ width: 6, overflow: 'hidden' }}>
                        <Feather name="star" size={12} color={theme.colors.accent} />
                    </View>
                </View>
            );
        }

        // Add empty stars
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <Feather key={`empty-${i}`} name="star" size={12} color={theme.colors.border} />
            );
        }

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {stars}
            </View>
        );
    };

    return (
        <Animated.View
            style={[
                styles.interpreterCard,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.interpreterInfo}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: interpreter.avatar }}
                                style={styles.avatar}
                            />
                            <View style={[
                                styles.statusIndicator,
                                { backgroundColor: interpreter.status === 'online' ? theme.colors.success : theme.colors.text.light }
                            ]} />
                        </View>

                        <View style={styles.interpreterDetails}>
                            <Text style={styles.interpreterName}>{interpreter.name}</Text>
                            <View style={styles.ratingContainer}>
                                <View style={styles.starsContainer}>
                                    {renderStars(interpreter.rating)}
                                </View>
                                <Text style={styles.ratingText}>
                                    {interpreter.rating} ({interpreter.reviewCount})
                                </Text>
                            </View>
                            <Text style={styles.responseTime}>
                                Responds in {interpreter.responseTime}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>per minute</Text>
                        <Text style={styles.price}>${interpreter.pricePerMinute}</Text>
                    </View>
                </View>

                {/* Languages */}
                <View style={styles.languagesSection}>
                    <Feather name="globe" size={16} color={theme.colors.text.secondary} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.languagesList}
                    >
                        {interpreter.languages.map((language, index) => (
                            <View key={language} style={styles.languageChip}>
                                <Text style={styles.languageChipText}>{language}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Expertise */}
                <View style={styles.expertiseSection}>
                    <Feather name="briefcase" size={16} color={theme.colors.text.secondary} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.expertiseList}
                    >
                        {interpreter.expertise.map((skill) => (
                            <View key={skill} style={styles.expertiseTag}>
                                <Text style={styles.expertiseTagText}>{skill}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Stats */}
                <View style={styles.statsSection}>
                    <View style={styles.statItem}>
                        <Feather name="check-circle" size={14} color={theme.colors.success} />
                        <Text style={styles.statText}>{interpreter.completedJobs} jobs</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Feather name="award" size={14} color={theme.colors.primary} />
                        <Text style={styles.statText}>{interpreter.yearsExperience} years exp</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                    {interpreter.description}
                </Text>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => onMessage(interpreter)}
                        activeOpacity={0.8}
                    >
                        <Feather name="message-circle" size={18} color={theme.colors.text.white} />
                        <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.callButton}
                        onPress={() => onAudioCall(interpreter)}
                        activeOpacity={0.8}
                    >
                        <Feather name="phone" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.videoButton}
                        onPress={() => onVideoCall(interpreter)}
                        activeOpacity={0.8}
                    >
                        <Feather name="video" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Main Find Interpreter Screen Component
const FindInterpreterScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('rating');
    const [filters, setFilters] = useState({
        languageFrom: 'English',
        languageTo: 'Any',
        status: 'all',
        expertise: 'All',
    });
    const [interpreters, setInterpreters] = useState(interpretersData);
    const [loading, setLoading] = useState(false);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        // Implement search filtering logic here
        filterInterpreters(text, filters, sortBy);
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        filterInterpreters(searchText, newFilters, sortBy);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        filterInterpreters(searchText, filters, newSortBy);
    };

    const handleLanguagePairSelect = ({ languageFrom, languageTo }) => {
        const newFilters = { ...filters, languageFrom, languageTo };
        setFilters(newFilters);
        filterInterpreters(searchText, newFilters, sortBy);
    };

    const filterInterpreters = (search, currentFilters, currentSort) => {
        let filtered = [...interpretersData];

        // Apply search filter
        if (search) {
            filtered = filtered.filter(interpreter =>
                interpreter.name.toLowerCase().includes(search.toLowerCase()) ||
                interpreter.languages.some(lang => lang.toLowerCase().includes(search.toLowerCase())) ||
                interpreter.expertise.some(exp => exp.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Apply status filter
        if (currentFilters.status !== 'all') {
            filtered = filtered.filter(interpreter => interpreter.status === currentFilters.status);
        }

        // Apply expertise filter
        if (currentFilters.expertise !== 'All') {
            filtered = filtered.filter(interpreter =>
                interpreter.expertise.includes(currentFilters.expertise)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (currentSort) {
                case 'rating':
                    return b.rating - a.rating;
                case 'experience':
                    return b.yearsExperience - a.yearsExperience;
                case 'price':
                    return a.pricePerMinute - b.pricePerMinute;
                case 'newest':
                    return b.completedJobs - a.completedJobs; // Using completed jobs as proxy for "newest"
                default:
                    return 0;
            }
        });

        setInterpreters(filtered);
    };

    const handlePostJob = () => {
        // Navigate to Post Job screen
        console.log('Navigate to Post Job screen');
    };

    const handleMessage = (interpreter) => {
        Alert.alert('Message', `Starting conversation with ${interpreter.name}`);
    };

    const handleAudioCall = (interpreter) => {
        Alert.alert('Audio Call', `Calling ${interpreter.name}...`);
    };

    const handleVideoCall = (interpreter) => {
        Alert.alert('Video Call', `Starting video call with ${interpreter.name}...`);
    };

    const renderInterpreterItem = ({ item, index }) => (
        <InterpreterCard
            interpreter={item}
            onMessage={handleMessage}
            onAudioCall={handleAudioCall}
            onVideoCall={handleVideoCall}
            index={index}
        />
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Find an Interpreter"
                onBack={() => console.log('Navigate back')}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Top Prompt Bar */}
                <TopPromptBar onPostJob={handlePostJob} />

                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <SmartSearchBar
                        searchText={searchText}
                        onSearchChange={handleSearch}
                        onClear={() => handleSearch('')}
                    />
                </View>

                {/* Filter Section */}
                <FilterSection
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onLanguagePairPress={() => setLanguageModalVisible(true)}
                />

                {/* Results Header */}
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
                        {interpreters.length} interpreters found
                    </Text>
                    <SortingDropdown
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                    />
                </View>

                {/* Interpreters List */}
                {/* Continuing from where the script left off - after renderInterpreterItem function */}

                <FlatList
                    data={interpreters}
                    renderItem={renderInterpreterItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.interpretersList}
                    ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <Feather name="search" size={48} color={theme.colors.text.light} />
                            <Text style={styles.emptyStateTitle}>No interpreters found</Text>
                            <Text style={styles.emptyStateText}>
                                Try adjusting your search criteria or filters
                            </Text>
                            <TouchableOpacity
                                style={styles.clearFiltersButton}
                                onPress={() => {
                                    setSearchText('');
                                    setFilters({
                                        languageFrom: 'English',
                                        languageTo: 'Any',
                                        status: 'all',
                                        expertise: 'All',
                                    });
                                    setSortBy('rating');
                                    setInterpreters(interpretersData);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    refreshing={loading}
                    onRefresh={() => {
                        setLoading(true);
                        setTimeout(() => setLoading(false), 1000);
                    }}
                />
            </Animated.View>
            <LanguagePairModal
                visible={languageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
                onSelect={handleLanguagePairSelect}
                initialFrom={filters.languageFrom}
                initialTo={filters.languageTo}
            />
        </View>
    );
};

// Complete StyleSheet
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
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
    },
    headerTitleSecondary: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginHorizontal: theme.spacing.xs,
    },

    // Content Styles
    content: {
        flex: 1,
    },

    // Prompt Bar Styles
    promptBar: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    promptContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    promptText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
    promptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primaryLight + '20',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    promptButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        marginRight: theme.spacing.xs,
    },

    // Search Section Styles
    searchSection: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        elevation: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchInput: {
        flex: 1,
        ...theme.typography.body,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
        marginRight: theme.spacing.sm,
    },

    // Filter Section Styles
    filterSection: {
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        elevation: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    filterToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterToggleText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    filterContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.xs,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    filterGroup: {
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },

    // Language Pair Styles
    languagePairContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        flex: 1,
        marginHorizontal: theme.spacing.xs,
    },
    languageSelectorText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        marginHorizontal: theme.spacing.sm,
        flex: 1,
    },

    // Status Toggle Styles
    statusToggle: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.xs,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        flex: 1,
        justifyContent: 'center',
    },
    statusOptionActive: {
        backgroundColor: theme.colors.primary,
    },
    statusOptionText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    statusOptionTextActive: {
        color: theme.colors.text.white,
    },
    onlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.success,
        marginRight: theme.spacing.xs,
    },
    offlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.text.light,
        marginRight: theme.spacing.xs,
    },

    // Expertise Styles
    expertiseContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: theme.spacing.xs,
    },
    expertiseChip: {
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    expertiseChipActive: {
        backgroundColor: theme.colors.primary,
    },
    expertiseChipText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    expertiseChipTextActive: {
        color: theme.colors.text.white,
    },

    // Results Header Styles
    resultsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    resultsCount: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
    },

    // Sorting Styles
    sortingContainer: {
        position: 'relative',
    },
    sortingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sortingButtonText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        marginRight: theme.spacing.sm,
    },
    sortingDropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        elevation: 3,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        zIndex: 1000,
        minWidth: 200,
        overflow: 'hidden',
    },
    sortingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    sortingOptionActive: {
        backgroundColor: theme.colors.primaryLight + '20',
    },
    sortingOptionText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    sortingOptionTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },

    // Interpreter Card Styles
    interpretersList: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
    cardSeparator: {
        height: theme.spacing.md,
    },
    interpreterCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    interpreterInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    interpreterDetails: {
        flex: 1,
    },
    interpreterName: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: theme.spacing.sm,
    },
    ratingText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    responseTime: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    price: {
        ...theme.typography.h3,
        color: theme.colors.primary,
    },

    // Languages Section
    languagesSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    languagesList: {
        marginLeft: theme.spacing.sm,
    },
    languageChip: {
        backgroundColor: theme.colors.secondary + '20',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.xs,
    },
    languageChipText: {
        ...theme.typography.small,
        color: theme.colors.secondary,
        fontWeight: '500',
    },

    // Expertise Section
    expertiseSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    expertiseList: {
        marginLeft: theme.spacing.sm,
    },
    expertiseTag: {
        backgroundColor: theme.colors.accent + '20',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.xs,
    },
    expertiseTagText: {
        ...theme.typography.small,
        color: theme.colors.accent,
        fontWeight: '500',
    },

    // Stats Section
    statsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    statText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },

    // Description
    description: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        lineHeight: 22,
        marginBottom: theme.spacing.md,
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        flex: 1,
        justifyContent: 'center',
        marginRight: theme.spacing.sm,
    },
    messageButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.xs,
    },
    callButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        marginRight: theme.spacing.sm,
    },
    videoButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },

    // Empty State Styles
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyStateTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    emptyStateText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    clearFiltersButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
    },
    clearFiltersButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
    },
});

export default FindInterpreterScreen;