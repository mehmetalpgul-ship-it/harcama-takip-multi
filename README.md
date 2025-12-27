```markdown
# harcama-takip-multi

Mobil Harcama Takip Uygulaması (Expo + React Native + TypeScript + Firebase)

Özet:
- MVP: email/password auth, gelir/gider ekleme (TRY, USD, EUR), aylık rapor (her para birimi için ayrı toplam).
- Teknolojiler: Expo (managed), React Native, TypeScript, Firebase Auth + Firestore, React Native Paper (Material UI).

Kurulum (lokal)
1. Repo oluştur ve klonla:
   - GitHub'da `harcama-takip-multi` isimli repo oluştur.
   - Yerel:
     git clone <repo-url>
     cd harcama-takip-multi

2. Node & Expo:
   - Node.js v16+ önerilir.
   - Expo CLI (isteğe bağlı): npm install -g expo-cli

3. Paketleri yükle:
   yarn install
   veya
   npm install

4. Firebase projesi oluştur:
   - https://console.firebase.google.com/ adresinden yeni proje oluştur.
   - Authentication > Sign-in method > Email/Password etkinleştir.
   - Firestore Database oluştur (location seç).
   - Proje ayarlarından (SDK config) web app için config bilgilerini al (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

5. Firebase config ekle:
   - `src/config/firebase.ts` dosyasındaki placeholder'ları kendi config'inle değiştir.

6. Firestore security rules (başlangıç önerisi):
   ```rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /transactions/{txId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```

7. Başlat:
   expo start
   - Expo Go ile ya da emulator/physical device ile çalıştır.

Notlar / Sonraki adımlar:
- İstersen döviz çevirme (tüm işlemleri tek baz paraya dönüştürme) ekleyebilirim (harici döviz kuru API'si gerekli).
- Google Sign-In istersen eklemeyi yaparım (ek yapılandırma gerektirir).

Eğer hazırsan, reponu oluştur ve bana haber ver; istersen ben de repo oluşturup tüm dosyaları buraya zip/commit içeriği olarak göndereyim.
```