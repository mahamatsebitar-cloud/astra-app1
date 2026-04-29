export const getMessageDuJour = async () => {
    const now = new Date();
    const mois = now.getMonth() + 1; // Janvier est 0 en JS
    const jourCle = `${String(mois).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
    let messagesSaisonniers;
  
    // Importation dynamique : on ne télécharge que ce qu'on utilise
    if (mois === 12 || mois <= 2 || (mois === 3 && now.getDate() < 20)) {
      const { MESSAGES_HIVER } = await import('./messagesHiver');
      messagesSaisonniers = MESSAGES_HIVER;
    } else if (mois <= 5 || (mois === 6 && now.getDate() < 20)) {
      const { MESSAGES_PRINTEMPS } = await import('./messagesPrintemps');
      messagesSaisonniers = MESSAGES_PRINTEMPS;
    } else if (mois <= 8 || (mois === 9 && now.getDate() < 22)) {
      const { MESSAGES_ETE } = await import('./messagesEte');
      messagesSaisonniers = MESSAGES_ETE;
    } else {
      const { MESSAGES_AUTOMNE } = await import('./messagesAutomne');
      messagesSaisonniers = MESSAGES_AUTOMNE;
    }
  
    return messagesSaisonniers[jourCle] || "Une nouvelle journée commence sous les astres.";
  };