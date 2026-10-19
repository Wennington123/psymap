# Setup Firebase + Build Offline (PsyMap)

## 1. Projeto Firebase (manual, no Console)

1. Crie um projeto em https://console.firebase.google.com (ex.: `psymap`).
2. **Adicionar app Android** — package: `com.app.psymap`.
3. **SHA-1**: registrar os fingerprints em Configurações do projeto → App Android.
   - Keystore de produção do repo:
     ```
     keytool -list -v -keystore android-keystore.jks
     ```
     (registrar o SHA-1 do alias de release)
   - Keystore de debug do ambiente local (para builds de dev):
     ```
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
     ```
4. Baixar **google-services.json** e colocar na **raiz do projeto** (ao lado do package.json).
5. **Authentication → Sign-in method** → ativar o provedor **Google**.
6. **Firestore** → criar database (modo produção).
7. Pegar o **Client ID Web** (oauth web na Google Cloud Console ou no `google-services.json`) e colocar em `app.json` → `extra.googleWebClientId` (substitui o placeholder `TODO_CLIENT_ID_WEB_DO_FIREBASE`).
8. Implantar as regras de `firestore.rules` (colar no console do Firestore em Rules, ou com Firebase CLI):
   ```
   npm i -g firebase-tools && firebase login && firebase deploy --only firestore:rules --project <project-id>
   ```
9. O índice composto do ranking (weekId ASC + xpWeek DESC) é sugerido automaticamente
   pelo console na primeira query — clicar em criar. (ou `firebase deploy --only firestore:indexes`)

## 2. Build offline (sem EAS)

O fluxo passa a ser nativo puro (Managed → Bare):

```bash
npm install                 # inclui deps nativas do Firebase
npx expo prebuild --clean   # gera /android a partir de app.json + plugins
cd android
./gradlew assembleDebug     # build de dev (instala o dev client no device)
./gradlew assembleRelease   # APK de produção
./gradlew bundleRelease     # AAB para a Play Store
```

### Assinatura (release)
Após o primeiro `prebuild`, configure a assinatura em `android/app/build.gradle`
usando o `android-keystore.jks` local (padrão key.properties):

1. Crie `android/key.properties`:
   ```
   storeFile=../../android-keystore.jks
   storePassword=...  (senha da keystore)
   keyAlias=<alias>
   keyPassword=...    (senha da key)
   ```
2. No `build.gradle`, carregar `key.properties` no signingConfig `release`.
   Como `prebuild --clean` regenera e sobrescreve o android/, o ideal é mover o `/android` para o repo (bare) após o primeiro prebuild e parar de usar `--clean`.

O `.easignore`/`.gitignore` que ignora a keystore pode impedir builds em CI — em CI local via GitLab runner, defina as variáveis de senha em vez de commitar o JSON.

### Testar
```bash
npx expo run:android --device   # build + install + dev client
```

## 3. GitLab CI (opcional)

O `.gitlab-ci.yml` atual só publica a pages de privacidade. Exemplo de job
para builds de APK em runner self-hosted (ou docker image com Android SDK):

```yaml
build:android:debug:
  stage: build
  image: cimg/android:2025.07-node  # node + android sdk + jdk17
  script:
    - npm ci --include=dev
    - npx expo prebuild --clean
    - cd android && ./gradlew assembleDebug
  artifacts:
    paths:
      - android/app/build/outputs/apk/debug/app-debug.apk
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

Nota: com SDK v26 do RN Firebase é necessário JDK 17/21 (JDK 25 do Linux host pode
falhar no Gradle 8.x embutido — usar JAVA_HOME apontando pra 17/21).

## 4. Assets importantes

| item | onde |
|---|---|
| `google-services.json` | raiz do projeto (precisa existir ANTES do prebuild) |
| `firestore.rules` | raiz — implantar no console |
| Web Client ID | `app.json` → `extra.googleWebClientId` |
| package principal | `com.app.psymap` |
