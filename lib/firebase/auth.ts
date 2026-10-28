import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signOut as fbSignOut,
  GoogleAuthProvider,
  type User,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

GoogleSignin.configure({
  webClientId: (Constants.expoConfig?.extra?.googleWebClientId as string) || '',
});

const authInstance = getAuth();

export function initAuth(onUser: (u: User | null) => void, onReady: () => void): () => void {
  return onAuthStateChanged(authInstance, (u) => {
    onUser(u);
    onReady();
  });
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const result = await GoogleSignin.signIn();
    if (result.type !== 'success') return null;
    const idToken = result.data?.idToken;
    if (!idToken) return null;
    const credential = GoogleAuthProvider.credential(idToken);
    const { user: fbUser } = await signInWithCredential(authInstance, credential);
    return fbUser;
  } catch (e) {
    console.warn('Google sign-in failed', e);
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
  await fbSignOut(authInstance);
}
