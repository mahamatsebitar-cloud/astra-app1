const PlanetCircle = ({ symbole, couleur, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-[13px]',
      md: 'w-10 h-10 text-base',
    };
  
    return (
      <div
        className={`rounded-full bg-[#141731] border border-border flex items-center justify-center font-serif ${sizeClasses[size]}`}
        style={{ color: couleur }}
      >
        {symbole}
      </div>
    );
  };
  
  export default PlanetCircle;