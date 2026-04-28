// src/App.jsx
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
import OnboardingInvit from './screens/OnboardingInvit'; 
import Home from './screens/Home';
import NatalChart from './screens/NatalChart';
import Horoscope from './screens/Horoscope';
import Compatibilite from './screens/Compatibilite';
import Profil from './screens/Profil';

const AppContent = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [activeTab, setActiveTab] = useState('home');

  // Logic de redirection sécurisée
  useEffect(() => {
    // 1. On attend impérativement la fin de tous les chargements
    if (authLoading || profileLoading) return;

    if (isAuthenticated) {
      const onboardingScreens = ['onb1', 'onb2', 'onb3', 'onbInvit'];
      
      // 2. Vérification du profil
      // Si le profil est absent OU si le signe solaire n'est pas renseigné
      if (!profile || !profile.signe_solaire) {
        
        // CORRECTION : On ne redirige vers ONB1 QUE si on n'est pas déjà dans le tunnel.
        // Cela évite de casser la navigation entre ONB3 et ONBInvit à cause du lag Supabase.
        if (!onboardingScreens.includes(currentScreen)) {
          console.log("🛠️ Profil incomplet -> Début du tunnel Onboarding");
          setCurrentScreen('onb1');
        }
      } 
      // 3. Si le profil est complet
      else {
        // Redirection vers Home seulement si on vient des écrans de "passage"
        const gatewayScreens = ['loading', 'splash', 'login'];
        if (gatewayScreens.includes(currentScreen)) {
          console.log("✅ Profil complet détecté -> Direction Accueil");
          setCurrentScreen('home');
          setActiveTab('home');
        }
      }
    } else {
      // 4. Non connecté -> Retour au Splash
      if (currentScreen !== 'splash' && currentScreen !== 'login') {
        setCurrentScreen('splash');
      }
    }
  }, [authLoading, profileLoading, isAuthenticated, profile, currentScreen]);

  // Définir quels écrans affichent la barre de navigation basse
  const showNav = useMemo(() => {
    return ['home', 'natal', 'horoscope', 'compat', 'profil'].includes(currentScreen);
  }, [currentScreen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  // Écran de chargement stabilisé
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
        return <Onboarding3 onFinish={() => setCurrentScreen('onbInvit')} />;
      case 'onbInvit':
        return <OnboardingInvit onFinish={() => handleTabChange('home')} />;
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