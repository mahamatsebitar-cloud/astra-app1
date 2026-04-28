// src/services/shareService.js

const generateStars = (seed, count) => {
    const stars = [];
    let seedValue = 0;
    for (let i = 0; i < seed.length; i++) seedValue += seed.charCodeAt(i);
    
    const pseudoRandom = () => {
      seedValue = (seedValue * 16807) % 2147483647;
      return (seedValue - 1) / 2147483646;
    };
  
    for (let i = 0; i < count; i++) {
      stars.push({
        x: pseudoRandom() * 1080,
        y: pseudoRandom() * 1920,
        radius: pseudoRandom() * 2 + 0.5,
        opacity: pseudoRandom() * 0.8 + 0.2
      });
    }
    return stars;
  };
  
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
  
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };
  
  export const generateStoryImage = async (userData, friendData, compatibilite) => {
    // Création d'un canvas haute résolution
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
  
    // 1. Fond Luxueux (Noir Nuit Profonde)
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#040615');
    grad.addColorStop(0.5, '#0B0E25');
    grad.addColorStop(1, '#040615');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);
  
    // 2. Étoiles (Ambiance)
    const seed = (userData.nom || '') + (friendData.nom || '');
    const stars = generateStars(seed, 120);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 164, 96, ${s.opacity})`;
      ctx.fill();
    });
  
    // 3. Logo ASTRA
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(201, 164, 96, 0.4)';
    ctx.fillStyle = '#C9A460';
    ctx.font = 'normal 100px serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASTRA', 540, 250);
    ctx.shadowBlur = 0; // Reset shadow
  
    // 4. Sous-titre
    ctx.fillStyle = '#6B688A';
    ctx.font = 'bold 30px sans-serif';
    ctx.letterSpacing = "8px";
    ctx.fillText('AFFINITÉS ASTRALES', 540, 330);
    ctx.letterSpacing = "0px";
  
    // 5. Blocs Signes
    const drawSign = (x, y, signe, nom, emoji) => {
      ctx.fillStyle = '#C9A460';
      ctx.font = '160px serif';
      ctx.fillText(emoji, x, y);
      
      ctx.fillStyle = '#F0ECE0';
      ctx.font = '40px serif';
      ctx.fillText(signe, x, y + 100);
      
      ctx.fillStyle = '#6B688A';
      ctx.font = '30px sans-serif';
      ctx.fillText(nom.toUpperCase(), x, y + 150);
    };
  
    const getEmoji = (s) => ({
      "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
      "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
      "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
    }[s] || "✨");
  
    drawSign(270, 650, userData.signeSolaire, userData.nom?.split(' ')[0], getEmoji(userData.signeSolaire));
    drawSign(810, 650, friendData.signeSolaire, friendData.nom?.split(' ')[0], getEmoji(friend_data.signeSolaire));
  
    // 6. Cercle de Score Central
    const score = compatibilite?.global || 50;
    const cx = 540, cy = 680, r = 130;
  
    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#1C2040';
    ctx.lineWidth = 15;
    ctx.stroke();
  
    // Progress
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI/2, (-Math.PI/2) + (score/100)*Math.PI*2);
    ctx.strokeStyle = '#C9A460';
    ctx.lineCap = 'round';
    ctx.lineWidth = 15;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#C9A460';
    ctx.stroke();
    ctx.shadowBlur = 0;
  
    ctx.fillStyle = '#C9A460';
    ctx.font = 'bold 80px serif';
    ctx.fillText(`${score}%`, cx, cy + 25);
  
    // 7. Citation (Formatée)
    if (compatibilite?.citation) {
      ctx.fillStyle = '#F0ECE0';
      ctx.font = 'italic 36px serif';
      const lines = wrapText(ctx, compatibilite.citation, 850);
      lines.forEach((l, i) => ctx.fillText(l, 540, 1000 + (i * 60)));
    }
  
    // 8. Footer avec branding
    ctx.fillStyle = 'rgba(107, 104, 138, 0.5)';
    ctx.font = '24px sans-serif';
    ctx.fillText('Disponible sur l\'App Store & Play Store', 540, 1800);
    ctx.fillStyle = '#C9A460';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('ASTRA-APP.FR', 540, 1850);
  
    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  };
  
  export const shareToInstagram = async (imageUrl) => {
    if (navigator.share) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'astra-compatibilite.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'Mon alliance astrale',
          text: 'Regarde ma compatibilité sur Astra ✨'
        });
        return { success: true };
      } catch (e) { return { success: false }; }
    }
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'astra-story.png';
    a.click();
    return { success: true };
  };