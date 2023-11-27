import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'e-commerce-basic',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
