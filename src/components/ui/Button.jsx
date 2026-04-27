const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
    const baseStyles = "font-serif text-sm w-full cursor-pointer transition-opacity hover:opacity-90 active:opacity-80";
    
    const variants = {
      primary: "bg-gold text-night tracking-wide rounded-full py-4 border-none",
      outline: "bg-transparent text-gold border border-gold rounded-full py-3"
    };
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;