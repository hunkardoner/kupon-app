import { Platform } from 'react-native';
import { GoogleSignin, statusCodes, User, SignInResponse } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

interface AppleUserInfo {
  identityToken: string;
  fullName?: {
    givenName?: string | null;
    familyName?: string | null;
  };
  email?: string;
  user: string;
}

class SocialAuthService {
  constructor() {
    this.configureGoogleSignIn();
  }

  private configureGoogleSignIn() {
    try {
      GoogleSignin.configure({
        webClientId: '647075040650-i83qb16u0i1ptu1f0idtl4q5dqmdm0ol.googleusercontent.com', // Web client ID
        iosClientId: '647075040650-6lrv93le5hvr78qdi6c7e73k2mbbpb1r.googleusercontent.com', // iOS client ID (optional)
        scopes: ['profile', 'email'],
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        profileImageSize: 120,
      });
    } catch (error) {
      console.error('Google SignIn configuration error:', error);
    }
  }

  async signInWithGoogle(): Promise<SignInResponse | null> {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Get user info
      const userInfo = await GoogleSignin.signIn();
      
      console.log('Google Sign-In Success:', userInfo);
      
      return userInfo;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Some other error happened:', error);
      }
      
      throw error;
    }
  }

  async signInWithApple(): Promise<AppleUserInfo | null> {
    try {
      // Check if Apple Authentication is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      
      if (!isAvailable) {
        throw new Error('Apple Authentication is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Apple Sign-In Success:', credential);

      if (credential.identityToken) {
        return {
          identityToken: credential.identityToken,
          fullName: credential.fullName ? {
            givenName: credential.fullName.givenName,
            familyName: credential.fullName.familyName,
          } : undefined,
          email: credential.email || undefined,
          user: credential.user,
        };
      } else {
        throw new Error('No identity token received from Apple');
      }
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      
      if (error.code === 'ERR_CANCELED') {
        console.log('User cancelled the sign-in flow');
      } else {
        console.log('Apple Sign-In error:', error.message);
      }
      
      throw error;
    }
  }

  async signOut() {
    try {
      // Sign out from Google
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.log('Google sign out error:', error);
      }
      
      console.log('Social sign-out successful');
    } catch (error) {
      console.error('Social sign-out error:', error);
    }
  }

  async getCurrentGoogleUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch (error) {
      console.log('No current Google user:', error);
      return null;
    }
  }

  // For web platforms, we can use expo-auth-session
  async signInWithGoogleWeb() {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: '647075040650-i83qb16u0i1ptu1f0idtl4q5dqmdm0ol.googleusercontent.com',
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Token,
        redirectUri: AuthSession.makeRedirectUri(),
        extraParams: {
          nonce: await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            Math.random().toString(),
            { encoding: Crypto.CryptoEncoding.HEX }
          ),
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      console.log('Google Web Auth Result:', result);

      if (result.type === 'success') {
        const { access_token } = result.params;
        
        // Get user info from Google API
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
        );
        const userInfo = await userInfoResponse.json();
        
        return {
          user: {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            photo: userInfo.picture,
          },
          accessToken: access_token,
          idToken: '', // Not available in this flow
        };
      }
      
      return null;
    } catch (error) {
      console.error('Google Web Auth Error:', error);
      throw error;
    }
  }
}

export const socialAuthService = new SocialAuthService();
