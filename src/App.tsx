import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState, useMemo, useRef, createContext, useContext, ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Menu, X, Github as GithubIcon, Download, ChevronRight, Search, BookOpen, Clock, User, ArrowRight, Layers, Zap, Globe, Shield, Bell, CheckCircle, Heart, Wind, Lock, Star, ExternalLink, Instagram, Send, MoreVertical, Plus, ShoppingCart, Library, Tv, ShieldCheck, Cloud } from "lucide-react";
import { BLOG_POSTS, ManhwaItem, NewsSection } from "./data/blogPosts";
import { cn } from "./lib/utils";

// --- Helper Functions ---

const handleDownload = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  if (isAndroid) {
    // Trigger direct APK download
    const link = document.createElement('a');
    link.href = '/atrix-beta.apk';
    link.download = 'atrix-beta.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (isIOS) {
    alert("Atrix for iOS is currently in beta. Stay tuned for the IPA release!");
  } else {
    // Desktop or other
    const confirmDownload = confirm("Atrix Explorer is a mobile-first experience. Would you like to download the Android APK directly?");
    if (confirmDownload) {
      const link = document.createElement('a');
      link.href = '/atrix-beta.apk';
      link.download = 'atrix-beta.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  // Optimized scroll detection using motion's useScroll
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      if (latest > 50) {
        if (!scrolled) setScrolled(true);
      } else {
        if (scrolled) setScrolled(false);
      }
    });
  }, [scrolled, scrollY]);

  // Close menu on route change
  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "FEATURES", path: "/features" },
    { name: "BLOG", path: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      {/* Background Layer for Performance */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500 -z-10",
        scrolled ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-brand-bg/90 backdrop-blur-xl border-b border-brand-border shadow-sm" />
      </div>

      <div className={cn(
        "max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between transition-all duration-300",
        scrolled ? "h-16" : "h-20 sm:h-24"
      )}>
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-lg bg-brand-primary">
            <span className="font-black text-xl italic tracking-tighter text-brand-bg">A</span>
          </div>
          <span className="text-xl font-black tracking-tighter transition-colors whitespace-nowrap text-brand-text">ATRIX EXPLORER</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-xs font-black tracking-widest transition-all",
                    isActive
                      ? "text-brand-text"
                      : "text-brand-grey/40 hover:text-brand-text"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="h-11 px-6 rounded-2xl bg-brand-primary text-brand-bg font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              GET APK <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            className="p-2 transition-colors text-brand-text"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 border-b border-brand-border bg-brand-bg md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              {navLinks.map((link) => {
                const isActive = link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-2xl font-black transition-colors uppercase tracking-widest",
                      isActive ? "text-brand-text" : "text-brand-grey/40 hover:text-brand-text"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="h-px bg-brand-border" />
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-primary text-brand-bg font-black uppercase tracking-widest shadow-xl"
              >
                GET APK <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="pt-32 pb-16 border-t transition-colors bg-brand-bg border-brand-border">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-16 mb-20">
          <div className="col-span-1 md:col-span-3">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-brand-primary">
                <span className="font-black italic tracking-tighter text-brand-bg">A</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-brand-text">ATRIX EXPLORER</span>
            </Link>
            <p className="text-brand-grey max-w-sm mb-10 leading-relaxed text-lg font-light">
              The ultimate hybrid tracking experience. Your personalized digital library for everything you watch and read.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl transition-all border bg-brand-card border-brand-border hover:opacity-80">
                <GithubIcon size={24} className="text-brand-text" />
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 text-sm">
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs opacity-50 text-brand-text">App</h4>
            <ul className="space-y-4">
              {["Hybrid Engine", "Hybrid Reminders", "Manual Entry", "Global Hub"].map(i => (
                <li key={i}><Link to="/features" className="text-brand-grey hover:text-brand-text transition-colors">{i}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 md:col-span-1 text-sm">
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs opacity-50 text-brand-text">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={handleDownload} className="text-brand-grey hover:text-brand-text transition-colors">Android (Direct)</button></li>
              <li className="text-brand-grey/40 cursor-not-allowed">iOS (Pending)</li>
              <li><Link to="/freedom" className="text-brand-grey hover:text-brand-text transition-colors">OS Sovereignty</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-1 text-sm">
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs opacity-50 text-brand-text">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-brand-grey hover:text-brand-text transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-brand-grey hover:text-brand-text transition-colors">Terms of Service</Link></li>
              <li><Link to="/freedom" className="text-brand-grey hover:text-brand-text transition-colors">Freedom Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 border-brand-border">
          <p className="text-brand-grey/40 text-xs font-mono">© 2026 ATRIX EXPLORER. THE FLEXIBLE LIBRARY SYSTEM.</p>
          <div className="flex items-center gap-6">
            <div className="w-2 h-2 rounded-full animate-pulse bg-brand-primary" />
            <span className="text-brand-grey/40 text-xs font-mono uppercase">System Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

// --- UI Mockup Components ---

const NotificationMockup = ({ isStatic }: { isStatic?: boolean }) => (
  <motion.div
    initial={isStatic ? undefined : { opacity: 0, x: 20 }}
    whileInView={isStatic ? undefined : { opacity: 1, x: 0 }}
    viewport={isStatic ? undefined : { once: true }}
    className="relative z-10 p-4 rounded-2xl shadow-2xl border flex items-center gap-4 max-w-xs bg-brand-card border-brand-border"
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary text-brand-bg shadow-lg shadow-brand-primary/10">
      <Bell size={20} />
    </div>
    <div className="flex-1">
      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5 text-brand-text">Instant Alert</div>
      <div className="text-sm font-bold tracking-tight text-brand-text">New Chapter: Regression</div>
      <div className="text-[10px] opacity-60 text-brand-grey font-medium">Chapter 142 is now live!</div>
    </div>
  </motion.div>
);

const LibraryItemMockup = ({ title, progress, subtitle }: { title: string, progress: number, subtitle?: string }) => (
  <div className="relative z-10 p-4 rounded-xl border border-brand-border flex items-center gap-4 transition-all hover:translate-y-[-2px] w-full bg-brand-card shadow-sm">
    <div className="w-14 h-20 rounded-lg bg-brand-primary/5 flex-shrink-0 relative overflow-hidden ring-1 ring-brand-border">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent" />
    </div>
    <div className="flex-1 min-w-0 text-left">
      <div className="flex justify-between items-start mb-1">
        <div className="text-sm font-bold truncate tracking-tight text-brand-text/90">{title}</div>
        <MoreVertical size={14} className="opacity-40 flex-shrink-0 text-brand-text" />
      </div>
      <div className="text-[10px] mb-3 uppercase tracking-wider font-semibold text-brand-grey opacity-60">{subtitle || "manhwa • Today"}</div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-brand-primary/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            className="h-full bg-brand-primary/80"
          />
        </div>
        <div className="text-[9px] font-mono whitespace-nowrap text-brand-grey opacity-50">
          {Math.floor(progress * 1.2)} / 120 CH
        </div>
      </div>
    </div>
  </div>
);

const LibraryHeaderMockup = () => (
  <div className="mb-8 text-brand-text">
    <div className="flex items-center justify-between mb-6">
      <h4 className="text-2xl font-black tracking-tight">Your Library</h4>
      <div className="flex items-center gap-4 opacity-60">
        <Plus size={20} />
        <Layers size={20} />
        <MoreVertical size={20} />
      </div>
    </div>
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
      {[
        { name: "Plan", icon: ShoppingCart },
        { name: "Ongoing", icon: Library },
        { name: "Drop", icon: Star },
        { name: "Completed", icon: CheckCircle }
      ].map((tab, i) => (
        <div key={tab.name} className={cn(
          "px-4 py-2 rounded-xl text-[10px] font-bold border flex items-center gap-2 whitespace-nowrap snap-start",
          i === 2 ? "bg-brand-primary text-brand-bg border-brand-primary" : "opacity-40 border-current"
        )}>
          <tab.icon size={12} /> {tab.name}
        </div>
      ))}
    </div>
  </div>
);

// --- Background Blob Component ---

const BackgroundBlob = ({
  className,
  color = "bg-brand-grey/30",
  size = "w-64 h-64",
  variant = 0,
  style,
  animateProps
}: {
  className: string,
  color?: string,
  size?: string,
  variant?: number,
  style?: React.CSSProperties,
  animateProps?: any
}) => {
  // Parse standard Tailwind bg class and extract opacity
  let fillStyleColor = "var(--color-brand-grey)";
  let opacity = 0.22; // Distinct static presence

  const match = color.match(/^bg-([^\/]+)(?:\/(\d+))?$/);
  if (match) {
    const name = match[1];
    const opacityRaw = match[2];

    // Explicitly map standard and brand colors to CSS variables or HEX colors
    if (name === "brand-primary") {
      fillStyleColor = "var(--color-brand-primary)";
    } else if (name === "brand-grey") {
      fillStyleColor = "var(--color-brand-grey)";
    } else if (name === "zinc-400") {
      fillStyleColor = "#a1a1aa";
    } else if (name === "zinc-500") {
      fillStyleColor = "#71717a";
    } else if (name === "zinc-600") {
      fillStyleColor = "#52525b";
    } else {
      fillStyleColor = `var(--color-${name})`;
    }

    if (opacityRaw) {
      const parsedOpacity = parseInt(opacityRaw, 10) / 100;
      opacity = Math.min(0.40, parsedOpacity * 1.2);
    } else {
      opacity = 0.30;
    }
  }

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none opacity-90",
        size,
        className
      )}
      style={{ zIndex: -1, ...style }}
      {...(animateProps ? {
        animate: animateProps,
        transition: {
          duration: 12 + (variant * 2),
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {})}
    >
      <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d={BLOB_PATHS[variant % BLOB_PATHS.length]}
          style={{ fill: fillStyleColor, fillOpacity: opacity }}
          className="transition-all duration-300"
        />
      </svg>
    </motion.div>
  );
};

const BLOB_PATHS = [
  "M45.5,-58.5C59.7,-49.2,72.7,-36.8,77.5,-22.1C82.3,-7.3,78.9,9.8,71.2,25.2C63.5,40.6,51.5,54.3,37.3,62.8C23.1,71.3,6.7,74.6,-9.3,72.4C-25.3,70.2,-40.9,62.5,-53.4,51.3C-65.8,40.1,-75.1,25.3,-78.9,9.4C-82.7,-6.6,-81,-23.7,-72,-37.2C-63.1,-50.7,-46.9,-60.7,-31.1,-69.1C-15.3,-77.6,0.3,-84.4,14.6,-81.2C28.8,-78,41.2,-64.8,45.5,-58.5Z",
  "M40.1,-55C52.9,-47.5,64.8,-37.6,71.1,-25.2C77.4,-12.9,78,-1.9,74.5,8C70.9,18,63.1,26.9,54.4,34.8C45.6,42.7,35.8,49.6,24.8,55.9C13.8,62.2,1.6,68,-10.1,67.3C-21.7,66.6,-32.8,59.5,-41.8,51.2C-50.7,42.9,-57.4,33.4,-63.3,22.4C-69.2,11.5,-74.3,-1,-73.4,-13.4C-72.5,-25.7,-65.7,-38,-55.4,-46.4C-45.1,-54.7,-31.3,-59.2,-18.2,-61.8C-5,-64.3,7.5,-65,20.4,-62.4C33.3,-59.8,40.1,-55,40.1,-55Z",
  "M33.4,-44.6C44.1,-36.1,54.1,-27.4,58.8,-16.4C63.6,-5.5,63.2,7.7,58.7,20.2C54.1,32.7,45.4,44.6,33.9,52C22.4,59.4,8.1,62.3,-5.4,60.8C-19,59.3,-31.7,53.4,-42.6,44.6C-53.5,35.8,-62.6,24.1,-65.3,11.1C-68.1,-1.9,-64.5,-16.1,-56.9,-27.9C-49.3,-39.7,-37.7,-49.2,-25.4,-57C-13.1,-64.8,0.1,-71,11.5,-69.1C23,-67.2,33.4,-57.2,33.4,-44.6Z",
  "M38.5,-59.3C50.2,-51.2,60.2,-39.7,68.2,-25.6C76.1,-11.5,82,5.2,78.2,19.3C74.3,33.4,60.7,45,46.7,55C32.7,65.1,18.4,73.6,2.2,70.5C-14,67.4,-32,52.8,-46,39.3C-60,25.8,-70,13.4,-74.6,-1.5C-79.1,-16.4,-78.2,-33.7,-68.8,-45.3C-59.3,-56.9,-41.2,-62.8,-25.8,-68.1C-10.4,-73.4,2.3,-78.2,15.7,-76.3C29.1,-74.4,36.8,-67.3,38.5,-59.3Z"
];

const DecorativeOrganic = ({
  className,
  color = "fill-brand-grey/5",
  size = "w-48 h-48",
  variant = 0,
  style
}: {
  className?: string,
  color?: string,
  size?: string,
  delay?: number,
  variant?: number,
  style?: React.CSSProperties
}) => {
  let fillStyleColor = "var(--color-brand-grey)";
  let opacity = 0.08;

  const match = color.match(/^fill-([^\/]+)(?:\/(\d+))?$/);
  if (match) {
    const name = match[1];
    const opacityRaw = match[2];
    if (name === "brand-primary") {
      fillStyleColor = "var(--color-brand-primary)";
    } else {
      fillStyleColor = "var(--color-brand-grey)";
    }
    if (opacityRaw) {
      opacity = (parseInt(opacityRaw, 10) / 100) * 1.5; // Premium visibility
    }
  }

  return (
    <div
      className={cn(
        "absolute pointer-events-none opacity-40",
        size,
        className
      )}
      style={{ zIndex: -1, ...style }}
    >
      <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d={BLOB_PATHS[variant % BLOB_PATHS.length]}
          style={{ fill: fillStyleColor, fillOpacity: opacity }}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="6 6"
          strokeOpacity="0.55"
        />
      </svg>
    </div>
  );
};

const FloatingDot = ({
  className,
  size = "w-4 h-4",
  style
}: {
  className?: string,
  delay?: number,
  size?: string,
  style?: React.CSSProperties
}) => (
  <div
    className={cn("absolute rounded-full bg-brand-text opacity-40 pointer-events-none", size, className)}
    style={{ zIndex: -1, ...style }}
  />
);

const DottedPath = ({
  className,
  d = "M10 80 Q 50 10 120 80",
  width = 200,
  height = 100,
  viewBox = "0 0 200 100",
  style
}: {
  className?: string,
  d?: string,
  width?: number,
  height?: number,
  viewBox?: string,
  style?: React.CSSProperties
}) => (
  <svg
    className={cn("absolute pointer-events-none opacity-20", className)}
    style={{ zIndex: -1, ...style }}
    width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg"
  >
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" className="text-brand-text" />
  </svg>
);

const PencilConnector = ({
  className,
  d,
  viewBox = "0 0 100 200",
  style
}: {
  className?: string,
  d: string,
  viewBox?: string,
  style?: React.CSSProperties
}) => {
  return (
    <svg
      className={cn("absolute pointer-events-none text-brand-grey/25", className)}
      style={{ zIndex: 1, ...style }}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
    </svg>
  );
};


const HomePage = () => {
  return (
    <div className="relative overflow-hidden bg-brand-bg text-brand-text isolate">
      <Helmet>
        <title>Atrix Explorer | Your Simple Manhwa Tracker</title>
        <meta name="description" content="Stop forgetting where you left off. Atrix Explorer helps you track your library with zero effort and lightning fast updates." />
      </Helmet>

      {/* Flowing Pencil Sketch Connectors */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* Connector 1: Hero Section (Right) -> Problem Section (Left) */}
        <PencilConnector
          className="hidden lg:block top-[11%] right-[5%] w-[400px] h-[600px]"
          viewBox="0 0 400 600"
          d="M380,50 C300,200 150,400 30,550"
        />
        <PencilConnector
          className="lg:hidden top-[14%] left-[50%] -translate-x-1/2 w-[80px] h-[300px]"
          viewBox="0 0 80 300"
          d="M40,0 C20,100 60,200 40,300"
        />

        {/* Connector 2: Problem Section (Left) -> Solution Section (Right) */}
        <PencilConnector
          className="hidden lg:block top-[27%] left-[5%] w-[450px] h-[600px]"
          viewBox="0 0 450 600"
          d="M30,50 C120,220 280,380 420,550"
        />
        <PencilConnector
          className="lg:hidden top-[31%] left-[50%] -translate-x-1/2 w-[80px] h-[300px]"
          viewBox="0 0 80 300"
          d="M40,0 C60,100 20,200 40,300"
        />

        {/* Connector 3: Solution Section (Right) -> Discovery Hub (Left) */}
        <PencilConnector
          className="hidden lg:block top-[43%] right-[5%] w-[450px] h-[650px]"
          viewBox="0 0 450 650"
          d="M420,50 C320,250 180,420 30,600"
        />
        <PencilConnector
          className="lg:hidden top-[47%] left-[50%] -translate-x-1/2 w-[80px] h-[300px]"
          viewBox="0 0 80 300"
          d="M40,0 C20,100 60,200 40,300"
        />

        {/* Connector 4: Discovery Hub (Left) -> Library Organization (Right) */}
        <PencilConnector
          className="hidden lg:block top-[59%] left-[5%] w-[450px] h-[650px]"
          viewBox="0 0 450 650"
          d="M30,50 C120,250 280,420 420,600"
        />
        <PencilConnector
          className="lg:hidden top-[64%] left-[50%] -translate-x-1/2 w-[80px] h-[300px]"
          viewBox="0 0 80 300"
          d="M40,0 C60,100 20,200 40,300"
        />

        {/* Connector 5: Library Organization (Right) -> Insights Blog (Center) */}
        <PencilConnector
          className="hidden lg:block top-[74%] right-[10%] w-[500px] h-[600px]"
          viewBox="0 0 500 600"
          d="M450,50 C350,220 200,380 50,550"
        />
        <PencilConnector
          className="lg:hidden top-[79%] left-[50%] -translate-x-1/2 w-[80px] h-[300px]"
          viewBox="0 0 80 300"
          d="M40,0 C20,100 60,200 40,300"
        />
      </div>

      {/* Hero Section - Visual Storytelling */}
      <section className="relative flex items-center pt-20 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden isolate">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden isolate">
          <BackgroundBlob
            className="top-[-10%] right-[-5%]"
            color="bg-brand-primary/20"
            size="w-[600px] h-[600px]"
            animateProps={{ x: [0, 50, 0], y: [0, -30, 0] }}
            variant={3}
          />
          <BackgroundBlob
            className="bottom-[5%] left-[5%]"
            color="bg-brand-grey/28"
            size="w-[400px] h-[400px]"
            animateProps={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
            variant={1}
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-brand-grey"
            >
              TRACK YOUR READING LIFE
            </motion.span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tighter uppercase text-brand-text">
              Track manhwa <br />
              <span className="text-brand-text/40">easily.</span> <br />
              Never lose <br />
              <span className="text-brand-text/40">progress</span> again.
            </h1>

            <p className="text-brand-grey text-sm md:text-lg max-w-lg mb-8 font-normal leading-relaxed text-balance mx-auto lg:mx-0">
              Organize your library, get chapter alerts, and discover new stories in one place. Simple, fast, and free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleDownload}
                className="h-14 px-8 font-black text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 bg-brand-primary text-brand-bg uppercase tracking-widest"
              >
                Download APK <ArrowRight size={18} />
              </button>
              <Link
                to="/features"
                className="h-14 px-8 font-black text-sm rounded-2xl border border-brand-border transition-all flex items-center justify-center gap-3 bg-brand-card text-brand-text hover:bg-brand-primary hover:text-brand-bg uppercase tracking-widest"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Screenshot Showcase */}
          <div className="relative flex justify-center lg:justify-end items-center py-6 sm:py-10 lg:pr-16 xl:pr-8 isolate">
            {/* Background Glow/Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] pointer-events-none opacity-30" style={{ zIndex: -1 }}>
              <div className="w-full h-full bg-gradient-to-tr from-brand-primary/20 via-transparent to-brand-grey/5 blur-3xl rounded-[4rem]" />
            </div>

            {/* Main Screenshot Container (Scaled Down) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 60, damping: 15, mass: 0.9 }}
              className="relative w-full max-w-[220px] sm:max-w-[300px] z-20"
            >
              {/* Decorative Support Elements */}
              <DecorativeOrganic className="top-10 -right-20 rotate-45" size="w-48 h-48" color="fill-brand-grey/10" delay={0.6} variant={0} />
              <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12" size="w-64 h-64" color="fill-brand-primary/5" delay={0.8} variant={1} />
              <DecorativeOrganic className="top-1/2 -left-20 rotate-12 opacity-30" size="w-32 h-32" color="fill-brand-grey/10" delay={1} variant={2} />
              <FloatingDot className="top-1/4 -right-16" delay={1} size="w-8 h-8" />
              <FloatingDot className="bottom-1/3 -left-16" delay={1.2} size="w-12 h-12" />
              <FloatingDot className="top-2/3 -right-10" delay={1.4} size="w-6 h-6" />
              <DottedPath className="-top-12 -left-20 rotate-[15deg] scale-150" d="M10 90 Q 100 10 190 90" />

              <MobileFrame className="z-20">
                <img
                  src="/hero-preview.jpg"
                  alt="Atrix Explorer Home Screen"
                  className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                />
              </MobileFrame>

              {/* Floating Support Elements - Refined Positions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15, mass: 0.9 }}
                className="absolute -top-4 -right-8 sm:-right-10 z-30 hidden sm:block"
              >
                <div className="p-2 sm:p-3 rounded-2xl shadow-xl glass-card border border-brand-border backdrop-blur-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-brand-bg shadow-lg">
                    <Bell size={16} />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Alert</div>
                    <div className="text-[10px] font-bold whitespace-nowrap">Chapter 142 Live</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 60, damping: 15, mass: 0.9 }}
                className="absolute bottom-16 left-0 sm:-left-20 z-30"
              >
                <div className="p-2 sm:p-3 rounded-2xl shadow-xl glass-card border border-brand-border backdrop-blur-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <CheckCircle size={14} />
                    </div>
                    <div className="text-[10px] font-bold text-brand-text">Synced</div>
                  </div>
                  <div className="w-20 sm:w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 60, damping: 15, mass: 0.9 }}
                className="absolute -bottom-2 right-6 sm:right-12 z-30"
              >
                <div className="px-3 py-1.5 rounded-full shadow-lg bg-brand-card border border-brand-border flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-grey">Online</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Narrative Section 2 - The Problem */}
      <section className="relative py-20 sm:py-32 border-y border-brand-border transition-colors overflow-hidden bg-brand-bg/50 isolate">
        <BackgroundBlob
          className="top-1/4 -right-20"
          color="bg-brand-grey/28"
          size="w-96 h-96"
          variant={2}
        />
        <BackgroundBlob
          className="bottom-1/4 -left-20"
          color="bg-brand-primary/20"
          size="w-80 h-80"
          variant={0}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1 relative isolate">
            {/* Layer 1: Background flow/decorative elements (placed behind the grid) */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-0">
              <div className="relative w-full max-w-[260px] sm:max-w-xs">
                <FloatingDot className="-top-16 -left-12" delay={0.5} size="w-12 h-12" />
                <DecorativeOrganic className="-bottom-16 -right-12" size="w-48 h-48" color="fill-brand-grey/5" delay={0.9} variant={0} />
                <DecorativeOrganic className="-top-12 right-0 rotate-12" size="w-32 h-32" color="fill-brand-primary/5" delay={1.1} variant={1} />
                <DecorativeOrganic className="bottom-0 -left-12 -rotate-12 opacity-40" size="w-24 h-24" color="fill-brand-grey/10" delay={1.3} variant={2} />

                <DottedPath
                  className="-bottom-40 right-20 rotate-45"
                  width={300}
                  height={200}
                  viewBox="0 0 300 200"
                  d="M20 20 Q 150 180 280 20"
                />
              </div>
            </div>

            {/* Layer 2: Grid of Colorful, Opaque Screenshots */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4 pt-12">
                {[
                  "/problem-screenshot-1.webp", // Slot 1: Cluttered Track List Spreadsheet
                  "/problem-screenshot-2.webp"  // Slot 2: 59 Inactive Mobile Tabs
                ].map((src, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-brand-card border border-brand-border overflow-hidden relative group shadow-md">
                    <img
                      src={src}
                      alt={`App Screenshot Mockup ${i + 1}`}
                      className="w-full h-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  "/problem-screenshot-3.webp", // Slot 3: Huge Manual Manga Tracker Spreadsheet
                  "/problem-screenshot-4.webp"  // Slot 4: 403 Forbidden Server Error Page
                ].map((src, i) => (
                  <div key={i + 2} className="aspect-[3/4] rounded-2xl bg-brand-card border border-brand-border overflow-hidden relative group shadow-md">
                    <img
                      src={src}
                      alt={`App Screenshot Mockup ${i + 3}`}
                      className="w-full h-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 3: Foreground Overlay Card (fully interactive, z-20) */}
            <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
              <div className="relative w-full max-w-[260px] sm:max-w-xs pointer-events-auto">
                <div className="relative z-10 p-5 sm:p-8 rounded-3xl border shadow-2xl text-center bg-brand-bg/95 border-brand-border glass-card">
                  <h4 className="text-base sm:text-xl font-bold mb-2 text-brand-text">Lost Progress?</h4>
                  <p className="text-[10px] sm:text-sm text-brand-grey opacity-60">Manhwa lists are hard to manage. Tabs close, bookmarks get lost, and memories fade.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <span className="text-brand-grey text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Problem</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter uppercase text-brand-text">
              Why does tracking <br /> feel like a chore?
            </h2>
            <p className="text-brand-grey text-lg font-light leading-relaxed mb-8">
              Existing platforms are bloated, ads-heavy, or just plain boring. We built Atrix Explorer to be a clean, personal space—a place where your library feels alive and respected.
            </p>
            <div className="space-y-4 text-left inline-block lg:block">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-brand-grey"><X size={18} /></div>
                <div>
                  <div className="font-bold text-sm text-brand-text">No more lost tabs</div>
                  <div className="text-sm opacity-50">Browser history is not a reading list.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-brand-grey"><X size={18} /></div>
                <div>
                  <div className="font-bold text-sm text-brand-text">No manual reminders</div>
                  <div className="text-sm opacity-50">Stop checking sites every hour for updates.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section 3 - The Solution */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-8 overflow-hidden bg-brand-bg isolate">
        <BackgroundBlob
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          color="bg-brand-grey/20"
          size="w-full h-full"
          animateProps={{ opacity: [0.3, 0.45, 0.3] }}
          variant={1}
        />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative z-10">
          <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
            <span className="text-brand-grey text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Solution</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter uppercase text-brand-text">
              Instant Tracking, <br /> Zero Manual Effort.
            </h2>
            <p className="text-brand-grey text-lg font-light leading-relaxed mb-10">
              Our architecture does the hard work for you. The moment a translation is available, our system syncs your library and sends a notification. You focus on reading; we focus on the search.
            </p>
            <ul className="space-y-6 text-left inline-block lg:block">
              {[
                { title: "Quantum Sync", desc: "Your position is saved across all devices instantly." },
                { title: "Low-Latency Alerts", desc: "Direct-to-device notifications and telegram integration." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center border border-brand-border">
                    <CheckCircle size={12} className="text-brand-grey" />
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-tight text-brand-text">{item.title}</div>
                    <div className="text-sm opacity-50">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -inset-10 blur-3xl opacity-10 rounded-full bg-brand-primary" />
            <div className="relative z-10 flex flex-col gap-6 items-center">
              <DecorativeOrganic className="-top-16 -left-24 rotate-12" size="w-48 h-48" color="fill-brand-primary/5" variant={1} />
              <DecorativeOrganic className="bottom-0 -right-20 -rotate-45 opacity-30" size="w-40 h-40" color="fill-brand-grey/5" delay={0.4} variant={2} />
              <DecorativeOrganic className="top-1/2 -right-32 rotate-90" size="w-32 h-32" color="fill-brand-primary/10" delay={0.6} variant={0} />
              <FloatingDot className="top-20 -right-20" delay={0.3} size="w-10 h-10" />

              {/* Flow path between notifications */}
              <DottedPath
                className="top-40 -left-20 rotate-[130deg] scale-[2]"
                d="M10 10 Q 50 90 90 10"
              />
              <DottedPath className="-top-10 -right-24 scale-75 opacity-10" />

              <NotificationMockup />
              <div className="sm:translate-x-[-20px]">
                <NotificationMockup />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Narrative Section 4 - Discovery Hub */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-8 transition-colors bg-brand-bg/50 border-y border-brand-border overflow-hidden isolate">
        <BackgroundBlob
          className="-bottom-20 -right-20"
          color="bg-brand-primary/20"
          size="w-96 h-96"
          variant={3}
        />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative z-10">
          <div className="order-1 lg:order-1 text-center lg:text-left">
            <span className="text-brand-grey text-xs font-black uppercase tracking-[0.3em] mb-4 block">Discovery Hub</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-6 leading-[1.1] tracking-tighter uppercase text-brand-text">
              Search Smarter. <br /> <span className="text-brand-grey/40">Story-First Discovery.</span>
            </h2>
            <p className="text-brand-grey text-lg font-light leading-relaxed mb-8">
              Don't get distracted by flashy cover art or posters. Describe the vibe, trope, or storyline in plain English. Our natural language engine generates content-first result cards so you find stories you'll actually love based on substance, not clickbait.
            </p>

            <div className="space-y-6 text-left inline-block lg:block mb-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center border border-brand-border shrink-0">
                  <Search size={12} className="text-brand-grey" />
                </div>
                <div>
                  <div className="font-bold text-sm text-brand-text uppercase tracking-wider">Natural Language Search</div>
                  <div className="text-xs sm:text-sm opacity-50">Search in natural language (e.g. <i>"Reincarnation manhwa"</i>) to get highly relevant, story-centric results.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center border border-brand-border shrink-0">
                  <BookOpen size={12} className="text-brand-grey" />
                </div>
                <div>
                  <div className="font-bold text-sm text-brand-text uppercase tracking-wider">Story-First Result Cards</div>
                  <div className="text-xs sm:text-sm opacity-50">Result cards present key descriptions and details upfront. Read basic info and storylines to find your favorite content.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center border border-brand-border shrink-0">
                  <User size={12} className="text-brand-grey" />
                </div>
                <div>
                  <div className="font-bold text-sm text-brand-text uppercase tracking-wider">Community-Backed Popularity</div>
                  <div className="text-xs sm:text-sm opacity-50">See exactly how popular a title is by checking the precise number of readers (e.g., 837.9M readers) right on the card.</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {["Natural Language", "Content-Based", "Story-First", "Reader Metrics"].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-xl text-[9px] font-bold border border-brand-border uppercase tracking-widest bg-brand-card text-brand-text">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="order-2 lg:order-2 relative flex justify-center">
            <div className="absolute -inset-10 blur-3xl opacity-10 rounded-full bg-brand-primary" />
            <div className="relative w-full max-w-[220px] sm:max-w-[300px] z-20">
              <DecorativeOrganic className="-top-12 -right-16" size="w-40 h-40" color="fill-brand-grey/5" variant={0} />
              <DecorativeOrganic className="bottom-0 -left-20 rotate-45 opacity-40" size="w-48 h-48" color="fill-brand-primary/5" delay={0.2} variant={1} />
              <DecorativeOrganic className="top-1/2 -right-24 -rotate-12" size="w-32 h-32" color="fill-brand-grey/10" delay={0.4} variant={2} />
              <FloatingDot className="bottom-1/4 -left-16 opacity-20" size="w-12 h-12" />
              <DottedPath className="-bottom-10 -right-20 -rotate-12 scale-125" d="M20 20 Q 100 90 180 20" />

              <MobileFrame>
                <img
                  src="/discovery-preview.jpg"
                  alt="Atrix Explorer Natural Language Search Screen"
                  className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </MobileFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section 5 - Library Management */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-brand-bg overflow-hidden isolate">
        <BackgroundBlob
          className="top-0 right-0"
          color="bg-brand-grey/28"
          size="w-96 h-96"
          variant={2}
        />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative z-10">
          <div className="relative isolate">
            <DecorativeOrganic className="-top-10 -left-12 opacity-20" size="w-32 h-32" color="fill-brand-grey/5" variant={2} />
            <DecorativeOrganic className="-bottom-12 -right-16 rotate-12 opacity-30" size="w-48 h-48" color="fill-brand-primary/5" delay={0.2} variant={1} />
            <DecorativeOrganic className="top-1/2 -right-20 -rotate-45" size="w-36 h-36" color="fill-brand-grey/10" delay={0.4} variant={0} />
            <FloatingDot className="bottom-12 -right-10" delay={0.4} size="w-10 h-10" />

            <div className="relative w-full max-w-[220px] sm:max-w-[300px] mx-auto z-10">
              <MobileFrame>
                <img
                  src="/library-preview.jpg"
                  alt="Atrix Explorer Library Screen"
                  className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </MobileFrame>
            </div>
          </div>
          <div className="text-center lg:text-left">
            <span className="text-brand-grey text-xs font-black uppercase tracking-[0.3em] mb-4 block">Organization</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter uppercase text-brand-text break-words">
              Your reading life, <br className="hidden sm:block" /> Perfectly Organized.
            </h2>
            <p className="text-brand-grey text-lg font-light leading-relaxed mb-10">
              Group your library into Plan, Ongoing, or Completed statuses. Our interface is designed for speed—so you can spend less time managing and more time reading.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {["Categorize", "Cloud Sync", "Offline Access", "Custom Notes"].map(tag => (
                <span key={tag} className="px-4 py-2 rounded-xl text-[10px] font-bold border border-brand-border uppercase tracking-widest bg-brand-card text-brand-text">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Community Insights */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-brand-bg transition-colors border-t border-brand-border overflow-hidden isolate">
        <BackgroundBlob
          className="-top-20 -left-20"
          color="bg-brand-grey/28"
          size="w-80 h-80"
          variant={0}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <DecorativeOrganic className="top-0 -left-32 opacity-10" size="w-64 h-64" color="fill-brand-primary/5" variant={0} />
          <DecorativeOrganic className="bottom-0 -right-32 rotate-12 opacity-10" size="w-72 h-72" color="fill-brand-grey/10" variant={1} />
          <div className="text-center mb-16 px-4">
            <span className="text-brand-grey text-xs font-black uppercase tracking-[0.3em] mb-4 block">BLOG & COMMUNITY</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-6 leading-[1.1] tracking-tighter uppercase text-brand-text">
              Weekly Manhwa <span className="text-brand-grey/40">News & Picks.</span>
            </h2>
            <p className="text-brand-grey text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
              Discover new manhwa, trending chapters, anime updates, and community stories every week.
            </p>
            <DottedPath
              className="top-full left-1/2 -translate-x-1/2 mt-4 rotate-180 opacity-5"
              d="M10 10 Q 50 90 90 10"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-brand-border rounded-[2rem] text-left transition-all hover:translate-y-[-8px] shadow-sm hover:shadow-xl bg-brand-card"
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-zinc-500/10">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-grey mb-2">{post.category}</div>
                <h3 className="text-lg font-bold mb-4 tracking-tight line-clamp-2 text-brand-text">{post.title}</h3>
                <Link to={`/blog/${post.id}`} className="text-xs font-black uppercase tracking-widest hover:gap-2 transition-all flex items-center gap-1 text-brand-text group/btn">
                  Read More <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/blog" className="inline-flex h-14 px-8 items-center justify-center rounded-2xl border border-brand-border bg-brand-card text-brand-text font-black uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-brand-bg transition-all">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Warmer and Softer */}
      <section className="pb-20 sm:pb-32 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 flex flex-col items-center text-center shadow-2xl transition-colors border-2 border-brand-border bg-brand-primary text-brand-bg">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8 uppercase text-balance">
                Ready to take back <br /> control of your library?
              </h2>
              <p className="text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed text-balance opacity-80">
                Downloading Atrix Explorer is the first step towards a better reading habit. It’s free, fast, and built for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="h-16 px-12 font-black text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl bg-brand-bg text-brand-text"
                >
                  Download APK
                </button>
                <a href="https://t.me/manhwa_daily" target="_blank" rel="noreferrer" className="h-16 px-12 font-black text-lg rounded-2xl border border-brand-bg/20 hover:bg-brand-bg/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                  <Send size={20} /> Join Telegram
                </a>
              </div>
            </div>

            {/* Visual Flair */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-black rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const MobileFrame = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={cn("relative z-10 aspect-[9/18.5] rounded-[2rem] p-2 border border-brand-border bg-brand-bg shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] overflow-hidden", className)}>
    <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-brand-card border border-brand-border relative group">
      {children}
    </div>
  </div>
);

// --- Custom Mockup UI Components for Features Page ---

const ExportWorkflowUI = () => (
  <div className="relative z-10 w-full max-w-lg p-5 sm:p-6 rounded-[2rem] border border-brand-border bg-brand-card shadow-xl flex flex-col sm:flex-row items-center gap-5 overflow-hidden">
    <DecorativeOrganic className="-top-12 -left-12 opacity-25" size="w-32 h-32" color="fill-brand-primary/5" variant={0} />
    <DecorativeOrganic className="-bottom-16 -right-16 opacity-30" size="w-36 h-36" color="fill-brand-grey/5" variant={1} />

    <div className="relative z-10 flex-1 w-full p-4 rounded-2xl bg-brand-bg border border-brand-border text-left">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} className="text-brand-primary" />
        <span className="text-[9px] font-black tracking-widest text-brand-text">DATABASE</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-2 py-1.5 rounded bg-brand-card text-[9px] font-mono border border-brand-border">
          <span className="truncate max-w-[100px]">library_data.json</span>
          <span className="text-emerald-600 font-bold text-[8px]">READY</span>
        </div>
        <div className="flex justify-between items-center px-2 py-1.5 rounded bg-brand-card text-[9px] font-mono border border-brand-border opacity-70">
          <span className="truncate max-w-[100px]">reading_log.csv</span>
          <span className="text-emerald-600 font-bold text-[8px]">READY</span>
        </div>
      </div>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center gap-2 shrink-0">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-bg shadow-lg cursor-pointer"
        onClick={handleDownload}
      >
        <Download size={16} />
      </motion.div>
      <span className="text-[8px] font-black uppercase tracking-widest text-brand-grey">EXPORT DATA</span>
    </div>

    <div className="relative z-10 flex-1 w-full p-4 rounded-2xl bg-brand-bg border border-brand-border text-left">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={14} className="text-emerald-600" />
        <span className="text-[9px] font-black tracking-widest text-brand-text">DOWNLOAD SUCCESS</span>
      </div>
      <div className="border border-brand-border rounded overflow-hidden">
        <div className="grid grid-cols-3 gap-1 bg-brand-card p-1 text-[7px] font-mono font-bold text-brand-grey">
          <span>TITLE</span>
          <span>CH</span>
          <span>STATUS</span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 text-[7px] font-mono border-t border-brand-border text-brand-text/80">
          <span className="truncate">ORV</span>
          <span>142</span>
          <span className="text-emerald-600 font-semibold">Active</span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 text-[7px] font-mono border-t border-brand-border text-brand-text/80">
          <span className="truncate">Regression</span>
          <span>89</span>
          <span className="text-emerald-600 font-semibold">Active</span>
        </div>
      </div>
    </div>
  </div>
);

const CategoryGridUI = () => {
  const items = [
    { name: "MANGA", count: "142 Titles", icon: BookOpen, accent: "border-brand-primary/20 bg-brand-primary/5" },
    { name: "ANIME", count: "89 Series", icon: Tv, accent: "border-brand-border hover:border-brand-primary/50" },
    { name: "NOVELS", count: "24 Books", icon: Layers, accent: "border-brand-border hover:border-brand-primary/50" },
    { name: "WEB SERIES", count: "12 Channels", icon: Globe, accent: "border-brand-border hover:border-brand-primary/50" },
    { name: "CUSTOM", count: "No Limits", icon: Star, accent: "border-dashed border-brand-border hover:bg-brand-card/50" },
  ];

  return (
    <div className="relative isolate w-full">
      <DecorativeOrganic className="-top-12 -left-12 opacity-25" size="w-36 h-36" color="fill-brand-primary/5" variant={0} />
      <DecorativeOrganic className="-bottom-16 -right-16 opacity-30" size="w-44 h-44" color="fill-brand-grey/5" variant={1} />
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.02 }}
            className={cn(
              "p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-3 bg-brand-card shadow-sm border-brand-border",
              item.accent
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-text shadow-sm">
              <item.icon size={18} />
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest text-brand-text">{item.name}</div>
              <div className="text-[9px] font-medium text-brand-grey opacity-60 mt-0.5">{item.count}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CollagePersonalizationUI = () => (
  <div className="relative z-10 w-full min-h-[300px] sm:min-h-[380px] flex items-center justify-center py-6">
    <div className="relative w-full max-w-sm sm:max-w-md aspect-[1.5/1]">
      {/* Card 1: Poster Upload Mockup */}
      <motion.div
        whileHover={{ zIndex: 30, scale: 1.02 }}
        className="absolute top-0 left-0 w-[45%] aspect-[3/4] rounded-2xl border border-brand-border bg-brand-card shadow-2xl p-2.5 flex flex-col justify-between"
      >
        <div className="flex-1 w-full rounded-xl bg-zinc-200/50 relative overflow-hidden flex items-center justify-center group/poster border border-brand-border">
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center justify-center z-10">
            <span className="text-[8px] font-black tracking-widest text-white uppercase border border-white/40 px-1.5 py-0.5 rounded">Change Cover</span>
          </div>
          <div className="absolute inset-1.5 border border-dashed border-white/20 pointer-events-none" />
          <BookOpen size={20} className="opacity-20 text-brand-primary" />
        </div>
        <div className="mt-2 text-left">
          <span className="text-[7px] font-black uppercase tracking-widest text-brand-grey block">UPLOAD POSTER</span>
          <div className="text-[9px] font-bold text-brand-text truncate">solo_leveling_v2.jpg</div>
        </div>
      </motion.div>

      {/* Card 2: Journal Note */}
      <motion.div
        whileHover={{ zIndex: 30, scale: 1.02 }}
        className="absolute bottom-0 right-0 w-[60%] p-4 rounded-2xl border border-brand-border bg-brand-bg shadow-2xl z-20 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between border-b border-brand-border pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <span className="text-[8px] font-black tracking-widest text-brand-text uppercase">Private Notes</span>
          </div>
          <span className="text-[7px] font-mono text-brand-grey opacity-50">MANUAL ENTRY</span>
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono text-brand-grey text-left leading-relaxed">
          "The pacing in Chapter 142 is absolutely perfect. The art paneling is gorgeous. I should add this list to my custom recommendations list..."
        </div>
      </motion.div>

      {/* Card 3: Counter Adjuster */}
      <motion.div
        whileHover={{ zIndex: 30, scale: 1.02 }}
        className="absolute top-[20%] right-0 p-2.5 rounded-xl border border-brand-border bg-brand-card shadow-lg z-10 flex items-center gap-3"
      >
        <div className="text-left">
          <div className="text-[7px] font-black tracking-widest text-brand-grey uppercase">PROGRESS</div>
          <div className="text-[10px] font-bold text-brand-text">Chapter 142</div>
        </div>
        <div className="flex gap-1">
          <button className="w-5 h-5 rounded bg-brand-bg border border-brand-border flex items-center justify-center font-bold text-xs hover:bg-brand-primary hover:text-brand-bg">-</button>
          <button className="w-5 h-5 rounded bg-brand-bg border border-brand-border flex items-center justify-center font-bold text-xs hover:bg-brand-primary hover:text-brand-bg">+</button>
        </div>
      </motion.div>
    </div>
  </div>
);

const SyncConnectionsUI = () => (
  <div className="relative z-10 w-full max-w-md aspect-[2/1] flex items-center justify-center overflow-hidden">
    {/* Background soft glow behind cloud vault */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />

    {/* Center: Cloud Sync Vault */}
    <div className="flex flex-col items-center gap-1.5 relative z-20">
      <motion.div
        animate={{
          y: [0, -4, 0]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-14 h-14 rounded-2xl bg-brand-primary flex flex-col items-center justify-center text-brand-bg shadow-2xl relative"
      >
        <div className="absolute -inset-0.5 bg-brand-primary/10 rounded-2xl blur opacity-50 animate-pulse" />
        <Cloud size={20} className="relative z-10 mb-0.5" />
        <Shield size={8} className="relative z-10 opacity-80" />
      </motion.div>
      <span className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-text">Sync Vault</span>
    </div>

    {/* Left: Phone A (Primary Phone) */}
    <div className="absolute left-[12%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
      <motion.div
        whileHover={{ y: -3 }}
        className="w-10 h-16 rounded-xl border border-brand-primary bg-brand-card p-0.5 shadow-md relative overflow-hidden flex flex-col justify-between"
      >
        {/* Phone Ear Speaker notch */}
        <div className="w-4 h-0.5 bg-brand-primary rounded-full mx-auto mb-0.5 opacity-80 shrink-0" />

        {/* Screen content */}
        <div className="flex-1 w-full rounded-md bg-brand-bg border border-brand-border/40 p-0.5 flex flex-col gap-0.5 overflow-hidden select-none">
          {/* Library list visual representation */}
          <div className="h-1 w-full bg-brand-primary/10 rounded-[1px]" />
          <div className="h-1 w-[80%] bg-brand-grey/15 rounded-[1px]" />
          <div className="h-1 w-[90%] bg-brand-primary/10 rounded-[1px]" />
          <div className="h-1 w-[65%] bg-brand-grey/15 rounded-[1px]" />

          {/* Active Reading Progress Item */}
          <div className="mt-auto pt-0.5 border-t border-brand-border/30 flex items-center justify-between">
            <div className="h-0.5 w-3 bg-brand-primary/30 rounded-sm" />
            <div className="h-0.5 w-1 bg-brand-primary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="w-4 h-0.5 bg-brand-primary/60 rounded-full mx-auto mt-0.5 shrink-0" />
      </motion.div>
      <div className="text-center">
        <div className="text-[8px] font-black uppercase tracking-widest text-brand-text">Phone A</div>
        <div className="text-[6px] font-mono text-brand-grey">Primary</div>
      </div>
    </div>

    {/* Right: Phone B (Synced Phone) */}
    <div className="absolute right-[12%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
      <motion.div
        whileHover={{ y: -3 }}
        className="w-10 h-16 rounded-xl border border-brand-border bg-brand-card p-0.5 shadow-md relative overflow-hidden flex flex-col justify-between"
      >
        {/* Phone Ear Speaker notch */}
        <div className="w-4 h-0.5 bg-brand-border rounded-full mx-auto mb-0.5 shrink-0" />

        {/* Screen content - Perfect Sync replication */}
        <div className="flex-1 w-full rounded-md bg-brand-bg border border-brand-border/40 p-0.5 flex flex-col gap-0.5 overflow-hidden select-none">
          {/* Synced content matches Phone A exactly! */}
          <div className="h-1 w-full bg-brand-primary/10 rounded-[1px]" />
          <div className="h-1 w-[80%] bg-brand-grey/15 rounded-[1px]" />
          <div className="h-1 w-[90%] bg-brand-primary/10 rounded-[1px]" />
          <div className="h-1 w-[65%] bg-brand-grey/15 rounded-[1px]" />

          {/* Synced Reading Progress */}
          <div className="mt-auto pt-0.5 border-t border-brand-border/30 flex items-center justify-between">
            <div className="h-0.5 w-3 bg-brand-primary/30 rounded-sm" />
            <div className="h-0.5 w-1 bg-brand-primary rounded-full" />
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="w-4 h-0.5 bg-brand-border rounded-full mx-auto mt-0.5 shrink-0" />
      </motion.div>
      <div className="text-center">
        <div className="text-[8px] font-black uppercase tracking-widest text-brand-text">Phone B</div>
        <div className="text-[6px] font-mono text-brand-grey">Synced</div>
      </div>
    </div>

    {/* SVG Path connectors */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-brand-border)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="gradient-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-brand-border)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Animated paths between Phone A and Cloud Vault */}
      <motion.path
        d="M 90 100 Q 145 60 200 100"
        fill="none"
        stroke="url(#gradient-left)"
        strokeWidth="1"
        strokeDasharray="3 3"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <motion.path
        d="M 90 100 Q 145 140 200 100"
        fill="none"
        stroke="url(#gradient-left)"
        strokeWidth="1"
        strokeDasharray="3 3"
        animate={{ strokeDashoffset: [0, 20] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />

      {/* Animated paths between Cloud Vault and Phone B */}
      <motion.path
        d="M 200 100 Q 255 60 310 100"
        fill="none"
        stroke="url(#gradient-right)"
        strokeWidth="1"
        strokeDasharray="3 3"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <motion.path
        d="M 200 100 Q 255 140 310 100"
        fill="none"
        stroke="url(#gradient-right)"
        strokeWidth="1"
        strokeDasharray="3 3"
        animate={{ strokeDashoffset: [0, 20] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
    </svg>
  </div>
);

const GuestFreedomPanelUI = () => (
  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto px-4">
    {/* Guest Mode Card */}
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="p-8 sm:p-10 rounded-[2.5rem] border border-brand-border bg-brand-card flex flex-col gap-6 text-left shadow-md hover:shadow-xl transition-all relative overflow-hidden isolate"
    >
      <DecorativeOrganic className="-top-12 -right-12 rotate-12 opacity-30" size="w-48 h-48" color="fill-brand-primary/5" variant={0} style={{ zIndex: -1 }} />
      <DecorativeOrganic className="bottom-[-30px] left-[-30px] rotate-[45deg] opacity-20" size="w-40 h-40" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />

      <div className="flex flex-col gap-6 relative z-10 w-full h-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Lock size={22} />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-brand-primary">LOCAL-FIRST PRIVACY</div>
            <h3 className="text-xl font-black text-brand-text uppercase tracking-tight">Guest Mode</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-brand-grey font-light leading-relaxed">
          Start instantly without sharing a single byte of personal data. Your library lives entirely on your device—fully private, fast, and completely yours.
        </p>

        <div className="h-px bg-brand-border/50 my-2" />

        <div className="space-y-3.5">
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-grey opacity-60 mb-1">AVAILABLE OFFLINE</div>
          {[
            { text: "No signup or account required", desc: "Open the app and track immediately." },
            { text: "100% local private library", desc: "No tracker tracking you. Your data is private." },
            { text: "Offline progress tracking", desc: "Works perfectly without an active internet connection." },
            { text: "Full manual tracking support", desc: "Custom titles, chapters, notes, and local covers." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle size={16} className="text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-brand-text leading-tight">{item.text}</h4>
                <p className="text-[10px] text-brand-grey font-light leading-normal opacity-85">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Account Mode Card */}
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="p-8 sm:p-10 rounded-[2.5rem] border border-brand-border bg-brand-card flex flex-col gap-6 text-left shadow-md hover:shadow-xl transition-all relative overflow-hidden isolate"
    >
      <DecorativeOrganic className="-top-12 -right-12 rotate-45 opacity-30" size="w-48 h-48" color="fill-brand-grey/5" variant={2} style={{ zIndex: -1 }} />
      <DecorativeOrganic className="bottom-[-30px] left-[-30px] rotate-[15deg] opacity-20" size="w-40 h-40" color="fill-brand-primary/5" variant={3} style={{ zIndex: -1 }} />

      <div className="flex flex-col gap-6 relative z-10 w-full h-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <User size={22} />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-brand-primary">OPTIONAL UPGRADE</div>
            <h3 className="text-xl font-black text-brand-text uppercase tracking-tight">Account Mode</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-brand-grey font-light leading-relaxed">
          Create an account only when you want to extend your library across mobile devices. Back up your history and receive real-time updates seamlessly.
        </p>

        <div className="h-px bg-brand-border/50 my-2" />

        <div className="space-y-3.5">
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-grey opacity-60 mb-1">CLOUD EXTENSIONS</div>
          {[
            { text: "Secure cloud sync & backups", desc: "Safeguard your progress in your personal cloud vault." },
            { text: "Switch devices without losing data", desc: "Sync between your primary and backup phones instantly." },
            { text: "Chapter release notifications", desc: "Get pinged immediately when a new chapter drops." },
            { text: "Reading statistics & insights", desc: "Unlock streak calendars and category distributions." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle size={16} className="text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-brand-text leading-tight">{item.text}</h4>
                <p className="text-[10px] text-brand-grey font-light leading-normal opacity-85">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

const StatsDashboardUI = () => (
  <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col gap-4 text-left shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black tracking-widest text-brand-grey uppercase">READING STREAK</span>
        <Star size={14} className="text-amber-500 fill-amber-500/20" />
      </div>
      <div>
        <div className="text-xl font-black text-brand-text">42 DAYS</div>
        <p className="text-[8px] text-brand-grey opacity-60 font-medium">Consistent daily activity</p>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={cn("aspect-square rounded border border-brand-border flex items-center justify-center text-[7px] font-mono", i < 5 ? "bg-brand-primary text-brand-bg border-brand-primary font-bold" : "bg-brand-bg text-brand-grey opacity-45")}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>

    <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col gap-4 text-left shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black tracking-widest text-brand-grey uppercase">MONTHLY PROGRESS</span>
        <BookOpen size={14} className="text-brand-primary" />
      </div>
      <div>
        <div className="text-xl font-black text-brand-text">180 CH</div>
        <p className="text-[8px] text-brand-grey opacity-60 font-medium">Chapters read this month</p>
      </div>
      <div className="space-y-1 mt-2">
        <div className="flex justify-between text-[7px] font-mono text-brand-grey opacity-60">
          <span>TARGET: 200 CH</span>
          <span>90%</span>
        </div>
        <div className="w-full h-1 bg-brand-primary/10 rounded-full overflow-hidden">
          <div className="h-full w-[90%] bg-brand-primary" />
        </div>
      </div>
    </div>

    <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col gap-4 text-left shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black tracking-widest text-brand-grey uppercase">DISTRIBUTION</span>
        <Layers size={14} className="text-brand-primary" />
      </div>
      <div>
        <div className="text-xl font-black text-brand-text">3 STYLES</div>
        <p className="text-[8px] text-brand-grey opacity-60 font-medium">Media diversity tracked</p>
      </div>
      <div className="flex flex-col gap-1 text-[7px] font-mono mt-1">
        <div className="flex justify-between items-center"><span className="text-brand-text font-bold">MANHWA</span><span className="text-brand-grey opacity-60">60%</span></div>
        <div className="flex justify-between items-center"><span className="text-brand-text font-bold">MANGA</span><span className="text-brand-grey opacity-60">25%</span></div>
        <div className="flex justify-between items-center"><span className="text-brand-text font-bold">NOVELS</span><span className="text-brand-grey opacity-60">15%</span></div>
      </div>
    </div>

    <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col gap-3 text-left shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black tracking-widest text-brand-grey uppercase">READING INSIGHTS</span>
        <Clock size={14} className="text-brand-primary" />
      </div>
      <div className="text-[7px] text-brand-grey opacity-60 font-medium">Daily contribution mapping</div>
      <div className="grid grid-cols-9 gap-1 mt-1">
        {Array.from({ length: 27 }).map((_, i) => {
          const density = [0, 1, 2, 3, 0, 2, 1, 3, 2, 0, 1, 0, 3, 2, 1, 2, 0, 3, 1, 2, 1, 3, 0, 2, 1, 2, 3][i];
          return (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-[1px] transition-all",
                density === 0 && "bg-brand-bg border border-brand-border",
                density === 1 && "bg-brand-primary/20",
                density === 2 && "bg-brand-primary/50",
                density === 3 && "bg-brand-primary"
              )}
            />
          );
        })}
      </div>
    </div>
  </div>
);

const FeaturesPage = () => {
  return (
    <div className="pt-32 sm:pt-48 pb-20 sm:pb-32 min-h-screen overflow-hidden bg-brand-bg text-brand-text relative isolate">
      <DecorativeOrganic className="top-20 -left-20" size="w-96 h-96" color="fill-brand-primary/5" variant={0} style={{ zIndex: -1 }} />
      <DecorativeOrganic className="top-1/4 -right-32 rotate-12" size="w-64 h-64" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />
      <BackgroundBlob
        className="top-0 left-0"
        color="bg-brand-primary/20"
        size="w-[800px] h-[800px]"
        animateProps={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
        variant={0}
        style={{ zIndex: -1 }}
      />
      <BackgroundBlob
        className="bottom-0 right-0"
        color="bg-brand-grey/28"
        size="w-[600px] h-[600px]"
        animateProps={{ scale: [1, 1.2, 1] }}
        variant={2}
        style={{ zIndex: -1 }}
      />

      <Helmet>
        <title>Features | Atrix Explorer Overview</title>
        <meta name="description" content="Discover how Atrix Explorer provides a flexible personal library system with smart tracking, optional cloud sync, and guest freedom." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* 1. Hero / Big Vision */}
        <header className="mb-20 sm:mb-32 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-grey text-xs font-black uppercase tracking-[0.4em] mb-6 block"
          >
            FREEDOM & FLEXIBILITY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1] tracking-tighter uppercase mb-8 text-balance text-brand-text"
          >
            BUILT FOR READERS<br />WHO WANT MORE<br />CONTROL.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-grey text-lg md:text-xl font-light leading-relaxed text-balance"
          >
            Atrix Explorer is a flexible personal library system. Track your collection, customize your layouts, and read on your own terms—with zero forced account signups.
          </motion.p>
        </header>

        <div className="space-y-32 sm:space-y-48">
          {/* 2. SMART TRACKING (Library) */}
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/32"
              size="w-[500px] h-[500px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <BackgroundBlob
              className="-bottom-20 -right-20"
              color="bg-brand-grey/35"
              size="w-[400px] h-[400px]"
              variant={3}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[500px] sm:min-h-[600px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-6 sm:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <div className="w-full max-w-[240px] sm:max-w-[280px] relative">
                  <DecorativeOrganic className="-top-12 -right-16 rotate-12" size="w-56 h-56" color="fill-brand-grey/10" variant={0} />
                  <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-40" size="w-64 h-64" color="fill-brand-primary/5" variant={1} />
                  <DecorativeOrganic className="top-1/2 -right-20 rotate-90" size="w-40 h-40" color="fill-brand-grey/5" variant={2} />

                  <MobileFrame>
                    <img
                      src="/library-preview.jpg"
                      alt="Library Mockup Screen"
                      className="w-full h-full object-cover"
                    />
                  </MobileFrame>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-black opacity-[0.03] select-none uppercase tracking-tighter text-brand-text">01</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Layers size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-brand-text">SMART TRACKING</div>
                    <div className="text-xs font-bold text-brand-grey">Stay organized effortlessly.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[1] text-brand-text">
                  YOUR ENTIRE LIBRARY,<br />ALL IN ONE PLACE.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Track your reading progress, organize titles, and continue where you left off — without messy tabs, screenshots, or forgotten bookmarks.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Track chapters and progress", "Organize titles easily", "Create reading lists", "Continue from any device"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleDownload}
                  className="h-14 px-8 mx-auto lg:mx-0 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg bg-brand-primary text-brand-bg"
                >
                  Get APK <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* 3. INSTANT UPDATES (Notifications) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-top-20 -right-20"
              color="bg-brand-grey/35"
              size="w-[500px] h-[500px]"
              variant={0}
              style={{ zIndex: -1 }}
            />
            <BackgroundBlob
              className="-bottom-20 -left-12"
              color="bg-brand-primary/32"
              size="w-[450px] h-[450px]"
              variant={1}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-grey/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[500px] sm:min-h-[600px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-6 sm:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <div className="w-full max-w-[240px] sm:max-w-[280px] relative flex items-center justify-center">
                  <DecorativeOrganic className="-top-16 -left-20 rotate-45" size="w-64 h-64" color="fill-brand-grey/10" variant={1} />
                  <DecorativeOrganic className="-bottom-16 -right-20 -rotate-12 opacity-30" size="w-56 h-56" color="fill-brand-primary/5" variant={0} />
                  <DecorativeOrganic className="top-1/4 -right-16 opacity-10" size="w-48 h-48" color="fill-brand-grey/10" variant={2} />

                  <MobileFrame>
                    <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
                      <div className="w-full transform -translate-y-4">
                        <NotificationMockup isStatic={true} />
                      </div>
                      <div className="w-full opacity-40 scale-90 translate-y-2">
                        <NotificationMockup isStatic={true} />
                      </div>
                      <div className="w-full opacity-20 scale-75 translate-y-4">
                        <NotificationMockup isStatic={true} />
                      </div>
                    </div>
                  </MobileFrame>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-black opacity-[0.03] select-none uppercase tracking-tighter text-brand-text">02</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Zap size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-brand-text">INSTANT UPDATES</div>
                    <div className="text-xs font-bold text-brand-grey">Never miss a release.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[1] text-brand-text">
                  GET NEW CHAPTER<br />UPDATES INSTANTLY.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  The moment a new chapter drops, Atrix Explorer lets you know — so you stay ahead without constantly checking websites.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Instant chapter alerts", "Fast update tracking", "Spoiler-safe notifications", "Follow multiple series easily"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleDownload}
                  className="h-14 px-8 mx-auto lg:mx-0 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg bg-brand-primary text-brand-bg"
                >
                  Get APK <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* 4. DISCOVERY (Search & Recommendations) */}
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/32"
              size="w-[460px] h-[460px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <BackgroundBlob
              className="-bottom-24 -right-20"
              color="bg-brand-grey/35"
              size="w-[420px] h-[420px]"
              variant={3}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[500px] sm:min-h-[600px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-6 sm:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <div className="w-full max-w-[240px] sm:max-w-[280px] relative">
                  <DecorativeOrganic className="-top-12 -right-20 rotate-12" size="w-60 h-60" color="fill-brand-primary/10" variant={2} />
                  <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-20" size="w-64 h-64" color="fill-brand-primary/5" variant={0} />
                  <DecorativeOrganic className="top-1/2 -left-24 opacity-30" size="w-44 h-44" color="fill-brand-grey/10" variant={1} />

                  <MobileFrame>
                    <img
                      src="/discovery-preview.jpg"
                      alt="Discovery Mockup Screen"
                      className="w-full h-full object-cover"
                    />
                  </MobileFrame>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-black opacity-[0.03] select-none uppercase tracking-tighter text-brand-text">03</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Search size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-brand-text">DISCOVERY HUB</div>
                    <div className="text-xs font-bold text-brand-grey">Find something new.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[1] text-brand-text">
                  DISCOVER YOUR NEXT<br />FAVORITE SERIES.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Search trending titles, hidden gems, and community favorites — all from one powerful discovery hub.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Fast global search", "Trending recommendations", "Discover hidden gems", "Explore community favorites"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleDownload}
                  className="h-14 px-8 mx-auto lg:mx-0 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg bg-brand-primary text-brand-bg"
                >
                  Get APK <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* 5. CLOUD SYNC SYSTEM (Optional Cloud Integration) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 sm:gap-16 lg:gap-32">
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[380px] sm:min-h-[460px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-6 sm:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <DecorativeOrganic className="-top-12 -right-16 rotate-12 opacity-30" size="w-56 h-56" color="fill-brand-primary/5" variant={0} style={{ zIndex: -1 }} />
                <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-40" size="w-64 h-64" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />
                <DecorativeOrganic className="top-1/2 -right-20 rotate-90 opacity-20" size="w-40 h-40" color="fill-brand-primary/5" variant={2} style={{ zIndex: -1 }} />
                <SyncConnectionsUI />
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-black opacity-[0.03] select-none uppercase tracking-tighter text-brand-text">04</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Globe size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-brand-text">CLOUD SYNC SYSTEM</div>
                    <div className="text-xs font-bold text-brand-grey">Continue anywhere.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[1] text-brand-text">
                  YOUR LIBRARY, SAFE<br />ACROSS YOUR DEVICES.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Your collection, progress, and reminders stay backed up securely when you sign in. Login only if you want cloud features—the choice is completely yours.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {[
                    "Secure cloud backup",
                    "Switch phones without losing progress",
                    "Sync your library instantly",
                    "Login only if you want cloud features"
                  ].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 6. GUEST FREEDOM (Local vs Cloud Comparative Panel) */}
          <div className="flex flex-col gap-12 sm:gap-16 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/20"
              size="w-[500px] h-[500px]"
              variant={0}
              style={{ zIndex: -1 }}
            />
            <BackgroundBlob
              className="bottom-0 -right-20"
              color="bg-brand-grey/28"
              size="w-[450px] h-[450px]"
              variant={1}
              style={{ zIndex: -1 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-brand-grey text-xs font-black uppercase tracking-[0.4em] mb-4 block">USE IT YOUR WAY</span>
              <span className="text-xs font-bold text-brand-grey block mb-2">No forced accounts. No restrictions.</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[1] text-brand-text mb-6">
                GUEST FREEDOM BY DESIGN.
              </h2>
              <p className="text-lg leading-relaxed text-brand-grey font-light">
                Start instantly as a guest, or create an account to unlock cloud sync, notifications, and personalized insights. Here is exactly how they work:
              </p>
            </motion.div>
            <GuestFreedomPanelUI />
          </div>

          {/* 7. PERSONALIZATION (Custom covers, journals, counters) */}
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-32">
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[380px] sm:min-h-[460px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-6 sm:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <DecorativeOrganic className="-top-12 -right-16 rotate-45 opacity-30" size="w-56 h-56" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />
                <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-20" size="w-64 h-64" color="fill-brand-primary/5" variant={2} style={{ zIndex: -1 }} />
                <CollagePersonalizationUI />
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-black opacity-[0.03] select-none uppercase tracking-tighter text-brand-text">05</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Heart size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-brand-text">PERSONALIZATION</div>
                    <div className="text-xs font-bold text-brand-grey">Make it feel yours.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[1] text-brand-text">
                  CUSTOMIZE YOUR<br />LIBRARY YOUR WAY.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  From custom posters to private notes, Atrix Explorer gives you the freedom to build a library that feels personal.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Upload custom posters", "Add private notes", "Set custom reminders", "Edit progress manually", "Personalize your collection"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 8. UNLIMITED CATEGORIES (Manga, Anime, Novels...) */}
          <div className="flex flex-col gap-12 sm:gap-16 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-grey/28"
              size="w-[450px] h-[450px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <BackgroundBlob
              className="bottom-0 -right-20"
              color="bg-brand-primary/20"
              size="w-[500px] h-[500px]"
              variant={3}
              style={{ zIndex: -1 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-brand-grey text-xs font-black uppercase tracking-[0.4em] mb-4 block">UNLIMITED CATEGORIES</span>
              <span className="text-xs font-bold text-brand-grey block mb-2">Track what you love.</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[1] text-brand-text mb-6">
                CREATE YOUR OWN<br />PERSONAL LIBRARY SYSTEM.
              </h2>
              <p className="text-lg leading-relaxed text-brand-grey font-light">
                Atrix Explorer isn’t limited to manhwa. Add anime, novels, manga, movies, or anything else you want to track.
              </p>
            </motion.div>
            <CategoryGridUI />
          </div>

          {/* 9. IMPORT & EXPORT (CSV / JSON Backups) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 sm:gap-16 lg:gap-32">
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-grey/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[360px] sm:min-h-[420px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-6 sm:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <DecorativeOrganic className="-top-12 -right-16 rotate-12 opacity-20" size="w-56 h-56" color="fill-brand-primary/5" variant={3} style={{ zIndex: -1 }} />
                <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-30" size="w-64 h-64" color="fill-brand-grey/5" variant={0} style={{ zIndex: -1 }} />
                <ExportWorkflowUI />
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-black opacity-[0.03] select-none uppercase tracking-tighter text-brand-text">06</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Download size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-brand-text">IMPORT & EXPORT</div>
                    <div className="text-xs font-bold text-brand-grey">Your data stays yours.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[1] text-brand-text">
                  BACKUP, EXPORT,<br />AND MOVE YOUR<br />LIBRARY ANYTIME.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Your reading history should never feel locked. Export your library in one click and import it back whenever you need.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Export in CSV or JSON", "One-click backup system", "Bulk import with templates", "Easy migration from spreadsheets", "Safe cloud storage support"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 10. READING INSIGHTS (Statistics, Streaks, Progress Dashboard) */}
          <div className="flex flex-col gap-12 sm:gap-16 pt-8 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/20"
              size="w-[500px] h-[500px]"
              variant={1}
              style={{ zIndex: -1 }}
            />
            <BackgroundBlob
              className="bottom-0 -right-20"
              color="bg-brand-grey/28"
              size="w-[450px] h-[450px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-brand-grey text-xs font-black uppercase tracking-[0.4em] mb-4 block">TRACK YOUR READING LIFE</span>
              <span className="text-xs font-bold text-brand-grey block mb-2">SEE YOUR READING JOURNEY.</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[1] text-brand-text mb-6">
                VISUALIZE YOUR PROGRESS OVER TIME.
              </h2>
              <p className="text-lg leading-relaxed text-brand-grey font-light">
                View your reading activity, completed titles, progress streaks, and personal statistics over time.
              </p>
            </motion.div>
            <StatsDashboardUI />
          </div>
        </div>

        {/* Large overarching connection flow */}
        <DottedPath
          className="-bottom-20 left-0 opacity-[0.03] scale-[3] origin-left"
          width={500}
          height={200}
          viewBox="0 0 500 200"
          d="M10 180 Q 250 20 490 180"
        />

        {/* Final CTA Section */}
        <div className="relative isolate mt-32 sm:mt-64">
          <BackgroundBlob
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
            color="bg-brand-primary/20"
            size="w-[600px] h-[600px]"
            variant={3}
            style={{ zIndex: -1 }}
          />
          <section className="relative py-20 sm:py-32 rounded-[3rem] sm:rounded-[4rem] overflow-hidden text-center border border-brand-border bg-brand-card">
            <DecorativeOrganic className="-top-20 -left-20 opacity-30" size="w-64 h-64" color="fill-brand-primary/5" variant={2} />
            <DecorativeOrganic className="bottom-0 right-0 -rotate-12 opacity-30" size="w-72 h-72" color="fill-brand-grey/10" variant={0} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl mx-auto relative z-10 px-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 text-brand-text">
                BUILD YOUR PERFECT<br /><span className="text-brand-grey">READING SPACE.</span>
              </h2>
              <p className="text-brand-grey mb-12 font-light max-w-sm mx-auto leading-relaxed">Join readers who want a cleaner, smarter, and more personal way to manage their library.</p>
              <button
                onClick={handleDownload}
                className="h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-2xl bg-brand-primary text-brand-bg flex items-center gap-3 mx-auto"
              >
                GET ATRIX EXPLORER <ArrowRight size={16} />
              </button>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
};

const PrivacyPage = () => {
  return (
    <div className="pt-32 sm:pt-48 pb-20 sm:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase text-brand-text">Privacy Policy</h1>
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl h-full prose-zinc">
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">Effective: May 07, 2026</p>
        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">1. The Atrix Freedom Clause</h2>
        <p>Atrix Explorer is built on the principle of local privacy. Most of your library data, including custom notes and posters, is processed locally or stored securely in your synchronized cloud vault. We do not sell your reading or watching habits.</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">2. Data Collection</h2>
        <p>We collect minimal data required for synchronization and core library functions:</p>
        <ul>
          <li>Account Credentials: To secure your synchronized vault.</li>
          <li>Library Metadata: Title IDs, progress status, and your manual entries.</li>
          <li>Technical Logs: Latency reports and system health to ensure the Global Hub remains online.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">3. Zero-Knowledge Library</h2>
        <p>We do not "scrape" your content. Our search metadata pulls from public Manhwa/Manhua databases. Your manual custom entries are yours alone.</p>
      </section>
    </div>
  )
}

const TermsPage = () => {
  return (
    <div className="pt-32 sm:pt-48 pb-20 sm:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase text-brand-text">Terms of Service</h1>
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-zinc">
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">Last Updated: May 2026</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">1. Usage Rights</h2>
        <p>Atrix Explorer is a content tracking tool. You are responsible for ensuring that the posters you upload and the metadata you track comply with your local copyright laws.</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">2. Automated Features</h2>
        <p>Our search functionality is designed to provide quick access to tracking metadata for Manhwa and Manhua. We do not guarantee the 100% accuracy of third-party database information.</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">3. Account Responsibility</h2>
        <p>Your library is your personal space. Protect your access credentials. We are not responsible for data loss resulting from unauthorized account access.</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">4. Beta Scope</h2>
        <p>Atrix Explorer is currently in a high-performance Beta state. Features may be tuned for better efficiency during this development phase.</p>
      </section>
    </div>
  )
}

const FreedomPage = () => {
  return (
    <div className="pt-32 sm:pt-48 pb-20 sm:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase text-brand-text">Freedom Policy</h1>
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-zinc">
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">The Library Without Borders</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">1. Neutral Platform</h2>
        <p>Atrix Explorer does not discriminate against media types. Whether you track a blockbuster movie or an obscure indie webserial, the infrastructure treated them with equal fidelity.</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">2. Manual Sovereignty</h2>
        <p>We believe the user should never be blocked by a missing database entry. If a title doesn't exist in our Manhwa metadata search, you have the absolute right and capability to create it manually with your own titles, notes, and artwork. Atrix Explorer is for collectors who want full control.</p>

        <h2 className="text-2xl sm:text-3xl font-bold uppercase text-brand-text">3. Local-First Export</h2>
        <p>Your library data belongs to you. We are committed to providing tools that allow you to export your data, ensuring you aren't locked into our system if you choose to move your logs elsewhere.</p>
      </section>
    </div>
  )
}

const BlogPage = () => {
  const [visibleCount, setVisibleCount] = useState(9);
  const [filter, setFilter] = useState<"All" | "News" | "Recommendations">("All");

  const filteredPosts = useMemo(() => {
    if (filter === "All") return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === filter);
  }, [filter]);

  const latestPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);
  const displayedPosts = otherPosts.slice(0, visibleCount);

  const loadMore = () => {
    const currentCount = displayedPosts.length;
    setVisibleCount(prev => prev + 9);
    setTimeout(() => {
      const anchor = document.getElementById(`blog-post-card-${currentCount}`);
      if (anchor) {
        // Height of sticky navbar + top padding buffer
        const headerOffset = 140; 
        const elementPosition = anchor.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="pt-32 sm:pt-48 pb-20 sm:pb-32 min-h-screen bg-brand-bg relative overflow-hidden isolate">
      <DecorativeOrganic className="top-10 -left-32 rotate-45 opacity-20" size="w-96 h-96" color="fill-brand-primary/5" variant={1} />
      <DecorativeOrganic className="bottom-0 right-0 -rotate-12 opacity-20" size="w-[500px] h-[500px]" color="fill-brand-grey/5" variant={2} />
      <FloatingDot className="top-1/3 -right-12" delay={0.5} size="w-16 h-16" />
      <BackgroundBlob
        className="top-20 -left-20"
        color="bg-brand-primary/20"
        size="w-[600px] h-[600px]"
        variant={3}
      />
      <BackgroundBlob
        className="bottom-20 -right-20"
        color="bg-brand-grey/28"
        size="w-[600px] h-[600px]"
        variant={1}
      />
      <Helmet>
        <title>The Catalog | Curated Manhwa & Manhua Recommendations</title>
        <meta name="description" content="Discover the best Manhwa and Manhua recommendations. Expertly curated lists of badass OP MCs, cultivation, and non-cliché storylines." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <header className="mb-16 sm:mb-24 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.5em] mb-6 block text-brand-grey opacity-60"
          >
            Archive — Issue {new Date().getMonth() + 1}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter mb-8 uppercase text-brand-text"
          >
            The Catalog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-grey max-w-xl text-lg sm:text-xl font-light leading-relaxed"
          >
            Expertly curated Manhwa and Manhua lists. Your gateway to the strongest protagonists and most unique narratives.
          </motion.p>
        </header>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-16 sm:mb-20 justify-center">
          {(["All", "News", "Recommendations"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setVisibleCount(9);
              }}
              className={cn(
                "px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-95",
                filter === cat
                  ? "bg-brand-primary text-brand-bg shadow-xl"
                  : "bg-brand-card text-brand-grey hover:bg-brand-primary/10"
              )}
            >
              {cat === "News" ? "Weekly News" : cat}
            </button>
          ))}
        </div>

        {/* Latest Post Hero */}
        {latestPost && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 sm:mb-32 group"
          >
            <Link to={`/blog/${latestPost.id}`} className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-brand-border hover:shadow-2xl transition-all duration-500 bg-brand-card">
              <div className="relative aspect-[16/9] lg:aspect-square overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <img
                  src={latestPost.image}
                  alt={latestPost.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
                  <span className="px-4 sm:px-6 py-2 bg-white/90 backdrop-blur-xl rounded-full text-[9px] sm:text-xs font-black text-zinc-950 uppercase tracking-widest border border-white shadow-xl">
                    Featured / {latestPost.category}
                  </span>
                </div>
              </div>
              <div className="px-2 sm:px-4 text-center lg:text-left">
                <span className="text-xs font-mono text-brand-grey uppercase tracking-widest block mb-4 sm:mb-6">{latestPost.date} — By {latestPost.author}</span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6 sm:mb-8 leading-[1.1] tracking-tighter uppercase text-brand-text">
                  {latestPost.title}
                </h2>
                <p className="text-brand-grey text-lg sm:text-xl font-light leading-relaxed mb-8 sm:mb-10 line-clamp-3">
                  {latestPost.excerpt}
                </p>
                <div className="inline-flex items-center gap-4 font-black uppercase text-xs sm:text-sm tracking-widest group-hover:gap-6 transition-all text-brand-text">
                  Read the latest <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </motion.article>
        )}

        {/* Grid Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-16 sm:gap-y-20 mb-20">
          {displayedPosts.map((item, i) => (
            <motion.article
              id={`blog-post-card-${i}`}
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i % 3 * 0.1 }}
              className="flex flex-col group p-4 sm:p-5 rounded-[2rem] border border-brand-border bg-brand-card transition-all duration-500 hover:shadow-2xl"
            >
              <Link to={`/blog/${item.id}`} className="flex flex-col h-full">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-6 sm:mb-8 bg-brand-card-sub">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-zinc-900 uppercase tracking-widest border border-white shadow-md">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col px-2 pb-2">
                  <span className="text-[10px] font-mono text-brand-grey uppercase tracking-widest block mb-3">{item.date}</span>
                  <h3 className="text-xl sm:text-2xl font-bold transition-colors tracking-tight leading-tight uppercase mb-3 text-brand-text group-hover:text-brand-primary">
                    {item.title}
                  </h3>
                  <p className="text-brand-grey font-light leading-relaxed line-clamp-2 mb-6 text-sm flex-1">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-3 font-bold uppercase text-[10px] sm:text-xs tracking-widest group-hover:gap-5 transition-all text-brand-primary">
                    Read Story <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < otherPosts.length && (
          <div className="flex justify-center mt-20 sm:mt-32">
            <button
              onClick={loadMore}
              className="px-12 sm:px-16 py-5 sm:py-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 bg-brand-primary text-brand-bg"
            >
              Load More Articles
              <ArrowRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const { id } = useParams();
  const item = BLOG_POSTS.find(b => b.id === id);

  if (!item) return <div className="pt-48 text-center font-mono text-zinc-400 bg-brand-bg h-screen">ARTICLE_NOT_FOUND</div>;

  const latestNews = BLOG_POSTS.filter(post => post.category === "News" && post.id !== item.id).slice(0, 3);
  const recommendedPosts = BLOG_POSTS.filter(post => post.category === "Recommendations" && post.id !== item.id).slice(0, 3);

  return (
    <div className="pt-32 sm:pt-48 pb-20 sm:pb-32 bg-brand-bg relative overflow-hidden isolate">
      <DecorativeOrganic className="top-1/4 -right-20 opacity-30 rotate-12" size="w-96 h-96" color="fill-brand-primary/5" variant={0} />
      <DecorativeOrganic className="bottom-1/3 -left-32 -rotate-12 opacity-20" size="w-[500px] h-[500px]" color="fill-brand-grey/5" variant={1} />
      <BackgroundBlob
        className="top-0 right-0"
        color="bg-brand-primary/20"
        size="w-[700px] h-[700px]"
        variant={2}
      />
      <BackgroundBlob
        className="bottom-0 left-0"
        color="bg-brand-grey/28"
        size="w-[500px] h-[500px]"
        variant={3}
      />
      <Helmet>
        <title>{item.title} | Atrix Explorer Archive</title>
        <meta name="description" content={item.excerpt} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-12">
          <Link to="/blog" className="inline-flex items-center gap-3 transition-all uppercase font-mono text-[10px] sm:text-xs tracking-widest text-brand-grey hover:text-brand-text">
            <ArrowRight size={16} className="rotate-180" /> Back to Blog
          </Link>
        </div>

        <header className="mb-16 md:mb-24">
          <div className="flex flex-col gap-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 bg-brand-card text-brand-text border border-brand-border">
                {item.category}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[1] uppercase text-brand-text">
                {item.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] py-6 border-y border-brand-border text-brand-grey">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-border bg-brand-card">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`} alt={item.author} referrerPolicy="no-referrer" />
                </div>
                <span className="font-black tracking-normal uppercase text-brand-text">{item.author}</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-brand-border" />
              <span>{item.date}</span>
              <div className="hidden sm:block h-4 w-px bg-brand-border" />
              <span className="flex items-center gap-2 font-black"><Clock size={12} /> 8 MIN READ</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="relative w-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-16 lg:mb-24 shadow-2xl bg-brand-card aspect-[16/9] flex items-center justify-center">
            <img
              src={item.image}
              alt="Article Hero"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none font-light leading-relaxed prose-zinc text-zinc-700">
            <div className="space-y-16 sm:space-y-24">
              {item.content ? (
                <>
                  <p className="text-xl sm:text-2xl md:text-3xl leading-tight font-medium mb-12 text-brand-text drop-shadow-sm">{item.content.intro}</p>

                  {item.content.type === 'recommendation' ? (
                    (() => {
                      const items = item.content.items || [];
                      const rawHalf = Math.floor(items.length / 2);
                      // Ensure even split so the 2-column grid is perfectly balanced on desktop
                      const half = rawHalf % 2 === 0 ? rawHalf : rawHalf + 1;
                      const firstHalf = items.slice(0, half);
                      const secondHalf = items.slice(half);

                      return (
                        <>
                          {/* First Half of Recommendations */}
                          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mt-12">
                            {firstHalf.map((m: ManhwaItem) => (
                              <motion.div
                                key={m.rank}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-6 sm:p-8 rounded-[2rem] border border-brand-border group/item flex flex-col sm:flex-row gap-6 sm:gap-8 items-start bg-brand-card relative overflow-hidden isolate"
                              >
                                <DecorativeOrganic className="-top-12 -right-12 opacity-10" size="w-32 h-32" color="fill-brand-primary/5" variant={1} />
                                {item.category !== 'Recommendations' && m.image && (
                                  <div className="w-full sm:w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-xl relative flex-shrink-0 z-10">
                                    <img src={m.image} alt={m.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" referrerPolicy="no-referrer" />
                                    <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-primary text-brand-bg flex items-center justify-center font-black text-xs sm:text-sm shadow-xl">
                                      {m.rank}
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 relative z-10">
                                  <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 tracking-tighter uppercase leading-tight text-brand-text flex items-center gap-3">
                                    {item.category === 'Recommendations' && (
                                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary text-brand-bg text-xs sm:text-sm font-black flex-shrink-0">
                                        {m.rank}
                                      </span>
                                    )}
                                    <span>{m.title}</span>
                                  </h3>
                                  <p className="text-brand-grey mb-6 leading-relaxed text-sm font-medium opacity-80" style={{ whiteSpace: 'pre-line' }}>{m.desc}</p>
                                  <button
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(m.title)}`, '_blank')}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-widest border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-primary hover:text-brand-bg active:scale-95"
                                  >
                                    Search on web <Search size={14} />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Inline Telegram promotion card positioned exactly in the middle */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="my-12 sm:my-16 p-6 sm:p-8 rounded-[2rem] border-2 border-dashed border-brand-border flex flex-col md:flex-row items-center gap-6 sm:gap-8 transition-colors bg-brand-card"
                          >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#229ED9] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                              <Send size={28} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2 text-brand-text">Daily Manhwa News Updates on Telegram</h4>
                              <p className="text-brand-grey text-sm font-medium">
                                Don't wait for our reports. Get fast updates on chapter drops, season returns, and chat with other readers.
                              </p>
                            </div>
                            <button
                              onClick={() => window.open('https://t.me/manhwa_daily', '_blank')}
                              className="px-8 py-4 bg-brand-primary text-brand-bg rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 flex-shrink-0"
                            >
                              Join Now
                            </button>
                          </motion.div>

                          {/* Second Half of Recommendations */}
                          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                            {secondHalf.map((m: ManhwaItem) => (
                              <motion.div
                                key={m.rank}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-6 sm:p-8 rounded-[2rem] border border-brand-border group/item flex flex-col sm:flex-row gap-6 sm:gap-8 items-start bg-brand-card relative overflow-hidden isolate"
                              >
                                <DecorativeOrganic className="-top-12 -right-12 opacity-10" size="w-32 h-32" color="fill-brand-primary/5" variant={1} />
                                {item.category !== 'Recommendations' && m.image && (
                                  <div className="w-full sm:w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-xl relative flex-shrink-0 z-10">
                                    <img src={m.image} alt={m.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" referrerPolicy="no-referrer" />
                                    <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-primary text-brand-bg flex items-center justify-center font-black text-xs sm:text-sm shadow-xl">
                                      {m.rank}
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 relative z-10">
                                  <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 tracking-tighter uppercase leading-tight text-brand-text flex items-center gap-3">
                                    {item.category === 'Recommendations' && (
                                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary text-brand-bg text-xs sm:text-sm font-black flex-shrink-0">
                                        {m.rank}
                                      </span>
                                    )}
                                    <span>{m.title}</span>
                                  </h3>
                                  <p className="text-brand-grey mb-6 leading-relaxed text-sm font-medium opacity-80" style={{ whiteSpace: 'pre-line' }}>{m.desc}</p>
                                  <button
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(m.title)}`, '_blank')}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-widest border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-primary hover:text-brand-bg active:scale-95"
                                  >
                                    Search on web <Search size={14} />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="space-y-16 sm:space-y-24 mt-16 sm:mt-20">
                      {item.content.sections?.map((section: NewsSection, idx: number) => (
                        <motion.section
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="max-w-4xl mr-auto"
                        >
                          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-none text-brand-text">
                            {section.heading}
                          </h2>
                          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-brand-grey font-light mb-12">
                            {section.text}
                          </p>
                          {section.image && (
                            <div className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl bg-brand-card aspect-[16/9] mb-12 border border-brand-border">
                              <img src={section.image} alt={section.heading} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </motion.section>
                      ))}
                    </div>
                  )}

                  <div className="mt-20 sm:mt-24 space-y-12">
                    <div className="p-8 sm:p-12 md:p-16 lg:p-20 rounded-[2.5rem] sm:rounded-[3rem] relative overflow-hidden transition-colors border-2 border-brand-border shadow-2xl bg-brand-primary text-brand-bg">
                      <div className="relative z-10 max-w-3xl">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-8 px-4 py-1.5 border border-brand-bg/20 rounded-full w-fit opacity-60">Atrix App: Better Tracking</span>

                          <h3 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6 sm:mb-8 leading-[1]">
                            Track With <br />
                            <span className="opacity-50">Atrix Explorer.</span>
                          </h3>

                          <p className="text-lg sm:text-xl font-light leading-relaxed mb-10 sm:mb-12 opacity-80 max-w-md">
                            Use Atrix Explorer to track your library easily. It has fast search and daily news updates right in your pocket.
                          </p>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/" className="h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl bg-brand-bg text-brand-text">
                              Download APK <Download size={18} />
                            </Link>
                            <Link to="/features" className="h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border border-brand-bg/20 hover:bg-brand-bg/10 transition-all backdrop-blur-sm">
                              See Features <ChevronRight size={18} />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-gradient-to-br from-black/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
                    </div>
                  </div>
                </>
              ) : (
                <p>Full analysis coming soon for this archive entry.</p>
              )}
            </div>
          </div>

          {/* Related Blog Posts (Latest & Recommendations) */}
          {item.content && (
            <div className="mt-24 sm:mt-32 pt-16 border-t border-brand-border space-y-24 sm:space-y-32">
              {/* Latest News Section */}
              {latestNews.length > 0 && (
                <div className="space-y-10">
                  <div className="text-center lg:text-left">
                    <span className="text-brand-grey text-xs font-black uppercase tracking-[0.4em] mb-4 block">STAY UPDATED</span>
                    <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-brand-text">LATEST INTEL & NEWS</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-16 sm:gap-y-20">
                    {latestNews.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col group p-4 sm:p-5 rounded-[2rem] border border-brand-border bg-brand-card transition-all duration-500 hover:shadow-2xl"
                      >
                        <Link to={`/blog/${post.id}`} className="flex flex-col h-full">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-6 sm:mb-8 bg-brand-card-sub">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-zinc-900 uppercase tracking-widest border border-white shadow-md">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col px-2 pb-2">
                            <span className="text-[10px] font-mono text-brand-grey uppercase tracking-widest block mb-3">{post.date}</span>
                            <h3 className="text-xl sm:text-2xl font-bold transition-colors tracking-tight leading-tight uppercase mb-3 text-brand-text group-hover:text-brand-primary">
                              {post.title}
                            </h3>
                            <p className="text-brand-grey font-light leading-relaxed line-clamp-2 mb-6 text-sm flex-1">
                              {post.excerpt}
                            </p>
                            <div className="mt-auto flex items-center gap-3 font-bold uppercase text-[10px] sm:text-xs tracking-widest group-hover:gap-5 transition-all text-brand-primary">
                              Read Story <ArrowRight size={18} />
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {recommendedPosts.length > 0 && (
                <div className="space-y-10">
                  <div className="text-center lg:text-left">
                    <span className="text-brand-grey text-xs font-black uppercase tracking-[0.4em] mb-4 block">EXPLORE MORE</span>
                    <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-brand-text">RECOMMENDED READS</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-16 sm:gap-y-20">
                    {recommendedPosts.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col group p-4 sm:p-5 rounded-[2rem] border border-brand-border bg-brand-card transition-all duration-500 hover:shadow-2xl"
                      >
                        <Link to={`/blog/${post.id}`} className="flex flex-col h-full">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-6 sm:mb-8 bg-brand-card-sub">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-zinc-900 uppercase tracking-widest border border-white shadow-md">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col px-2 pb-2">
                            <span className="text-[10px] font-mono text-brand-grey uppercase tracking-widest block mb-3">{post.date}</span>
                            <h3 className="text-xl sm:text-2xl font-bold transition-colors tracking-tight leading-tight uppercase mb-3 text-brand-text group-hover:text-brand-primary">
                              {post.title}
                            </h3>
                            <p className="text-brand-grey font-light leading-relaxed line-clamp-2 mb-6 text-sm flex-1">
                              {post.excerpt}
                            </p>
                            <div className="mt-auto flex items-center gap-3 font-bold uppercase text-[10px] sm:text-xs tracking-widest group-hover:gap-5 transition-all text-brand-primary">
                              Read Story <ArrowRight size={18} />
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Page Transition Wrapper ---
const PageWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// --- Scroll Restorer on Route Change ---
const ScrollToTop = () => {
  return null;
};

// --- App Content Component ---
function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary selection:text-brand-bg transition-colors duration-300">
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" focusable="false">
        <filter id="pencil-sketch">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {/* @ts-expect-error React Router DOM v7 does not declare key on RoutesProps */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/features" element={<PageWrapper><FeaturesPage /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
            <Route path="/blog/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
            <Route path="/freedom" element={<PageWrapper><FreedomPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

// --- Main App ---

export default function App() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration to prevent jumps during page transitions
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Always set light theme attributes on mount
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark');
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

