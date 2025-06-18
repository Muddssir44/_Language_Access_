import React from 'react';
import {
    View,
    Text,

    TouchableOpacity,

    Image,

    Animated,

} from 'react-native';
import { Feather } from '@expo/vector-icons';





export const interpreters = [
    {
        id: 1,
        name: 'Maria Rodriguez',
        rating: 4.9,
        reviews: 234,
        languages: ['English', 'Spanish', 'French'],
        specialties: ['Medical', 'Legal'],
        pricePerMinute: 2.50,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2c5?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        responseTime: '< 2 min'
    },
    {
        id: 2,
        name: 'Ahmed Hassan',
        rating: 4.8,
        reviews: 189,
        languages: ['Arabic', 'English', 'German'],
        specialties: ['Business', 'Technical'],
        pricePerMinute: 3.20,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        responseTime: '< 5 min'
    },
    {
        id: 3,
        name: 'Liu Wei',
        rating: 4.7,
        reviews: 156,
        languages: ['Mandarin', 'English', 'Japanese'],
        specialties: ['Business', 'Tourism'],
        pricePerMinute: 2.80,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
        responseTime: '< 10 min'
    }
];

const InterpreterCard = ({ interpreter, onMessage, onCall, onVideoCall }) => {
    const fadeAnim = new Animated.Value(0);

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.interpreterCard, { opacity: fadeAnim }]}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: interpreter.avatar }} style={styles.avatar} />
                    <View style={[styles.onlineIndicator, { backgroundColor: interpreter.isOnline ? theme.accent : theme.text.light }]} />
                </View>

                <View style={styles.interpreterInfo}>
                    <Text style={styles.interpreterName}>{interpreter.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Feather size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text style={styles.rating}>{interpreter.rating}</Text>
                        <Text style={styles.reviews}>({interpreter.reviews} reviews)</Text>
                    </View>
                    <Text style={styles.responseTime}>
                        <Feather size={12} color={theme.text.secondary} /> {interpreter.responseTime}
                    </Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${interpreter.pricePerMinute}</Text>
                    <Text style={styles.priceUnit}>per min</Text>
                </View>
            </View>

            <View style={styles.languagesContainer}>
                <Feather size={14} color={theme.text.secondary} />
                <Text style={styles.languages}>
                    {interpreter.languages.join(' • ')}
                </Text>
            </View>

            <View style={styles.specialtiesContainer}>
                <Feather size={14} color={theme.text.secondary} />
                <Text style={styles.specialties}>
                    {interpreter.specialties.join(', ')}
                </Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.messageButton]}
                    onPress={() => onMessage(interpreter)}
                >
                    <Feather size={18} color={theme.primary} />
                    <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => onCall(interpreter)}
                >
                    <Feather size={18} color="#fff" />
                    <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.videoButton]}
                    onPress={() => onVideoCall(interpreter)}
                >
                    <Feather size={18} color="#fff" />
                    <Text style={styles.videoButtonText}>Video</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};


const styles = StyleSheet.create({

    interpretersSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    interpreterCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...theme.shadow,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.border,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    interpreterInfo: {
        flex: 1,
    },
    interpreterName: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text.primary,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rating: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.text.primary,
        marginLeft: 4,
        marginRight: 4,
    },
    reviews: {
        fontSize: 14,
        color: theme.text.secondary,
    },
    responseTime: {
        fontSize: 12,
        color: theme.text.secondary,
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.primary,
    },
    priceUnit: {
        fontSize: 12,
        color: theme.text.secondary,
    },
    languagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    languages: {
        fontSize: 14,
        color: theme.text.secondary,
        marginLeft: 8,
        flex: 1,
    },
    specialtiesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    specialties: {
        fontSize: 14,
        color: theme.text.secondary,
        marginLeft: 8,
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 2,
        justifyContent: 'center',
    },
    messageButton: {
        backgroundColor: theme.secondary,
        borderWidth: 1,
        borderColor: theme.primary,
    },
    messageButtonText: {
        color: theme.primary,
        marginLeft: 6,
        fontWeight: '500',
    },
    callButton: {
        backgroundColor: theme.accent,
    },
    callButtonText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '500',
    },
    videoButton: {
        backgroundColor: theme.primary,
    },
    videoButtonText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '500',
    },
});
export default InterpreterCard;