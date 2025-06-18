import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Portuguese', 'Mandarin', 'Cantonese', 'Hindi', 'Russian', 'Japanese', 'Korean', 'Italian', 'Dutch', 'Turkish', 'Polish', 'Bengali', 'Vietnamese', 'Urdu', 'Persian', 'Swahili', 'Greek', 'Thai', 'Hebrew', 'Malay', 'Indonesian', 'Romanian', 'Hungarian', 'Czech', 'Slovak', 'Finnish', 'Danish', 'Norwegian', 'Swedish', 'Filipino', 'Serbian', 'Croatian', 'Bulgarian', 'Ukrainian', 'Malayalam', 'Tamil', 'Telugu', 'Punjabi', 'Gujarati', 'Marathi', 'Kannada', 'Sinhala', 'Burmese', 'Khmer', 'Lao', 'Mongolian', 'Nepali', 'Pashto', 'Somali', 'Zulu', 'Xhosa', 'Afrikaans', 'Amharic', 'Yoruba', 'Igbo', 'Hausa', 'Maori', 'Samoan', 'Tongan', 'Fijian', 'Tahitian', 'Hawaiian', 'Other'
];

const LanguagePairModal = ({ visible, onClose, onSelect, initialFrom = 'English', initialTo = 'Any' }) => {
    const [from, setFrom] = useState(initialFrom);
    const [to, setTo] = useState(initialTo);
    const [step, setStep] = useState('from'); // 'from' or 'to'

    const handleSelect = () => {
        onSelect({ languageFrom: from, languageTo: to });
        onClose();
    };

    const handleLanguagePress = (lang) => {
        if (step === 'from') {
            setFrom(lang);
            setStep('to');
        } else {
            setTo(lang);
            handleSelect();
        }
    };

    const renderLanguage = ({ item }) => (
        <TouchableOpacity
            style={styles.languageItem}
            onPress={() => handleLanguagePress(item)}
        >
            <Text style={styles.languageText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>
                        {step === 'from' ? 'Select From Language' : 'Select To Language'}
                    </Text>
                    <FlatList
                        data={LANGUAGES}
                        keyExtractor={(item) => item}
                        renderItem={renderLanguage}
                        style={{ maxHeight: 350 }}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: 320,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    languageItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        width: 260,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    languageText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 32,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default LanguagePairModal;
