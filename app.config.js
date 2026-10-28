const flavor = process.env.FLAVOR || 'play';
const isFoss = flavor === 'foss';

const plugins = [
  'expo-router',
  'expo-asset',
  ['expo-notifications', { icon: './assets/icon.png', color: '#1a1a2e' }],
];

// Firebase / Google Sign-In só entram no build normal (Play). O flavor `foss`
// (F-Droid) exclui esses plugins e o google-services.json — necessário pela
// Inclusion Policy do F-Droid.
if (!isFoss) {
  plugins.push('@react-native-firebase/app');
  plugins.push('@react-native-google-signin/google-signin');
}

module.exports = {
  name: 'PsyMap',
  slug: 'psymap',
  version: '2.2.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'psymap',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a2e',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'org.psymap.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/favicon.png',
      backgroundColor: '#1a1a2e',
    },
    package: 'com.app.psymap',
    versionCode: 11,
    ...(isFoss ? {} : { googleServicesFile: './google-services.json' }),
  },
  plugins,
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    ...(isFoss
      ? {}
      : { googleWebClientId: '896785690367-kmvdjdabsrcjl4kmu1cgt4jkm9q8m7j7.apps.googleusercontent.com' }),
    flavor,
    eas: {
      projectId: 'b54c850c-9e85-43e4-8e45-fe9c0f41713b',
    },
  },
};
