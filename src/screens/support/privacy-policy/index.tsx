import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';

interface PrivacyPolicyProps {
  navigation: any;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyProps> = ({ navigation }) => {
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
      <View style={styles.headerRight} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        alwaysBounceVertical={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Genel Bilgiler</Text>
          <Text style={styles.paragraph}>
            Bu Gizlilik Politikası, Kupon Uygulaması ("Uygulama") aracılığıyla toplanan kişisel verilerinizin 
            nasıl işlendiği, saklandığı ve korunduğu hakkında bilgi vermektedir. 6698 sayılı Kişisel Verilerin 
            Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin korunması bizim için son derece önemlidir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Toplanan Veriler</Text>
          <Text style={styles.paragraph}>
            Uygulamayı kullanırken aşağıdaki veriler toplanabilir:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Ad, soyad ve e-posta adresi</Text>
            <Text style={styles.listItem}>• Kullanıcı tercihleri ve favoriler</Text>
            <Text style={styles.listItem}>• Uygulama kullanım bilgileri</Text>
            <Text style={styles.listItem}>• Cihaz bilgileri (model, işletim sistemi)</Text>
            <Text style={styles.listItem}>• Konum bilgileri (opsiyonel)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Verilerin Kullanım Amacı</Text>
          <Text style={styles.paragraph}>
            Toplanan kişisel veriler aşağıdaki amaçlarla kullanılır:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Kullanıcı hesabının oluşturulması ve yönetimi</Text>
            <Text style={styles.listItem}>• Kişiselleştirilmiş kupon önerileri sunma</Text>
            <Text style={styles.listItem}>• Uygulama performansının iyileştirilmesi</Text>
            <Text style={styles.listItem}>• Müşteri destek hizmetlerinin sağlanması</Text>
            <Text style={styles.listItem}>• Yasal yükümlülüklerin yerine getirilmesi</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Veri Güvenliği</Text>
          <Text style={styles.paragraph}>
            Kişisel verileriniz, endüstri standardı güvenlik önlemleri ile korunmaktadır. 
            Verileriniz şifrelenir ve güvenli sunucularda saklanır. Yetkisiz erişimlere karşı 
            teknik ve idari tedbirler alınmıştır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Veri Paylaşımı</Text>
          <Text style={styles.paragraph}>
            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. 
            Kupon sağlayıcı markalarla sadece anonim istatistiksel veriler paylaşılabilir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Kullanıcı Hakları</Text>
          <Text style={styles.paragraph}>
            KVKK kapsamında aşağıdaki haklara sahipsiniz:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</Text>
            <Text style={styles.listItem}>• İşlenen verileriniz hakkında bilgi talep etme</Text>
            <Text style={styles.listItem}>• Verilerin düzeltilmesini veya silinmesini isteme</Text>
            <Text style={styles.listItem}>• Veri işlemeye itiraz etme</Text>
            <Text style={styles.listItem}>• Veri taşınabilirliği hakkı</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Çerezler (Cookies)</Text>
          <Text style={styles.paragraph}>
            Uygulama deneyiminizi iyileştirmek için çerezler kullanılabilir. 
            Bu çerezler, tercihleri hatırlamak ve analitik veriler toplamak için kullanılır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Değişiklikler</Text>
          <Text style={styles.paragraph}>
            Bu Gizlilik Politikası zaman zaman güncellenebilir. 
            Önemli değişiklikler uygulama içinde bildirilecektir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. İletişim</Text>
          <Text style={styles.paragraph}>
            Gizlilik Politikası ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>E-posta: privacy@kuponcepte.com.tr</Text>
            <Text style={styles.contactText}>Telefon: +90 (212) 123 45 67</Text>
          </View>
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
