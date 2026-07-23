import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState, useMemo, useRef, createContext, useContext, ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Menu, X, Github as GithubIcon, Download, ChevronRight, ChevronDown, Search, BookOpen, Clock, User, ArrowRight, ArrowDown, Layers, Zap, Globe, Shield, Bell, CheckCircle, Heart, Wind, Lock, Star, ExternalLink, Instagram, Send, MoreVertical, Plus, ShoppingCart, Library, Tv, ShieldCheck, Cloud } from "lucide-react";
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
    link.href = 'https://download.atrixexplorer.com/atrixexplorer-1.1.9.apk';
    link.download = 'atrixexplorer-1.1.9.apk';
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
      link.href = 'https://download.atrixexplorer.com/atrixexplorer-1.1.9.apk';
      link.download = 'atrixexplorer-1.1.9.apk';
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
    { name: "DOWNLOAD", path: "/download" },
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
            <span className="font-bold text-xl italic tracking-tighter text-brand-bg">A</span>
          </div>
          <span className="text-xl font-bold tracking-tighter transition-colors whitespace-nowrap text-brand-text">ATRIX EXPLORER</span>
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
                    "text-xs font-bold tracking-widest transition-all",
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
              className="h-11 px-6 rounded-2xl bg-brand-primary text-brand-bg font-bold text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
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
                      "text-2xl font-bold transition-colors uppercase tracking-widest",
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
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-primary text-brand-bg font-bold tracking-widest shadow-xl"
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
                <span className="font-bold italic tracking-tighter text-brand-bg">A</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-brand-text">ATRIX EXPLORER</span>
            </Link>
            <p className="text-brand-grey max-w-sm mb-10 leading-relaxed text-lg font-light">
              The ultimate hybrid tracking experience. Your personalized digital library for everything you watch and read.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/atrixexplorer/Atrix-Explorer" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl transition-all border bg-brand-card border-brand-border hover:opacity-80">
                <GithubIcon size={24} className="text-brand-text" />
              </a>
              <a href="https://www.instagram.com/atrixexplorer/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl transition-all border bg-brand-card border-brand-border hover:opacity-80">
                <Instagram size={24} className="text-brand-text" />
              </a>
              <a href="https://www.instagram.com/manhua_edits/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl transition-all border bg-brand-card border-brand-border hover:opacity-80">
                <Instagram size={24} className="text-brand-text" />
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 text-sm">
            <h4 className="font-bold mb-8 tracking-widest text-xs opacity-50 text-brand-text">App</h4>
            <ul className="space-y-4">
              {["Hybrid Engine", "Hybrid Reminders", "Browser Tracking", "Global Hub"].map(i => (
                <li key={i}><Link to="/features" className="text-brand-grey hover:text-brand-text transition-colors">{i}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 md:col-span-1 text-sm">
            <h4 className="font-bold mb-8 tracking-widest text-xs opacity-50 text-brand-text">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={handleDownload} className="text-brand-grey hover:text-brand-text transition-colors">Android (Direct)</button></li>
              <li><Link to="/download" className="text-brand-grey hover:text-brand-text transition-colors">All Releases</Link></li>
              <li className="text-brand-grey/40 cursor-not-allowed">iOS (Pending)</li>
              <li><Link to="/freedom" className="text-brand-grey hover:text-brand-text transition-colors">OS Sovereignty</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-1 text-sm">
            <h4 className="font-bold mb-8 tracking-widest text-xs opacity-50 text-brand-text">Legal</h4>
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
            <span className="text-brand-grey/40 text-xs font-mono ">System Online</span>
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
      <div className="text-[10px] font-bold tracking-widest opacity-40 mb-0.5 text-brand-text">Instant Alert</div>
      <div className="text-sm font-bold tracking-tight text-brand-text">New Chapter: Regression</div>
      <div className="text-[10px] opacity-60 text-brand-grey font-medium">Chapter 142 is now live!</div>
    </div>
  </motion.div>
);

const ProgressUpdateMockup = ({ title, chapter, isSaved }: { title: string, chapter: number, isSaved?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative z-10 p-4 rounded-2xl shadow-2xl border flex items-center gap-4 max-w-xs bg-brand-card border-brand-border w-full text-left"
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary text-brand-bg shadow-lg shadow-brand-primary/10 shrink-0">
      {isSaved ? <CheckCircle size={20} className="text-brand-bg" /> : <Plus size={20} className="text-brand-bg" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[9px] font-bold tracking-widest opacity-40 mb-0.5 text-brand-text">
        {isSaved ? "Progress Saved" : "New Detected"}
      </div>
      <div className="text-sm font-bold tracking-tight text-brand-text truncate">{title}</div>
      <div className="text-[10px] opacity-60 text-brand-grey font-medium">
        {isSaved ? `Chapter ${chapter} saved to phone` : `Chapter ${chapter} detected on page`}
      </div>
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
      <div className="text-[10px] mb-3 tracking-wider font-semibold text-brand-grey opacity-60">{subtitle || "manhwa • Today"}</div>
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
      <h4 className="text-2xl font-bold tracking-tight">Your Library</h4>
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

const FAQItem = ({ faq }: { faq: {q: string, a: string} }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6 bg-[var(--app-card-dark)] rounded-2xl border border-[var(--app-border)] shadow-sm cursor-pointer hover:bg-[var(--app-card-dark)]/80 transition-colors" onClick={() => setOpen(!open)}>
       <h3 className="text-lg font-bold text-white flex items-center justify-between gap-4">
         <span>{faq.q}</span>
         <ChevronDown size={20} className={cn("text-[var(--app-accent-neon)] transition-transform shrink-0", open ? "rotate-180" : "")} />
       </h3>
       <AnimatePresence>
         {open && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: "auto", opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="overflow-hidden"
           >
             <p className="text-[var(--app-grey)] font-light pt-4 leading-relaxed">{faq.a}</p>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="w-full bg-brand-bg text-brand-text font-sans relative">
      <Helmet>
        <title>Atrix Explorer | Mobile Web Browser for Manga & Novel Readers</title>
        <meta name="description" content="A mobile web browser built for reading manga, manhwa, and novels. Automatically tracks your progress, blocks ads, and saves your library on your device." />
        <link rel="canonical" href="https://atrixexplorer.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atrixexplorer.com/" />
        <meta property="og:title" content="Atrix Explorer | Mobile Web Browser for Manga & Novel Readers" />
        <meta property="og:description" content="A mobile web browser built for reading manga, manhwa, and novels. Automatically tracks your progress, blocks ads, and saves your library on your device." />
        <meta property="og:image" content="https://atrixexplorer.com/hero-preview.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Atrix Explorer | Mobile Web Browser for Manga & Novel Readers" />
        <meta name="twitter:description" content="A mobile web browser built for reading manga, manhwa, and novels. Automatically tracks your progress, blocks ads, and saves your library on your device." />
        <meta name="twitter:image" content="https://atrixexplorer.com/hero-preview.webp" />
      </Helmet>

      {/* Global Dotted Connectors */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
         {/* Vertical line running down the center-left */}
         <div className="absolute left-[15%] top-0 bottom-0 w-px border-l-2 border-dotted border-brand-grey/10" />
         {/* Vertical line running down the center-right */}
         <div className="absolute right-[15%] top-0 bottom-0 w-px border-l-2 border-dotted border-brand-grey/10" />
      </div>

      {/* 1. Hero Section (White Background) */}
      <section className="relative pt-32 pb-24 px-4 sm:px-8 bg-brand-bg overflow-hidden isolate">
        <BackgroundBlob className="-top-20 -left-20" color="bg-brand-grey/[0.06]" size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]" variant={1} />
        <BackgroundBlob className="bottom-0 right-0" color="bg-brand-grey/[0.04]" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={2} />
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight text-brand-text">
              Browse the web. <br />
              <span className="text-zinc-600">We save your progress.</span>
            </h1>
            <p className="text-brand-grey text-lg font-light leading-relaxed mb-8">
              Built specifically for manga, manhwa, and novel readers who want automatic progress tracking without creating an account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://github.com/atrixexplorer/Atrix-Explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 px-8 font-bold text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-brand-border bg-brand-bg text-brand-text hover:bg-brand-card shadow-sm"
              >
                <GithubIcon size={18} /> GitHub
              </a>
              <button
                onClick={handleDownload}
                className="h-14 px-8 font-bold text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 bg-brand-primary text-white"
              >
                Download APK <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>

          <div className="relative flex justify-center lg:justify-end items-center py-10 isolate">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 60 }}
              className="relative w-full max-w-[300px] z-20 glow-cyan rounded-[2rem]"
            >
              <MobileFrame className="z-20 border-brand-border">
                <img
                  src="/hero-preview.webp"
                  alt="Atrix Explorer Home Screen"
                  className="w-full h-full object-cover"
                />
              </MobileFrame>

              {/* Floating UI Cards */}
              <div className="absolute -top-4 -right-10 z-30 hidden sm:flex items-center gap-2 bg-white rounded-2xl p-3 shadow-xl border border-zinc-200">
                 <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Star size={16} />
                 </div>
                 <div className="text-sm font-bold text-brand-text">Reading Streak</div>
              </div>

              <div className="absolute bottom-16 -left-16 z-30 hidden sm:flex flex-col bg-white rounded-2xl p-3 shadow-xl border border-zinc-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-brand-primary" />
                    <div className="text-xs font-bold text-brand-text">Auto Saved</div>
                  </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. The Problem Section */}
      <section className="relative py-24 px-4 sm:px-8 border-y border-brand-border bg-brand-bg/50 isolate overflow-hidden">
         <BackgroundBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="bg-brand-grey/[0.05]" size="w-[400px] sm:w-[800px] h-[400px] sm:h-[800px]" variant={3} />
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-brand-text">
              Stop managing spreadsheets. <br /> Start reading.
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
               {/* Left: The Mess */}
               <div className="flex relative">
                  <div className="w-[160px] sm:w-[200px] aspect-[3/4] rounded-2xl border border-red-500/20 shadow-xl overflow-hidden rotate-[-6deg] bg-white relative z-10">
                     <img src="/problem-screenshot-2.webp" alt="Messy tabs" className="w-full h-full object-cover opacity-80" />
                     <div className="absolute inset-0 bg-red-500/10" />
                  </div>
                  <div className="w-[160px] sm:w-[200px] aspect-[3/4] rounded-2xl border border-red-500/20 shadow-xl overflow-hidden rotate-[6deg] -ml-16 bg-white relative z-20">
                     <img src="/problem-screenshot-1.webp" alt="Spreadsheet" className="w-full h-full object-cover opacity-80" />
                     <div className="absolute inset-0 bg-red-500/10" />
                  </div>
               </div>

               {/* Center: Arrow */}
               <div className="hidden lg:flex items-center justify-center">
                  <ArrowRight size={48} className="text-brand-primary opacity-80" />
               </div>
               <div className="flex lg:hidden items-center justify-center my-4">
                  <ArrowDown size={40} className="text-brand-primary opacity-80" />
               </div>

               {/* Right: The Solution */}
               <div className="w-[200px] sm:w-[240px] aspect-[3/4] rounded-2xl border-2 border-brand-primary shadow-2xl glow-cyan overflow-hidden bg-white relative z-30">
                  <img src="/library-preview.webp" alt="Clean Library" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-brand-border flex items-center gap-2 whitespace-nowrap">
                     <CheckCircle size={16} className="text-brand-primary" />
                     <span className="text-xs font-bold text-brand-text">Organized Library</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. "Why ATRIX Explorer" Section (Dark Background) */}
      <section className="relative py-24 px-4 sm:px-8 bg-[var(--app-dark-bg)] text-[var(--app-text-light)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why ATRIX Explorer?</h2>
            <p className="text-[var(--app-grey)] text-lg max-w-2xl mx-auto font-light">Built from the ground up for a seamless reading experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { icon: BookOpen, title: "Never lose your place again", desc: "Spend a minute on a page, and the browser automatically remembers your position. No manual logs needed." },
              { icon: Globe, title: "Read comfortably without interruptions", desc: "Enjoy hands-free auto-scrolling, powerful ad-blocking, and clean search filters designed for novels and manga." },
              { icon: Lock, title: "Your history stays private", desc: "100% local-first privacy. Your reading library lives entirely on your device unless you actively choose to back it up." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[var(--app-card-dark)] border border-[var(--app-border)] shadow-sm hover:-translate-y-2 hover:shadow-2xl hover:border-brand-primary/30 transition-all duration-300 cursor-default">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[var(--app-grey)] font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Breakdown (White Background) */}
      <section className="relative py-24 px-4 sm:px-8 bg-brand-bg isolate overflow-hidden">
        <BackgroundBlob className="top-[10%] right-[-10%]" color="bg-brand-grey/[0.04]" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={0} />
        <BackgroundBlob className="bottom-[10%] left-[-10%]" color="bg-brand-grey/[0.04]" size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]" variant={1} />
        
        <div className="max-w-7xl mx-auto space-y-32 relative z-10">
          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
             <div className="relative flex justify-center">
                <div className="w-full max-w-[300px] relative">
                   <img src="/reader-feature-preview.webp" alt="Reader Feature" className="w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-brand-card" />
                </div>
             </div>
             <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-text">Comfortable reading, built-in.</h2>
                <p className="text-brand-grey text-lg font-light mb-8">
                  Manga and novel websites can be full of clutter. Atrix has built-in features to make reading clean and easy.
                </p>
                <ul className="space-y-4">
                  {[
                    "Blocks popups and ads instantly.",
                    "Hands-free auto-scroll at your preferred speed.",
                    "Cleaner search hiding shopping noise."
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-brand-primary" />
                      <span className="font-semibold text-brand-text">{text}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
             <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-text">Access your library, anywhere.</h2>
                <p className="text-brand-grey text-lg font-light mb-8">
                  Organize your collection into lists like Plan, Reading, or Completed. Your history is stored on your device, keeping your reading completely private.
                </p>
                <ul className="space-y-4">
                  {[
                    "Saved completely offline on your phone.",
                    "Optional free cloud backup across devices.",
                    "Export lists to standard formats easily."
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-brand-primary" />
                      <span className="font-semibold text-brand-text">{text}</span>
                    </li>
                  ))}
                </ul>
             </div>
             <div className="order-1 lg:order-2 relative flex justify-center">
                <div className="w-full max-w-[300px] relative">
                   <img src="/library-preview.webp" alt="Library View" className="w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-brand-card" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (Dark Background Rhythm Breaker) */}
      <section className="relative py-32 px-4 sm:px-8 bg-[var(--app-dark-bg)] text-[var(--app-text-light)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-20">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-12 sm:gap-8">
            {[
              { icon: Search, title: "Search", desc: "Find any novel or manga via the built-in browser." },
              { icon: BookOpen, title: "Read", desc: "Enjoy a clean, ad-free reading experience." },
              { icon: CheckCircle, title: "Progress Saved", desc: "We automatically log your chapter." },
              { icon: Globe, title: "Resume Anywhere", desc: "Open the app and jump right back in." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center relative">
                <div className="w-24 h-24 rounded-3xl bg-[var(--app-card-dark)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-accent-neon)] mb-8 z-10 relative shadow-xl hover:scale-105 transition-transform">
                  <step.icon size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-[var(--app-grey)] font-light text-lg max-w-[200px]">{step.desc}</p>
                
                {/* Connecting Line */}
                {i !== 3 && (
                  <div className="hidden sm:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-[var(--app-border)] z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Screenshots Carousel (White Background) */}
      <section className="relative py-24 px-4 sm:px-8 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-brand-text">Beautiful inside and out.</h2>
          </div>
          <div className="flex overflow-x-auto pt-8 pb-12 snap-x no-scrollbar px-4 md:px-8 w-full">
            <div className="flex gap-6 mx-auto">
              {[
                { src: "/hero-preview.webp", label: "Home" },
                { src: "/reading-tab-preview.webp", label: "Browser" },
                { src: "/library-preview.webp", label: "Library" },
                { src: "/Deatilescreen-preview.webp", label: "Detail" },
                { src: "/profile-preview.webp", label: "Profile" },
                { src: "/insight-preview.webp", label: "Insight" },
              ].map((item, i) => (
                <div key={i} className="shrink-0 snap-center group rounded-3xl transition-all duration-300 hover:-translate-y-4 cursor-pointer flex flex-col items-center justify-center">
                  <div className="bg-white rounded-3xl p-3 shadow-sm border border-brand-border group-hover:glow-cyan group-hover:shadow-2xl transition-all duration-300 w-[240px] md:w-[260px]">
                     <img src={item.src} alt={`${item.label} Mockup`} className="w-full rounded-2xl overflow-hidden" />
                  </div>
                  <div className="text-center mt-6 text-brand-grey font-bold tracking-widest text-xs uppercase opacity-70 group-hover:opacity-100 group-hover:text-brand-primary transition-colors">
                     {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 Built for readers (Dark Background) */}
      <section className="relative py-24 px-4 sm:px-8 bg-[var(--app-dark-bg)] text-[var(--app-text-light)]">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16">Built for readers, not browsers.</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
               {/* Chrome */}
               <div className="bg-[var(--app-card-dark)] p-8 rounded-3xl border border-[var(--app-border)] w-full max-w-sm">
                  <div className="flex items-center justify-center gap-3 mb-6 opacity-70">
                     <Globe size={24} />
                     <h3 className="text-xl font-bold">Generic Browser</h3>
                  </div>
                  <ul className="space-y-4 text-left">
                     <li className="flex items-center gap-3 text-[var(--app-grey)]"><X size={18} className="text-red-400 shrink-0" /> Generic web browser</li>
                     <li className="flex items-center gap-3 text-[var(--app-grey)]"><X size={18} className="text-red-400 shrink-0" /> No reading memory</li>
                     <li className="flex items-center gap-3 text-[var(--app-grey)]"><X size={18} className="text-red-400 shrink-0" /> No library organization</li>
                  </ul>
               </div>

               <div className="hidden md:block">
                  <ArrowRight size={32} className="text-[var(--app-grey)] opacity-30" />
               </div>
               <div className="md:hidden my-4">
                  <ArrowDown size={32} className="text-[var(--app-grey)] opacity-30" />
               </div>

               {/* ATRIX Explorer */}
               <div className="bg-[var(--app-card-dark)] p-8 rounded-3xl border-2 border-[var(--app-accent-neon)] w-full max-w-sm glow-cyan relative shadow-xl">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--app-accent-neon)] text-[#09090b] px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                     YOUR NEW HOME
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-6">
                     <div className="w-8 h-8 rounded-lg bg-[var(--app-accent-neon)] flex items-center justify-center text-[#09090b] font-bold text-lg">A</div>
                     <h3 className="text-xl font-bold text-white">ATRIX Explorer</h3>
                  </div>
                  <ul className="space-y-4 text-left">
                     <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-[var(--app-accent-neon)] shrink-0" /> Built specifically for manga & novels</li>
                     <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-[var(--app-accent-neon)] shrink-0" /> Remembers where you stopped</li>
                     <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-[var(--app-accent-neon)] shrink-0" /> Organizes your reading automatically</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 7. Comparison Table (White Background) */}
      <section className="relative py-24 px-4 sm:px-8 bg-brand-bg">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-brand-text">Why switch to ATRIX Explorer?</h2>
            
            <div className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
               <div className="grid grid-cols-3 bg-brand-card p-6 border-b border-brand-border">
                  <div className="font-bold text-brand-text">Feature</div>
                  <div className="font-bold text-brand-grey text-center">Chrome</div>
                  <div className="font-bold text-brand-primary text-center">ATRIX Explorer</div>
               </div>
               
               {[
                 { feat: "Saves reading progress", normal: false, atrix: true },
                 { feat: "Reading library", normal: false, atrix: true },
                 { feat: "Auto-scroll", normal: false, atrix: true },
                 { feat: "Optional backup", normal: false, atrix: true },
               ].map((row, i) => (
                 <div key={i} className="grid grid-cols-3 p-6 border-b border-brand-border last:border-0 hover:bg-brand-card/50 transition-colors items-center">
                    <div className="text-brand-text font-medium">{row.feat}</div>
                    <div className="text-center text-brand-grey flex justify-center">
                       {row.normal === false ? <X size={20} /> : <span className="text-sm">{row.normal}</span>}
                    </div>
                    <div className="text-center flex justify-center text-brand-primary">
                       <CheckCircle size={24} className="glow-cyan rounded-full" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. Social Proof (White Background) */}
      <section className="relative py-20 px-4 sm:px-8 bg-brand-bg text-center">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-brand-text">Join thousands of readers keeping track of everything they read.</h2>
            <p className="text-brand-grey mb-8 font-light text-lg">
               Get chapter updates, feature announcements, and reading recommendations.
            </p>
            <div className="flex justify-center">
               <a href="https://t.me/manhwa_daily" target="_blank" rel="noreferrer" className="px-8 py-4 rounded-2xl border border-brand-border bg-white shadow-sm hover:shadow-md transition-all flex items-center gap-3 text-brand-text font-bold">
                  <Send size={20} className="text-[#0088cc]" /> Join the Telegram Community
               </a>
            </div>
         </div>
      </section>

      {/* 9. FAQ Section (Dark Background) */}
      <section className="relative py-32 px-4 sm:px-8 bg-[var(--app-dark-bg)] text-[var(--app-text-light)] border-t border-[var(--app-border)]">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is this just a reading app?", a: "No, it's a fully functional mobile web browser that specifically detects and enhances manga and novel websites." },
                { q: "Is it available on iOS?", a: "Currently, ATRIX Explorer is only available for Android via APK download. We are actively exploring an iOS release in the future." },
                { q: "Do I need to create an account?", a: "Absolutely not. You can download the app and start reading immediately. Accounts are only needed if you want cloud backups." },
                { q: "Is my reading data private?", a: "Yes. By default, your entire reading history and library are stored exclusively on your local device." },
                { q: "Does it work offline?", a: "Your library and progress tracking work offline. However, since it is a web browser, you will need an internet connection to load and read new chapters." },
                { q: "Is cloud backup optional?", a: "Yes! Cloud backup is entirely optional and free. You never have to use it if you prefer 100% local storage." },
                { q: "Will it sync across devices?", a: "Yes, if you choose to create a free account, you can sync your library seamlessly across multiple Android devices." },
              ].map((faq, i) => (
                <div key={i}>
                  <FAQItem faq={faq} />
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* 10. Compact News (White Background) */}
      <section className="relative py-16 px-4 sm:px-8 bg-brand-bg">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-2xl font-bold text-brand-text">Latest News</h2>
                  <p className="text-brand-grey text-sm">Updates from the community</p>
               </div>
               <Link to="/blog" className="text-sm font-bold text-brand-primary hover:underline">View All &rarr;</Link>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
               {BLOG_POSTS.slice(0, 3).map((post, i) => (
                  <Link key={i} to={`/blog/${post.id}`} className="group block border border-brand-border rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                     <div className="h-32 bg-zinc-100 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     </div>
                     <div className="p-4">
                        <div className="text-[10px] font-bold text-brand-grey mb-1 uppercase tracking-widest">{post.category}</div>
                        <h3 className="text-sm font-bold text-brand-text line-clamp-2">{post.title}</h3>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 11. Big Download CTA (Dark Background) */}
      <section className="relative pt-24 sm:pt-40 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-8 bg-[var(--app-dark-bg)] text-white overflow-hidden text-center">
        {/* Glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-[var(--app-accent-neon)] opacity-10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
            Ready to organize <br /> everything you read?
          </h2>
          <p className="text-[var(--app-grey)] text-lg md:text-xl font-light mb-12">
            Download ATRIX Explorer today.
          </p>
          <div className="flex justify-center">
             <button
               onClick={handleDownload}
               className="h-16 px-12 font-bold text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl bg-white text-zinc-900 flex items-center gap-3"
             >
               Download APK <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const MobileFrame = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={cn("relative z-10 aspect-[9/18.5] rounded-[1.75rem] p-1.5 border border-brand-border bg-brand-bg shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] overflow-hidden", className)}>
    <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-brand-card border border-brand-border relative group">
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
        <span className="text-[9px] font-bold tracking-widest text-brand-text">DATABASE</span>
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
      <span className="text-[8px] font-bold tracking-widest text-brand-grey">EXPORT DATA</span>
    </div>

    <div className="relative z-10 flex-1 w-full p-4 rounded-2xl bg-brand-bg border border-brand-border text-left">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={14} className="text-emerald-600" />
        <span className="text-[9px] font-bold tracking-widest text-brand-text">DOWNLOAD SUCCESS</span>
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
              <div className="text-[10px] font-bold tracking-widest text-brand-text">{item.name}</div>
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
            <span className="text-[8px] font-bold tracking-widest text-white border border-white/40 px-1.5 py-0.5 rounded">Change Cover</span>
          </div>
          <div className="absolute inset-1.5 border border-dashed border-white/20 pointer-events-none" />
          <BookOpen size={20} className="opacity-20 text-brand-primary" />
        </div>
        <div className="mt-2 text-left">
          <span className="text-[7px] font-bold tracking-widest text-brand-grey block">UPLOAD POSTER</span>
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
            <span className="text-[8px] font-bold tracking-widest text-brand-text ">Private Notes</span>
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
          <div className="text-[7px] font-bold tracking-widest text-brand-grey ">PROGRESS</div>
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
      <span className="text-[7px] font-bold tracking-[0.2em] text-brand-text">Sync Vault</span>
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
        <div className="text-[8px] font-bold tracking-widest text-brand-text">Phone A</div>
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
        <div className="text-[8px] font-bold tracking-widest text-brand-text">Phone B</div>
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
  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto px-4 items-stretch">
    {/* Local-First Card (Primary) */}
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="p-5 sm:p-8 md:p-10 rounded-[2.5rem] border-2 border-brand-primary bg-brand-card flex flex-col gap-6 text-left shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden isolate"
    >
      <DecorativeOrganic className="-top-12 -right-12 rotate-12 opacity-30" size="w-48 h-48" color="fill-brand-primary/5" variant={0} style={{ zIndex: -1 }} />
      <DecorativeOrganic className="bottom-[-30px] left-[-30px] rotate-[45deg] opacity-20" size="w-40 h-40" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />
      
      <div className="absolute top-6 right-6 px-3 py-1 bg-brand-primary text-brand-bg text-[10px] font-bold tracking-widest rounded-full shadow-md">
        DEFAULT EXPERIENCE
      </div>

      <div className="flex flex-col gap-6 relative z-10 w-full h-full">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-bg shadow-lg">
            <Lock size={26} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-brand-primary">MAXIMUM PRIVACY</div>
            <h3 className="text-2xl font-bold text-brand-text tracking-tight">Local-First Mode</h3>
          </div>
        </div>

        <p className="text-sm text-brand-grey font-medium leading-relaxed">
          The complete, uncompromising ATRIX Explorer experience. Start instantly without onboarding friction. Your entire library, history, and notifications live securely on your device.
        </p>

        <div className="h-px bg-brand-border/50 my-2" />

        <div className="space-y-4">
          <div className="text-[10px] font-bold tracking-widest text-brand-grey opacity-60 mb-2">FULL FEATURE ACCESS</div>
          {[
            { text: "Frictionless start", desc: "No sign-ups or onboarding hurdles." },
            { text: "100% private library", desc: "Your data never leaves your phone." },
            { text: "Smart reading progress", desc: "Automatic chapter tracking and history." },
            { text: "Instant chapter alerts", desc: "Get notified immediately when new chapters drop." },
            { text: "Advanced reader tools", desc: "Unrestricted access to ad-block and auto-scroll." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle size={18} className="text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-brand-text leading-tight">{item.text}</h4>
                <p className="text-[11px] text-brand-grey font-light leading-normal opacity-85">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Cloud Sync Card (Optional) */}
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="p-5 sm:p-8 md:p-10 rounded-[2.5rem] border border-brand-border/50 bg-brand-bg flex flex-col gap-6 text-left shadow-sm hover:shadow-md transition-all relative overflow-hidden isolate opacity-90 hover:opacity-100"
    >
      <div className="flex flex-col gap-6 relative z-10 w-full h-full">
        <div className="flex items-center gap-4 opacity-80">
          <div className="w-12 h-12 rounded-2xl bg-brand-grey/10 flex items-center justify-center text-brand-text/60">
            <Cloud size={22} />
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-widest text-brand-grey">CROSS-DEVICE CONVENIENCE</div>
            <h3 className="text-xl font-bold text-brand-text/80 tracking-tight">Cloud Sync</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-brand-grey font-light leading-relaxed">
          Designed specifically for users who need to manage their library across multiple devices. A seamless infrastructure extension, not a feature paywall.
        </p>

        <div className="h-px bg-brand-border/50 my-2" />

        <div className="space-y-4">
          <div className="text-[10px] font-bold tracking-widest text-brand-grey opacity-60 mb-2">CLOUD INFRASTRUCTURE</div>
          {[
            { text: "Real-time device sync", desc: "Read on your phone, continue on your tablet." },
            { text: "Encrypted cloud backups", desc: "Safely store a mirrored copy of your library." },
            { text: "Seamless migration", desc: "Restore your entire setup instantly on a new phone." },
            { text: "Multi-device identicality", desc: "Keep all your tags, notes, and progress matched." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle size={18} className="text-brand-text/40 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-brand-text/80 leading-tight">{item.text}</h4>
                <p className="text-[11px] text-brand-grey font-light leading-normal opacity-85">{item.desc}</p>
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
        <span className="text-[8px] font-bold tracking-widest text-brand-grey ">READING STREAK</span>
        <Star size={14} className="text-amber-500 fill-amber-500/20" />
      </div>
      <div>
        <div className="text-xl font-bold text-brand-text">42 DAYS</div>
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
        <span className="text-[8px] font-bold tracking-widest text-brand-grey ">MONTHLY PROGRESS</span>
        <BookOpen size={14} className="text-brand-primary" />
      </div>
      <div>
        <div className="text-xl font-bold text-brand-text">180 CH</div>
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
        <span className="text-[8px] font-bold tracking-widest text-brand-grey ">DISTRIBUTION</span>
        <Layers size={14} className="text-brand-primary" />
      </div>
      <div>
        <div className="text-xl font-bold text-brand-text">3 STYLES</div>
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
        <span className="text-[8px] font-bold tracking-widest text-brand-grey ">READING INSIGHTS</span>
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
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen overflow-hidden bg-brand-bg text-brand-text relative isolate">
      <DecorativeOrganic className="top-20 -left-20" size="w-96 h-96" color="fill-brand-primary/5" variant={0} style={{ zIndex: -1 }} />
      <DecorativeOrganic className="top-1/4 -right-32 rotate-12" size="w-64 h-64" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />
      <BackgroundBlob
        className="top-0 left-0"
        color="bg-brand-primary/20"
        size="w-[400px] sm:w-[800px] h-[400px] sm:h-[800px]"
        animateProps={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
        variant={0}
        style={{ zIndex: -1 }}
      />
      <BackgroundBlob
        className="bottom-0 right-0"
        color="bg-brand-grey/28"
        size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
        animateProps={{ scale: [1, 1.2, 1] }}
        variant={2}
        style={{ zIndex: -1 }}
      />

      <Helmet>
        <title>Features | Atrix Explorer Browser</title>
        <meta name="description" content="Explore all features built for reading comfort: auto-save progress, popup blocking, auto-scroll, customizable library, and optional cloud backups." />
        <link rel="canonical" href="https://atrixexplorer.com/features" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atrixexplorer.com/features" />
        <meta property="og:title" content="Features | Atrix Explorer Browser" />
        <meta property="og:description" content="Explore all features built for reading comfort: auto-save progress, popup blocking, auto-scroll, customizable library, and optional cloud backups." />
        <meta property="og:image" content="https://atrixexplorer.com/hero-preview.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Features | Atrix Explorer Browser" />
        <meta name="twitter:description" content="Explore all features built for reading comfort: auto-save progress, popup blocking, auto-scroll, customizable library, and optional cloud backups." />
        <meta name="twitter:image" content="https://atrixexplorer.com/hero-preview.webp" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* 1. Hero / Big Vision */}
        <header className="mb-16 sm:mb-24 md:mb-40 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-grey text-xs font-bold tracking-[0.4em] mb-6 block"
          >
            FREEDOM & FLEXIBILITY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1] tracking-tighter mb-10 text-balance text-brand-text"
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
          
          {/* 2. READ COMFORTABLY (Browser Features) */}
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-top-20 -right-20"
              color="bg-brand-primary/20"
              size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-grey/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[500px] sm:min-h-[600px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <div className="w-full max-w-[240px] sm:max-w-[280px] relative">
                  <DecorativeOrganic className="-top-12 -right-16 rotate-12" size="w-56 h-56" color="fill-brand-grey/10" variant={0} />
                  <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-40" size="w-64 h-64" color="fill-brand-primary/5" variant={1} />
                  
                  <MobileFrame>
                    <img
                      src="/reading-tab-preview.webp"
                      alt="Reading View Mockup"
                      className="w-full h-full object-cover"
                    />
                  </MobileFrame>
                  <motion.div whileHover={{ scale: 1.05 }} className="absolute -right-8 sm:-right-12 top-24 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-bg shadow-xl border border-brand-border flex items-center gap-2 sm:gap-3 z-20">
                     <Shield size={18} className="text-emerald-500 shrink-0" />
                     <div className="text-[10px] sm:text-xs font-bold text-brand-text tracking-widest whitespace-nowrap">AD BLOCKED</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="absolute -left-8 sm:-left-12 bottom-32 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-bg shadow-xl border border-brand-border flex items-center gap-2 sm:gap-3 z-20">
                     <ArrowDown size={18} className="text-brand-primary shrink-0" />
                     <div className="text-[10px] sm:text-xs font-bold text-brand-text tracking-widest whitespace-nowrap">AUTO-SCROLL</div>
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.03] select-none tracking-tighter text-brand-text">01</div>
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
                    <BookOpen size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold tracking-widest opacity-40 text-brand-text">BROWSER FEATURES</div>
                    <div className="text-xs font-bold text-brand-grey">Zero interruptions.</div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1] text-brand-text">
                  READ COMFORTABLY,<br />EVERY SINGLE TIME.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Enjoy hands-free auto-scrolling, powerful ad-blocking, and clean search filters designed specifically for reading novels and manga.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Powerful ad-blocker", "Adjustable auto-scroll", "Block intrusive popups", "Distraction-free mode"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleDownload}
                  className="h-14 px-8 mx-auto lg:mx-0 rounded-2xl font-bold text-xs tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg bg-brand-primary text-brand-bg"
                >
                  Get APK <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* 3. AUTOMATIC PROGRESS TRACKING (Smart Tracking) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/32"
              size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[500px] sm:min-h-[600px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                {/* Scaled the phone UI up by 10% (from max-w-[280px] to max-w-[310px]) */}
                <div className="w-full max-w-[260px] sm:max-w-[310px] relative">
                  <DecorativeOrganic className="-top-12 -right-16 rotate-12" size="w-56 h-56" color="fill-brand-grey/10" variant={0} />
                  <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-40" size="w-64 h-64" color="fill-brand-primary/5" variant={1} />
                  
                  <MobileFrame>
                    <img
                      src="/library-preview.webp"
                      alt="Library Mockup Screen"
                      className="w-full h-full object-cover"
                    />
                  </MobileFrame>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.03] select-none tracking-tighter text-brand-text">02</div>
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
                    <Clock size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold tracking-widest opacity-40 text-brand-text">SMART TRACKING</div>
                    <div className="text-xs font-bold text-brand-grey">Automatic progress.</div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1] text-brand-text">
                  YOUR ENTIRE LIBRARY,<br />TRACKED EFFORTLESSLY.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Spend a minute on a page, and the browser automatically remembers your position. No manual logs, spreadsheets, or forgotten bookmarks.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Auto-detects chapters", "Smart history logs", "Continue from any device", "Works completely offline"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 4. LIBRARY MANAGEMENT (Personalization & Categories) */}
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/32"
              size="w-[230px] sm:w-[460px] h-[230px] sm:h-[460px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[400px] sm:min-h-[500px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <DecorativeOrganic className="-top-12 -right-16 rotate-45 opacity-30" size="w-56 h-56" color="fill-brand-grey/5" variant={1} style={{ zIndex: -1 }} />
                <CollagePersonalizationUI />
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.03] select-none tracking-tighter text-brand-text">03</div>
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
                    <div className="text-[10px] font-bold tracking-widest opacity-40 text-brand-text">LIBRARY MANAGEMENT</div>
                    <div className="text-xs font-bold text-brand-grey">Make it feel yours.</div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1] text-brand-text">
                  ORGANIZE EVERYTHING<br />YOUR WAY.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Track anything—manga, anime, novels, or movies. Use custom tags, private notes, and personalized posters to build a library that actually feels personal.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10">
                  {[
                    { icon: BookOpen, text: "Posters" },
                    { icon: Heart, text: "Playlists" },
                    { icon: Lock, text: "Notes" },
                    { icon: Star, text: "Tags" },
                  ].map((chip, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border bg-brand-bg shadow-sm text-sm font-bold text-brand-text hover:border-brand-primary transition-colors cursor-pointer">
                      <chip.icon size={14} className="text-brand-primary" />
                      {chip.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* 5. DISCOVERY */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 sm:gap-16 lg:gap-32 relative isolate">
            <BackgroundBlob
              className="-bottom-24 -right-20"
              color="bg-brand-grey/35"
              size="w-[210px] sm:w-[420px] h-[210px] sm:h-[420px]"
              variant={3}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-grey/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[500px] sm:min-h-[600px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <div className="w-full max-w-[240px] sm:max-w-[280px] relative">
                  <DecorativeOrganic className="-top-12 -right-20 rotate-12" size="w-60 h-60" color="fill-brand-primary/10" variant={2} />
                  
                  <MobileFrame>
                    <img
                      src="/discovery-preview.webp"
                      alt="Discovery Mockup Screen"
                      className="w-full h-full object-cover"
                    />
                  </MobileFrame>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.03] select-none tracking-tighter text-brand-text">04</div>
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
                    <div className="text-[10px] font-bold tracking-widest opacity-40 text-brand-text">DISCOVERY HUB</div>
                    <div className="text-xs font-bold text-brand-grey">Find something new.</div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1] text-brand-text">
                  FIND YOUR NEXT<br />FAVORITE READ.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Filter trending titles, uncover hidden gems, and explore community favorites — all from one powerful discovery hub.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {["Filter by genre & tags", "Trending recommendations", "Discover hidden gems", "Explore community favorites"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80">
                      <CheckCircle size={14} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 6. READING INSIGHTS (Kept exactly as is) */}
          <div className="flex flex-col gap-8 sm:gap-16 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/20"
              size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
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
              <span className="text-brand-grey text-xs font-bold tracking-[0.4em] mb-4 block">TRACK YOUR READING LIFE</span>
              <span className="text-xs font-bold text-brand-grey block mb-2">SEE YOUR READING JOURNEY.</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter leading-[1] text-brand-text mb-6">
                VISUALIZE YOUR PROGRESS OVER TIME.
              </h2>
              <p className="text-lg leading-relaxed text-brand-grey font-light">
                View your reading activity, completed titles, progress streaks, and personal statistics over time.
              </p>
            </motion.div>
            <StatsDashboardUI />
          </div>

          {/* 7. PRIVACY FIRST (New Section) */}
          <div className="relative py-20 sm:py-32 rounded-[3rem] sm:rounded-[4rem] overflow-hidden text-center border border-brand-primary/20 bg-brand-primary/5">
            <DecorativeOrganic className="-top-20 -left-20 opacity-30" size="w-64 h-64" color="fill-brand-primary/10" variant={2} />
            <DecorativeOrganic className="bottom-0 right-0 -rotate-12 opacity-30" size="w-72 h-72" color="fill-brand-primary/10" variant={0} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto relative z-10 px-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-brand-primary mx-auto flex items-center justify-center text-brand-bg mb-8 shadow-xl">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-brand-text">
                YOUR READING HISTORY<br />BELONGS TO YOU.
              </h2>
              <p className="text-brand-grey mb-12 font-light text-lg leading-relaxed">
                Atrix Explorer is built on a strict privacy-first architecture. We believe your data should stay on your device unless you explicitly choose otherwise.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-lg mx-auto">
                  {[
                    "Stored 100% locally", 
                    "No forced account signups", 
                    "Zero ads in your library", 
                    "Sync only if you choose to"
                  ].map((pt, i) => (
                    <div key={i} className="flex items-center gap-3 bg-brand-card border border-brand-border px-5 py-4 rounded-2xl shadow-sm">
                      <Lock size={18} className="text-brand-primary shrink-0" />
                      <span className="font-bold text-sm text-brand-text">{pt}</span>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* 8. OPTIONAL CLOUD SYNC */}
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16 lg:gap-32">
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-primary/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[380px] sm:min-h-[460px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <DecorativeOrganic className="-top-12 -right-16 rotate-12 opacity-30" size="w-56 h-56" color="fill-brand-primary/5" variant={0} style={{ zIndex: -1 }} />
                <SyncConnectionsUI />
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.03] select-none tracking-tighter text-brand-text">05</div>
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
                    <Cloud size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold tracking-widest opacity-40 text-brand-text">OPTIONAL UPGRADE</div>
                    <div className="text-xs font-bold text-brand-grey">Sync if you want.</div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1] text-brand-text">
                  YOUR LIBRARY, SAFE<br />ACROSS YOUR DEVICES.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Your library already works perfectly on one device. Sign in only if you want to keep everything synchronized across multiple phones.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10 max-w-md mx-auto lg:mx-0">
                  {[
                    "Secure cloud backup",
                    "Switch phones easily",
                    "Sync your library instantly",
                    "100% optional choice"
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

          {/* 9. GUEST FREEDOM VS ACCOUNT MODE */}
          <div className="flex flex-col gap-8 sm:gap-16 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/20"
              size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
              variant={0}
              style={{ zIndex: -1 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-brand-grey text-xs font-bold tracking-[0.4em] mb-4 block">USE IT YOUR WAY</span>
              <span className="text-xs font-bold text-brand-grey block mb-2">Guest mode is the default.</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter leading-[1] text-brand-text mb-6">
                LOCAL-FIRST BY DESIGN.
              </h2>
              <p className="text-lg leading-relaxed text-brand-grey font-light">
                You get the complete, unrestricted reading experience without ever creating an account. Cloud sync is simply an optional extension.
              </p>
            </motion.div>
            <GuestFreedomPanelUI />
          </div>

          {/* 10. IMPORT & EXPORT */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 sm:gap-16 lg:gap-32 mt-16 sm:mt-24">
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="absolute -inset-10 bg-gradient-to-br from-brand-grey/10 to-transparent blur-[100px] opacity-20"
                style={{ zIndex: -1 }}
              />
              <div
                className="min-h-[360px] sm:min-h-[420px] rounded-[2.5rem] sm:rounded-[3rem] border border-brand-border shadow-2xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-colors flex items-center justify-center bg-brand-card isolate"
              >
                <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-30" size="w-64 h-64" color="fill-brand-grey/5" variant={0} style={{ zIndex: -1 }} />
                <ExportWorkflowUI />
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.03] select-none tracking-tighter text-brand-text">06</div>
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
                    <div className="text-[10px] font-bold tracking-widest opacity-40 text-brand-text">IMPORT & EXPORT</div>
                    <div className="text-xs font-bold text-brand-grey">Export anytime.</div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-[1] text-brand-text">
                  BACKUP, EXPORT,<br />AND MOVE YOUR<br />LIBRARY ANYTIME.
                </h2>
                <p className="text-lg leading-relaxed text-brand-grey font-light mb-10">
                  Your reading history should never feel locked into our app. Export your entire library in one click.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-brand-border bg-brand-card shadow-sm">
                     <div className="text-xs font-bold text-brand-grey">.CSV</div>
                     <span className="text-sm font-medium text-brand-text">Spreadsheet Format</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-brand-primary/30 bg-brand-primary/5 shadow-sm">
                     <div className="text-xs font-bold text-brand-primary">.JSON</div>
                     <span className="text-sm font-medium text-brand-text">Raw Database Backup</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="relative isolate mt-20 sm:mt-32 md:mt-64">
          <BackgroundBlob
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
            color="bg-brand-primary/20"
            size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
            variant={3}
            style={{ zIndex: -1 }}
          />
          <section className="relative py-20 sm:py-24 rounded-[3rem] sm:rounded-[4rem] overflow-hidden text-center border border-brand-border bg-brand-card">
            <DecorativeOrganic className="-top-20 -left-20 opacity-30" size="w-64 h-64" color="fill-brand-primary/5" variant={2} />
            <DecorativeOrganic className="bottom-0 right-0 -rotate-12 opacity-30" size="w-72 h-72" color="fill-brand-grey/10" variant={0} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl mx-auto relative z-10 px-4"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter mb-10 text-brand-text">
                BUILD YOUR PERFECT<br /><span className="text-brand-grey">READING SPACE.</span>
              </h2>
              <button
                onClick={handleDownload}
                className="h-16 px-12 rounded-2xl font-bold text-xs tracking-widest transition-all hover:scale-105 shadow-2xl bg-brand-primary text-brand-bg flex items-center gap-3 mx-auto"
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
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <Helmet>
        <title>Privacy Policy | Atrix Explorer</title>
        <meta name="description" content="Atrix Explorer's privacy policy. Local-first by design — your library data stays on your device. Cloud sync is optional and fully opt-in." />
        <link rel="canonical" href="https://atrixexplorer.com/privacy" />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-10 tracking-tighter text-brand-text">Privacy Policy</h1>
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-zinc">
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">Effective: July 24, 2026</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">1. Our Approach to Privacy</h2>
        <p>Atrix Explorer is built on a local-first principle. Your library data, reading insights, search history, and browsing history live primarily on your device. Cloud sync is optional and only used to back up your library and profile. We do not sell your data, show ads, or track you across the web.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">2. Data We Collect</h2>
        <p>We collect only the data necessary for the app to function and sync:</p>
        <ul>
          <li><strong>Account Data:</strong> When you sign in via Google or GitHub, we receive your email address and a unique user ID. This is used for authentication and cloud sync.</li>
          <li><strong>Library Data:</strong> Title IDs, reading progress (chapter/season), custom status (plan/reading/completed/dropped), personal ratings (art & story), private notes, and reminder settings. This data syncs to our cloud only if you create an account.</li>
          <li><strong>Profile Data:</strong> Username, bio, and avatar image. Stored locally and synced to cloud for account portability.</li>
          <li><strong>Push Notification Tokens:</strong> Your device token is stored to send chapter alerts via Firebase Cloud Messaging.</li>
          <li><strong>Analytics & Usage Data:</strong> We collect anonymized usage data (such as screen views, session duration, and feature interactions) via Firebase Analytics to help us understand how the app is used and to improve the overall experience.</li>
          <li><strong>User Feedback:</strong> When you submit feedback, bug reports, or feature requests through the app, we collect the text you provide, alongside basic device and app version information to help us address the issue.</li>
          <li><strong>Crash Reports:</strong> Anonymous crash diagnostics via Firebase Crashlytics to help us fix bugs.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">3. Data That Stays on Your Device</h2>
        <p>The following data is stored locally and never sent to our servers:</p>
        <ul>
          <li>Search history and search result cache</li>
          <li>In-app browser history and visit history</li>
          <li>Reading insights (activity log, streaks, reading time estimates)</li>
          <li>Notification inbox history</li>
          <li>Trending and discovery caches</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">4. How We Handle Images</h2>
        <p>Custom posters and avatar images that you upload are stored locally on your device. If you have an account, a compressed copy is uploaded to Cloudflare R2 object storage for cross-device sync. These images are private to your account. No other user can see your custom posters or avatar unless we introduce a sharing feature in the future.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">5. Third-Party Services</h2>
        <p>Atrix Explorer uses the following third-party services. Each has its own privacy policy governing data handling:</p>
        <ul>
          <li><strong>Supabase</strong> — Cloud database, authentication, and storage. Stores your account info, library data, and profile data.</li>
          <li><strong>Firebase (Google)</strong> — Analytics for usage data, Crashlytics for error reporting, and Cloud Messaging for push notifications.</li>
          <li><strong>Cloudflare</strong> — R2 object storage for user-uploaded images and Workers for API proxying.</li>
          <li><strong>MeiliSearch</strong> — Search engine for comic metadata. Search queries are sent to return results; no personal data is stored.</li>
          <li><strong>Google & GitHub</strong> — Authentication providers. Only an ID token is exchanged; no profile data is stored client-side.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">6. No Copyrighted Content Hosting</h2>
        <p>Atrix Explorer does not host, store, distribute, or stream any copyrighted media files (images, videos, audio, or full-text content). The app exclusively uses text-based metadata — titles, descriptions, author names, genre tags, and user-submitted notes. All comic cover images displayed in the app are sourced from third-party public databases or uploaded by the user as custom posters for personal tracking purposes only.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">7. DMCA & Copyright Concerns</h2>
        <p>Because we do not host any copyrighted content, DMCA takedown requests for infringing files do not apply to our service. If you believe that any metadata displayed in the app infringes on your intellectual property rights, or that a user-uploaded custom poster violates your copyright, please contact us at <strong>support@atrixexplorer.com</strong> and we will review and address your concern promptly.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">8. Data Security</h2>
        <p>All data transmitted between the app and our servers is encrypted in transit (HTTPS / TLS). Database access is restricted by row-level security — each user can only access their own data. Poster uploads are rate-limited to prevent abuse. We follow industry best practices to protect your information.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">9. Data Retention & Deletion</h2>
        <p>Your library and profile data are retained for as long as your account is active. You can delete your account at any time from the app settings. Upon deletion, all cloud-stored data — library entries, profile info, and uploaded images — are permanently removed. Local data on your device must be deleted manually by clearing app data or uninstalling the app.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">10. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access</strong> — View all data associated with your account.</li>
          <li><strong>Export</strong> — Export your library as CSV or JSON from the app.</li>
          <li><strong>Correct</strong> — Edit your library entries and profile at any time.</li>
          <li><strong>Delete</strong> — Delete your account and all associated cloud data.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">11. Children's Privacy</h2>
        <p>Atrix Explorer is not intended for users under the age of 13. We do not knowingly collect data from children. If you believe a child has provided us with personal data, contact us and we will delete it.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">12. International Users</h2>
        <p>Your data may be processed on servers located in the United States and Europe, depending on the third-party service provider (Supabase, Google Cloud, Cloudflare). By using the app, you consent to this transfer.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">13. Changes to This Policy</h2>
        <p>We may update this policy from time to time. Changes will be posted here and reflected in the "Effective" date at the top. Continued use of the app after changes constitutes acceptance of the updated policy.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">14. In-App Browser and External Links</h2>
        <p>Atrix Explorer features an in-app browser designed for reading tracking. When using this browser, you are accessing third-party websites directly. We are not responsible for the privacy practices, data collection, or content of these external sites. We encourage you to review the privacy policies of any website you visit through the app.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">15. Contact</h2>
        <p>For questions, concerns, or data requests, contact us at <strong>support@atrixexplorer.com</strong>.</p>
      </section>
    </div>
  )
}

const TermsPage = () => {
  return (
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <Helmet>
        <title>Terms of Service | Atrix Explorer</title>
        <meta name="description" content="Atrix Explorer terms of service. No copyrighted content is hosted. Your data belongs to you. Read our usage terms and user responsibilities." />
        <link rel="canonical" href="https://atrixexplorer.com/terms" />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-10 tracking-tighter text-brand-text">Terms of Service</h1>
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-zinc">
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">Last Updated: July 24, 2026</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">1. What Atrix Explorer Is</h2>
        <p>Atrix Explorer is a personal library tracking application with a built-in browser. It allows users to track their reading progress across manhwa, manga, anime, novels, web series, and custom media types. The app provides text-based metadata (titles, descriptions, genre tags) and does not host, stream, or distribute any copyrighted media files.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">2. No Copyrighted Content</h2>
        <p>Atrix Explorer does not host, store, or serve any copyrighted images, videos, audio, or full-text content. All metadata displayed in the app is sourced from third-party public databases. User-uploaded custom posters are stored for personal tracking purposes only and are not publicly shared. If you believe any metadata or user content infringes your copyright, contact us at <strong>support@atrixexplorer.com</strong> and we will review the concern promptly.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">3. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the app for lawful purposes only.</li>
          <li>Not upload infringing, abusive, or illegal content as custom posters or notes.</li>
          <li>Not attempt to access another user's account or data.</li>
          <li>Not abuse the app's APIs, services, or infrastructure.</li>
          <li>Abide by the terms of service of any third-party websites you access via the in-app browser.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">4. User Content Ownership</h2>
        <p>Your library data — including titles, progress, notes, ratings, reminders, and custom posters — belongs to you. Atrix Explorer claims no ownership over your personal data. You retain full rights to your content and can export or delete it at any time.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">5. Third-Party Services and In-App Browser</h2>
        <p>Atrix Explorer integrates with third-party services to function (Supabase, Firebase, Cloudflare, MeiliSearch, Google, GitHub). The app also includes an in-app browser for your convenience. We are not responsible for the uptime, security, content, or data practices of any integrated services or external websites you visit. Each service and external website operates under its own terms and privacy policy, which you are responsible for reviewing.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">6. Disclaimer of Warranties</h2>
        <p>Atrix Explorer is provided "as is" and "as available." We do not guarantee that:</p>
        <ul>
          <li>The metadata (titles, descriptions, genre tags) is 100% accurate or complete.</li>
          <li>The app will be uninterrupted or error-free.</li>
          <li>Third-party databases or APIs will remain accessible.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">7. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Atrix Explorer and its developers shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app — including but not limited to data loss, metadata inaccuracies, or third-party service interruptions.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">8. Account Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms — including abuse of the service, uploading illegal content, or attempting to compromise the platform. You may delete your account at any time from the app settings.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">9. Governing Law</h2>
        <p>These terms shall be governed by and construed in accordance with the laws applicable to the developer's jurisdiction. Any disputes shall be resolved through informal negotiation before seeking legal remedies.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">10. Changes to These Terms</h2>
        <p>We may update these terms as the app evolves. Continued use after changes are posted constitutes acceptance of the new terms. We will notify users of significant changes via the app or email.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">11. Feedback & Suggestions</h2>
        <p>If you choose to provide feedback, bug reports, or suggestions for improving Atrix Explorer, you agree that we are free to use such feedback without any obligation, restriction, or compensation to you.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">12. Contact</h2>
        <p>For questions about these terms, contact us at <strong>support@atrixexplorer.com</strong>.</p>
      </section>
    </div>
  )
}

const FreedomPage = () => {
  return (
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <Helmet>
        <title>Freedom Policy | Atrix Explorer</title>
        <meta name="description" content="Atrix Explorer's Freedom Policy — track any media, export your data anytime, no vendor lock-in. Your library, your rules." />
        <link rel="canonical" href="https://atrixexplorer.com/freedom" />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-10 tracking-tighter text-brand-text">Freedom Policy</h1>
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-zinc">
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">The Library Without Borders</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">1. Neutral Platform</h2>
        <p>Atrix Explorer does not discriminate against media types. Whether you track a blockbuster movie or an obscure indie webserial, the infrastructure treats them with equal fidelity.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">2. Your Data, Your Rules</h2>
        <p>You own your library. Every title, note, rating, and custom poster belongs to you. We believe you should never be blocked by a missing database entry — if a title doesn't exist in our metadata search, you have the absolute right to create it yourself with your own titles, notes, and artwork. You can export your data anytime in CSV or JSON format.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">3. Local-First by Default</h2>
        <p>Your library lives primarily on your device. Search history, reading insights, visit history, and browser history never leave your phone unless you choose to sync. Cloud features are optional and opt-in.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">4. No Vendor Lock-In</h2>
        <p>Your library data belongs to you, not to us. We provide export tools (CSV and JSON) so you can move your data elsewhere at any time. Atrix Explorer is designed to be a tool you control, not a platform that controls you.</p>
      </section>
    </div>
  )
}

const DownloadPage = () => {
  const [activeTab, setActiveTab] = useState<"stable" | "beta">("stable");
  const [expandedVersion, setExpandedVersion] = useState<string | null>("v1.1.9");

  const toggleExpand = (version: string) => {
    setExpandedVersion(prev => (prev === version ? null : version));
  };

  const releases = {
    stable: [
      {
        version: "v1.1.9",
        type: "Stable",
        date: "July 2026",
        size: "68.2 MB",
        reqs: "Android 8.0+",
        features: [
          "Update in user interface and design",
          "Reading tabs where you can easily reach the last chapter you read",
          "Custom Playlist for you to use and create"
        ],
        fixes: [],
        perf: []
      },
      {
        version: "v1.1.5",
        type: "Stable",
        date: "June 2026",
        size: "67.81 MB",
        reqs: "Android 8.0+",
        features: [
          "Direct access to your regular reader source",
          "Direct resume reading from home screen"
        ],
        fixes: [
          "Fixed retry resilience for network errors"
        ],
        perf: []
      },
      {
        version: "v1.1.2",
        type: "Stable",
        date: "June 2026",
        size: "67.27 MB",
        reqs: "Android 8.0+",
        features: [
          "Complete local device mode — run the entire app on-device with optional cloud sync",
          "Browser filter to hide social media and shopping sites from search results",
          "Guest users can now view insights"
        ],
        fixes: [
          "Fixed image picker 'already_active' crash on rapid double-tap"
        ],
        perf: []
      },
      {
        version: "v1.1.1",
        type: "Stable",
        date: "June 2026",
        size: "67 MB",
        reqs: "Android 8.0+",
        features: [
          "App no longer crashes if you tap the image picker button twice"
        ],
        fixes: [
          "Fixed a rare crash when switching pages or closing the browser",
          "Improved handling of temporary network issues — no more random errors when uploading posters or syncing notifications"
        ],
        perf: []
      },
      {
        version: "v1.0.0",
        type: "Stable",
        date: "June 2026",
        size: "18.4 MB",
        reqs: "Android 8.0+",
        features: ["Core engine stability", "Glassmorphic UI polish"],
        fixes: ["Smooth scroll load-more coordinate snapping"],
        perf: []
      }
    ],
    beta: [
      {
        version: "v0.9.5-beta",
        type: "Beta",
        date: "May 2026",
        size: "18.1 MB",
        reqs: "Android 8.0+",
        checksum: "8e92a76f23c7b901bc09a25b2938a1cd928f6e2b1029c87f10b271e847c231bf",
        features: ["Reading insights improvements"],
        fixes: ["Celebration card interface updates"],
        perf: []
      },
      {
        version: "v0.9.0-beta",
        type: "Beta",
        date: "April 2026",
        size: "17.9 MB",
        reqs: "Android 8.0+",
        checksum: "7bc3a19b88c2e01a8f90b274e1d90c58e2a10b9bf281d7f1bb6571fa08d23d8c",
        features: ["New weekly news section", "Official publisher details section"],
        fixes: [],
        perf: ["Core memory footprint reduction", "Overall bug resolutions"]
      },
      {
        version: "v0.8.0-alpha",
        type: "Alpha",
        date: "March 2026",
        size: "16.8 MB",
        reqs: "Android 8.0+",
        checksum: "5fa23d18e0a1a5b8bfd90c5a271de38e88ff2bb08a1c8b7ff27c62d08a4f6be5",
        features: ["Export personal library data", "Import library backup lists from spreadsheet files"],
        fixes: ["Information screen usability enhancements"],
        perf: []
      }
    ]
  };

  const currentVersion = releases.stable[0];

  return (
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen bg-brand-bg relative overflow-hidden isolate text-brand-text">
      <DecorativeOrganic className="top-10 -left-32 rotate-45 opacity-20" size="w-96 h-96" color="fill-brand-primary/5" variant={1} />
      <DecorativeOrganic className="bottom-0 right-0 -rotate-12 opacity-20" size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]" color="fill-brand-grey/5" variant={2} />
      <BackgroundBlob className="top-20 -left-20" color="bg-brand-primary/20" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={3} />
      <BackgroundBlob className="bottom-20 -right-20" color="bg-brand-grey/28" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={1} />

      <Helmet>
        <title>Download Atrix Explorer | Releases & Version History</title>
        <meta name="description" content="Download the latest version of Atrix Explorer. Get the current Android APK (v1.1.9), view full release notes, changelogs, and download history." />
        <link rel="canonical" href="https://atrixexplorer.com/download" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atrixexplorer.com/download" />
        <meta property="og:title" content="Download Atrix Explorer | Releases & Version History" />
        <meta property="og:description" content="Download the latest version of Atrix Explorer. Get the current Android APK (v1.1.9), view full release notes, changelogs, and download history." />
        <meta property="og:image" content="https://atrixexplorer.com/hero-preview.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Download Atrix Explorer | Releases & Version History" />
        <meta name="twitter:description" content="Download the latest version of Atrix Explorer. Get the current Android APK (v1.1.9), view full release notes, changelogs, and download history." />
        <meta name="twitter:image" content="https://atrixexplorer.com/hero-preview.webp" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10">
        <header className="mb-16 text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-[0.5em] mb-6 block text-brand-grey opacity-60"
          >
            ATRIX HUB — RELEASES
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-8 "
          >
            Atrix Releases
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-grey max-w-2xl text-lg sm:text-xl font-light leading-relaxed mb-10"
          >
            Download previous and current Atrix Explorer releases. By default, the application auto-updates to the latest version.
          </motion.p>

        </header>

        {/* Current Active Release Showcase */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Latest Stable Release</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-[2rem] border border-brand-border bg-brand-card/90 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-primary/10 to-transparent blur-[80px] pointer-events-none rounded-full" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight">{currentVersion.version}</span>
                  <span className="px-3.5 py-1 bg-brand-primary text-brand-bg rounded-full text-[10px] font-bold tracking-widest">
                    {currentVersion.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <span className="block text-brand-grey font-mono text-[10px] opacity-60">Release Date</span>
                    <span className="font-bold">{currentVersion.date}</span>
                  </div>
                  <div>
                    <span className="block text-brand-grey font-mono text-[10px] opacity-60">File Size</span>
                    <span className="font-bold">{currentVersion.size}</span>
                  </div>
                  <div>
                    <span className="block text-brand-grey font-mono text-[10px] opacity-60">Platform</span>
                    <span className="font-bold">Android APK</span>
                  </div>
                  <div>
                    <span className="block text-brand-grey font-mono text-[10px] opacity-60">Target OS</span>
                    <span className="font-bold">{currentVersion.reqs}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href="https://download.atrixexplorer.com/atrixexplorer-1.1.9.apk"
                  download="atrixexplorer-1.1.9.apk"
                  className="inline-flex h-16 px-10 items-center justify-center rounded-2xl font-bold text-sm tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl bg-brand-primary text-brand-bg gap-3 whitespace-nowrap"
                >
                  Download APK <Download size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Android & iOS Platform Status Note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-[1.5rem] border border-brand-border bg-brand-card flex flex-col sm:flex-row items-center gap-5 text-left shadow-lg backdrop-blur-md mb-20"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-primary/10 text-brand-primary shrink-0">
            <Globe size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight mb-1">Platform Availability</h4>
            <p className="text-xs text-brand-grey leading-relaxed">
              Atrix Explorer is currently fully optimized and available for <span className="font-bold text-brand-text">Android devices</span>. We are actively working on the <span className="font-bold text-brand-text">iOS edition</span>, and it will be released soon. Stay tuned!
            </p>
          </div>
        </motion.div>

        {/* Accordion Release History (Matching shared example) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-brand-border pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Version Archives</h2>
            
            {/* Category Toggle Tabs */}
            <div className="flex p-1 bg-brand-card border border-brand-border rounded-xl w-fit">
              <button
                onClick={() => {
                  setActiveTab("stable");
                  setExpandedVersion("v1.1.9");
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === "stable" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-grey hover:text-brand-text"
                )}
              >
                Stable Releases
              </button>
              <button
                onClick={() => {
                  setActiveTab("beta");
                  setExpandedVersion("0.9.5-beta");
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === "beta" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-grey hover:text-brand-text"
                )}
              >
                Beta Builds
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {releases[activeTab].map((rel) => {
              const isExpanded = expandedVersion === rel.version;
              return (
                <div
                  key={rel.version}
                  className="rounded-2xl border border-brand-border bg-brand-card/60 backdrop-blur-md overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleExpand(rel.version)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-brand-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm text-brand-grey">Version</span>
                      <span className="font-bold text-lg text-brand-text">{rel.version}</span>
                      <span className="text-[10px] text-brand-grey/60 font-mono">({rel.date})</span>
                    </div>
                    <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180 text-brand-primary" : "text-brand-grey")}>
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-brand-border/40 bg-brand-bg/40"
                      >
                        <div className="p-6 sm:p-8 space-y-6">
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs border-b border-brand-border/40 pb-6">
                            <div>
                              <span className="text-brand-grey/50 font-mono text-[9px] block">Size</span>
                              <span className="font-bold">{rel.size}</span>
                            </div>
                            <div>
                              <span className="text-brand-grey/50 font-mono text-[9px] block">Target OS</span>
                              <span className="font-bold">{rel.reqs}</span>
                            </div>
                            <div>
                              <span className="text-brand-grey/50 font-mono text-[9px] block">Platform</span>
                              <span className="font-bold">Android (APK)</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-xs font-bold tracking-widest text-brand-grey">Changelog</h4>
                            <ul className="space-y-3 text-sm">
                              {rel.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="text-xs mt-0.5">🚀</span>
                                  <span className="leading-relaxed opacity-95">{feat}</span>
                                </li>
                              ))}
                              {rel.fixes.map((fix, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="text-xs mt-0.5">🛠️</span>
                                  <span className="leading-relaxed opacity-95">{fix}</span>
                                </li>
                              ))}
                              {rel.perf.map((pe, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="text-xs mt-0.5">⚡</span>
                                  <span className="leading-relaxed opacity-95">{pe}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

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
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen bg-brand-bg relative overflow-hidden isolate">
      <DecorativeOrganic className="top-10 -left-32 rotate-45 opacity-20" size="w-96 h-96" color="fill-brand-primary/5" variant={1} />
      <DecorativeOrganic className="bottom-0 right-0 -rotate-12 opacity-20" size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]" color="fill-brand-grey/5" variant={2} />
      <FloatingDot className="top-1/3 -right-12" delay={0.5} size="w-16 h-16" />
      <BackgroundBlob
        className="top-20 -left-20"
        color="bg-brand-primary/20"
        size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
        variant={3}
      />
      <BackgroundBlob
        className="bottom-20 -right-20"
        color="bg-brand-grey/28"
        size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
        variant={1}
      />
      <Helmet>
        <title>The Catalog | Curated Manhwa & Manhua Recommendations</title>
        <meta name="description" content="Discover the best Manhwa and Manhua recommendations. Expertly curated lists of badass OP MCs, cultivation, and non-cliché storylines." />
        <link rel="canonical" href="https://atrixexplorer.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atrixexplorer.com/blog" />
        <meta property="og:title" content="The Catalog | Curated Manhwa & Manhua Recommendations" />
        <meta property="og:description" content="Discover the best Manhwa and Manhua recommendations. Expertly curated lists of badass OP MCs, cultivation, and non-cliché storylines." />
        <meta property="og:image" content="https://atrixexplorer.com/hero-preview.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Catalog | Curated Manhwa & Manhua Recommendations" />
        <meta name="twitter:description" content="Discover the best Manhwa and Manhua recommendations. Expertly curated lists of badass OP MCs, cultivation, and non-cliché storylines." />
        <meta name="twitter:image" content="https://atrixexplorer.com/hero-preview.webp" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <header className="mb-16 sm:mb-24 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-[0.5em] mb-6 block text-brand-grey opacity-60"
          >
            Archive — Issue {new Date().getMonth() + 1}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-8 text-brand-text"
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
                "px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all active:scale-95",
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
                  <span className="px-4 sm:px-6 py-2 bg-white/90 backdrop-blur-xl rounded-full text-[9px] sm:text-xs font-bold text-zinc-950 tracking-widest border border-white shadow-xl">
                    Featured / {latestPost.category}
                  </span>
                </div>
              </div>
              <div className="px-2 sm:px-4 text-center lg:text-left">
                <span className="text-xs font-mono text-brand-grey tracking-widest block mb-4 sm:mb-6">{latestPost.date} — By {latestPost.author}</span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tighter text-brand-text">
                  {latestPost.title}
                </h2>
                <p className="text-brand-grey text-lg sm:text-xl font-light leading-relaxed mb-8 sm:mb-10 line-clamp-3">
                  {latestPost.excerpt}
                </p>
                <div className="inline-flex items-center gap-4 font-bold text-xs sm:text-sm tracking-widest group-hover:gap-6 transition-all text-brand-text">
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
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-zinc-900 tracking-widest border border-white shadow-md">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col px-2 pb-2">
                  <span className="text-[10px] font-mono text-brand-grey tracking-widest block mb-3">{item.date}</span>
                  <h3 className="text-xl sm:text-2xl font-bold transition-colors tracking-tight leading-tight mb-3 text-brand-text group-hover:text-brand-primary">
                    {item.title}
                  </h3>
                  <p className="text-brand-grey font-light leading-relaxed line-clamp-2 mb-6 text-sm flex-1">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-3 font-bold text-[10px] sm:text-xs tracking-widest group-hover:gap-5 transition-all text-brand-primary">
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
              className="px-12 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-base sm:text-lg tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 bg-brand-primary text-brand-bg"
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
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 bg-brand-bg relative overflow-hidden isolate">
      <DecorativeOrganic className="top-1/4 -right-20 opacity-30 rotate-12" size="w-96 h-96" color="fill-brand-primary/5" variant={0} />
      <DecorativeOrganic className="bottom-1/3 -left-32 -rotate-12 opacity-20" size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]" color="fill-brand-grey/5" variant={1} />
      <BackgroundBlob
        className="top-0 right-0"
        color="bg-brand-primary/20"
        size="w-[350px] sm:w-[700px] h-[350px] sm:h-[700px]"
        variant={2}
      />
      <BackgroundBlob
        className="bottom-0 left-0"
        color="bg-brand-grey/28"
        size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
        variant={3}
      />
      <Helmet>
        <title>{item.title} | Atrix Explorer Archive</title>
        <meta name="description" content={item.excerpt} />
        <link rel="canonical" href={`https://atrixexplorer.com/blog/${item.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://atrixexplorer.com/blog/${item.id}`} />
        <meta property="og:title" content={`${item.title} | Atrix Explorer Archive`} />
        <meta property="og:description" content={item.excerpt} />
        <meta property="og:image" content={item.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${item.title} | Atrix Explorer Archive`} />
        <meta name="twitter:description" content={item.excerpt} />
        <meta name="twitter:image" content={item.image} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": item.title,
          "description": item.excerpt,
          "image": item.image,
          "datePublished": item.date,
          "author": { "@type": "Person", "name": item.author },
          "publisher": { "@type": "Organization", "name": "Atrix Explorer", "url": "https://atrixexplorer.com" },
          "url": `https://atrixexplorer.com/blog/${item.id}`
        })}</script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto mb-12">
          <Link to="/blog" className="inline-flex items-center gap-3 transition-all font-mono text-[10px] sm:text-xs tracking-widest text-brand-grey hover:text-brand-text">
            <ArrowRight size={16} className="rotate-180" /> Back to Blog
          </Link>
        </div>

        <header className="mb-16 md:mb-24">
          <div className="flex flex-col gap-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] mb-6 bg-brand-card text-brand-text border border-brand-border">
                {item.category}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1] text-brand-text">
                {item.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-mono tracking-[0.2em] py-6 border-y border-brand-border text-brand-grey">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-border bg-brand-card">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`} alt={item.author} referrerPolicy="no-referrer" />
                </div>
                <span className="font-bold tracking-normal text-brand-text">{item.author}</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-brand-border" />
              <span>{item.date}</span>
              <div className="hidden sm:block h-4 w-px bg-brand-border" />
              <span className="flex items-center gap-2 font-bold"><Clock size={12} /> 8 MIN READ</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="relative w-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-16 lg:mb-24 shadow-2xl bg-brand-card aspect-[16/9] flex items-center justify-center">
            <img
              src={item.image}
              alt={item.title}
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
                                    <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-primary text-brand-bg flex items-center justify-center font-bold text-xs sm:text-sm shadow-xl">
                                      {m.rank}
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 relative z-10">
                                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 tracking-tighter leading-tight text-brand-text flex items-center gap-3">
                                    {item.category === 'Recommendations' && (
                                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary text-brand-bg text-xs sm:text-sm font-bold flex-shrink-0">
                                        {m.rank}
                                      </span>
                                    )}
                                    <span>{m.title}</span>
                                  </h3>
                                  <p className="text-brand-grey mb-6 leading-relaxed text-sm font-medium opacity-80" style={{ whiteSpace: 'pre-line' }}>{m.desc}</p>
                                  <button
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(m.title)}`, '_blank')}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all tracking-widest border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-primary hover:text-brand-bg active:scale-95"
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
                              <h4 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-brand-text">Daily Manhwa News Updates on Telegram</h4>
                              <p className="text-brand-grey text-sm font-medium">
                                Don't wait for our reports. Get fast updates on chapter drops, season returns, and chat with other readers.
                              </p>
                            </div>
                            <button
                              onClick={() => window.open('https://t.me/manhwa_daily', '_blank')}
                              className="px-8 py-4 bg-brand-primary text-brand-bg rounded-xl font-bold text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 flex-shrink-0"
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
                                    <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-primary text-brand-bg flex items-center justify-center font-bold text-xs sm:text-sm shadow-xl">
                                      {m.rank}
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 relative z-10">
                                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 tracking-tighter leading-tight text-brand-text flex items-center gap-3">
                                    {item.category === 'Recommendations' && (
                                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary text-brand-bg text-xs sm:text-sm font-bold flex-shrink-0">
                                        {m.rank}
                                      </span>
                                    )}
                                    <span>{m.title}</span>
                                  </h3>
                                  <p className="text-brand-grey mb-6 leading-relaxed text-sm font-medium opacity-80" style={{ whiteSpace: 'pre-line' }}>{m.desc}</p>
                                  <button
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(m.title)}`, '_blank')}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all tracking-widest border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-primary hover:text-brand-bg active:scale-95"
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
                          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 tracking-tighter leading-none text-brand-text">
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
                          <span className="text-[10px] font-bold tracking-[0.3em] block mb-8 px-4 py-1.5 border border-brand-bg/20 rounded-full w-fit opacity-60">Atrix App: Better Tracking</span>

                          <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 sm:mb-8 leading-[1]">
                            Track With <br />
                            <span className="opacity-50">Atrix Explorer.</span>
                          </h3>

                          <p className="text-lg sm:text-xl font-light leading-relaxed mb-10 sm:mb-12 opacity-80 max-w-md">
                            Use Atrix Explorer to track your library easily. It has fast search and daily news updates right in your pocket.
                          </p>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleDownload} className="h-16 px-10 rounded-2xl font-bold text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl bg-brand-bg text-brand-text">
                              Download APK <Download size={18} />
                            </button>
                            <Link to="/features" className="h-16 px-10 rounded-2xl font-bold text-sm tracking-widest flex items-center justify-center gap-3 border border-brand-bg/20 hover:bg-brand-bg/10 transition-all backdrop-blur-sm">
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
                    <span className="text-brand-grey text-xs font-bold tracking-[0.4em] mb-4 block">STAY UPDATED</span>
                    <h3 className="text-2xl sm:text-4xl font-bold tracking-tighter text-brand-text">LATEST INTEL & NEWS</h3>
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
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-zinc-900 tracking-widest border border-white shadow-md">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col px-2 pb-2">
                            <span className="text-[10px] font-mono text-brand-grey tracking-widest block mb-3">{post.date}</span>
                            <h3 className="text-xl sm:text-2xl font-bold transition-colors tracking-tight leading-tight mb-3 text-brand-text group-hover:text-brand-primary">
                              {post.title}
                            </h3>
                            <p className="text-brand-grey font-light leading-relaxed line-clamp-2 mb-6 text-sm flex-1">
                              {post.excerpt}
                            </p>
                            <div className="mt-auto flex items-center gap-3 font-bold text-[10px] sm:text-xs tracking-widest group-hover:gap-5 transition-all text-brand-primary">
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
                    <span className="text-brand-grey text-xs font-bold tracking-[0.4em] mb-4 block">EXPLORE MORE</span>
                    <h3 className="text-2xl sm:text-4xl font-bold tracking-tighter text-brand-text">RECOMMENDED READS</h3>
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
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-zinc-900 tracking-widest border border-white shadow-md">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col px-2 pb-2">
                            <span className="text-[10px] font-mono text-brand-grey tracking-widest block mb-3">{post.date}</span>
                            <h3 className="text-xl sm:text-2xl font-bold transition-colors tracking-tight leading-tight mb-3 text-brand-text group-hover:text-brand-primary">
                              {post.title}
                            </h3>
                            <p className="text-brand-grey font-light leading-relaxed line-clamp-2 mb-6 text-sm flex-1">
                              {post.excerpt}
                            </p>
                            <div className="mt-auto flex items-center gap-3 font-bold text-[10px] sm:text-xs tracking-widest group-hover:gap-5 transition-all text-brand-primary">
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
            <Route path="/download" element={<PageWrapper><DownloadPage /></PageWrapper>} />
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

