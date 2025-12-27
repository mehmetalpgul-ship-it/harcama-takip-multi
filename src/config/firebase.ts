// Firebase init - Lütfen kendi config'inizi buraya yapıştırın.
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

let app: FirebaseApp | null = null;
export let auth: ReturnType<typeof getAuth>;
export let db: ReturnType<typeof getFirestore>;

export function initializeFirebase() {
  if (getApps().length === 0) {
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    try {
      // web için persistence; native side için bu hata verebilir ama MVP'de sorun değil
      enableIndexedDbPersistence(db);
    } catch (e) {
      console.log('Firestore persistence not enabled:', e);
    }
  } else {
    // Eğer daha önce başlatıldıysa export edip devam et
    // @ts-ignore
    auth = getAuth();
    // @ts-ignore
    db = getFirestore();
  }
}
