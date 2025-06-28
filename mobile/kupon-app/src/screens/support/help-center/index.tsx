import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';

interface HelpCenterProps {
  navigation: any;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  isExpanded: boolean;
}

interface SupportForm {
  subject: string;
  description: string;
}

const HelpCenterScreen: React.FC<HelpCenterProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportForm, setSupportForm] = useState<SupportForm>({
    subject: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: 'Kupon uygulaması nasıl çalışır?',
      answer: 'Uygulamamızda markalardan aldığımız kuponları sizlerle paylaşıyoruz. Favori kuponlarınızı seçip, mağaza linkine tıklayarak indirimleri kullanabilirsiniz.',
      isExpanded: false,
    },
    {
      id: 2,
      question: 'Kuponlar nasıl kullanılır?',
      answer: 'Kupon detay sayfasında "Kuponu Kullan" butonuna tıklayarak doğrudan mağazaya yönlendirilirsiniz. Kupon kodu varsa otomatik olarak uygulanır.',
      isExpanded: false,
    },
    {
      id: 3,
      question: 'Kuponların geçerlilik süresi var mı?',
      answer: 'Evet, her kuponun geçerlilik süresi vardır. Bu süre kupon detayında gösterilir. Süresi dolan kuponlar otomatik olarak pasif hale gelir.',
      isExpanded: false,
    },
    {
      id: 4,
      question: 'Favori kuponları nasıl eklerim?',
      answer: 'Herhangi bir kuponun sağ üst köşesindeki kalp ikonuna tıklayarak favorilere ekleyebilirsiniz. Favorilerinize profil sayfasından erişebilirsiniz.',
      isExpanded: false,
    },
    {
      id: 5,
      question: 'Bildirimler nasıl ayarlanır?',
      answer: 'Profil sayfasından bildirim ayarlarınızı değiştirebilirsiniz. Yeni kuponlar, favorileriniz ve özel teklifler için bildirim alabilirsiniz.',
      isExpanded: false,
    },
    {
      id: 6,
      question: 'Hesabım nasıl silinir?',
      answer: 'Hesabınızı silmek için profil sayfasından "Hesabı Sil" seçeneğini kullanabilir veya destek ekibimizle iletişime geçebilirsiniz.',
      isExpanded: false,
    },
    {
      id: 7,
      question: 'Teknik sorun yaşıyorum, ne yapmalıyım?',
      answer: 'Teknik sorunlar için önce uygulamayı yeniden başlatmayı deneyin. Sorun devam ederse, aşağıdaki "Soru Sor" butonu ile bize ulaşabilirsiniz.',
      isExpanded: false,
    },
    {
      id: 8,
      question: 'Kuponlar ücretsiz mi?',
      answer: 'Evet, tüm kuponlar tamamen ücretsizdir. Uygulamamızı indirmek ve kuponları kullanmak için herhangi bir ücret ödemeniz gerekmez.',
      isExpanded: false,
    },
    {
      id: 9,
      question: 'Yeni markalar nasıl eklenir?',
      answer: 'Sürekli olarak yeni markalarla anlaşmalar yapıyoruz. Belirli bir markanın kuponlarını görmek istiyorsanız, bizimle iletişime geçerek talebinizi iletebilirsiniz.',
      isExpanded: false,
    },
    {
      id: 10,
      question: 'Gizlilik politikası nedir?',
      answer: 'Kişisel verilerinizin korunması bizim için önemlidir. Detaylı bilgi için profil sayfasından "Gizlilik Politikası" bölümünü inceleyebilirsiniz.',
      isExpanded: false,
    },
  ]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Yardım Merkezi</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const toggleFaq = (id: number) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq
    ));
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateSupportForm = (): boolean => {
    if (!supportForm.subject.trim()) {
      Alert.alert('Hata', 'Lütfen konu başlığı girin');
      return false;
    }
    if (!supportForm.description.trim()) {
      Alert.alert('Hata', 'Lütfen sorunuzu detaylı olarak açıklayın');
      return false;
    }
    return true;
  };

  const handleSupportSubmit = async () => {
    if (!validateSupportForm()) return;

    setLoading(true);
    try {
      // TODO: Resend.com API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Başarılı',
        'Sorunuz başarıyla gönderildi. Destek ekibimiz en kısa sürede size dönüş yapacak.',
        [
          {
            text: 'Tamam',
            onPress: () => setSupportForm({ subject: '', description: '' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Soru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+902121234567');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@kuponapp.com');
  };

  const renderFaqItem = (faq: FAQ) => (
    <View key={faq.id} style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => toggleFaq(faq.id)}
      >
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons
          name={faq.isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {faq.isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCallSupport}>
              <Ionicons name="call" size={24} color="#2196F3" />
              <Text style={styles.actionText}>Telefon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleEmailSupport}>
              <Ionicons name="mail" size={24} color="#2196F3" />
              <Text style={styles.actionText}>E-posta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('Contact')}
            >
              <Ionicons name="chatbubble" size={24} color="#2196F3" />
              <Text style={styles.actionText}>İletişim</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Sorunuzu arayın..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ List */}
        <View style={styles.faqSection}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(renderFaqItem)
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.noResultsText}>Aradığınız soruyu bulamadık</Text>
              <Text style={styles.noResultsSubtext}>
                Aşağıdaki "Soru Sor" butonu ile bize ulaşabilirsiniz
              </Text>
            </View>
          )}
        </View>

        {/* Ask Question Form */}
        <View style={styles.askQuestionSection}>
          <Text style={styles.sectionTitle}>Sorunuz Var mı?</Text>
          <Text style={styles.sectionSubtitle}>
            Aradığınız cevabı bulamadıysanız, bize doğrudan soru sorabilirsiniz.
          </Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Konu</Text>
              <TextInput
                style={styles.input}
                placeholder="Sorunuzun konusunu girin"
                value={supportForm.subject}
                onChangeText={(text) => setSupportForm(prev => ({ ...prev, subject: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Sorunuzu detaylı olarak açıklayın"
                value={supportForm.description}
                onChangeText={(text) => setSupportForm(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSupportSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="#fff" style={styles.submitIcon} />
                  <Text style={styles.submitButtonText}>Soru Gönder</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenterScreen;
