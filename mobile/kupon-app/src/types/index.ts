// src/types/index.ts

export interface Category {
  id: string | number; // API'nizin ID formatına göre string veya number olabilir
  name: string;
  // İhtiyaç duyabileceğiniz diğer kategori özellikleri
  // description?: string;
  // image?: string;
}

export interface Brand {
  id: string | number;
  name: string;
  logo?: string;
}

export interface Coupon {
  id: string | number;
  code: string;
  description: string;
  brand?: Brand; // Kupon bir markaya ait olabilir
  category?: Category; // Kupon bir kategoriye ait olabilir
  end_date?: string; // Tarih formatınıza göre string veya Date
}

// Diğer genel tipler buraya eklenebilir
