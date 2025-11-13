import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Camp Cafe',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 4000,
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
