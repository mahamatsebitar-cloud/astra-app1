import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneFrame from "./components/layout/PhoneFrame.jsx";
import { AuthProvider, useAuthContext } from './context/AuthContext';
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
import NoeudLunaire from './screens/NoeudLunaire'; // ← Ajouté

const AppContent = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (isAuthenticated) {
      if (profile && (profile.onboarding_completed || profile.signe_solaire)) {
        const gatewayScreens = ['loading', 'splash', 'login', 'onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
        
        if (gatewayScreens.includes(currentScreen)) {
          setCurrentScreen('home');
          setActiveTab('home');
        }
      } 
      else {
        const onboardingScreens = ['onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
        if (!onboardingScreens.includes(currentScreen)) {
          console.log("🛠️ Profil incomplet -> Redirection vers début Onboarding");
          setCurrentScreen('onb1');
        }
      }
    } else {
      if (currentScreen !== 'splash' && currentScreen !== 'login') {
        setCurrentScreen('splash');
      }
    }
  }, [authLoading, profileLoading, isAuthenticated, profile, currentScreen]);

  // Mis à jour pour inclure noeud_lunaire dans les écrans avec navigation
  const showNav = useMemo(() => {
    return ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire'].includes(currentScreen);
  }, [currentScreen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
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
        return <Login onSuccess={() => {}} />;
      case 'onb1':
        return <Onboarding1 onNext={() => setCurrentScreen('onb2')} />;
      case 'onb2':
        return <Onboarding2 onNext={() => setCurrentScreen('onb3')} />;
      case 'onb3':
        return <Onboarding3 onFinish={() => setCurrentScreen('loading_theme')} />;
      case 'loading_theme':
        return (
          <LoadingTheme 
            onComplete={() => setCurrentScreen('onbInvit')} 
            signeSolaire={profile?.signe_solaire}
          />
        );
      case 'onbInvit':
        return (
          <OnboardingInvit 
            onFinish={() => handleTabChange('home')} 
            userNom={profile?.nom || "Voyageur"}
            signeSolaire={profile?.signe_solaire || "Lion"}
          />
        );
      case 'home':
        return <Home onHoroscope={() => handleTabChange('horoscope')} onProfil={() => handleTabChange('profil')} />;
      case 'natal':
        return <NatalChart onSeeNoeuds={() => setCurrentScreen('noeud_lunaire')} />; // ← Passé la prop
      case 'noeud_lunaire':
        return <NoeudLunaire onBack={() => setCurrentScreen('natal')} />; // ← Ajouté
      case 'horoscope':
        return <Horoscope onBack={() => handleTabChange('home')} />;
      case 'compat':
        return <Compatibilite />;
      case 'profil':
        return <Profil onLogout={() => setCurrentScreen('splash')} />;
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
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;