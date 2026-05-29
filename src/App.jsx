// src/App.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { useProfile } from './hooks/useProfile';
import ConsentBanner from './components/ui/ConsentBanner';
import { findUserByShareToken, sendFriendRequest } from './services/friendService';
import { initPushNotifications, getPendingDeepLink } from './lib/notifications';
import { NotificationToast } from './components/NotificationToast';
import PolitiqueConfidentialite from './screens/legal/PolitiqueConfidentialite';

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

const PUBLIC_SCREENS = ['splash', 'login', 'onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
const ONBOARDING_SCREENS = ['onb1', 'onb2', 'onb3', 'loading_theme', 'onbInvit'];
const PROTECTED_SCREENS = ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire', 'abonnement'];

// ─── ORDRE DES TABS POUR DIRECTION SLIDE ───
const TAB_ORDER = ['home', 'natal', 'compat', 'profil'];
const TAB_SCREENS = ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire'];

// ─── SCREENS QUI SONT DES "PUSH" (stack) ───
const STACK_SCREENS = ['horoscope', 'noeud_lunaire', 'abonnement'];

// ─── SCREENS OÙ LE BOUTON RETOUR QUITTE L'APP (racine de l'app) ───
const EXIT_SCREENS = ['splash', 'home'];

const AppContent = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(isAuthenticated ? user?.id : null);

  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [loginMode, setLoginMode] = useState('connexion');
  const [onboardingData, setOnboardingData] = useState({
    dateNaissance: '',
    heure: '12:00',
    ville: 'Paris, France'
  });

  // ─── DEEP LINK STATE ───
  const [deepLinkTarget, setDeepLinkTarget] = useState(null);

  const scrollRef = useRef(null);
  const [isInOnboarding, setIsInOnboarding] = useState(false);
  const [showingPolicy, setShowingPolicy] = useState(false);

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

  // ━━━ INIT PUSH NOTIFICATIONS ━━━
  useEffect(() => {
    if (isAuthenticated && Capacitor.isNativePlatform()) {
      initPushNotifications();
    }
  }, [isAuthenticated]);

  // ─── ÉCOUTE LE DEEP LINK (app déjà ouverte) ───
  useEffect(() => {
    const handleDeepLink = (event) => {
      const data = event.detail;
      console.log('🔗 Deep link event:', data);
      processDeepLink(data);
    };

    window.addEventListener('astra-deep-link', handleDeepLink);
    return () => window.removeEventListener('astra-deep-link', handleDeepLink);
  }, []);

  // ─── CHECK DEEP LINK AU CHARGEMENT (app fermée → clique notif) ───
  useEffect(() => {
    if (authLoading || profileLoading || !isAuthenticated) return;
    if (currentScreen === 'loading' || currentScreen === 'splash') return;

    const link = getPendingDeepLink();
    if (!link) return;

    console.log('🎯 Deep link trouvé:', link);
    processDeepLink(link);
  }, [authLoading, profileLoading, isAuthenticated, currentScreen]);

  // ─── FONCTION DE TRAITEMENT DU DEEP LINK ───
  const processDeepLink = (data) => {
    if (!data || !data.screen) {
      console.log('❌ Pas de screen dans deep link');
      return;
    }

    console.log('🚀 Navigation vers:', data.screen);

    switch (data.screen) {
      case 'home':
        setCurrentScreen('home');
        setActiveTab('home');
        break;
      case 'compat':
        setCurrentScreen('compat');
        setActiveTab('compat');
        if (data.friendId) {
          setDeepLinkTarget({ type: 'friend', id: data.friendId });
        }
        break;
      case 'pending':
        setCurrentScreen('compat');
        setActiveTab('compat');
        setDeepLinkTarget({ type: 'pending' });
        break;
      case 'profil':
        setCurrentScreen('profil');
        setActiveTab('profil');
        break;
      default:
        console.log('❓ Screen inconnu:', data.screen);
        setCurrentScreen('home');
        setActiveTab('home');
    }
  };

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

  // ─── INTERCEPTER BOUTON RETOUR ANDROID ───
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleBackButton = async () => {
      // 🔴 MODAL OUVERT → fermer le modal, ne pas quitter
      const modalOpen = document.querySelector('[data-planet-modal]') || document.querySelector('[data-natal-modal]');
      if (modalOpen) {
        // Simuler un clic sur le fond pour fermer
        modalOpen.click();
        return;
      }

      // 🔴 SCREENS RACINE : quitte l'app directement
      if (EXIT_SCREENS.includes(currentScreen)) {
        CapacitorApp.exitApp();
        return;
      }

      // 🔙 LOGIN → retour au splash (pas quitter l'app)
      if (currentScreen === 'login') {
        setCurrentScreen('splash');
        return;
      }

      // 🔙 STACK SCREENS → retour à l'écran précédent
      if (STACK_SCREENS.includes(currentScreen) && previousScreen) {
        handlePopScreen();
        return;
      }
      
      // 🔙 AUTRES SCREENS (tabs natal/compat/profil) → retour à home
      if (!STACK_SCREENS.includes(currentScreen) && currentScreen !== 'home') {
        setCurrentScreen('home');
        setActiveTab('home');
        return;
      }
    };

    CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [currentScreen, previousScreen]);

  // Navigation intelligente
  useEffect(() => {
    if (currentScreen === 'login') return;
    if (authLoading) return;

    // Pendant l'onboarding, ne jamais interférer
    if (isInOnboarding) return;

    if (profileLoading) return;

    console.log('NAV DEBUG:', {
      authLoading, profileLoading, isAuthenticated,
      hasProfile: !!profile, currentScreen, isInOnboarding
    });

    // Déconnexion → splash
    if (!isAuthenticated) {
      if (PROTECTED_SCREENS.includes(currentScreen)) {
        setCurrentScreen('splash');
      }
      return;
    }

    // Utilisateur avec profil complet
    if (profile && (profile.onboarding_completed || profile.signe_solaire)) {
      if (PUBLIC_SCREENS.includes(currentScreen)) {
        setCurrentScreen('home');
        setActiveTab('home');
      }
      return;
    }

    // Utilisateur authentifié sans profil → lancer l'onboarding
    // SAUF si localStorage indique que l'onboarding a déjà été fait
    // (protection contre le 406 Supabase au re-login)
    const obDone = user?.id 
      ? localStorage.getItem('astra_ob_done_' + user.id) 
      : null;
    
    if (obDone) {
      // Onboarding déjà fait mais profil pas encore chargé → attendre
      return;
    }

    if (!ONBOARDING_SCREENS.includes(currentScreen)) {
      setIsInOnboarding(true);
      setCurrentScreen('onb1');
    }

  }, [authLoading, profileLoading, isAuthenticated, profile, currentScreen, isInOnboarding, user?.id]);

  const showNav = useMemo(() => {
    return ['home', 'natal', 'horoscope', 'compat', 'profil', 'noeud_lunaire'].includes(currentScreen);
  }, [currentScreen]);

  // ─── DÉTERMINE LA DIRECTION DU SLIDE POUR LES TABS ───
  const getSlideDirection = useCallback(() => {
    if (STACK_SCREENS.includes(currentScreen)) {
      return { x: 0, y: 100 };
    }

    const currentIndex = TAB_ORDER.indexOf(currentScreen);
    const prevIndex = TAB_ORDER.indexOf(previousTab);

    if (currentIndex === -1 || prevIndex === -1) return { x: 0, y: 0 };

    return currentIndex > prevIndex ? { x: 300, y: 0 } : { x: -300, y: 0 };
  }, [currentScreen, previousTab]);

  const handleTabChange = (tab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
    setCurrentScreen(tab);
    setDeepLinkTarget(null);
  };

  const handleNavigateToAbonnement = (fromScreen) => {
    setPreviousScreen(fromScreen || currentScreen);
    setCurrentScreen('abonnement');
  };

  // ─── NAVIGATION VERS STACK SCREEN (push) ───
  const handlePushScreen = (screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  // ─── RETOUR DU STACK ───
  const handlePopScreen = () => {
    setCurrentScreen(previousScreen);
  };

  // ─── HANDLER LOGIN AVEC MODE ───
  const handleLogin = (mode) => {
    setLoginMode(mode);
    setCurrentScreen('login');
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
        return <Splash onStart={() => setCurrentScreen('onb1')} onLogin={handleLogin} />;
      case 'login':
        return <Login onSuccess={() => { setCurrentScreen('home'); setActiveTab('home'); }} mode={loginMode} />;
      case 'onb1':
        return <Onboarding1 onNext={(date) => { setOnboardingData(prev => ({...prev, dateNaissance: date})); setCurrentScreen('onb2'); }} />;
      case 'onb2':
        return <Onboarding2 onNext={(heure) => { setOnboardingData(prev => ({...prev, heure})); setCurrentScreen('onb3'); }} />;
      case 'onb3':
        return <Onboarding3 dateNaissance={onboardingData.dateNaissance} heure={onboardingData.heure} onFinish={() => setCurrentScreen('loading_theme')} />;
      case 'loading_theme':
        return <LoadingTheme onComplete={() => setCurrentScreen('onbInvit')} signeSolaire={profile?.signe_solaire} />;
      case 'onbInvit':
        return <OnboardingInvit 
          onFinish={() => {
            setIsInOnboarding(false);
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          userNom={profile?.nom || "Voyageur"}
          signeSolaire={profile?.signe_solaire || "Lion"}
        />;
      case 'home':
        return <Home onHoroscope={() => handlePushScreen('horoscope')} onProfil={() => handleTabChange('profil')} />;
      case 'natal':
        return <NatalChart onSeeNoeuds={() => handlePushScreen('noeud_lunaire')} onUpgrade={() => handlePushScreen('abonnement')} />;
      case 'noeud_lunaire':
        return <NoeudLunaire onBack={handlePopScreen} onUpgrade={() => handlePushScreen('abonnement')} />;
      case 'horoscope':
        return <Horoscope onBack={handlePopScreen} onUpgrade={() => handlePushScreen('abonnement')} />;
      case 'compat':
        return (
          <Compatibilite 
            onUpgrade={() => handlePushScreen('abonnement')} 
            deepLinkTarget={deepLinkTarget}
            onDeepLinkConsumed={() => setDeepLinkTarget(null)}
          />
        );
      case 'profil':
        return <Profil onLogout={() => setCurrentScreen('splash')} onNavigate={(screen) => screen === 'abonnement' && handlePushScreen('abonnement')} />;
      case 'abonnement':
        return <Abonnement onBack={handlePopScreen} onSubscribed={() => setCurrentScreen('home')} />;
      case 'politique_confidentialite':
        return <PolitiqueConfidentialite onBack={() => {
          setShowingPolicy(false);
          handlePopScreen();
        }} />;
      default:
        return <Home onHoroscope={() => handlePushScreen('horoscope')} onProfil={() => handleTabChange('profil')} />;
    }
  };

  // ─── VARIANTS D'ANIMATION (VERSION 1 ORIGINALE) ───
  const slideVariants = {
    enter: (direction) => ({
      x: direction.x,
      y: direction.y,
      opacity: 0,
      scale: STACK_SCREENS.includes(currentScreen) ? 0.95 : 1,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }
    },
    exit: (direction) => ({
      x: direction.x * -0.3,
      y: direction.y * -0.3,
      opacity: 0,
      scale: STACK_SCREENS.includes(previousScreen) ? 0.95 : 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }
    })
  };

  const direction = getSlideDirection();

  return (
    <div className="h-screen w-screen bg-night flex flex-col overflow-hidden">
      <NotificationToast />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div 
            key={currentScreen} 
            ref={scrollRef}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full overflow-y-auto absolute top-0 left-0"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNav && (
        <nav className="h-16 bg-[#090C1E] border-t border-border flex items-center justify-around px-2 shrink-0 z-50 relative">
          {[
            { id: 'home', label: 'ACCUEIL', icon: 'home' },
            { id: 'natal', label: 'THÈME', icon: 'wheel' },
            { id: 'compat', label: 'AFFINITÉS', icon: 'overlap' },
            { id: 'profil', label: 'PROFIL', icon: 'profile' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const strokeColor = isActive ? 'var(--color-gold)' : 'var(--color-muted)';

            const renderIcon = () => {
              switch(tab.icon) {
                case 'home':
                  return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 20.5523 15 20V15C15 14.4477 14.5523 14 14 14H10C9.44772 14 9 14.4477 9 15V20C9 20.5523 8.55228 21 8 21H4C3.44772 21 3 20.5523 3 20V9.5Z" />
                    </svg>
                  );
                case 'wheel':
                  return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="4" x2="12" y2="7" />
                      <line x1="12" y1="17" x2="12" y2="20" />
                      <line x1="4" y1="12" x2="7" y2="12" />
                      <line x1="17" y1="12" x2="20" y2="12" />
                    </svg>
                  );
                case 'overlap':
                  return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="12" r="6" />
                      <circle cx="15" cy="12" r="6" />
                      <path d="M12 8C13.6569 9.5 13.6569 14.5 12 16" />
                    </svg>
                  );
                case 'profile':
                  return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="9" r="5" />
                      <path d="M5 20C5 17 8 15 12 15C16 15 19 17 19 20" />
                    </svg>
                  );
                default:
                  return null;
              }
            };

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="flex flex-col items-center gap-1 min-w-[60px] py-2 relative"
              >
                {renderIcon()}
                <span className={`text-[9px] tracking-wide font-serif ${isActive ? 'text-gold' : 'text-muted'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-8 h-0.5 bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      )}

      <ConsentBanner 
        onShowPolicy={() => {
          setShowingPolicy(true);
          setPreviousScreen(currentScreen);
          setCurrentScreen('politique_confidentialite');
        }}
        currentScreen={currentScreen}
      />
    </div>
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