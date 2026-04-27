const ScoreBar = ({ score = 1, couleur = '#C9A460' }) => {
    const segments = [1, 2, 3, 4, 5];
  
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-[3px]">
          {segments.map((index) => (
            <div
              key={index}
              className="h-[3px] w-[24px] rounded-[2px]"
              style={{
                backgroundColor: index <= score ? couleur : '#252848'
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-muted tabular-nums">{score}/5</span>
      </div>
    );
  };
  
  export default ScoreBar;