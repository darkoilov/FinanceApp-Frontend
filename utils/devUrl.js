import Constants from 'expo-constants';

export function devUrl() {
  return 'http://172.20.10.2:3000'
  // return Constants?.manifest2?.extra?.expoClient?.extra?.reactAppDevUrl || Constants?.manifest?.extra?.reactAppDevUrl
}
