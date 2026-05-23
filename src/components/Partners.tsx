import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '../lib/supabase';

interface Partner {
  id: string;
  name: string;
  color: string;
  svg: React.ReactNode;
}

const fallbackPartners: Partner[] = [
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    color: '#FF7200',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-8 w-auto">
        <text x="6" y="28" fontSize="22" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="-0.5">itaú</text>
        <text x="52" y="28" fontSize="10" fontWeight="400" fontFamily="Outfit, sans-serif">unibanco</text>
      </svg>
    ),
  },
  {
    id: 'pf',
    name: 'Polícia Federal',
    color: '#1B4FBB',
    svg: (
      <svg viewBox="0 0 160 40" fill="currentColor" className="h-8 w-auto">
        <rect x="4" y="8" width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.15" />
        <text x="8" y="24" fontSize="13" fontWeight="700" fontFamily="Arial" fill="currentColor">🛡</text>
        <text x="34" y="16" fontSize="9" fontWeight="700" fontFamily="Outfit, sans-serif">DEPARTAMENTO DE</text>
        <text x="34" y="28" fontSize="9" fontWeight="700" fontFamily="Outfit, sans-serif">POLÍCIA FEDERAL</text>
      </svg>
    ),
  },
  {
    id: 'stefanini',
    name: 'Stefanini',
    color: '#E63329',
    svg: (
      <svg viewBox="0 0 130 40" fill="currentColor" className="h-8 w-auto">
        <text x="4" y="28" fontSize="24" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="-1">Stefanini</text>
      </svg>
    ),
  },
  {
    id: 'keltech',
    name: 'Kel Tech Solutions',
    color: '#00C2FF',
    svg: (
      <svg viewBox="0 0 160 40" fill="currentColor" className="h-8 w-auto">
        <rect x="4" y="10" width="20" height="20" rx="5" fill="currentColor" fillOpacity="0.2" />
        <text x="8" y="25" fontSize="14" fontWeight="700" fill="currentColor">K</text>
        <text x="30" y="22" fontSize="13" fontWeight="700" fontFamily="Outfit, sans-serif">Kel Tech</text>
        <text x="30" y="34" fontSize="9" fontWeight="400" fontFamily="Outfit, sans-serif" fillOpacity="0.7">Solutions</text>
      </svg>
    ),
  },
  {
    id: 'ecglobal',
    name: 'EC Global',
    color: '#8B5CF6',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-8 w-auto">
        <circle cx="20" cy="20" r="14" fill="currentColor" fillOpacity="0.15" />
        <text x="12" y="25" fontSize="14" fontWeight="700" fill="currentColor">EC</text>
        <text x="40" y="22" fontSize="14" fontWeight="700" fontFamily="Outfit, sans-serif">EC Global</text>
      </svg>
    ),
  },
  {
    id: 'ebakery',
    name: 'eBakery',
    color: '#F59E0B',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-8 w-auto">
        <text x="4" y="28" fontSize="22" fontWeight="900" fontFamily="Outfit, sans-serif">eBakery</text>
      </svg>
    ),
  },
];

const PartnerItem: React.FC<{ partner: Partner }> = ({ partner }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.12 }}
      className="group flex-shrink-0 mx-10 flex items-center justify-center cursor-default transition-all duration-300"
    >
      <div
        className="text-slate-600 group-hover:text-current transition-colors duration-400"
        style={{ '--partner-color': partner.color } as React.CSSProperties}
      >
        <div
          className="grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-400"
          style={{ color: partner.color }}
          title={partner.name}
        >
          {partner.svg}
        </div>
      </div>
    </motion.div>
  );
};

const Partners: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const [partnerList, setPartnerList] = useState<Partner[]>(fallbackPartners);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase.from('partners').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const parsed = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            color: d.color,
            svg: d.svg_markup.trim().startsWith('<svg') ? (
              <div dangerouslySetInnerHTML={{ __html: d.svg_markup }} />
            ) : (
              <img src={d.svg_markup} alt={d.name} className="h-8 w-auto object-contain max-h-8 filter brightness-75 group-hover:brightness-100 transition-all duration-300" />
            )
          }));
          setPartnerList(parsed);
        }
      } catch (err) {
        console.warn('Error fetching partners from Supabase, using fallback static data:', err);
      }
    };
    fetchPartners();
  }, []);

  // Duplicate for seamless loop
  const doubled = [...partnerList, ...partnerList];

  return (
    <section className="relative py-28 sm:py-36 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 mb-4 tracking-wider uppercase">
            Empresas & Clientes
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Por onde minha jornada passou
          </h2>
          <p className="text-slate-500 text-base">
            Grandes marcas que confiaram no meu trabalho.
          </p>
        </motion.div>

        {/* Infinite ticker */}
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {doubled.map((partner, i) => (
              <PartnerItem key={`${partner.id}-${i}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
