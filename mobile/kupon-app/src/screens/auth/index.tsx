import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { socialAuthService } from '../../services/socialAuthService';
import * as AppleAuthentication from 'expo-apple-authentication';
import { styles } from './style';

interface AuthScreenProps {
  navigation?: any;
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
  const { login, register, googleLogin, appleLogin, isLoading, error } = useAuth();

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

  const handleGoogleSignIn = async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await socialAuthService.signInWithGoogleWeb();
        if (result && result.accessToken) {
          await googleLogin(result.accessToken);
        }
      } else {
        const result = await socialAuthService.signInWithGoogle();
        if (result && result.type === 'success') {
          // Use ID token for backend verification if available
          if (result.data.idToken) {
            await googleLogin(result.data.idToken);
          } else if (result.data.serverAuthCode) {
            // Fallback to server auth code
            await googleLogin(result.data.serverAuthCode);
          } else {
            Alert.alert('Hata', 'Google giriş bilgileri alınamadı');
          }
        } else {
          Alert.alert('Hata', 'Google giriş başarısız');
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Hata', 'Google ile giriş sırasında hata oluştu');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await socialAuthService.signInWithApple();
      if (result) {
        const fullName = result.fullName 
          ? `${result.fullName.givenName || ''} ${result.fullName.familyName || ''}`.trim()
          : undefined;
        
        await appleLogin(
          result.identityToken,
          result.user,
          result.email,
          fullName
        );
      }
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      if (error.code !== 'ERR_CANCELED') {
        Alert.alert('Hata', 'Apple ile giriş sırasında hata oluştu');
      }
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

  const renderSocialLogin = () => (
    <View style={styles.socialLoginContainer}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>veya</Text>
        <View style={styles.divider} />
      </View>
      
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleButtonText}>Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.appleButton}
            onPress={handleAppleSignIn}
            disabled={isLoading}
          >
            <Ionicons name="logo-apple" size={20} color="white" />
            <Text style={styles.appleButtonText}>Apple ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
          </TouchableOpacity>
        )}
      </View>
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
        {renderSocialLogin()}
        {renderSwitchMode()}
        {renderGuestAccess()}
        {renderBenefits()}
      </View>
    </KeyboardAvoidingView>
  );
}

export default AuthScreen;
