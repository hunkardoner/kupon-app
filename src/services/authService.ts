// API Configuration - temporary fix for import issues
const API_BASE_URL = 'https://kupon.com/api';
const API_KEY = 'your-api-key-here';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  token?: string;
  user?: any;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        // API'den gelen hata mesajını kullan, yoksa genel bir mesaj göster
        const errorMessage = jsonResponse.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Backend'den gelen yeni yanıttan eski ApiResponse formatına dönüştür
      return {
        success: true,
        data: jsonResponse.data,
        token: jsonResponse.token,
        message: jsonResponse.message || 'İşlem başarılı',
      };

    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error.message || 'Ağ hatası oluştu',
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.makeRequest('/logout', {
      method: 'POST',
    });
  }

  async getUser(): Promise<ApiResponse<any>> {
    return this.makeRequest('/user', {
      method: 'GET',
    });
  }

  async updatePreferences(preferences: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/user/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
}

export const authService = new AuthService();
