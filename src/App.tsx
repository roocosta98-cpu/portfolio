import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Skills from './components/Skills';
import BentoGrid from './components/BentoGrid';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PortfolioSection from './components/PortfolioSection';
import Testimonials from './components/Testimonials';
import FlashlightEffect from './components/FlashlightEffect';

// Import newly created routes
import BlogList from './components/BlogList';
import BlogPostView from './components/BlogPostView';
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';

import { supabase } from './lib/supabase';

// Ambient particles
const ParticleField: React.FC = () => {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 12,
    size: 2 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-violet-400"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, bottom: 0, opacity: 0 }}
          animate={{ y: [0, -(window.innerHeight + 100)], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

const PortfolioHome: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="section-divider" />
      <Timeline />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <PortfolioSection />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <BentoGrid />
      <div className="section-divider" />
      <Partners />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />
      <Contact />
    </>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative min-h-screen bg-[#020409]">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{ scaleX, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
      />

      {/* Flashlight effect — above content, below UI chrome */}
      <FlashlightEffect />

      {/* Ambient particles */}
      <ParticleField />

      {/* Nav */}
      <Navbar />

      {/* Main content — z-10 so it sits above the flashlight overlay */}
      <main className="relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('site_title, favicon_url')
          .eq('id', 'global')
          .single();
        if (data) {
          if (data.site_title) {
            document.title = data.site_title;
          }
          if (data.favicon_url) {
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (link) {
              link.href = data.favicon_url;
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load global site settings.", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Visitor Pages */}
        <Route
          path="/"
          element={
            <MainLayout>
              <PortfolioHome />
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <BlogList />
            </MainLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <MainLayout>
              <BlogPostView />
            </MainLayout>
          }
        />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
