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
    ToastAndroid,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Consistent theme from other screens
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

// Dynamic Header Component (consistent with other screens)
const DynamicHeader = ({
    type = 'back',
    title = 'Messages',
    onBack,
    onBell,
    onProfile,
    showActions = false,
    onSearchPress,
    isSearching,
    searchValue,
    onSearchChange,
    onSearchCancel
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
        if (isSearching) {
            return (
                <View style={[styles.headerLeft, { flex: 1 }]}>
                    <TouchableOpacity style={styles.headerButton} onPress={onSearchCancel} activeOpacity={0.7}>
                        <Feather name="x" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <TextInput
                        style={{
                            flex: 1,
                            height: 40,
                            marginLeft: 8,
                            color: theme.colors.text.primary,
                            backgroundColor: theme.colors.surfaceLight,
                            borderRadius: theme.borderRadius.md,
                            paddingHorizontal: theme.spacing.md,
                        }}
                        placeholder="Search..."
                        placeholderTextColor={theme.colors.text.light}
                        value={searchValue}
                        onChangeText={onSearchChange}
                        autoFocus
                        returnKeyType="search"
                    />
                </View>
            );
        }
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
                        {showActions && (
                            <View style={styles.headerActions}>
                                <TouchableOpacity style={styles.headerButton} onPress={onSearchPress} activeOpacity={0.7}>
                                    <Feather name="search" size={24} color={theme.colors.text.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                                    <Feather name="more-vertical" size={24} color={theme.colors.text.primary} />
                                </TouchableOpacity>
                            </View>
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

// Message validation utility
const validateMessage = (message) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+92|0\d{3}|\d{4})[- ]?\d{7}|\d{10,11}/;
    const urlRegex = /(wa\.me|whatsapp|facebook|instagram|twitter|telegram|discord|skype|gmail|yahoo|hotmail|outlook)/i;

    if (emailRegex.test(message)) {
        return { isValid: false, type: 'email' };
    }
    if (phoneRegex.test(message)) {
        return { isValid: false, type: 'phone' };
    }
    if (urlRegex.test(message)) {
        return { isValid: false, type: 'social' };
    }

    return { isValid: true };
};

// Toast helper function
const showToast = (message) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
        Alert.alert('Warning', message);
    }
};

// Conversation List Item Component
const ConversationItem = ({ conversation, onPress, index }) => {
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

    return (
        <Animated.View
            style={[
                styles.conversationItem,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(conversation)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.conversationTouchable}
            >
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: conversation.avatarColor }]}>
                        <Text style={styles.avatarText}>
                            {conversation.interpreterName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    {conversation.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                        <Text style={styles.interpreterName} numberOfLines={1}>
                            {conversation.interpreterName}
                        </Text>
                        <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                    </View>

                    <View style={styles.conversationMeta}>
                        <Text style={styles.languagePair}>{conversation.languagePair}</Text>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.domain}>{conversation.domain}</Text>
                    </View>

                    <View style={styles.lastMessageContainer}>
                        <Text
                            style={[
                                styles.lastMessage,
                                conversation.unreadCount > 0 && styles.lastMessageUnread
                            ]}
                            numberOfLines={1}
                        >
                            {conversation.lastMessage}
                        </Text>
                        {conversation.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadCount}>
                                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Message Bubble Component
const MessageBubble = ({ message, onLongPress, isReplying }) => {
    const isOwn = message.senderId === 'client';
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleLongPress = () => {
        if (!isReplying) {
            onLongPress(message);
        }
    };

    return (
        <Animated.View
            style={[
                styles.messageContainer,
                isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <TouchableOpacity
                onLongPress={handleLongPress}
                delayLongPress={500}
                activeOpacity={0.8}
                style={[
                    styles.messageBubble,
                    isOwn ? styles.ownMessage : styles.otherMessage
                ]}
            >
                {message.replyTo && (
                    <View style={styles.replyContainer}>
                        <View style={styles.replyLine} />
                        <View style={styles.replyContent}>
                            <Text style={styles.replyAuthor}>
                                {message.replyTo.senderId === 'client' ? 'You' : 'Interpreter'}
                            </Text>
                            <Text style={styles.replyText} numberOfLines={2}>
                                {message.replyTo.text}
                            </Text>
                        </View>
                    </View>
                )}

                <Text style={[
                    styles.messageText,
                    isOwn ? styles.ownMessageText : styles.otherMessageText
                ]}>
                    {message.text}
                </Text>

                <Text style={[
                    styles.messageTime,
                    isOwn ? styles.ownMessageTime : styles.otherMessageTime
                ]}>
                    {message.time}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Reply Preview Component
const ReplyPreview = ({ replyingTo, onCancel }) => {
    const slideAnim = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.replyPreview, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.replyPreviewContent}>
                <View style={styles.replyPreviewLine} />
                <View style={styles.replyPreviewText}>
                    <Text style={styles.replyPreviewAuthor}>
                        Replying to {replyingTo.senderId === 'client' ? 'yourself' : 'interpreter'}
                    </Text>
                    <Text style={styles.replyPreviewMessage} numberOfLines={1}>
                        {replyingTo.text}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.replyPreviewCancel}>
                <Feather name="x" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Chat Screen Component
const ChatScreen = ({ conversation, onBack }) => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Hello! I\'m interested in your legal interpretation services for tomorrow.',
            senderId: 'client',
            time: '10:30 AM',
            timestamp: Date.now() - 3600000,
        },
        {
            id: '2',
            text: 'Hello! Thank you for reaching out. I\'d be happy to help with your legal interpretation needs. What specific type of legal proceeding will this be for?',
            senderId: 'interpreter',
            time: '10:32 AM',
            timestamp: Date.now() - 3480000,
        },
        {
            id: '3',
            text: 'It\'s for a contract review meeting with our Spanish-speaking client. The meeting is expected to last about 2 hours.',
            senderId: 'client',
            time: '10:35 AM',
            timestamp: Date.now() - 3300000,
        },
        {
            id: '4',
            text: 'Perfect! I have extensive experience in legal contract interpretation. My rate is $75/hour for legal interpretation services. What time works best for you tomorrow?',
            senderId: 'interpreter',
            time: '10:37 AM',
            timestamp: Date.now() - 3180000,
        },
    ]);

    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const scrollViewRef = useRef(null);
    const inputRef = useRef(null);
    const [searching, setSearching] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        // Validate message content
        const validation = validateMessage(inputText);
        if (!validation.isValid) {
            let warningMessage = '';
            switch (validation.type) {
                case 'email':
                    warningMessage = '⚠️ Email addresses are not allowed in messages. Please use the platform for communication.';
                    break;
                case 'phone':
                    warningMessage = '⚠️ Phone numbers are not allowed in messages. Please keep communication within the platform.';
                    break;
                case 'social':
                    warningMessage = '⚠️ Social media links and external contact methods are not allowed. Please use platform messaging.';
                    break;
            }

            showToast(warningMessage);
            setInputText('');
            return;
        }

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            senderId: 'client',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            replyTo: replyingTo,
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setReplyingTo(null);
        scrollToBottom();
    };

    const handleMessageLongPress = (message) => {
        Alert.alert(
            'Message Options',
            'What would you like to do?',
            [
                {
                    text: 'Reply',
                    onPress: () => {
                        setReplyingTo(message);
                        inputRef.current?.focus();
                    }
                },
                {
                    text: 'Copy',
                    onPress: () => {
                        // Copy functionality would go here
                        showToast('Message copied to clipboard');
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const filteredMessages = searching && searchValue.trim()
        ? messages.filter(m => m.text.toLowerCase().includes(searchValue.trim().toLowerCase()))
        : messages;

    return (
        <View style={styles.chatContainer}>
            <DynamicHeader
                type="back"
                title={conversation.interpreterName}
                onBack={onBack}
                showActions={true}
                onSearchPress={() => setSearching(true)}
                isSearching={searching}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearchCancel={() => { setSearching(false); setSearchValue(''); }}
            />

            {/* Warning Banner */}
            <View style={styles.warningBanner}>
                <Feather name="alert-triangle" size={16} color={theme.colors.warning} />
                <Text style={styles.warningText}>
                    Please avoid sharing personal contact information (phone, email, social links). Violations may lead to account suspension.
                </Text>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={scrollToBottom}
            >
                {filteredMessages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        onLongPress={handleMessageLongPress}
                        isReplying={!!replyingTo}
                    />
                ))}
            </ScrollView>

            {/* Reply Preview */}
            {replyingTo && (
                <ReplyPreview
                    replyingTo={replyingTo}
                    onCancel={() => setReplyingTo(null)}
                />
            )}

            {/* Message Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <View style={styles.inputRow}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type your message..."
                            placeholderTextColor={theme.colors.text.light}
                            multiline={true}
                            maxLength={500}
                        />
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                        ]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                        activeOpacity={0.8}
                    >
                        <Feather
                            name="send"
                            size={20}
                            color={inputText.trim() ? theme.colors.text.white : theme.colors.text.light}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

// Empty State Component
const EmptyState = () => {
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
                <Feather name="message-circle" size={64} color={theme.colors.text.light} />
            </Animated.View>
            <Text style={styles.emptyStateTitle}>No conversations yet</Text>
            <Text style={styles.emptyStateSubtitle}>
                Start connecting with interpreters to begin messaging
            </Text>
        </View>
    );
};

// Main Messages Screen Component
const MessagesScreen = () => {
    const [conversations, setConversations] = useState([
        {
            id: '1',
            interpreterName: 'Maria Rodriguez',
            languagePair: 'English ↔ Spanish',
            domain: 'Legal',
            lastMessage: 'Perfect! My rate is $75/hour for legal interpretation services. What time works best?',
            timestamp: '10:37 AM',
            unreadCount: 2,
            isOnline: true,
            avatarColor: theme.colors.primary,
        },
        {
            id: '2',
            interpreterName: 'Jean-Pierre Dubois',
            languagePair: 'English ↔ French',
            domain: 'Medical',
            lastMessage: 'I\'m available for the medical consultation tomorrow at 2 PM.',
            timestamp: 'Yesterday',
            unreadCount: 0,
            isOnline: false,
            avatarColor: theme.colors.secondary,
        },
        {
            id: '3',
            interpreterName: 'Ahmad Hassan',
            languagePair: 'English ↔ Arabic',
            domain: 'Business',
            lastMessage: 'Thank you for considering my services. I have 5+ years of experience in business interpretation.',
            timestamp: '2 days ago',
            unreadCount: 1,
            isOnline: true,
            avatarColor: theme.colors.accent,
        },
    ]);

    const [selectedConversation, setSelectedConversation] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [searching, setSearching] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleConversationPress = (conversation) => {
        // Mark as read
        setConversations(conversations.map(conv =>
            conv.id === conversation.id
                ? { ...conv, unreadCount: 0 }
                : conv
        ));
        setSelectedConversation(conversation);
    };

    const handleBackFromChat = () => {
        setSelectedConversation(null);
    };

    const filteredConversations = searching && searchValue.trim()
        ? conversations.filter(conv =>
            conv.interpreterName.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
            conv.languagePair.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
            conv.domain.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchValue.trim().toLowerCase())
        )
        : conversations;

    const renderConversationItem = ({ item, index }) => (
        <ConversationItem
            conversation={item}
            onPress={handleConversationPress}
            index={index}
        />
    );

    if (selectedConversation) {
        return (
            <ChatScreen
                conversation={selectedConversation}
                onBack={handleBackFromChat}
            />
        );
    }

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Messages"
                onBack={() => console.log('Navigate back')}
                showActions={true}
                onSearchPress={() => setSearching(true)}
                isSearching={searching}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearchCancel={() => { setSearching(false); setSearchValue(''); }}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {filteredConversations.length === 0 ? (
                    <EmptyState />
                ) : (
                    <FlatList
                        data={filteredConversations}
                        renderItem={renderConversationItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.conversationsList}
                    />
                )}
            </Animated.View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Header Styles (consistent with other screens)
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
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    headerTitleSecondary: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: theme.spacing.sm,
        marginLeft: theme.spacing.sm,
    },

    // Content Styles
    content: {
        flex: 1,
    },

    // Conversations List Styles
    conversationsList: {
        padding: theme.spacing.md,
    },
    conversationItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    conversationTouchable: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: theme.colors.success,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    interpreterName: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        flex: 1,
    },
    timestamp: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    conversationMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    languagePair: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    separator: {
        ...theme.typography.caption,
        color: theme.colors.text.light,
        marginHorizontal: theme.spacing.sm,
    },
    domain: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    lastMessageUnread: {
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
    },
    unreadCount: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
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
        ...theme.typography.h2,
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

    // Chat Screen Styles
    chatContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    warningText: {
        ...theme.typography.small,
        color: '#92400E',
        marginLeft: theme.spacing.sm,
        flex: 1,
        lineHeight: 16,
    },
    messagesContainer: {
        flex: 1,
        padding: theme.spacing.md,
    },

    // Message Bubble Styles
    messageContainer: {
        marginBottom: theme.spacing.md,
    },
    ownMessageContainer: {
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    ownMessage: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    messageText: {
        ...theme.typography.body,
        lineHeight: 20,
    },
    ownMessageText: {
        color: theme.colors.text.white,
    },
    otherMessageText: {
        color: theme.colors.text.primary,
    },
    messageTime: {
        ...theme.typography.small,
        marginTop: theme.spacing.xs,
        alignSelf: 'flex-end',
    },
    ownMessageTime: {
        color: theme.colors.text.white,
        opacity: 0.8,
    },
    otherMessageTime: {
        color: theme.colors.text.light,
    },

    // Reply Styles
    replyContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    replyLine: {
        width: 3,
        backgroundColor: theme.colors.accent,
        borderRadius: 2,
        marginRight: theme.spacing.sm,
    },
    replyContent: {
        flex: 1,
    },
    replyAuthor: {
        ...theme.typography.small,
        fontWeight: '600',
        color: theme.colors.accent,
        marginBottom: 2,
    },
    replyText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.8,
        fontStyle: 'italic',
    },

    // Reply Preview Styles
    replyPreview: {
        backgroundColor: theme.colors.surfaceLight,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyPreviewContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyPreviewLine: {
        width: 3,
        height: 30,
        backgroundColor: theme.colors.primary,
        borderRadius: 2,
        marginRight: theme.spacing.sm,
    },
    replyPreviewText: {
        flex: 1,
    },
    replyPreviewAuthor: {
        ...theme.typography.small,
        color: theme.colors.primary,
        fontWeight: '600',
        marginBottom: 2,
    },
    replyPreviewMessage: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    replyPreviewCancel: {
        padding: theme.spacing.sm,
        marginLeft: theme.spacing.sm,
    },

    // Input Styles
    inputContainer: {
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textInputContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: theme.spacing.sm,
        maxHeight: 100,
    },
    textInput: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 44,
        textAlignVertical: 'center',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    sendButtonInactive: {
        backgroundColor: theme.colors.border,
    },
});

export default MessagesScreen;