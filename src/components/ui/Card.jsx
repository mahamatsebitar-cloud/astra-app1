const Card = ({ children, className = '', onClick }) => {
    return (
      <div
        className={`bg-card border border-border rounded-2xl p-4 ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {children}
      </div>
    );
  };
  
  export default Card;