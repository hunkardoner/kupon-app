import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';

interface ContactProps {
  navigation: any;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactScreen: React.FC<ContactProps> = ({ navigation }) => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>İletişim</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin');
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
      return false;
    }
    if (!form.subject.trim()) {
      Alert.alert('Hata', 'Lütfen konu başlığı girin');
      return false;
    }
    if (!form.message.trim()) {
      Alert.alert('Hata', 'Lütfen mesajınızı yazın');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Resend.com API integration
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Başarılı',
        'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              setForm({ name: '', email: '', subject: '', message: '' });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderHeader()}
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Bizimle İletişime Geçin</Text>
            <Text style={styles.introText}>
              Sorularınız, önerileriniz veya şikayetleriniz için aşağıdaki formu doldurabilirsiniz. 
              En kısa sürede size dönüş yapacağız.
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad *</Text>
              <TextInput
                style={styles.input}
                placeholder="Adınızı ve soyadınızı girin"
                value={form.name}
                onChangeText={(value) => updateForm('name', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresi *</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta adresinizi girin"
                value={form.email}
                onChangeText={(value) => updateForm('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Konu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Mesajınızın konusunu girin"
                value={form.subject}
                onChangeText={(value) => updateForm('subject', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mesaj *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mesajınızı detaylı olarak yazın"
                value={form.message}
                onChangeText={(value) => updateForm('message', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Mesaj Gönder</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfoSection}>
            <Text style={styles.sectionTitle}>Diğer İletişim Kanalları</Text>
            
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#2196F3" />
              <View style={styles.contactItemContent}>
                <Text style={styles.contactItemTitle}>E-posta</Text>
                <Text style={styles.contactItemText}>support@kuponapp.com</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#2196F3" />
              <View style={styles.contactItemContent}>
                <Text style={styles.contactItemTitle}>Telefon</Text>
                <Text style={styles.contactItemText}>+90 (212) 123 45 67</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={20} color="#2196F3" />
              <View style={styles.contactItemContent}>
                <Text style={styles.contactItemTitle}>Çalışma Saatleri</Text>
                <Text style={styles.contactItemText}>Pazartesi - Cuma: 09:00 - 18:00</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactScreen;
