// src/constants/colors.ts

export interface AppColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  white: string;
  black: string;
  gray: string; // Gri renk eklendi
  // İhtiyaç duydukça daha fazla renk ekleyebilirsiniz
}

const COLORS: AppColors = {
  primary: '#6366F1', // Laravel projesindeki ana renkle uyumlu
  secondary: '#8B5CF6', // Laravel projesindeki ikincil renkle uyumlu
  background: '#F3F4F6', // Açık gri bir arkaplan
  card: '#FFFFFF',       // Kartların arkaplanı
  text: '#1F2937',        // Ana metin rengi (Koyu Gri)
  textSecondary: '#6B7280', // İkincil metin rengi (Orta Gri)
  border: '#E5E7EB',      // Kenarlıklar için açık gri
  error: '#EF4444',       // Hata mesajları için kırmızı
  success: '#10B981',     // Başarı mesajları için yeşil
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080', // Gri renk tanımı
};

export default COLORS;
