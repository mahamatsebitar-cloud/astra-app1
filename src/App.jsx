import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneFrame from "./components/layout/PhoneFrame.jsx";
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { useProfile } from './hooks/useProfile';

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

// Écrans publics accessibles sans authentification
const PUBLIC_SCREENS = ['splash', 'login', 'onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
// Écrans de l'onboarding (pour éviter les boucles)
const ONBOARDING_SCREENS = ['onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
// Écrans protégés (nécessitent authentification + profil complet)
const PROTECTED_SCREENS = ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire', 'abonnement'];

const AppContent = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [activeTab, setActiveTab] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [onboardingData, setOnboardingData] = useState({
    dateNaissance: '',
    heure: '12:00',
    ville: 'Paris, France'
  });
  
  const scrollRef = useRef(null);

  // Scroll Reset à chaque changement d'écran — double sécurité
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
      // Double sécurité : après le rendu de l'animation
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo(0, 0);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Navigation intelligente : redirige selon l'état d'authentification
  useEffect(() => {
    if (authLoading || profileLoading) return;

    // CAS 1 : Utilisateur AUTHENTIFIÉ avec profil COMPLET
    if (isAuthenticated && profile && (profile.onboarding_completed || profile.signe_solaire)) {
      // Si on est sur un écran public ou d'onboarding → rediriger vers home
      if (PUBLIC_SCREENS.includes(currentScreen) || currentScreen === 'loading') {
        setCurrentScreen('home');
        setActiveTab('home');
      }
      // Sinon, laisser l'utilisateur sur son écran actuel (profil, horoscope, etc.)
      return;
    }

    // CAS 2 : Utilisateur AUTHENTIFIÉ mais profil INCOMPLET (en cours d'onboarding)
    if (isAuthenticated && (!profile || (!profile.onboarding_completed && !profile.signe_solaire))) {
      // Si on n'est PAS déjà dans l'onboarding → rediriger vers onb1
      if (!ONBOARDING_SCREENS.includes(currentScreen) && currentScreen !== 'loading') {
        setCurrentScreen('onb1');
      }
      // Si on est déjà dans l'onboarding → laisser continuer
      return;
    }

    // CAS 3 : Utilisateur NON AUTHENTIFIÉ
    if (!isAuthenticated) {
      // Si on est sur un écran protégé → rediriger vers splash
      if (PROTECTED_SCREENS.includes(currentScreen)) {
        setCurrentScreen('splash');
      }
      // Si on est déjà sur splash, login ou onboarding → laisser l'utilisateur tranquille
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

  if (authLoading || profileLoading || currentScreen === 'loading') {
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
        return <Login onSuccess={() => {
          setCurrentScreen('home');
          setActiveTab('home');
        }} />;
      case 'onb1':
        return <Onboarding1 onNext={(date) => {
          setOnboardingData(prev => ({...prev, dateNaissance: date}));
          setCurrentScreen('onb2');
        }} />;
      case 'onb2':
        return <Onboarding2 onNext={(heure) => {
          setOnboardingData(prev => ({...prev, heure}));
          setCurrentScreen('onb3');
        }} />;
      case 'onb3':
        return <Onboarding3 
          dateNaissance={onboardingData.dateNaissance}
          heure={onboardingData.heure}
          onFinish={() => setCurrentScreen('loading_theme')} 
        />;
      case 'loading_theme':
        return <LoadingTheme onComplete={() => setCurrentScreen('onbInvit')} signeSolaire={profile?.signe_solaire} />;
      case 'onbInvit':
        return <OnboardingInvit onFinish={() => {
          setCurrentScreen('home');
          setActiveTab('home');
        }} userNom={profile?.nom || "Voyageur"} signeSolaire={profile?.signe_solaire || "Lion"} />;
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
    <PhoneFrame
      showNav={showNav}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="relative h-full overflow-hidden bg-night">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            ref={scrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-full overflow-y-auto"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
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