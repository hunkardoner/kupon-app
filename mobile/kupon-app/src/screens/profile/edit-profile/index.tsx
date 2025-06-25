import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { userAPI } from '../../../api/index';
import { styles } from './style';
interface EditProfileProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.name.trim()) {
        Alert.alert('Hata', 'Ad soyad boş bırakılamaz');
        return;
      }

      if (!formData.email.trim()) {
        Alert.alert('Hata', 'E-posta boş bırakılamaz');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
        return;
      }

      // Update profile
      await userAPI.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
      });

      // Refresh user data
      await refreshUser();

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Profil Düzenle</Text>
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#2196F3" />
        ) : (
          <Text style={styles.saveButtonText}>Kaydet</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderProfileImage = () => (
    <View style={styles.profileImageSection}>
      <View style={styles.profileImageContainer}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultProfileImage}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
        )}
        <TouchableOpacity style={styles.changePhotoButton}>
          <Ionicons name="camera" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>
      <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ad Soyad</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Adınızı ve soyadınızı girin"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>E-posta</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="E-posta adresinizi girin"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Telefon (Opsiyonel)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Telefon numaranızı girin"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Hakkında (Opsiyonel)</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            placeholder="Kendiniz hakkında kısa bir açıklama yazın"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileImage()}
        {renderForm()}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
