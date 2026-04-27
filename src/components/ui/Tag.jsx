const Tag = ({ children }) => {
    return (
      <span className="bg-[#141731] text-gold border border-border rounded-full px-3 py-1 text-[10px] tracking-wider font-serif inline-block">
        {children}
      </span>
    );
  };
  
  export default Tag;