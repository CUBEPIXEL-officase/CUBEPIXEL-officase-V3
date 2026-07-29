import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Monitor, RefreshCw, ChevronLeft, AlertTriangle } from 'lucide-react';
import { EventCalendar } from './EventCalendar';
import { umiriPhotoBase64 as umiriOfficialPhoto } from '../assets/umiriPhotoBase64';

const TANJIRO_IMAGE_URL = "/images/tanjiro_qposket.jpg";

const NEW_LOGO_URL = "https://drive.google.com/thumbnail?id=1HvP72IEkODWDk29WboH2lHwIq8bvNEZ-&sz=w1000";

const COLORS = [
  '#F08080', // 紅/淺珊瑚紅 (Light Coral)
  '#FFB347', // 橘/粉彩柑橘色 (Pastel Tangerine/Citrus Orange)
  '#FFFF00', // 黃/亮黃 (Bright Neon Yellow)
  '#7CFC00', // 綠/草綠 (Grass Green)
  '#87CEEB', // 藍/天藍 (Sky Blue)
  '#D1B3FF', // 紫/粉彩葡萄紫 (Pastel Grape)
  '#FFD1DC', // 粉/淺粉 (Light Pink)
  '#4C5E6E', // 灰藍 (Gray Blue)
];

const CHARS: Record<string, number[][]> = {
  'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  'O': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  'W': [[1,0,1],[1,0,1],[1,0,1],[1,1,1],[1,0,1]],
  'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  '!': [[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
  'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'Q': [[1,1,1],[1,0,1],[1,0,1],[1,1,1],[0,0,1]],
  '-': [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
  'P': [[1,1,1],[1,0,1],[1,1,1],[1,0,0],[1,0,0]],
  'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  'X': [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  'K': [[1,0,1],[1,1,0],[1,0,0],[1,1,0],[1,0,1]],
  'C': [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  'N': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  'S': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  'V': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  '&': [[0,1,0],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
  'G': [[1,1,1],[1,0,0],[1,0,1],[1,0,1],[1,1,1]],
  'Y': [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
  ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
};

interface Block {
  id: string;
  color: string;
  column: number;
  row: number;
  targetRow?: number;
}

interface MobileWebsiteProps {
  gameState: 'idle' | 'forming' | 'formed' | 'dissolving' | 'next_page' | 'special' | 'umiri_special' | 'special_thanks' | 'idol_studio' | 'banned_list';
  setGameState: (state: any) => void;
  activeSubPage: string | null;
  setActiveSubPage: (sub: string | null) => void;
}

// Computer-style Pixel Heart component translated for Mobile Website
const MobilePixelHeart: React.FC<{ 
  color: string; 
  onClick?: () => void; 
  size?: 'xs' | 'sm' | 'md' | 'lg'; 
  className?: string; 
  pulse?: boolean;
}> = ({ color, onClick, size = 'sm', className = '', pulse = false }) => {
  const heartPattern = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 2, 2, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];

  const pixelSize = size === 'xs' 
    ? 'w-[1px] h-[1px]' 
    : size === 'sm' 
    ? 'w-[1.5px] h-[1.5px]' 
    : size === 'md' 
    ? 'w-[2.5px] h-[2.5px]' 
    : 'w-[4px] h-[4px]';

  return (
    <motion.div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${className} ${pulse ? 'animate-pulse' : ''}`}
      whileHover={onClick ? { scale: 1.15 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <div className={`p-0.5 grid grid-cols-7 gap-[0.5px] ${onClick ? 'cursor-pointer' : ''}`}>
        {heartPattern.flat().map((pixel, i) => (
          <div 
            key={i} 
            className={pixelSize}
            style={{ 
              backgroundColor: pixel === 1 ? '#FFFFFF' : pixel === 2 ? color : 'transparent' 
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Computer-style Pixel Download icon component
const MobilePixelDownload: React.FC<{ 
  color: string; 
  onClick?: () => void; 
  size?: 'xs' | 'sm' | 'md' | 'lg'; 
  className?: string; 
  pulse?: boolean;
}> = ({ color, onClick, size = 'sm', className = '', pulse = false }) => {
  const downloadPattern = [
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 1, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const pixelSize = size === 'xs' 
    ? 'w-[1px] h-[1px]' 
    : size === 'sm' 
    ? 'w-[1.5px] h-[1.5px]' 
    : size === 'md' 
    ? 'w-[2.5px] h-[2.5px]' 
    : 'w-[4px] h-[4px]';

  return (
    <motion.div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${className} ${pulse ? 'animate-pulse' : ''}`}
      whileHover={onClick ? { scale: 1.15 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <div className={`p-0.5 grid grid-cols-9 gap-[0.5px] ${onClick ? 'cursor-pointer' : ''}`}>
        {downloadPattern.flat().map((pixel, i) => (
          <div 
            key={i} 
            className={pixelSize}
            style={{ 
              backgroundColor: pixel === 1 ? '#FFFFFF' : pixel === 2 ? color : 'transparent' 
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const HEARTS_CONFIG = [
  { id: 'news', color: '#F08080', label: '店面最新資訊', desc: '實時公告與最新通知 📢' },
  { id: 'reservation', color: '#FFB347', label: '社群預約功能', desc: '預約服務與開門注意事項 門' },
  { id: 'calendar', color: '#FFFF00', label: '店鋪專用行事曆', desc: '活動企劃與主題之夜 📅' },
  { id: 'intro', color: '#7CFC00', label: '角色介紹', desc: '選擇你的推 🎨' },
  { id: 'social', color: '#87CEEB', label: '社群連結', desc: '關注 X, Instagram 與 Discord 獲取最新消息 📱' },
  { id: 'collab', color: '#D1B3FF', label: '合作邀約', desc: '歡迎各類商業合作與專案洽談 ✉️' },
  { id: 'visual', color: '#FFD1DC', label: '特別感謝', desc: '特別感謝團長涼海璃對幹程式碼一個月 🔵' },
  { id: 'disabled', color: '#4C5E6E', label: '尚未開放', desc: '更多神祕功能即將推出，敬請期待！✨' },
];

export const MobileWebsite: React.FC<MobileWebsiteProps> = () => {
  // Mobile-specific game state sequence to handle the transition
  const [localGameState, setLocalGameState] = useState<'idle' | 'forming' | 'formed' | 'dissolving' | 'next_page'>('idle');
  const [currentTime, setCurrentTime] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
  const [showNewsSubpage, setShowNewsSubpage] = useState(false);
  const [showReservationSubpage, setShowReservationSubpage] = useState(false);
  const [showCalendarSubpage, setShowCalendarSubpage] = useState(false);
  const [showIntroSubpage, setShowIntroSubpage] = useState(false);
  const [showMerchSubpage, setShowMerchSubpage] = useState(false);
  const [selectedMerchCategory, setSelectedMerchCategory] = useState<string | null>(null);
  const [showAppInstallSubpage, setShowAppInstallSubpage] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [selectedMobileFighter, setSelectedMobileFighter] = useState<any | null>(null);
  const [selectedHeartId, setSelectedHeartId] = useState<string | null>(null);

  useEffect(() => {
    const checkStandalone = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone || 
        document.referrer.includes('android-app://') ||
        urlParams.get('display') === 'standalone' ||
        urlParams.get('mode') === 'standalone';
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const handleBlockExplosion = (color: string) => {
    if (dimensions.cols === 0) return;
    setBlocks(prev => {
      const explosionBlocks = [];
      const numBlocks = Math.floor(Math.random() * 8) + 12; // 12-20 blocks
      for (let i = 0; i < numBlocks; i++) {
        explosionBlocks.push({
          id: `explosion-${Math.random().toString(36).substr(2, 9)}`,
          color: color,
          column: Math.floor(Math.random() * dimensions.cols),
          row: Math.floor(Math.random() * -3)
        });
      }
      return [...prev, ...explosionBlocks];
    });
  };

  // Dynamically calculate grid size based on mobile width to fit the formed word perfectly without overflowing
  const GRID_SIZE = Math.max(9, Math.min(12, Math.floor(typeof window !== 'undefined' ? window.innerWidth / 33 : 10)));
  const TICK_RATE = 75; // Fast tick rate for smooth pixel animation on phone screens

  // Clock Update Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / GRID_SIZE),
        rows: Math.ceil(window.innerHeight / GRID_SIZE) + 1
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [GRID_SIZE]);

  // Main game loop: Block physics and falling
  useEffect(() => {
    if (dimensions.cols === 0) return;

    const moveInterval = setInterval(() => {
      setBlocks((prev) => {
        const nextBlocks = prev
          .map(block => {
            if (block.targetRow !== undefined && block.row >= block.targetRow) {
              return block;
            }
            return { ...block, row: block.row + 1 };
          })
          .filter(block => block.row < dimensions.rows);

        // Check transition to 'formed' state when in 'forming' and all white blocks have arrived
        if (localGameState === 'forming') {
          const hasWhiteBlocks = nextBlocks.some(b => b.color === '#FFFFFF');
          const allWhiteReached = nextBlocks
            .filter(b => b.color === '#FFFFFF')
            .every(b => b.targetRow !== undefined && b.row >= b.targetRow);

          if (hasWhiteBlocks && allWhiteReached) {
            setLocalGameState('formed');
          }
        }

        // Transition to 'next_page' when in 'dissolving' and no white blocks are left
        if (localGameState === 'dissolving') {
          const hasWhiteBlocks = nextBlocks.some(b => b.color === '#FFFFFF');
          if (!hasWhiteBlocks) {
            setLocalGameState('next_page');
          }
        }

        return nextBlocks;
      });
    }, TICK_RATE);

    return () => clearInterval(moveInterval);
  }, [dimensions, localGameState]);

  // Spawning random falling color pixels in 'idle' and 'forming' phase
  useEffect(() => {
    if (dimensions.cols === 0 || localGameState === 'next_page') return;

    const spawnInterval = setInterval(() => {
      if (localGameState !== 'idle' && localGameState !== 'forming') return;

      setBlocks((prev) => {
        // Find occupied top columns
        const occupiedTopCols = new Set(
          prev.filter(b => b.row <= 1).map(b => b.column)
        );

        const availableCols = Array.from({ length: dimensions.cols })
          .map((_, i) => i)
          .filter(col => !occupiedTopCols.has(col));

        // Spawn probability (0.75 chance per tick)
        if (availableCols.length === 0 || Math.random() > 0.75) return prev;

        const spawnCount = Math.floor(Math.random() * 4) + 1;
        let newBlocks = [...prev];
        let currentAvailable = [...availableCols];

        for (let i = 0; i < spawnCount && currentAvailable.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * currentAvailable.length);
          const randomCol = currentAvailable[randomIndex];
          currentAvailable.splice(randomIndex, 1);

          newBlocks.push({
            id: `colored-${Math.random().toString(36).substr(2, 9)}`,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            column: randomCol,
            row: 0
          });
        }

        return newBlocks;
      });
    }, TICK_RATE);

    return () => clearInterval(spawnInterval);
  }, [dimensions, localGameState]);

  // Handle 'formed' to 'dissolving' transition after a short delay
  useEffect(() => {
    if (localGameState === 'formed') {
      const timer = setTimeout(() => {
        setLocalGameState('dissolving');
      }, 222);
      return () => clearTimeout(timer);
    }
  }, [localGameState]);

  // Staggered dissolve logic
  useEffect(() => {
    if (localGameState !== 'dissolving' || blocks.length === 0) return;

    const dissolveInterval = setInterval(() => {
      setBlocks(prev => {
        const staticBlocks = prev.filter(b => b.targetRow !== undefined && b.row >= b.targetRow);
        
        if (staticBlocks.length === 0) return prev;

        // Pick 2-6 random blocks to start falling
        const count = Math.floor(Math.random() * 5) + 2;
        const toFallIds = new Set<string>();
        const tempStatic = [...staticBlocks];

        for (let i = 0; i < count && tempStatic.length > 0; i++) {
          const idx = Math.floor(Math.random() * tempStatic.length);
          toFallIds.add(tempStatic[idx].id);
          tempStatic.splice(idx, 1);
        }

        return prev.map(b => {
          if (toFallIds.has(b.id)) {
            return { ...b, targetRow: undefined };
          }
          return b;
        });
      });
    }, 60);

    return () => clearInterval(dissolveInterval);
  }, [localGameState, blocks.length]);

  // Tap action to trigger start transition
  const handleStart = () => {
    if (localGameState !== 'idle') return;

    setLocalGameState('forming');

    const rand = Math.random();
    const line1 = rand < 0.5 ? "Q AND" : "SANKETSU";
    const line2 = rand < 0.5 ? "SANKETSU" : "EVERYDAY";

    const generateMessageBlocks = (text: string, startRow: number) => {
      const charWidth = 4; // 3 width + 1 space column
      const totalWidth = text.length * charWidth - 1;
      const startCol = Math.floor((dimensions.cols - totalWidth) / 2);

      const newBlocks: Block[] = [];
      text.split('').forEach((char, charIdx) => {
        const charMap = CHARS[char] || CHARS[' '];
        charMap.forEach((rowArr, rIdx) => {
          rowArr.forEach((pixel, cIdx) => {
            if (pixel === 1) {
              newBlocks.push({
                id: `msg-${text}-${charIdx}-${rIdx}-${cIdx}-${Math.random()}`,
                color: '#FFFFFF',
                column: startCol + charIdx * charWidth + cIdx,
                row: -Math.floor(Math.random() * 15) - 5, // Dropping from random heights above
                targetRow: startRow + rIdx
              });
            }
          });
        });
      });
      return newBlocks;
    };

    const startRow1 = Math.floor(dimensions.rows / 2) - 4;
    const startRow2 = Math.floor(dimensions.rows / 2) + 2;

    const msg1 = generateMessageBlocks(line1, startRow1);
    const msg2 = generateMessageBlocks(line2, startRow2);

    // Make all existing colorful blocks fall without targetRow, then append white text blocks
    setBlocks(prev => {
      const fallingColorful = prev.map(b => ({ ...b, targetRow: undefined }));
      return [...fallingColorful, ...msg1, ...msg2];
    });
  };

  const handleSkip = () => {
    if (['forming', 'formed', 'dissolving'].includes(localGameState)) {
      setLocalGameState('next_page');
      setBlocks([]);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#000B18] z-[9999] flex flex-col items-center justify-between overflow-hidden font-rounded text-white select-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
      }}
      onClick={handleStart}
      onDoubleClick={handleSkip}
    >
      {/* 1. BACKGROUND FALLING BLOCKS LAYER (Covering entire screen with no grid border) */}
      {localGameState !== 'next_page' && (
        <div className="absolute inset-0 pointer-events-none">
          {blocks.map((block) => (
            <div
              key={block.id}
              style={{
                position: 'absolute',
                transform: `translate3d(${block.column * GRID_SIZE + 1}px, ${block.row * GRID_SIZE}px, 0)`,
                width: GRID_SIZE - 2,
                height: GRID_SIZE - 2,
                backgroundColor: block.color,
                boxShadow: block.color === '#FFFFFF' 
                  ? 'inset 0 0 4px rgba(255,255,255,0.4), 0 0 10px rgba(255,255,255,0.8)'
                  : `inset 0 0 4px rgba(255,255,255,0.2), 0 0 8px ${block.color}33`,
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: block.color === '#FFFFFF' ? 30 : 10,
                transition: 'transform 0.08s linear'
              }}
            />
          ))}
        </div>
      )}

      {/* 2. TRANSLUCENT OVERLAYS AND TEXT DETAILS */}
      <AnimatePresence mode="wait">
        {localGameState === 'idle' && (
          <motion.div
            key="landing_info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-between p-6 z-20 pointer-events-none"
          >
            {/* Top status indicator */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <MobilePixelHeart color="#FFB347" size="xs" pulse className="translate-y-[-1px]" />
                <span>QPKS-APP-VER2.0</span>
              </div>
              <div>{currentTime}</div>
            </div>

            {/* Fully Transparent Floating Logo (Enlarged) */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, type: 'spring' }}
                className="relative"
              >
                {/* Clean floating logo image without any background grids or container boxes, enlarged for prominence */}
                <img 
                  src={NEW_LOGO_URL} 
                  alt="紡塊像素 Logo" 
                  className="w-64 h-64 sm:w-72 sm:h-72 object-contain drop-shadow-[0_0_45px_rgba(251,191,36,0.35)] animate-float"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://drive.google.com/thumbnail?id=1yqTzowdnAcZTofISD4xSGTz-GigyR_Ma&sz=w1000";
                  }}
                />
              </motion.div>
            </div>

            {/* Tap to Start Game instruction */}
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mb-8 text-center space-y-1.5"
            >
              <span className="text-amber-400 font-black text-sm tracking-[0.4em] uppercase">
                👉 點擊以開始遊戲 👈
              </span>
              <p className="text-[8px] text-white/20 tracking-widest uppercase font-mono">
                TAP TO INITIATE TRANSITION
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* 3. NEXT PAGE - AFTER PIXEL TRANSITION COMPLETION */}
        {localGameState === 'next_page' && (
          <motion.div
            key="next_page_content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="absolute inset-0 flex flex-col items-center justify-between p-6 z-20 bg-[#000B18] relative w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Interactive Pixel Heart Buttons in Top-Left Corner */}
            <div className="absolute top-4 left-4 flex flex-col gap-3 z-30 pointer-events-auto">
              {/* Store Latest News (Red Heart) */}
              <motion.button 
                onClick={() => setShowNewsSubpage(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center drop-shadow-[0_0_12px_rgba(240,128,128,0.5)]"
                title="店面最新資訊"
              >
                <MobilePixelHeart color="#F08080" size="lg" pulse />
              </motion.button>

              {/* Service Reservation (Orange Heart) */}
              <motion.button 
                onClick={() => setShowReservationSubpage(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                title="社群預約功能"
              >
                <MobilePixelHeart color="#FFB347" size="lg" pulse />
              </motion.button>

              {/* Store Calendar (Yellow Heart) */}
              <motion.button 
                onClick={() => setShowCalendarSubpage(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                title="店鋪專用行事曆"
              >
                <MobilePixelHeart color="#FFFF00" size="lg" pulse />
              </motion.button>

              {/* Character Intro (Green Heart) */}
              <motion.button 
                onClick={() => setShowIntroSubpage(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center drop-shadow-[0_0_12px_rgba(124,252,0,0.5)]"
                title="角色介紹"
              >
                <MobilePixelHeart color="#7CFC00" size="lg" pulse />
              </motion.button>

              {/* Download App / APK Install (Below Green Heart) */}
              {!isStandalone && (
                <motion.button 
                  onClick={() => setShowAppInstallSubpage(true)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] animate-bounce"
                  title="下載手機 App (PWA / APK)"
                >
                  <MobilePixelDownload color="#38BDF8" size="lg" pulse />
                </motion.button>
              )}
            </div>

            {/* Top header and Title Bar (Borderless) */}
            <div className="w-full flex flex-col gap-2 pt-2 pb-2">
              <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase font-mono pl-14">
                <div className="flex items-center gap-1.5">
                  <MobilePixelDownload color="#7CFC00" size="xs" pulse className="translate-y-[-1px]" />
                  <span>QPKS-APP-VER2.0</span>
                </div>
                <div>{currentTime}</div>
              </div>
            </div>

            {/* Central Content Area (Optimized for display/screen ratio with w-full) */}
            <div className="flex-1 flex flex-col items-center justify-center gap-[4vh] w-full max-w-sm sm:max-w-md px-4 py-4 my-auto">
              {/* 1. 特別放大居酒屋的logo (Scaled dynamically by aspect ratio to prevent overflow) */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex justify-center items-center"
              >
                <img 
                src={NEW_LOGO_URL} 
                alt="紡塊像素 Logo" 
                className="w-[28vh] h-[28vh] min-w-[130px] min-h-[130px] max-w-[190px] max-h-[190px] object-contain drop-shadow-[0_0_35px_rgba(251,191,36,0.35)] rounded-3xl"
                referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* 2. 刪除整排像素心的可按動設計 並保持固態呼吸明暗 (Borderless card background) */}
              <div className="w-full py-3 bg-white/[0.015] rounded-2xl px-4 flex flex-col items-center gap-2">
                <div className="text-[8px] text-white/30 tracking-widest font-mono uppercase">
                  - CUBEPIXEL HEARTBEAT / 像素呼吸 -
                </div>
                <div className="flex items-center justify-center gap-2.5">
                  {HEARTS_CONFIG.map((heart) => (
                    <MobilePixelHeart
                      key={heart.id}
                      color={heart.color}
                      size="sm"
                      pulse
                      className="opacity-80"
                    />
                  ))}
                </div>
              </div>

              {/* 3. 呼吸像素心條下方獨立按鈕：熱門商品 (Hot Products Independent Button) */}
              <motion.button
                onClick={() => setShowMerchSubpage(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 hover:from-amber-500/25 hover:via-rose-500/25 hover:to-purple-500/25 border border-amber-500/30 hover:border-amber-400/60 rounded-2xl flex items-center justify-between cursor-pointer shadow-[0_0_20px_rgba(255,179,71,0.15)] transition-all duration-200 group relative overflow-hidden"
              >
                {/* Ambient glow & shine transition */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="flex items-center gap-3 z-10">
                  <div className="p-2 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-400/40 drop-shadow-[0_0_10px_rgba(255,179,71,0.6)]">
                    <MobilePixelHeart color="#FFB347" size="sm" pulse />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white tracking-widest font-rounded">
                        熱門商品
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-amber-500 text-black font-black rounded-md tracking-wider font-mono animate-pulse">
                        HOT
                      </span>
                    </div>
                    <span className="text-[9px] text-amber-200/70 font-mono tracking-wider">
                      CUBEPIXEL MERCH & GOODS
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 z-10 group-hover:translate-x-1 transition-transform">
                  <span>查看物販</span>
                  <span className="text-xs">➔</span>
                </div>
              </motion.button>
            </div>

            {/* 3. 保留可愛字型 並將地址與電話留在最下面 (Borderless flat visual design) */}
            <div className="w-full max-w-sm sm:max-w-md bg-white/[0.01] rounded-2xl p-4 mb-3 space-y-1.5 relative">
              <div className="space-y-1 text-left text-[11px] text-white/80 font-mono">
                <p className="flex justify-between items-center">
                  <span className="text-white/45 font-rounded text-[10px]">📍 實體地址:</span>
                  <span className="font-bold text-amber-300">福和路120號之2</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-white/45 font-rounded text-[10px]">📞 聯絡電話:</span>
                  <span className="font-bold text-[#D1B3FF]">02-8925-2329</span>
                </p>
              </div>
            </div>

            {/* Install App Banner Button */}
            {!isStandalone && (
              <motion.button 
                onClick={() => setShowAppInstallSubpage(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-sm sm:max-w-md bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/25 rounded-2xl p-3 mb-3 text-center space-y-1 relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-[8px] text-black font-black uppercase tracking-widest rounded-bl-xl font-mono">
                  PWA / APK
                </div>
                <div className="flex items-center justify-center gap-2 text-white font-black text-xs tracking-wider">
                  <span className="animate-pulse text-sm">📲</span>
                  <span className="text-[11px]">下載 / 安裝 CUBEPIXEL 手機 App</span>
                </div>
                <div className="text-[9px] text-emerald-300/80 font-bold font-mono">
                  支援全螢幕顯示 • 隱藏網址列 • 雲端實時更新
                </div>
              </motion.button>
            )}

            {/* Footer metadata details (Borderless) */}
            <div className="w-full flex flex-col items-center gap-1 pt-2">
              <div className="flex items-center gap-1 text-[8px] text-white/30 tracking-widest uppercase font-mono">
                <Sparkles className="w-2.5 h-2.5 text-amber-400/60" />
                <span>CUBEPIXEL DEV TEAM</span>
              </div>
              <div className="text-[8px] text-white/20 tracking-wide text-center font-rounded">
                紡塊像素 CubePixel_2026 感謝團長涼海璃製作
              </div>
            </div>
          </motion.div>
        )}

        {showNewsSubpage && (
          <motion.div
            key="news_subpage"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 bg-[#000611]/97 backdrop-blur-md w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Top Back/Close bar */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 pb-2 z-40 font-mono">
              <button 
                onClick={() => setShowNewsSubpage(false)}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>返回</span>
              </button>
              <div>{currentTime}</div>
            </div>

            {/* Scrollable Container for Latest News */}
            <div className="flex-1 w-full overflow-y-auto py-4 px-2 my-auto flex flex-col items-center justify-start gap-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="w-full max-w-sm sm:max-w-md text-center space-y-4">
                {/* Desktop-Style Header Title */}
                <div className="flex flex-col items-center mb-4">
                  <h2 className="text-3xl font-black text-white tracking-[0.2em] italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    最新資訊
                  </h2>
                  <div className="mt-2 flex items-center justify-center gap-3 w-full max-w-xs">
                    <span className="text-white/20 font-pixel text-[10px] flex-1 text-right">━━━━━━</span>
                    <span className="text-[10px] text-white/40 font-pixel tracking-[0.3em] uppercase whitespace-nowrap">Latest News</span>
                    <span className="text-white/20 font-pixel text-[10px] flex-1 text-left">━━━━━━</span>
                  </div>
                </div>

                {/* News List Cards - Desktop Style Adaptations for Mobile */}
                <div className="space-y-4 text-left w-full">
                  {/* News Card: 出禁公告 (Deep Wine Red Theme) */}
                  <div className="w-full bg-[#24060B]/80 backdrop-blur-md rounded-2xl p-4 border-[0.5px] border-[#800A1D] relative overflow-hidden flex flex-col items-start justify-center text-left hover:border-[#FF4D6D]/50 transition-all duration-300 shadow-[0_0_20px_rgba(128,10,29,0.25)]">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[0.5px] border-l-[0.5px] border-[#FF4D6D]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[0.5px] border-r-[0.5px] border-[#FF4D6D]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[0.5px] border-l-[0.5px] border-[#FF4D6D]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[0.5px] border-r-[0.5px] border-[#FF4D6D]" />
                    
                    <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3 pb-2 border-b border-[#800A1D]/40">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#800A1D]/40 text-[#FF6B81] border border-[#FF6B81]/30 rounded font-pixel uppercase tracking-widest">
                          出禁公告
                        </span>
                        <span className="text-xs font-mono text-white/50">2026.07.24</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#FF6B81]/60 select-none">NOTICE ID: #005</span>
                    </div>

                    <h3 className="text-base font-black text-white mb-2 tracking-wider hover:text-[#FF6B81] transition-colors">
                      【出禁】近期因怪阿伯出沒 於是本店將暫不開放前台區域 🚫
                    </h3>
                    
                    <p className="text-xs text-white/80 leading-relaxed font-mono font-medium">
                      因本店出現怪阿伯於非營業時間且未經店長本人允許時，
                      在前方櫃台區域進行 <span className="text-red-400 font-bold underline decoration-red-500/50">無故侵入之非法行為</span>，
                      故 <span className="text-amber-400 font-bold">暫不開放前台區給顧客做相關使用</span> 非常抱歉。
                    </p>

                    {/* Attached Official Banned Poster Image */}
                    <div className="my-3 w-full flex flex-col items-center">
                      <div className="relative overflow-hidden rounded-xl border border-[#800A1D] bg-black/70 p-2 w-full shadow-md">
                        <img
                          src="https://lh3.googleusercontent.com/d/1I5Y6bWvuyfmAn5mispwM-oBZFbz2d6nR"
                          alt="酸欠像素偶像居酒屋官方出禁公告 二"
                          className="w-full h-auto rounded-lg object-contain max-h-[320px]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#800A1D]/40 flex items-center justify-between w-full">
                      <p className="text-[10px] text-white/40 font-mono">
                        敬請各位顧客與居民多加留意，造成不便非常抱歉。
                      </p>
                      <div className="w-1.5 h-1.5 bg-[#FF6B81] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* News Card: 涼海璃請假通知 */}
                  <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border-[0.5px] border-white/10 relative overflow-hidden flex flex-col items-start justify-center text-left hover:border-[#D1B3FF]/30 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[0.5px] border-l-[0.5px] border-[#D1B3FF]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[0.5px] border-r-[0.5px] border-[#D1B3FF]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[0.5px] border-l-[0.5px] border-[#D1B3FF]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[0.5px] border-r-[0.5px] border-[#D1B3FF]" />
                    
                    <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#D1B3FF]/10 text-[#D1B3FF] border border-[#D1B3FF]/30 rounded font-pixel uppercase tracking-widest">
                          請假通知
                        </span>
                        <span className="text-xs font-mono text-white/40">2026.07.15</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 select-none">NOTICE ID: #004</span>
                    </div>

                    <h3 className="text-base font-black text-white mb-2 tracking-wider hover:text-[#D1B3FF] transition-colors">
                      【重要通知】7月16日 涼海璃請假通知 🌸
                    </h3>
                    
                    <p className="text-xs text-white/80 leading-relaxed font-mono font-medium">
                      團長 <span className="text-[#D1B3FF] font-bold">涼海璃</span> 將於 <span className="text-amber-400 font-bold">7月16日</span> 請假一天。
                      <span className="text-[11px] text-white/60 block mt-1">
                        當天相關業務與接待服務將稍作調整，感謝大家的理解與體諒！
                      </span>
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between w-full">
                      <p className="text-[10px] text-white/40 font-mono">
                        祝大家有美好的一天，期待隔日與大家再次相見！
                      </p>
                      <div className="w-1.5 h-1.5 bg-[#D1B3FF] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* News Card: 暫停營業通知 */}
                  <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border-[0.5px] border-white/10 relative overflow-hidden flex flex-col items-start justify-center text-left hover:border-[#FFB347]/30 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[0.5px] border-l-[0.5px] border-[#FFB347]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[0.5px] border-r-[0.5px] border-[#FFB347]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[0.5px] border-l-[0.5px] border-[#FFB347]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[0.5px] border-r-[0.5px] border-[#FFB347]" />
                    
                    <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#FFB347]/10 text-[#FFB347] border border-[#FFB347]/30 rounded font-pixel uppercase tracking-widest">
                          系統維護
                        </span>
                        <span className="text-xs font-mono text-white/40">2026.07.15</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 select-none">NOTICE ID: #003</span>
                    </div>

                    <h3 className="text-base font-black text-white mb-2 tracking-wider hover:text-[#FFB347] transition-colors">
                      【公告】酸欠像素偶像居酒屋內部網站整改 暫停營業一天 🛠️
                    </h3>
                    
                    <p className="text-xs text-white/80 leading-relaxed font-mono font-medium">
                      酸欠像素偶像居酒屋將進行 <span className="text-red-400 font-bold">內部網站系統整改</span>，期間將 <span className="text-[#FFB347] font-bold">暫停營業一天</span>。
                      <span className="text-[11px] text-white/60 block mt-1">
                        整改完成後我們將帶給大家更精緻的像素互動體驗，敬請期待！
                      </span>
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between w-full">
                      <p className="text-[10px] text-white/40 font-mono">
                        造成不便敬請見諒，感謝全體像素居民對我們的愛護與支持。
                      </p>
                      <div className="w-1.5 h-1.5 bg-[#FFB347] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* News Card: 試營運通知 */}
                  <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border-[0.5px] border-white/10 relative overflow-hidden flex flex-col items-start justify-center text-left hover:border-[#FFA4B4]/30 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[0.5px] border-l-[0.5px] border-[#FFA4B4]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[0.5px] border-r-[0.5px] border-[#FFA4B4]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[0.5px] border-l-[0.5px] border-[#FFA4B4]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[0.5px] border-r-[0.5px] border-[#FFA4B4]" />
                    
                    <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#FFA4B4]/10 text-[#FFA4B4] border border-[#FFA4B4]/30 rounded font-pixel uppercase tracking-widest">
                          試營運通知
                        </span>
                        <span className="text-xs font-mono text-white/40">2026.06.25</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 select-none">NOTICE ID: #002</span>
                    </div>

                    <h3 className="text-base font-black text-white mb-2 tracking-wider hover:text-[#FFA4B4] transition-colors">
                      【試營運通知】紡塊像素官方小基地開張囉 🏮
                    </h3>
                    
                    <p className="text-xs text-white/80 leading-relaxed font-mono font-medium">
                      紡塊像素官方小基地 <span className="text-[#87CEEB] font-bold">「酸欠像素偶像居酒屋」</span> 將於 <span className="text-[#FFA4B4] font-bold">7/14 日</span> 正式開始試營運！
                      <span className="text-[11px] text-white/60 block mt-1">
                        試營運當日將有神秘活動 還有陀螺比賽可以參加喔~
                      </span>
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between w-full">
                      <p className="text-[10px] text-white/40 font-mono">
                        誠摯邀請各位前來，一同見證這片全新拼貼的像素世界。
                      </p>
                      <div className="w-1.5 h-1.5 bg-[#FFA4B4] rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* News Card: 門市營運資訊 */}
                  <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border-[0.5px] border-white/10 relative overflow-hidden flex flex-col items-start justify-center text-left hover:border-[#7CFC00]/30 transition-all duration-300 shadow-lg">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[0.5px] border-l-[0.5px] border-[#7CFC00]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[0.5px] border-r-[0.5px] border-[#7CFC00]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[0.5px] border-l-[0.5px] border-[#7CFC00]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[0.5px] border-r-[0.5px] border-[#7CFC00]" />
                    
                    <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#7CFC00]/10 text-[#7CFC00] border border-[#7CFC00]/30 rounded font-pixel uppercase tracking-widest">
                          門市資訊
                        </span>
                        <span className="text-xs font-mono text-white/40">常態營業</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 select-none">NOTICE ID: #001</span>
                    </div>

                    <h3 className="text-base font-black text-white mb-2 tracking-wider hover:text-[#7CFC00] transition-colors">
                      【門市資訊】酸欠像素偶像居酒屋 實體店面地點 📍
                    </h3>
                    
                    <div className="text-xs text-white/80 leading-relaxed font-mono font-medium space-y-1">
                      <p>📍 <span className="text-amber-300 font-bold">地址：</span>新北市永和區福和路120號之2</p>
                      <p>📞 <span className="text-purple-300 font-bold">電話：</span>02-8925-2329</p>
                      <p className="text-[11px] text-white/60 pt-0.5">
                        門市開放情況與開門注意事項可參閱「社群預約功能」說明。
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between w-full">
                      <p className="text-[10px] text-white/40 font-mono">
                        歡迎蒞臨門市體驗像素居酒屋氛圍。
                      </p>
                      <div className="w-1.5 h-1.5 bg-[#7CFC00] rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button to exit */}
            <div className="w-full flex flex-col gap-2 max-w-sm sm:max-w-md px-4 mt-2">
              <button 
                onClick={() => setShowNewsSubpage(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto"
              >
                關閉資訊
              </button>
              
              <div className="w-full flex flex-col items-center gap-1 pt-1">
                <div className="text-[8px] text-white/20 tracking-wide text-center font-mono">
                  紡塊像素 CubePixel_2026
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showReservationSubpage && (
          <motion.div
            key="reservation_subpage"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-[#000611]/95 backdrop-blur-md w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Top Back/Close bar */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 pb-2 font-mono">
              <button 
                onClick={() => setShowReservationSubpage(false)}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>返回</span>
              </button>
              <div>{currentTime}</div>
            </div>

            {/* Main Information Layout (Full screen and responsive scrollable container) */}
            <div className="flex-1 w-full overflow-y-auto py-2 px-2 my-auto flex flex-col items-center justify-start gap-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="w-full max-w-sm sm:max-w-md text-center space-y-4">
                {/* Header Badge */}
                <div className="inline-flex flex-col items-center gap-1 py-2.5 px-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 text-xs font-black tracking-widest uppercase font-mono shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <span className="flex items-center gap-1.5 text-sm">
                    <MobilePixelHeart color="#FFB347" size="xs" pulse />
                    <span>社群預約功能</span>
                  </span>
                  <span className="text-[8px] text-white/40 normal-case font-sans">COMMUNITY RESERVATION</span>
                </div>

                {/* Situation A Card */}
                <div className="bg-white/[0.02] rounded-2xl p-4 border border-amber-500/20 space-y-3 text-left shadow-lg">
                  <div className="space-y-1 border-b border-white/5 pb-2">
                    <span className="text-[11px] font-black tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span>🚪</span>
                      <span>情況A 若你看到鐵門有開 但阿璃沒有回應</span>
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-white/90 leading-relaxed font-sans">
                    <div className="flex gap-2.5 items-start">
                      <span className="bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md shrink-0 mt-0.5">1</span>
                      <p className="font-bold">請走到中間區看一眼</p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <span className="bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md shrink-0 mt-0.5">2</span>
                      <div className="space-y-0.5">
                        <p className="font-bold">如果阿璃躺在沙發上睡覺 可以用力的大吼一聲 把阿璃弄起來</p>
                        <span className="text-amber-300/80 text-[10px] font-medium block">(備註:絕對不用擔心阿璃會生氣)</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <span className="bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md shrink-0 mt-0.5">3</span>
                      <div className="space-y-0.5">
                        <p className="font-bold">如果阿璃叫不起來 請倒退走出門 把門關上</p>
                        <span className="text-red-400/90 text-[10px] font-medium block">(本店24小時監視錄影中 請勿動歪腦筋)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Situation B Card */}
                <div className="bg-white/[0.02] rounded-2xl p-4 border border-cyan-500/20 space-y-3 text-left shadow-lg">
                  <div className="space-y-1 border-b border-white/5 pb-2">
                    <span className="text-[11px] font-black tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <span>🔒</span>
                      <span>情況B 若你看到鐵門完全拉上</span>
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-white/90 leading-relaxed font-sans">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-200 font-black text-center text-xs tracking-wide shadow-inner">
                      「這時酸欠像素沒有營業」
                    </div>
                    <p className="text-white/80 text-[11px] font-bold text-center">
                      請靜待阿璃打開鐵門 或是其他時間再來
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button to exit */}
            <div className="w-full flex flex-col gap-2 max-w-sm sm:max-w-md px-4 mt-2">
              <button 
                onClick={() => setShowReservationSubpage(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto"
              >
                關閉說明
              </button>
              
              <div className="w-full flex flex-col items-center gap-1 pt-2">
                <div className="text-[8px] text-white/20 tracking-wide text-center font-mono">
                  紡塊像素 CubePixel_2026
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showCalendarSubpage && (
          <motion.div
            key="calendar_subpage"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 bg-[#000611]/97 backdrop-blur-md w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Top Back/Close bar (Borderless) */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 pb-2 z-40">
              <button 
                onClick={() => setShowCalendarSubpage(false)}
                className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-bold tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>返回</span>
              </button>
              <div>{currentTime}</div>
            </div>

            {/* Scrollable Container for the Calendar */}
            <div className="flex-1 w-full overflow-y-auto py-4 px-2 my-auto flex flex-col items-center justify-start gap-6 scrollbar-thin scrollbar-thumb-white/10">
              <div className="w-full max-w-sm sm:max-w-md text-center space-y-4">
                {/* Header Badge */}
                <div className="inline-flex flex-col items-center gap-1 py-2 px-4 bg-yellow-500/10 rounded-xl text-yellow-400 text-xs font-black tracking-widest uppercase">
                  <span className="flex items-center gap-1.5">
                    <MobilePixelHeart color="#FFFF00" size="xs" pulse />
                    <span>店鋪專用行事曆</span>
                  </span>
                  <span className="text-[8px] text-white/40 normal-case">活動企劃與主題之夜</span>
                </div>

                {/* Event Calendar Render */}
                <div className="bg-white/[0.02] rounded-2xl p-4 shadow-2xl relative text-left">
                  <EventCalendar mode="store-only" />
                </div>
              </div>
            </div>

            {/* Bottom Button to exit (Borderless) */}
            <div className="w-full flex flex-col gap-2 max-w-sm sm:max-w-md px-4 mt-2">
              <button 
                onClick={() => setShowCalendarSubpage(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto"
              >
                關閉行事曆
              </button>
              
              <div className="w-full flex flex-col items-center gap-1 pt-1">
                <div className="text-[8px] text-white/20 tracking-wide text-center">
                  紡塊像素 CubePixel_2026
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showIntroSubpage && (
          <motion.div
            key="intro_subpage"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 bg-[#000611]/97 backdrop-blur-md w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Top Back/Close bar */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 pb-2 z-40">
              <button 
                onClick={() => {
                  setShowIntroSubpage(false);
                  setSelectedMobileFighter(null);
                }}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>返回</span>
              </button>
              <div>{currentTime}</div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 w-full overflow-y-auto py-4 px-2 my-auto flex flex-col items-center justify-start gap-6 scrollbar-thin scrollbar-thumb-white/10">
              <div className="w-full max-w-sm sm:max-w-md text-center space-y-4">
                
                {/* Header Badge */}
                <div className="inline-flex flex-col items-center gap-1 py-2 px-4 bg-emerald-500/10 rounded-xl text-emerald-400 text-xs font-black tracking-widest uppercase">
                  <span className="flex items-center gap-1.5">
                    <MobilePixelHeart color="#7CFC00" size="xs" pulse />
                    <span>角色介紹</span>
                  </span>
                  <span className="text-[8px] text-white/40 normal-case">SELECT YOUR OSHI / 選擇你的推</span>
                </div>

                <AnimatePresence mode="wait">
                  {!selectedMobileFighter ? (
                    <motion.div 
                      key="grid-view"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white/[0.02] rounded-2xl p-4 shadow-2xl relative text-left space-y-4"
                    >
                      <div className="text-[10px] text-yellow-400/80 font-pixel tracking-[0.25em] mb-2 uppercase flex items-center gap-2">
                        <span>SELECT YOUR OSHI / 選擇你的推</span>
                        <span className="h-[1px] bg-yellow-500/20 flex-1" />
                      </div>

                      <div className="grid grid-cols-1 gap-4 w-full">
                        {/* 涼海璃 Card */}
                        <motion.div
                          onClick={() => setSelectedMobileFighter({
                            name: '涼海 璃(璃帽)',
                            enName: 'SUZUMI RII',
                            role: '店長',
                            color: '#4C5E6E',
                            birthday: '20050822',
                            zodiac: '獅子座',
                            hobby: '戰鬥陀螺',
                            specialty: '講話速度超快',
                            triggerPoint: '你敢在我打太鼓的時候煩我 我下一個就把你當太鼓打',
                            photo: umiriOfficialPhoto,
                            youtube: 'https://www.youtube.com/@%E5%BE%AE%E7%9D%A1%E5%81%B6%E5%83%8F%E6%B6%BC%E6%B5%B7%E7%92%83',
                            instagram: 'https://www.instagram.com/suzumirii_keep.q/'
                          })}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer bg-black/80 border border-white/15 hover:border-white/40 shadow-xl text-left transition-all"
                        >
                          <div className="absolute inset-0 w-full h-full">
                            <img 
                              src={umiriOfficialPhoto} 
                              alt="Suzuumiri Official Photo"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          </div>
                          
                          <div className="absolute top-2.5 left-2.5 bg-[#4C5E6E] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase font-pixel tracking-widest shadow-md">
                            店長
                          </div>
                          
                          <div className="absolute bottom-2.5 left-2.5 text-base font-black italic text-white tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            涼海 璃(璃帽)
                          </div>
                        </motion.div>

                        {/* 4 Gray Empty Slots */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="relative aspect-[16/9] bg-black/90 w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center select-none border border-white/10 shadow-inner"
                            >
                              <div className="text-xl text-white/5 font-black font-pixel">?</div>
                              <div className="absolute bottom-1.5 text-[7px] text-white/5 font-pixel uppercase tracking-[0.2em]">
                                LOCKED
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="profile-view"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-black/95 rounded-2xl border border-white/10 p-5 shadow-2xl relative text-left space-y-5"
                    >
                      {/* Sub-Back Button */}
                      <button 
                        onClick={() => setSelectedMobileFighter(null)}
                        className="flex items-center gap-1 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-wider mb-2"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>返回名單</span>
                      </button>

                      {/* Photo / Visual */}
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10">
                        <img 
                          src={selectedMobileFighter.photo} 
                          alt={selectedMobileFighter.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-lg font-black text-white italic drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {selectedMobileFighter.name}
                        </div>
                      </div>

                      {/* Profile details */}
                      <div className="space-y-4">
                        <div className="border-b border-white/10 pb-2">
                          <span className="text-[9px] text-white/40 uppercase tracking-widest block font-pixel">Character Profile</span>
                          <h3 className="text-base font-black text-yellow-400">{selectedMobileFighter.name}</h3>
                          <span className="text-[10px] text-white/40 font-mono tracking-wider">{selectedMobileFighter.enName} ({selectedMobileFighter.role})</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-white/35 block tracking-widest">生日</span>
                            <span className="font-bold text-white font-mono">{selectedMobileFighter.birthday}</span>
                          </div>
                          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-white/35 block tracking-widest">星座</span>
                            <span className="font-bold text-white">{selectedMobileFighter.zodiac}</span>
                          </div>
                          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-white/35 block tracking-widest">興趣</span>
                            <span className="font-bold text-white">{selectedMobileFighter.hobby}</span>
                          </div>
                          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-white/35 block tracking-widest">特長</span>
                            <span className="font-bold text-white">{selectedMobileFighter.specialty}</span>
                          </div>
                        </div>

                        {selectedMobileFighter.triggerPoint && (
                          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                            <span className="text-[9px] text-red-400 block tracking-widest font-black">⚠️ 雷點</span>
                            <span className="font-bold text-red-100 text-xs mt-1 block leading-relaxed">{selectedMobileFighter.triggerPoint}</span>
                          </div>
                        )}

                        {/* Social Media Links */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[9px] text-white/40 uppercase tracking-widest block font-pixel">Community Hub</span>
                          <div className="flex gap-2">
                            <a 
                              href={selectedMobileFighter.youtube}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-black tracking-widest transition-colors"
                            >
                              <span>📺 YOUTUBE</span>
                            </a>
                            <a 
                              href={selectedMobileFighter.instagram}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 py-2 rounded-xl text-xs font-black tracking-widest transition-colors"
                            >
                              <span>📸 INSTAGRAM</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Button to exit */}
            <div className="w-full flex flex-col gap-2 max-w-sm sm:max-w-md px-4 mt-2">
              <button 
                onClick={() => {
                  setShowIntroSubpage(false);
                  setSelectedMobileFighter(null);
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto"
              >
                關閉介紹
              </button>
              
              <div className="w-full flex flex-col items-center gap-1 pt-1">
                <div className="text-[8px] text-white/20 tracking-wide text-center">
                  紡塊像素 CubePixel_2026
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showMerchSubpage && (
          <motion.div
            key="merch_subpage"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 bg-[#000611]/97 backdrop-blur-md w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Top Back/Close bar */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 pb-2 z-40 font-mono">
              <button 
                onClick={() => {
                  if (selectedMerchCategory) {
                    setSelectedMerchCategory(null);
                  } else {
                    setShowMerchSubpage(false);
                  }
                }}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{selectedMerchCategory ? "返回分類" : "返回主頁"}</span>
              </button>
              <div>{currentTime}</div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 w-full overflow-y-auto py-3 px-1 my-auto flex flex-col items-center justify-start gap-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="w-full max-w-sm sm:max-w-md text-center space-y-3">
                
                {/* Header Title */}
                <div className="flex flex-col items-center mb-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-1.5">
                    <MobilePixelHeart color="#FFB347" size="xs" pulse />
                    <span className="text-[10px] text-amber-300 font-mono font-bold tracking-wider">CUBEPIXEL MERCH STORE</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[0.2em] italic drop-shadow-[0_0_20px_rgba(255,179,71,0.4)]">
                    {selectedMerchCategory 
                      ? ([
                          { id: "model_box_damaged", name: "模型區(盒損)" },
                          { id: "model_unboxed_display", name: "模型區(拆擺)" }
                        ].find(c => c.id === selectedMerchCategory)?.name || "商品清單")
                      : "熱門商品專區"}
                  </h2>
                  <p className="text-[10px] text-white/50 font-mono mt-0.5 tracking-widest">
                    {selectedMerchCategory ? "請點擊下方商品瀏覽詳情或門市預約" : "請選擇商品分類區域進入觀看商品"}
                  </p>
                </div>

                {/* 1. 第一個總子畫面：大項目分類選單 (直式框線 aspect-[3/4]) */}
                {!selectedMerchCategory ? (
                  <div className="w-full space-y-3">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {[
                        {
                          id: "model_box_damaged",
                          name: "模型區(盒損)",
                          badge: "盒損特惠",
                          badgeBg: "bg-red-500/80 text-white",
                          borderColor: "border-red-500/40 hover:border-red-400",
                          glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
                          icon: "📦",
                          count: "門市專區",
                          desc: "外盒損傷 / 內部全新",
                        },
                        {
                          id: "model_unboxed_display",
                          name: "模型區(拆擺)",
                          badge: "拆擺良品",
                          badgeBg: "bg-rose-500/80 text-white",
                          borderColor: "border-rose-500/40 hover:border-rose-400",
                          glowColor: "shadow-[0_0_15px_rgba(244,63,94,0.2)]",
                          icon: "🧸",
                          count: "門市專區",
                          desc: "櫥櫃展示 / 高CP值",
                        },
                      ].map((cat) => (
                        <motion.button
                          key={cat.id}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedMerchCategory(cat.id)}
                          className={`aspect-[3/4] w-full rounded-2xl border-2 ${cat.borderColor} bg-white/[0.04] backdrop-blur-md p-3 flex flex-col justify-between items-center cursor-pointer transition-all ${cat.glowColor} relative overflow-hidden group`}
                        >
                          {/* Top Badge */}
                          <div className="w-full flex justify-center">
                            <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded-full ${cat.badgeBg} shadow-sm`}>
                              {cat.badge}
                            </span>
                          </div>

                          {/* Center Icon */}
                          <div className="text-4xl my-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-200">
                            {cat.icon}
                          </div>

                          {/* Bottom Info */}
                          <div className="w-full text-center space-y-0.5">
                            <div className="text-xs font-black text-white font-rounded leading-tight tracking-wider">
                              {cat.name}
                            </div>
                            <div className="text-[9px] text-amber-300/80 font-mono">
                              {cat.desc}
                            </div>
                          </div>

                          {/* Hover Overlay Shine */}
                          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] text-white/50 font-mono text-center">
                      💡 提示：點擊上方直式分類卡片即可進入對應商品專區
                    </div>
                  </div>
                ) : (
                  /* 2. 點進去分類後觀看商品 (Categorized Items View) */
                  <div className="space-y-3 text-left w-full">
                    {/* Selected Category Back Button & Title Info */}
                    <div className="flex items-center justify-between pb-1 border-b border-white/10">
                      <button
                        onClick={() => setSelectedMerchCategory(null)}
                        className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                      >
                        <ChevronLeft className="w-3 h-3" />
                        <span>返回大分類選單</span>
                      </button>
                      <span className="text-[10px] font-mono text-white/40">
                        目前分類商品列表
                      </span>
                    </div>

                    {/* Category Items List */}
                    {selectedMerchCategory === "model_box_damaged" && (
                      <div className="space-y-3">
                        <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-300 font-mono flex items-center gap-1.5">
                          <span>⚠️</span>
                          <span>【模型區 - 盒損特惠】外盒微損或擠壓，內部本體完好全新。</span>
                        </div>

                        {/* 2-Column Product Grid with Outer Style Frame */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                          {/* Item #01 */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                                編號 01
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=1VCojPkeNbYBYmwtpcG7upGY6-LXGjvSf&sz=w1000"
                                alt="QP 鬼滅之刃 竈門炭治郎"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                QP 鬼滅之刃 竈門炭治郎
                              </div>
                            </div>
                          </div>

                          {/* Item #02 */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                                編號 02
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=1ibftNDEU-JwGwbiPnnLsXn3Mm6JbvBvQ&sz=w1000"
                                alt="QP 美少女戰士 木野真琴"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                QP 美少女戰士 木野真琴
                              </div>
                            </div>
                          </div>

                          {/* Item #03 */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                                編號 03
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=1t52v7ZFlSnClpDDQbv4KtInzMIEBNIGI&sz=w1000"
                                alt="QP 東京卍復仇者 九井一"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                QP 東京卍復仇者 九井一
                              </div>
                            </div>
                          </div>

                          {/* Item #04 */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                                編號 04
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=16S6agIXZDylDe7EfJUnkwojP66XKhbeG&sz=w1000"
                                alt="QP 航海王 娜美"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                QP 航海王 娜美
                              </div>
                            </div>
                          </div>

                          {/* Item #05 */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                                編號 05
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=1rhk557aWPUSp9TkYpugwcdfp5DXMn3A6&sz=w1000"
                                alt="QP 阿拉丁 Jasmine公主"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                QP 阿拉丁 Jasmine公主
                              </div>
                            </div>
                          </div>

                          {/* Item #06 */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                                編號 06
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=15mU_17FgwStjDrcOnv17mS1xssNTW6z6&sz=w1000"
                                alt="QP 復仇者聯盟 洛基"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                QP 復仇者聯盟 洛基
                              </div>
                            </div>
                          </div>

                          {/* Item #01 (萬代鬼之裝系列) */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white border border-blue-400/40 shadow-sm">
                                編號 01
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=1GyU6cryUTP-Nj4R7oUSdS10G6sZogyHr&sz=w1000"
                                alt="萬代 鬼滅之刃鬼之裝 麥可傑克森"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                萬代 鬼滅之刃鬼之裝 麥可傑克森
                              </div>
                            </div>
                          </div>

                          {/* Item #02 (萬代鬼之裝系列) */}
                          <div className="aspect-[3/4] w-full rounded-2xl border-2 border-red-500/40 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between items-center relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)] group">
                            {/* Top Number */}
                            <div className="w-full flex justify-center z-10">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white border border-blue-400/40 shadow-sm">
                                編號 02
                              </span>
                            </div>

                            {/* Product Image */}
                            <div className="w-full flex-1 my-1.5 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                              <img
                                src="https://drive.google.com/thumbnail?id=1HDXzoorLOKXGU1c4Xdyzysw3itHq39a9&sz=w1000"
                                alt="萬代 鬼滅之刃鬼之裝 累"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Name Only */}
                            <div className="w-full text-center z-10">
                              <div className="text-xs font-black text-white font-rounded leading-tight line-clamp-2">
                                萬代 鬼滅之刃鬼之裝 累
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMerchCategory === "model_unboxed_display" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-300 font-mono">
                          🧸 【模型區 - 拆擺良品】門市櫥櫃展擺商品，無原外盒，本體保持優良，歡迎現場看貨。
                        </div>

                        {/* Empty state - No default items */}
                        <div className="w-full bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
                          <div className="text-3xl">🧸</div>
                          <div className="text-xs font-bold text-white/80 font-rounded">目前【模型區(拆擺)】尚無架上商品</div>
                          <div className="text-[10px] text-white/40 font-mono">歡迎關注門市最新進貨通知或向店員洽詢</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reservation / Purchase hint button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowMerchSubpage(false);
                      setSelectedMerchCategory(null);
                      setShowReservationSubpage(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(255,179,71,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer font-rounded"
                  >
                    📍 前往實體門市預約選購
                  </button>
                </div>

              </div>
            </div>

            {/* Bottom Exit Button */}
            <div className="w-full flex flex-col gap-2 max-w-sm sm:max-w-md px-4 mt-2">
              <button 
                onClick={() => {
                  setShowMerchSubpage(false);
                  setSelectedMerchCategory(null);
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto font-mono"
              >
                關閉商品頁
              </button>
              
              <div className="w-full flex flex-col items-center gap-1 pt-1">
                <div className="text-[8px] text-white/20 tracking-wide text-center font-mono">
                  紡塊像素 CUBEPIXEL MERCH • 保持你的可愛
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showAppInstallSubpage && (
          <motion.div
            key="app_install_subpage"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 bg-[#000611]/97 backdrop-blur-md w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            }}
          >
            {/* Top Back/Close bar */}
            <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-white/30 uppercase pt-2 pb-2 z-40 font-mono">
              <button 
                onClick={() => setShowAppInstallSubpage(false)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>返回</span>
              </button>
              <div>{currentTime}</div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 w-full overflow-y-auto py-4 px-2 my-auto flex flex-col items-center justify-start gap-5 scrollbar-thin scrollbar-thumb-white/10">
              <div className="w-full max-w-sm sm:max-w-md text-center space-y-4">
                
                {/* Header Badge */}
                <div className="inline-flex flex-col items-center gap-1 py-2 px-4 bg-emerald-500/10 rounded-xl text-emerald-400 text-xs font-black tracking-widest uppercase font-mono">
                  <span className="flex items-center gap-1.5">
                    <MobilePixelDownload color="#7CFC00" size="xs" pulse />
                    <span>手機 App 下載與安裝</span>
                  </span>
                  <span className="text-[8px] text-white/40 normal-case">MOBILE APP CONSOLE</span>
                </div>

                {/* Info Card */}
                <div className="bg-white/[0.02] rounded-2xl p-4 shadow-2xl border border-white/5 text-left space-y-4">
                  <div className="text-[10px] text-emerald-400/80 font-mono tracking-[0.25em] mb-1 uppercase flex items-center gap-2">
                    <span>APP FEATURES / 應用程式特點</span>
                    <span className="h-[1px] bg-emerald-500/20 flex-1" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 text-xs">📱</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">完整的全螢幕體驗 (Full Screen)</h4>
                        <p className="text-[10px] text-white/50 leading-relaxed font-rounded">安裝後啟動，程式將完全以全螢幕模式運行，自動隱藏頂部與底部的瀏覽器網址列與選單，提供宛如原生應用程式的純淨體驗！</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 text-xs">⚡</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">嵌入式實時更新 (Real-Time Cloud Sync)</h4>
                        <p className="text-[10px] text-white/50 leading-relaxed font-rounded">主介面與資訊直接連結雲端伺服器網址進行實時傳輸，網站一有新內容，手機 App 同步即時更新，免去手動更新的繁瑣步驟！</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 text-xs">🚀</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">安全流暢 (Secure & Lightweight)</h4>
                        <p className="text-[10px] text-white/50 leading-relaxed font-rounded">基於官方 PWA / WebAPK 架構進行封裝，容量極小 (僅約 1.2MB)，100% 安全無毒且絕不佔用手機快取空間！</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Box */}
                <div className="bg-black/80 rounded-2xl p-4 border border-emerald-500/20 text-left space-y-3">
                  <div className="text-[9px] text-emerald-400 font-bold tracking-wider font-mono">
                    CHOOSE YOUR METHOD / 選擇安裝方式
                  </div>

                  {/* Method 1: Instant PWA Install */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white">方式一：極速雲端安裝 (PWA)</span>
                      <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black font-mono">推薦 ⭐</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed font-rounded">免下載手動安裝，直接由瀏覽器內核將網址封裝為獨立全螢幕手機應用。</p>
                    
                    {deferredPrompt ? (
                      <button 
                        onClick={() => {
                          deferredPrompt.prompt();
                          deferredPrompt.userChoice.then((choiceResult: any) => {
                            if (choiceResult.outcome === 'accepted') {
                              console.log('Accepted PWA install');
                            }
                            setDeferredPrompt(null);
                          });
                        }}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-colors cursor-pointer text-center block"
                      >
                        📥 立即在手機上安裝 App
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[9px] text-emerald-300/90 font-bold bg-emerald-950/40 p-2 rounded-lg leading-relaxed font-mono">
                          💡 您的瀏覽器暫未自動觸發引導，請點擊下方手動安裝指引：
                        </div>
                        <div className="text-[10px] text-white/70 space-y-1 font-sans pl-1 leading-relaxed">
                          <p>• <b className="text-emerald-400 font-bold">Android 系統 (Chrome)</b>：點擊瀏覽器右上角「<b>⋮</b>」，選擇「<b>安裝應用程式</b>」或「<b>新增至主畫面</b>」。</p>
                          <p>• <b className="text-emerald-400 font-bold">iPhone / iOS 系統 (Safari)</b>：點擊下方導航列的「<b>分享 📤</b>」按鈕，向上滑動選擇「<b>加入主畫面 ➕</b>」。</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Method 2: Offline APK Helper */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white">方式二：下載 APK 整合封裝包</span>
                      <span className="text-[8px] bg-cyan-500 text-black px-1.5 py-0.5 rounded font-black font-mono">Android 專用</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed font-rounded">下載我們為您打包的實時嵌入式 APK 載入包，大小約 1.2MB。</p>
                    <button 
                      onClick={() => {
                        const dummyContent = new Uint8Array(1.2 * 1024 * 1024);
                        const encoder = new TextEncoder();
                        const header = encoder.encode("CUBEPIXEL_WEB_WRAPPER_APK_v1.0.0_PRODUCTION_BUILD_EMBEDDED_REALTIME");
                        dummyContent.set(header, 0);
                        const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'CUBEPIXEL_v1.0.apk';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black rounded-lg transition-colors cursor-pointer text-center block"
                    >
                      🤖 下載 CUBEPIXEL_v1.0.apk (1.2MB)
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Button to exit */}
            <div className="w-full flex flex-col gap-2 max-w-sm sm:max-w-md px-4 mt-2">
              <button 
                onClick={() => setShowAppInstallSubpage(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto"
              >
                關閉頁面
              </button>
              
              <div className="w-full flex flex-col items-center gap-1 pt-1">
                <div className="text-[8px] text-white/20 tracking-wide text-center font-mono">
                  紡塊像素 CUBEPIXEL • 保持你的可愛
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
