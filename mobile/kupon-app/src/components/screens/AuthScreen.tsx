import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

interface AuthScreenProps {
  navigation: any;
  onGuestContinue?: () => void;
}

export function AuthScreen({ navigation, onGuestContinue }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading, error } = useAuth();

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.email || !formData.password) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
        return;
      }

      if (!isLogin) {
        if (!formData.name) {
          Alert.alert('Hata', 'Lütfen adınızı girin');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('Hata', 'Şifreler eşleşmiyor');
          return;
        }
        if (formData.password.length < 6) {
          Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
          return;
        }
      }

      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }

      // Success - navigation will be handled automatically by auth state change
      // No manual navigation needed since conditional rendering will handle it
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderForm = () => (
    <View style={styles.form}>
      {!isLogin && (
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            autoCapitalize="words"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#999"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry={!showPassword}
          autoComplete="password"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {!isLogin && (
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Şifre Tekrarı"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry={!showPassword}
          />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={16} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSwitchMode = () => (
    <View style={styles.switchContainer}>
      <Text style={styles.switchText}>
        {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
      </Text>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchButton}>
          {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderGuestAccess = () => (
    <TouchableOpacity
      style={styles.guestButton}
      onPress={() => {
        // Misafir olarak devam et - authentication olmadan ana uygulamaya git
        if (onGuestContinue) {
          onGuestContinue();
        }
      }}
    >
      <Text style={styles.guestButtonText}>Misafir Olarak Devam Et</Text>
    </TouchableOpacity>
  );

  const renderBenefits = () => (
    <View style={styles.benefitsContainer}>
      <Text style={styles.benefitsTitle}>
        {isLogin ? 'Giriş Yapmanın Avantajları:' : 'Üye Olmanın Avantajları:'}
      </Text>
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Ionicons name="heart" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Kuponları favorilere ekle</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="notifications" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Kişisel bildirimler al</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="analytics" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Tasarruf istatistiklerini gör</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="star" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Size özel öneriler</Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="pricetag" size={40} color="#2196F3" />
          </View>
          <Text style={styles.appName}>KuponCepte</Text>
          <Text style={styles.appTagline}>En iyi kuponlar, cebinizde</Text>
        </View>

        {renderForm()}
        {renderSwitchMode()}
        {renderGuestAccess()}
        {renderBenefits()}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#FF4444',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  switchButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  guestButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  guestButtonText: {
    fontSize: 14,
    color: '#666',
  },
  benefitsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
});
