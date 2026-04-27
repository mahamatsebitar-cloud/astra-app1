import React, { useState, useEffect } from 'react';
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
import Home from './screens/Home';
import NatalChart from './screens/NatalChart';
import Horoscope from './screens/Horoscope';
import Compatibilite from './screens/Compatibilite';
import Profil from './screens/Profil';

const AppContent = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');

  // Synchronisation de l'écran initial avec redirection intelligente
  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (isAuthenticated) {
        // Option A : Si l'utilisateur n'a pas encore de données astro, on le force à l'onboarding
        if (profile && !profile.signe_solaire) {
          setCurrentScreen('onb1');
        } else {
          setCurrentScreen('home');
          setActiveTab('home');
        }
      } else {
        setCurrentScreen('splash');
      }
    }
  }, [authLoading, profileLoading, isAuthenticated, profile]);

  const navScreens = ['home', 'natal', 'horoscope', 'compat', 'profil'];
  const showNav = navScreens.includes(currentScreen);

  const screenVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  // Loader pendant la vérification de la session et du profil
  if (authLoading || profileLoading) {
    return (
      <div className="h-screen w-screen bg-night flex items-center justify-center">
        <div className="text-gold font-serif italic animate-pulse tracking-widest">
          Lecture des astres...
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <Splash
            onStart={() => setCurrentScreen('onb1')}
            onLogin={() => setCurrentScreen('login')}
          />
        );
      case 'login':
        return (
          <Login 
            onSuccess={() => {
              // Après login, on vérifie s'il faut faire l'onboarding ou aller au Home
              if (profile?.signe_solaire) {
                setCurrentScreen('home');
              } else {
                setCurrentScreen('onb1');
              }
            }} 
          />
        );
      case 'onb1':
        return <Onboarding1 onNext={() => setCurrentScreen('onb2')} />;
      case 'onb2':
        return <Onboarding2 onNext={() => setCurrentScreen('onb3')} />;
      case 'onb3':
        return <Onboarding3 onFinish={() => {
          setCurrentScreen('home');
          setActiveTab('home');
        }} />;
      case 'home':
        return (
          <Home
            onHoroscope={() => handleTabChange('horoscope')}
            onProfil={() => handleTabChange('profil')}
          />
        );
      case 'natal':
        return <NatalChart />;
      case 'horoscope':
        return <Horoscope onBack={() => handleTabChange('home')} />;
      case 'compat':
        return <Compatibilite />;
      case 'profil':
        return <Profil onLogout={() => setCurrentScreen('splash')} />;
      default:
        return (
          <div className="text-cream p-10 text-center font-serif italic">
            L'univers est en expansion...
          </div>
        );
    }
  };

  return (
    <PhoneFrame
      showNav={showNav}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="relative h-full overflow-y-auto custom-scrollbar bg-night">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={screenVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
};

// Wrapper principal pour injecter le contexte
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;