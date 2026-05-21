import { initializeApp, getApp, getApps } from 'firebase/app'
import {
  getAuth,
  initializeAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

let auth
if (typeof window !== 'undefined') {
  try {
    auth = getAuth(app)
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Failed to set persistence:', error)
    })
  } catch (error) {
    console.error('Failed to initialize auth:', error)
    auth = initializeAuth(app, { persistence: browserLocalPersistence })
  }
}

export { app, auth }

// Get messaging instance (only in browser with service worker)
export function getMessagingInstance() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      return getMessaging(app)
    } catch (error) {
      console.error('Failed to initialize messaging:', error)
      return null
    }
  }
  return null
}
