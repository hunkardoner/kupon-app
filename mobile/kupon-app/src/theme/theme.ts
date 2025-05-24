// src/theme/theme.ts
export interface AppTheme {
  colors: {
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
    gray: string;
    warning?: string;
    accent?: string;
    surface?: string;
    shadow?: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    small: number;
    medium: number;
    large: number;
  };
  typography: {
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      small: number;
      medium: number;
      large: number;
      xxxl: number;
    };
    weights: {
      normal: '400';
      medium: '500';
      semiBold: '600';
      bold: '700';
    };
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
    };
    subtitle: {
      fontSize: number;
    };
    caption: {
      fontSize: number;
    };
  };
  borders: {
    radius: {
      sm: number;
      md: number;
      lg: number;
      full: number;
      small: number;
      medium: number;
      large: number;
    };
    width: {
      thin: number;
      medium: number;
      thick: number;
    };
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
    small: number;
    medium: number;
    large: number;
  };
}

export const lightTheme: AppTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    card: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#8E8E93',
    warning: '#FF9500',
    accent: '#FF2D92',
    surface: '#FFFFFF',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
      small: 14,
      medium: 16,
      large: 18,
      xxxl: 32,
    },
    weights: {
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
    h1: {
      fontSize: 32,
      fontWeight: '700',
    },
    h2: {
      fontSize: 28,
      fontWeight: '700',
    },
    h3: {
      fontSize: 20,
      fontWeight: '700',
    },
    body: {
      fontSize: 15,
    },
    subtitle: {
      fontSize: 16,
    },
    caption: {
      fontSize: 12,
    },
  },
  borders: {
    radius: {
      small: 4,
      medium: 8,
      large: 12,
      full: 9999,
      sm: 4,
      md: 8,
      lg: 12,
    },
    width: {
      thin: 1,
      medium: 2,
      thick: 4,
    },
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
    small: 4,
    medium: 8,
    large: 12,
  },
};

export const darkTheme: AppTheme = {
  ...lightTheme,
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#4d4d4d',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#8E8E93',
    warning: '#FF9F0A',
    accent: '#FF375F',
    surface: '#FFFFFF',
    shadow: '#000000',
  },
};
