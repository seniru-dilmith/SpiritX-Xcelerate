import { motion } from "framer-motion";

type CricketItemType = "bat" | "ball" | "wicket";

const cricketItems: { type: CricketItemType; position: string; size: string }[] = [
  { type: "bat", position: "top-10 left-5", size: "w-16" },
  { type: "ball", position: "bottom-10 right-5", size: "w-12" },
  { type: "bat", position: "top-20 right-20", size: "w-14" },
  { type: "ball", position: "bottom-16 left-16", size: "w-10" },
  { type: "wicket", position: "top-32 left-8", size: "w-14" },
  { type: "wicket", position: "bottom-24 right-24", size: "w-16" },
  { type: "ball", position: "top-40 right-10", size: "w-12" },
  { type: "bat", position: "bottom-32 left-5", size: "w-14" },
  { type: "wicket", position: "top-14 right-36", size: "w-12" },
  { type: "bat", position: "bottom-20 left-32", size: "w-16" },
];

// SVG paths for cricket equipment
const CricketSVGs = {
  bat: (
    <svg viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bat handle */}
      <rect x="40" y="10" width="20" height="100" rx="5" fill="#8B4513" />
      <rect x="40" y="10" width="20" height="100" rx="5" stroke="#5D2906" strokeWidth="1" />
      
      {/* Grip wrapping */}
      <path d="M40 20 H60 M40 30 H60 M40 40 H60 M40 50 H60 M40 60 H60 M40 70 H60 M40 80 H60 M40 90 H60" 
        stroke="#333" strokeWidth="1" strokeDasharray="2,3" />
      
      {/* Bat blade */}
      <path d="M30 110 C30 110, 20 130, 20 150 L20 270 C20 280, 30 290, 50 290 C70 290, 80 280, 80 270 L80 150 C80 130, 70 110, 70 110 Z" 
        fill="#D2B48C" />
      <path d="M30 110 C30 110, 20 130, 20 150 L20 270 C20 280, 30 290, 50 290 C70 290, 80 280, 80 270 L80 150 C80 130, 70 110, 70 110 Z" 
        stroke="#A0522D" strokeWidth="1" />
        
      {/* Wood grain */}
      <path d="M30 130 Q50 150 70 130 M30 170 Q50 190 70 170 M30 210 Q50 230 70 210 M30 250 Q50 270 70 250" 
        stroke="#A0522D" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  ),
  
  ball: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Cricket ball */}
      <circle cx="50" cy="50" r="45" fill="#B91C1C" />
      <circle cx="50" cy="50" r="45" stroke="#881111" strokeWidth="1" />
      
      {/* Seam */}
      <path d="M50 5 Q65 25 65 50 Q65 75 50 95 Q35 75 35 50 Q35 25 50 5" 
        fill="none" stroke="white" strokeWidth="3" />
      
      {/* Wear and texture */}
      <circle cx="35" cy="35" r="15" fill="#D32F2F" fillOpacity="0.3" />
      <circle cx="65" cy="70" r="12" fill="#D32F2F" fillOpacity="0.3" />
      <circle cx="25" cy="60" r="8" fill="#D32F2F" fillOpacity="0.3" />
    </svg>
  ),
  
  wicket: (
    <svg viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Stumps */}
      <rect x="20" y="20" width="10" height="250" rx="5" fill="#F5DEB3" />
      <rect x="55" y="20" width="10" height="250" rx="5" fill="#F5DEB3" />
      <rect x="90" y="20" width="10" height="250" rx="5" fill="#F5DEB3" />
      
      {/* Bails */}
      <rect x="15" y="20" width="20" height="7" rx="2" fill="#E8C388" />
      <rect x="50" y="20" width="20" height="7" rx="2" fill="#E8C388" />
      <rect x="85" y="20" width="20" height="7" rx="2" fill="#E8C388" />
      
      {/* Ground markers */}
      <rect x="0" y="270" width="120" height="10" rx="2" fill="#8B4513" />
      <rect x="40" y="280" width="40" height="5" rx="1" fill="#8B4513" />
    </svg>
  )
};

const CricketDecorations = () => {
  return (
    <>
      {cricketItems.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.position} ${item.size} opacity-80`}
          animate={
            item.type === "ball"
              ? { y: [0, -15, 0], rotate: [0, 180, 360] }
              : item.type === "bat"
              ? { rotate: [-5, 5, -5] }
              : { scale: [1, 1.05, 1] }
          }
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        >
          {CricketSVGs[item.type]}
        </motion.div>
      ))}
    </>
  );
};

export default CricketDecorations;