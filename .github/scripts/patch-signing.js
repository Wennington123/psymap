const fs = require('fs');

const gradlePath = 'android/app/build.gradle';
const original = fs.readFileSync(gradlePath, 'utf8');
const marker = '// CI_RELEASE_SIGNING';

if (original.includes(marker)) {
  console.log('Signing config already present, skipping.');
  process.exit(0);
}

// Credentials come from CI secrets (environment variables), never from the repo.
const storeFile = process.env.KEYSTORE_FILE || '../../android-keystore.jks';
const storePassword = process.env.KEYSTORE_PASSWORD;
const keyAlias = process.env.KEY_ALIAS;
const keyPassword = process.env.KEY_PASSWORD;

if (!storePassword || !keyAlias || !keyPassword) {
  console.error(
    'Missing signing environment variables: set KEYSTORE_PASSWORD, KEY_ALIAS and KEY_PASSWORD.',
  );
  process.exit(1);
}

const requirement = `
${marker}
android {
    signingConfigs {
        release {
            storeFile file('${storeFile}')
            storePassword '${storePassword}'
            keyAlias '${keyAlias}'
            keyPassword '${keyPassword}'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
`;

fs.writeFileSync(gradlePath, original + requirement);
console.log('Release signing config appended.');
