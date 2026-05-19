// src/lib/errorMessages.js

const ERROR_MAP = {
    // Connexion
    'Invalid login credentials': 'Email ou mot de passe incorrect',
    'User not found': 'Aucun compte trouvé avec cet email',
    'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
    'Invalid email or password': 'Email ou mot de passe incorrect',
    
    // Inscription
    'User already registered': 'Un compte existe déjà avec cet email',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
    'Unable to validate email address: invalid format': 'Format d\'email invalide',
    'Signup requires a valid password': 'Veuillez entrer un mot de passe valide',
    
    // Réseau / générique
    'Network error': 'Problème de connexion. Vérifiez votre internet',
    'Rate limit exceeded': 'Trop de tentatives. Réessayez dans quelques minutes',
    'default': 'Une erreur est survenue. Réessayez'
  };
  
  export function translateError(error) {
    if (!error) return null;
    
    // Si c'est déjà une string traduite (pas dans la map), on la retourne
    if (typeof error === 'string') {
      return ERROR_MAP[error] || error;
    }
    
    // Si c'est un objet avec message
    if (error.message) {
      return ERROR_MAP[error.message] || error.message;
    }
    
    return ERROR_MAP['default'];
  }