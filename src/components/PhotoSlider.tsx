import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface SliderPhoto {
  src: string;
  alt: string;
  tag: string;
}

const photos: SliderPhoto[] = [
  { src: '/fotos/foto1.jpg', alt: 'Rodrigo Tagashira — Red Hoodie',    tag: '🎨 The Creative'    },
  { src: '/fotos/foto2.jpg', alt: 'Rodrigo Tagashira — Green Blazer',  tag: '💼 The Professional' },
  { src: '/fotos/foto3.jpg', alt: 'Rodrigo Tagashira — All Black',     tag: '⚡ Dev Mode'          },
  { src: '/fotos/foto4.jpg', alt: 'Rodrigo Tagashira — Tech Office',   tag: '🖥️ In The Zone'       },
  { src: '/fotos/foto5.jpg', alt: 'Rodrigo Tagashira — Zona de Geek',  tag: '🎮 Geek Side'         },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, scale: 0.97, transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }),
};

const PhotoSlider: React.FC = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [autoplay, setAutoplay] = useState(true);

  const navigate = useCallback((dir: 1 | -1) => {
    setCurrent(([prev]) => [(prev + dir + photos.length) % photos.length, dir]);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => navigate(1), 4500);
    return () => clearInterval(id);
  }, [autoplay, navigate]);

  const goTo = (index: number) => {
    const dir = index > current ? 1 : -1;
    setCurrent([index, dir]);
  };

  return (
    <div className="w-full select-none">
      {/* Main slider */}
      <div
        className="relative overflow-hidden rounded-2xl bg-[#020409]"
        style={{ aspectRatio: '4/5', maxHeight: '520px' }}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <img
              src={photos[current].src}
              alt={photos[current].alt}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

            {/* Badge ONLY — no title text */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute bottom-4 left-4"
            >
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-md border border-white/20">
                {photos[current].tag}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        {/* Counter */}
        <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15">
          <span className="text-white/70 text-[10px] font-mono">
            {String(current + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
          <Camera size={12} className="text-white/60" />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {photos.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="cursor-pointer">
            <motion.div
              animate={{ width: i === current ? 22 : 7, backgroundColor: i === current ? '#a78bfa' : 'rgba(255,255,255,0.18)' }}
              className="h-1.5 rounded-full"
              style={{ width: 7 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoSlider;
