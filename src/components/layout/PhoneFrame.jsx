import React from 'react';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';

const PhoneFrame = ({ children, showNav, activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center items-center min-h-screen py-4 bg-black">
      {/* Le chassis du téléphone */}
      <div className="w-[340px] h-[700px] bg-night rounded-[42px] overflow-hidden relative border border-[#1C2040] outline outline-[7px] outline-[#0B0D20] shadow-2xl">
        
        {/* Barre de statut en haut */}
        <StatusBar />
        
        {/* Zone de contenu défilable */}
        <div className={`relative overflow-y-auto custom-scrollbar ${showNav ? 'h-[592px]' : 'h-[658px]'}`}>
          <div className="px-5 pt-2 pb-10">
            {children}
          </div>
        </div>

        {/* Navigation basse conditionnelle */}
        {showNav && (
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        )}
      </div>
    </div>
  );
};

export default PhoneFrame;