import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneFrame from "./components/layout/PhoneFrame.jsx";
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { useProfile } from './hooks/useProfile';
import ConsentBanner from './components/ui/ConsentBanner';
import { findUserByShareToken, sendFriendRequest } from './services/friendService';

// Screens
import Splash from './screens/Splash';
import Login from './screens/Login';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import Onboarding3 from './screens/Onboarding3';
import LoadingTheme from './screens/LoadingTheme';
import OnboardingInvit from './screens/OnboardingInvit'; 
import Home from './screens/Home';
import NatalChart from './screens/NatalChart';
import Horoscope from './screens/Horoscope';
import Compatibilite from './screens/Compatibilite';
import Profil from './screens/Profil';
import NoeudLunaire from './screens/NoeudLunaire';
import Abonnement from './screens/Abonnement';

// Firebase pour les notifications
import { saveToken } from './services/notificationService';

const PUBLIC_SCREENS = ['splash', 'login', 'onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
const ONBOARDING_SCREENS = ['onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
const PROTECTED_SCREENS = ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire', 'abonnement'];

const AppContent = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [onboardingData, setOnboardingData] = useState({
    dateNaissance: '',
    heure: '12:00',
    ville: 'Paris, France'
  });
  
  const scrollRef = useRef(null);

  // ━━━ GESTION LIEN DE PARTAGE /invite/TOKEN ━━━
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/invite\/([a-f0-9]+)/);
    if (match) {
      const token = match[1];
      localStorage.setItem('astra_invite_token', token);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    const processInvite = async () => {
      const token = localStorage.getItem('astra_invite_token');
      if (!token || !user?.id) return;
      localStorage.removeItem('astra_invite_token');
      const { data: inviteur } = await findUserByShareToken(token);
      if (!inviteur || inviteur.id === user.id) return;
      await sendFriendRequest(user.id, inviteur.id);
      setCurrentScreen('compat');
    };
    if (isAuthenticated) processInvite();
  }, [isAuthenticated, user?.id]);

  // ━━━ INITIALISATION NOTIFICATIONS PUSH ━━━
  useEffect(() => {
    if (!user?.id) return;
    
    const initNotifications = async () => {
      try {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BElNVxN3gT4JmMNx4Gq5YdOsl_9LJHnFJP1Y2M3N6K7p8QrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234'
              });
            }
            
            if (subscription) {
              const token = subscription.endpoint;
              await saveToken(user.id, token);
              console.log('✅ Notification token saved');
            }
          }
        }
      } catch (err) {
        console.warn('Notification init:', err);
      }
    };

    // Demande la permission après 3 secondes (pas au chargement)
    const timer = setTimeout(initNotifications, 3000);
    return () => clearTimeout(timer);
  }, [user?.id]);

  // Scroll Reset à chaque changement d'écran
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
      const timer = setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Navigation intelligente
  useEffect(() => {
    console.log('NAV DEBUG:', { authLoading, profileLoading, isAuthenticated, hasProfile: !!profile, currentScreen });
    
    if (authLoading || profileLoading) return;

    // FORÇAGE : si on est sur 'loading', sortir immédiatement
    if (currentScreen === 'loading') {
      if (!isAuthenticated) {
        setCurrentScreen('splash');
      } else if (profile && (profile.onboarding_completed || profile.signe_solaire)) {
        setCurrentScreen('home');
        setActiveTab('home');
      } else {
        setCurrentScreen('onb1');
      }
      return;
    }

    if (isAuthenticated && profile && (profile.onboarding_completed || profile.signe_solaire)) {
      if (PUBLIC_SCREENS.includes(currentScreen)) {
        setCurrentScreen('home');
        setActiveTab('home');
      }
      return;
    }

    if (isAuthenticated && (!profile || (!profile.onboarding_completed && !profile.signe_solaire))) {
      if (!ONBOARDING_SCREENS.includes(currentScreen)) {
        setCurrentScreen('onb1');
      }
      return;
    }

    if (!isAuthenticated) {
      if (PROTECTED_SCREENS.includes(currentScreen)) {
        setCurrentScreen('splash');
      }
      return;
    }
  }, [authLoading, profileLoading, isAuthenticated, profile, currentScreen]);

  const showNav = useMemo(() => {
    return ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire'].includes(currentScreen);
  }, [currentScreen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  const handleNavigateToAbonnement = (fromScreen) => {
    setPreviousScreen(fromScreen || currentScreen);
    setCurrentScreen('abonnement');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="h-screen w-screen bg-night flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <div className="text-gold font-serif italic animate-pulse tracking-[0.2em] text-[10px] uppercase">
            Consultation des éphémérides
          </div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Splash onStart={() => setCurrentScreen('onb1')} onLogin={() => setCurrentScreen('login')} />;
      case 'login':
        return <Login onSuccess={() => { setCurrentScreen('home'); setActiveTab('home'); }} />;
      case 'onb1':
        return <Onboarding1 onNext={(date) => { setOnboardingData(prev => ({...prev, dateNaissance: date})); setCurrentScreen('onb2'); }} />;
      case 'onb2':
        return <Onboarding2 onNext={(heure) => { setOnboardingData(prev => ({...prev, heure})); setCurrentScreen('onb3'); }} />;
      case 'onb3':
        return <Onboarding3 dateNaissance={onboardingData.dateNaissance} heure={onboardingData.heure} onFinish={() => setCurrentScreen('loading_theme')} />;
      case 'loading_theme':
        return <LoadingTheme onComplete={() => setCurrentScreen('onbInvit')} signeSolaire={profile?.signe_solaire} />;
      case 'onbInvit':
        return <OnboardingInvit onFinish={() => { setCurrentScreen('home'); setActiveTab('home'); }} userNom={profile?.nom || "Voyageur"} signeSolaire={profile?.signe_solaire || "Lion"} />;
      case 'home':
        return <Home onHoroscope={() => handleTabChange('horoscope')} onProfil={() => handleTabChange('profil')} />;
      case 'natal':
        return <NatalChart onSeeNoeuds={() => setCurrentScreen('noeud_lunaire')} onUpgrade={() => handleNavigateToAbonnement('natal')} />;
      case 'noeud_lunaire':
        return <NoeudLunaire onBack={() => setCurrentScreen('natal')} onUpgrade={() => handleNavigateToAbonnement('noeud_lunaire')} />;
      case 'horoscope':
        return <Horoscope onBack={() => handleTabChange('home')} onUpgrade={() => handleNavigateToAbonnement('horoscope')} />;
      case 'compat':
        return <Compatibilite onUpgrade={() => handleNavigateToAbonnement('compat')} />;
      case 'profil':
        return <Profil onLogout={() => setCurrentScreen('splash')} onNavigate={(screen) => screen === 'abonnement' && handleNavigateToAbonnement('profil')} />;
      case 'abonnement':
        return <Abonnement onBack={() => setCurrentScreen(previousScreen)} onSubscribed={() => setCurrentScreen('home')} />;
      default:
        return <Home onHoroscope={() => handleTabChange('horoscope')} onProfil={() => handleTabChange('profil')} />;
    }
  };

  return (
    <PhoneFrame showNav={showNav} activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="relative h-full overflow-hidden bg-night">
        <AnimatePresence mode="wait">
          <motion.div key={currentScreen} ref={scrollRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-full overflow-y-auto"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
      <ConsentBanner />
    </PhoneFrame>
  );
};

const App = () => (
  <AuthProvider>
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  </AuthProvider>
);

export default App;