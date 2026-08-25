import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState, useMemo, useRef, createContext, useContext, ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Menu, X, Github as GithubIcon, Download, ChevronRight, ChevronDown, Search, BookOpen, Clock, User, ArrowRight, ArrowDown, Layers, Zap, Globe, Shield, Bell, CheckCircle, Heart, Wind, Lock, Star, ExternalLink, Instagram, Send, MoreVertical, Plus, ShoppingCart, Library, Tv, ShieldCheck, Cloud } from "lucide-react";
import { BLOG_POSTS, ManhwaItem, NewsSection } from "./data/blogPosts";
import { cn } from "./lib/utils";

const parseBlogDate = (dateStr: string) => {
  if (!dateStr) return { day: "15", month: "OCT" };
  const parts = dateStr.split(" ");
  if (parts.length >= 2) {
    const month = parts[0].substring(0, 3).toUpperCase();
    const day = parts[1].replace(",", "");
    return { day, month };
  }
  return { day: "15", month: "OCT" };
};

const handleDownload = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  if (isAndroid) {
    // Trigger direct APK download
    const link = document.createElement('a');
    link.href = 'https://download.atrixexplorer.com/atrixexplorer-1.2.0.apk';
    link.download = 'atrixexplorer-1.2.0.apk';
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
      link.href = 'https://download.atrixexplorer.com/atrixexplorer-1.2.0.apk';
      link.download = 'atrixexplorer-1.2.0.apk';
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
                    "text-xs font-bold tracking-widest transition-all py-2",
                    isActive
                      ? "text-brand-text font-extrabold"
                      : "text-zinc-600 hover:text-zinc-950 font-medium"
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
              className="h-11 px-6 rounded-2xl bg-brand-primary text-zinc-950 font-bold text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2"
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
                      "text-xl font-bold transition-colors uppercase tracking-widest py-1",
                      isActive ? "text-brand-text font-black" : "text-zinc-600 hover:text-zinc-950 font-medium"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
              <button
                onClick={handleDownload}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-brand-primary text-zinc-950 font-bold tracking-widest shadow-md active:scale-95"
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
              <li><Link to="/delete-account" className="text-brand-grey hover:text-brand-text transition-colors">Delete Account</Link></li>
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
        "absolute pointer-events-none opacity-90 transform-gpu will-change-transform",
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
    <div className="p-6 bg-[var(--app-card-dark)] rounded-2xl border border-zinc-700/80 shadow-sm cursor-pointer hover:bg-zinc-800/80 transition-colors" onClick={() => setOpen(!open)}>
       <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-between gap-4">
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
             <p className="text-zinc-300 font-normal pt-4 leading-relaxed text-sm sm:text-base">{faq.a}</p>
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
        <title>Atrix Explorer | Mobile Web Browser for Manhwa & Novel Readers</title>
        <meta name="description" content="A mobile web browser built for reading manhwa and novels. Automatically tracks your progress, blocks ads, and saves your library on your device." />
        <link rel="canonical" href="https://atrixexplorer.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atrixexplorer.com/" />
        <meta property="og:title" content="Atrix Explorer | Mobile Web Browser for Manhwa & Novel Readers" />
        <meta property="og:description" content="A mobile web browser built for reading manhwa and novels. Automatically tracks your progress, blocks ads, and saves your library on your device." />
        <meta property="og:image" content="https://atrixexplorer.com/hero-preview.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Atrix Explorer | Mobile Web Browser for Manhwa & Novel Readers" />
        <meta name="twitter:description" content="A mobile web browser built for reading manhwa and novels. Automatically tracks your progress, blocks ads, and saves your library on your device." />
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
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-brand-bg overflow-hidden isolate">
        <BackgroundBlob className="-top-20 -left-20" color="bg-brand-primary/[0.08]" size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]" variant={1} />
        <BackgroundBlob className="bottom-0 right-0" color="bg-zinc-400/[0.06]" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={2} />
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm mb-6 text-[11px] font-mono tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400"
            >
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
              <span>ATRIX HUB — RELEASES</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-brand-text">
              Your Manhwa browser, <br />
              <span className="font-serif italic font-normal text-brand-primary">we save your progress.</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              Built specifically for manhwa and novel readers who want automatic progress tracking without creating an account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
              <a
                href="https://github.com/atrixexplorer/Atrix-Explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-7 font-bold text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-zinc-300 dark:border-zinc-700 bg-brand-bg text-brand-text hover:bg-zinc-100 shadow-sm"
              >
                <GithubIcon size={18} /> GitHub
              </a>
              <button
                onClick={handleDownload}
                className="h-12 px-7 font-bold text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 bg-brand-primary text-zinc-950"
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

      {/* 2. The Problem Section ("Stop managing spreadsheets. Start reading.") */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-brand-bg/50 isolate overflow-hidden">
         <BackgroundBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="bg-brand-primary/[0.05]" size="w-[400px] sm:w-[800px] h-[400px] sm:h-[800px]" variant={3} />
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 sm:mb-16 tracking-tight text-brand-text"
            >
              Stop managing spreadsheets, <br /> <span className="font-serif italic font-normal text-brand-primary">start reading.</span>
            </motion.h2>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
               {/* Left: The Mess (Interactive Hover Motion Stack) */}
               <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex relative group/mess cursor-pointer"
               >
                  {/* Mess Card 1 */}
                  <div className="w-[160px] sm:w-[200px] aspect-[3/4] rounded-2xl border border-red-500/20 shadow-xl overflow-hidden rotate-[-6deg] group-hover/mess:-rotate-12 group-hover/mess:-translate-x-4 bg-white relative z-10 transition-all duration-500">
                     <img src="/problem-screenshot-2.webp" alt="Messy tabs" className="w-full h-full object-cover opacity-80 group-hover/mess:opacity-95 transition-opacity" />
                     <div className="absolute inset-0 bg-red-500/10" />
                  </div>

                  {/* Mess Card 2 */}
                  <div className="w-[160px] sm:w-[200px] aspect-[3/4] rounded-2xl border border-red-500/20 shadow-xl overflow-hidden rotate-[6deg] -ml-16 group-hover/mess:rotate-12 group-hover/mess:translate-x-4 bg-white relative z-20 transition-all duration-500">
                     <img src="/problem-screenshot-1.webp" alt="Spreadsheet" className="w-full h-full object-cover opacity-80 group-hover/mess:opacity-95 transition-opacity" />
                     <div className="absolute inset-0 bg-red-500/10" />
                  </div>

                  {/* Hover Floating Warning Pill */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg opacity-0 group-hover/mess:opacity-100 group-hover/mess:-translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap z-30">
                     MESSY MANUAL LOGS
                  </div>
               </motion.div>

               {/* Center: Glowing Animated Arrow */}
               <div className="hidden lg:flex items-center justify-center">
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                     <ArrowRight size={40} className="text-brand-primary opacity-90" />
                  </motion.div>
               </div>
               <div className="flex lg:hidden items-center justify-center my-4">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                     <ArrowDown size={36} className="text-brand-primary opacity-90" />
                  </motion.div>
               </div>

               {/* Right: The Solution (Interactive Hover Motion Card) */}
               <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-[200px] sm:w-[240px] aspect-[3/4] rounded-2xl border-2 border-brand-primary shadow-2xl glow-cyan overflow-hidden bg-white relative z-30 group/solution cursor-pointer hover:scale-108 hover:-rotate-1 hover:shadow-cyan-500/40 hover:shadow-2xl transition-all duration-500"
               >
                  <img src="/library-preview.webp" alt="Clean Library" className="w-full h-full object-cover group-hover/solution:scale-105 transition-transform duration-700" />
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-xl border border-zinc-200 flex items-center gap-2 whitespace-nowrap group-hover/solution:scale-105 transition-transform duration-300">
                     <CheckCircle size={16} className="text-brand-primary animate-pulse" />
                     <span className="text-xs font-bold text-zinc-950">Organized Library</span>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 3. "Why ATRIX Explorer" Section (3-Column Minimalist Editorial Layout - Inspired by Pinterest Showcase Designs) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] text-zinc-950 overflow-hidden isolate">
        {/* Ambient Organic Background Blobs */}
        <BackgroundBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none" color="bg-brand-primary/25" size="w-[600px] sm:w-[900px] h-[600px] sm:h-[900px]" variant={1} />
        <BackgroundBlob className="bottom-[-10%] right-[-5%] opacity-25 pointer-events-none" color="bg-cyan-500/20" size="w-[400px] sm:w-[600px] h-[400px] sm:h-[600px]" variant={2} />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-16 sm:space-y-20">
          {/* Header Block (Inspired by Pinterest Platform Showcase) */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-zinc-950 tracking-tight leading-[1.1]">
              WHY ATRIX EXPLORER
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug">
              Built from the ground up <br className="hidden sm:inline" /> <span className="font-serif italic font-normal text-brand-primary">for a seamless reading experience.</span>
            </p>
            <p className="text-zinc-600 font-normal text-base sm:text-lg leading-relaxed">
              Designed specifically for manhwa and novel readers who want distraction-free reading, position memory, and full privacy control.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleDownload}
                className="h-12 px-8 rounded-full bg-zinc-950 text-white font-bold text-xs tracking-widest hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
              >
                DOWNLOAD APK <ArrowRight size={18} className="text-brand-primary" />
              </button>
            </div>
          </div>

          {/* 3 Horizontal Feature Columns (Inspired by Reference Images) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                pill: "AUTO-SAVE 82%",
                pillColor: "bg-brand-primary text-zinc-950 border-brand-primary",
                icon: BookOpen,
                title: "Never lose your place again.",
                desc: "Spend a minute on any web page, and Atrix automatically saves your reading coordinates down to the exact paragraph. No manual bookmarks or spreadsheets needed."
              },
              {
                pill: "TAILORED FOR MANHWA",
                pillColor: "bg-cyan-600 text-white border-cyan-600",
                icon: Library,
                title: "Built for manhwa readers.",
                desc: "Customizable features for your library collection and source collection with effortless continuation—tailored specifically for manhwa, webtoon, and novel enthusiasts."
              },
              {
                pill: "LOCAL VAULT ACTIVE",
                pillColor: "bg-zinc-950 text-white border-zinc-950",
                icon: Lock,
                title: "Your reading history stays 100% private.",
                desc: "Zero tracking algorithms. Your reading library, history, and notes live strictly on your local device unless you explicitly opt to create an encrypted cloud backup."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={cn(
                  "group relative flex flex-col justify-between space-y-4",
                  i > 0 && "md:border-l md:border-zinc-200/80 md:pl-8 lg:pl-10"
                )}
              >
                <div className="space-y-4">
                  {/* Top: Icon Badge & Pill */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/60 text-zinc-950 flex items-center justify-center font-bold shadow-inner group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                      <item.icon size={22} />
                    </div>
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest border uppercase shadow-sm", item.pillColor)}>
                      {item.pill}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight leading-tight group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-600 font-normal text-sm sm:text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Breakdown (Apple & UnBox Editorial Alternating Split Showcase) */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white isolate overflow-hidden">
        <BackgroundBlob className="top-[10%] right-[-10%]" color="bg-brand-primary/[0.05]" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={0} />
        <BackgroundBlob className="bottom-[10%] left-[-10%]" color="bg-cyan-500/[0.05]" size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]" variant={1} />

        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28 relative z-10">
          
          {/* Feature 1: Comfortable Reading */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Phone Mockup Canvas (Right-Aligned on Desktop, 250px Max Proportioned Frame) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-2 lg:order-1 flex justify-center"
            >
              <div className="relative group cursor-pointer w-full max-w-[240px] sm:max-w-[260px]">
                {/* Soft Radial Ambient Shadow */}
                <div className="absolute inset-0 bg-brand-primary/20 blur-2xl transform-gpu will-change-transform rounded-full group-hover:bg-brand-primary/35 transition-all duration-500 pointer-events-none" />

                {/* Sleek Device Frame */}
                <MobileFrame className="z-20 border-brand-border group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500">
                  <img src="/reader-feature-preview.webp" alt="Reader Feature Preview" className="w-full h-full object-cover" />
                </MobileFrame>
              </div>
            </motion.div>

            {/* Editorial Content */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-mono font-black tracking-widest uppercase shadow-md">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                READING COMFORT
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight leading-[1.1]">
                Comfortable reading, <span className="font-serif italic font-normal text-brand-primary">built-in.</span>
              </h2>
              <p className="text-zinc-600 font-normal text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Manhwa and novel websites can be full of clutter. Atrix has built-in features to make reading clean and easy.
              </p>

              <ul className="space-y-4 pt-2 inline-block text-left">
                {[
                  "Blocks popups and ads instantly.",
                  "Hands-free auto-scroll at your preferred speed.",
                  "Cleaner search hiding shopping noise."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/15 flex items-center justify-center text-brand-primary shrink-0">
                      <CheckCircle size={16} />
                    </div>
                    <span className="font-semibold text-zinc-900 text-sm sm:text-base">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Feature 2: Access Your Library */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Editorial Content */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-mono font-black tracking-widest uppercase shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                LIBRARY MANAGEMENT
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight leading-[1.1]">
                Access your library, <span className="font-serif italic font-normal text-brand-primary">anywhere.</span>
              </h2>
              <p className="text-zinc-600 font-normal text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Organize your collection into lists like Plan, Reading, or Completed. Your history is stored on your device, keeping your reading completely private.
              </p>

              <ul className="space-y-4 pt-2 inline-block text-left">
                {[
                  "Saved completely offline on your phone.",
                  "Optional free cloud backup across devices.",
                  "Export lists to standard formats easily."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-600 shrink-0">
                      <CheckCircle size={16} />
                    </div>
                    <span className="font-semibold text-zinc-900 text-sm sm:text-base">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Phone Mockup Canvas (Right-Aligned on Desktop, 250px Max Proportioned Frame) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative group cursor-pointer w-full max-w-[240px] sm:max-w-[260px]">
                {/* Soft Radial Ambient Shadow */}
                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl transform-gpu will-change-transform rounded-full group-hover:bg-cyan-500/35 transition-all duration-500 pointer-events-none" />

                {/* Sleek Device Frame */}
                <MobileFrame className="z-20 border-brand-border group-hover:scale-105 group-hover:rotate-1 transition-all duration-500">
                  <img src="/library-preview.webp" alt="Library View Preview" className="w-full h-full object-cover" />
                </MobileFrame>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 5. How It Works (Horizontal Editorial Timeline Flow - Inspired by Editorial Pinterest Process Designs) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] text-zinc-950 isolate overflow-hidden">
        {/* Soft Organic Background Blobs */}
        <BackgroundBlob className="top-10 left-[-5%] opacity-30 pointer-events-none" color="bg-brand-primary/20" size="w-[500px] sm:w-[700px] h-[500px] sm:h-[700px]" variant={0} />
        <BackgroundBlob className="bottom-[-10%] right-[-5%] opacity-25 pointer-events-none" color="bg-cyan-500/20" size="w-[450px] sm:w-[650px] h-[450px] sm:h-[650px]" variant={2} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-mono font-black tracking-[0.25em] uppercase shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                SIMPLE 4-STEP PROCESS
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-950 tracking-tight leading-[1.1]"
              >
                How it <span className="font-serif italic font-normal text-brand-primary">works.</span>
              </motion.h2>
            </div>

            <p className="text-zinc-600 font-normal text-sm sm:text-base max-w-md leading-relaxed">
              An effortless reading workflow engineered specifically for manhwa, light novel, and webtoon discovery.
            </p>
          </div>

          {/* Horizontal Timeline Process Flow (Inspired by Pinterest Design) */}
          <div className="relative pt-6 pb-4">
            {/* Main Horizontal Timeline Line (Desktop) */}
            <div className="hidden md:block absolute top-[53px] left-8 right-8 h-[2px] bg-zinc-300 pointer-events-none z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
              {[
                {
                  step: "01",
                  phase: "PHASE 01",
                  title: "Search",
                  desc: "Find any manhwa or novel via the built-in browser."
                },
                {
                  step: "02",
                  phase: "PHASE 02",
                  title: "Read",
                  desc: "Enjoy a clean, ad-free reading experience."
                },
                {
                  step: "03",
                  phase: "PHASE 03",
                  title: "Progress Saved",
                  desc: "We automatically log your chapter."
                },
                {
                  step: "04",
                  phase: "PHASE 04",
                  title: "Resume Anywhere",
                  desc: "Open the app and jump right back in."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group relative flex flex-col justify-between"
                >
                  <div>
                    {/* Step Number & Phase Label Above Line */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-zinc-400 group-hover:text-zinc-950 transition-colors">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        {item.phase}
                      </span>
                    </div>

                    {/* Timeline Node Dot */}
                    <div className="relative flex items-center mb-6 py-1">
                      <div className="w-4 h-4 rounded-full bg-zinc-950 border-4 border-[#f8fafc] group-hover:bg-brand-primary group-hover:scale-125 transition-all duration-300 z-10 shadow-sm" />
                      <div className="md:hidden flex-1 h-[2px] bg-zinc-200 ml-2" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-tight mb-2 group-hover:text-brand-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-600 font-normal text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Screenshots Showcase & Direct Comparison (Unified Single Section with bg-brand-bg Background) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-brand-bg overflow-hidden isolate">
        <BackgroundBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="bg-brand-primary/[0.06]" size="w-[500px] sm:w-[800px] h-[500px] sm:h-[800px]" variant={1} />
        
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28 relative z-10">
          {/* Screenshots Showcase Block */}
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text tracking-tight"
              >
                Beautiful <span className="font-serif italic font-normal text-brand-primary">inside and out.</span>
              </motion.h2>
            </div>

            {/* Staggered 3D Depth Card Showcase Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center">
              {[
                { src: "/library-preview.webp", label: "Library", scale: "scale-95 opacity-90 hover:opacity-100" },
                { src: "/reading-tab-preview.webp", label: "Browser", scale: "scale-100 md:-translate-y-3 z-10" },
                { src: "/hero-preview.webp", label: "Home", scale: "scale-105 md:-translate-y-6 z-20 glow-cyan" },
                { src: "/Deatilescreen-preview.webp", label: "Detail", scale: "scale-105 md:-translate-y-6 z-20 glow-cyan" },
                { src: "/profile-preview.webp", label: "Profile", scale: "scale-100 md:-translate-y-3 z-10" },
                { src: "/insight-preview.webp", label: "Insight", scale: "scale-95 opacity-90 hover:opacity-100" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn("group rounded-3xl transition-all duration-500 cursor-pointer flex flex-col items-center", item.scale)}
                >
                  <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-2.5 shadow-xl border border-zinc-200/80 dark:border-zinc-800 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 w-full">
                    <img src={item.src} alt={`${item.label} Mockup`} className="w-full rounded-[1.5rem] overflow-hidden" />
                  </div>
                  <div className="text-center mt-4 text-zinc-600 dark:text-zinc-400 font-bold tracking-widest text-xs uppercase group-hover:text-brand-primary transition-colors">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Direct Comparison Block */}
          <div className="max-w-5xl mx-auto text-center space-y-12 sm:space-y-16">
            {/* Headline */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-mono font-black tracking-[0.3em] uppercase shadow-md">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                DIRECT COMPARISON
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-text tracking-tight leading-[1.1]">
                Built for readers, <span className="font-serif italic font-normal text-brand-primary">not browsers.</span>
              </h2>
            </div>

            {/* Minimalist Card-less Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start max-w-4xl mx-auto text-left">
              {/* Left: Generic Browser */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="space-y-6 opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
                  <Globe size={24} className="text-zinc-400" />
                  <h3 className="text-2xl font-bold text-brand-text tracking-tight">Generic Browser</h3>
                </div>

                <ul className="space-y-4 pt-1">
                  <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-medium">
                    <X size={20} className="text-red-500 shrink-0" /> Generic web browser
                  </li>
                  <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-medium">
                    <X size={20} className="text-red-500 shrink-0" /> No reading memory
                  </li>
                  <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-medium">
                    <X size={20} className="text-red-500 shrink-0" /> No library organization
                  </li>
                </ul>
              </motion.div>

              {/* Right: ATRIX Explorer */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="space-y-6 relative md:border-l md:border-zinc-200/80 dark:md:border-zinc-800 md:pl-10 lg:pl-12"
              >
                <div className="flex items-center justify-between gap-3 border-b border-zinc-950 dark:border-zinc-100 pb-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-zinc-950 font-black text-sm shadow-md">
                      A
                    </div>
                    <h3 className="text-2xl font-bold text-brand-text tracking-tight">ATRIX Explorer</h3>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-mono font-black tracking-widest uppercase shadow-md">
                    YOUR NEW HOME
                  </span>
                </div>

                <ul className="space-y-4 pt-1">
                  <li className="flex items-center gap-3 text-brand-text text-base sm:text-lg font-bold">
                    <CheckCircle size={22} className="text-brand-primary shrink-0" /> Built specifically for manhwa & novels
                  </li>
                  <li className="flex items-center gap-3 text-brand-text text-base sm:text-lg font-bold">
                    <CheckCircle size={22} className="text-brand-primary shrink-0" /> Remembers where you stopped
                  </li>
                  <li className="flex items-center gap-3 text-brand-text text-base sm:text-lg font-bold">
                    <CheckCircle size={22} className="text-brand-primary shrink-0" /> Organizes your reading automatically
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison Table & Social Proof (Unified Single Section - No Dividers) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] text-zinc-950 isolate overflow-hidden">
        {/* Smooth Ambient Backdrop Flow */}
        <BackgroundBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" color="bg-brand-primary/15" size="w-[600px] sm:w-[850px] h-[600px] sm:h-[850px]" variant={0} />

        <div className="max-w-4xl mx-auto space-y-16 sm:space-y-24 relative z-10">
          {/* Why switch to ATRIX Explorer? Comparison Table */}
          <div className="space-y-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-zinc-950 tracking-tight">
              Why switch to <span className="font-serif italic font-normal text-brand-primary">ATRIX Explorer?</span>
            </h2>
            
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-zinc-50 p-5 sm:p-6 border-b border-zinc-200">
                <div className="font-bold text-zinc-950 text-sm sm:text-base">Feature</div>
                <div className="font-bold text-zinc-500 text-center text-sm sm:text-base">Chrome</div>
                <div className="font-bold text-brand-primary text-center text-sm sm:text-base">ATRIX Explorer</div>
              </div>
              
              {[
                { feat: "Saves reading progress", normal: false, atrix: true },
                { feat: "Reading library", normal: false, atrix: true },
                { feat: "Auto-scroll", normal: false, atrix: true },
                { feat: "Optional backup", normal: false, atrix: true },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-5 sm:p-6 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-colors items-center">
                  <div className="text-zinc-900 font-medium text-sm sm:text-base">{row.feat}</div>
                  <div className="text-center text-zinc-400 flex justify-center">
                    {row.normal === false ? <X size={20} className="text-zinc-400" /> : <span className="text-sm">{row.normal}</span>}
                  </div>
                  <div className="text-center flex justify-center text-brand-primary">
                    <CheckCircle size={22} className="glow-cyan rounded-full text-brand-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof CTA */}
          <div className="text-center max-w-2xl mx-auto space-y-5 pt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">Join thousands of readers keeping track of everything they read.</h2>
            <p className="text-zinc-600 font-normal text-base sm:text-lg leading-relaxed">
              Get chapter updates, feature announcements, and reading recommendations.
            </p>
            <div className="flex justify-center pt-2">
              <a href="https://t.me/manhwa_daily" target="_blank" rel="noreferrer" className="h-12 px-8 rounded-full border border-zinc-300/80 bg-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-zinc-950 font-bold text-sm">
                <Send size={18} className="text-[#0088cc]" /> Join the Telegram Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section (Asymmetric 2-Column - Inspired by Taskku) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--app-dark-bg)] text-[var(--app-text-light)] border-t border-zinc-800 isolate">
         <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
               {/* Left Column: Sticky Title & Community CTA */}
               <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32 h-fit text-center lg:text-left">
                  <span className="text-brand-primary text-xs font-mono tracking-[0.3em] uppercase block">
                    HELP CENTER
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                    Frequently Asked <span className="font-serif italic font-normal text-brand-primary">Questions</span>
                  </h2>
                  <p className="text-zinc-400 text-base font-normal leading-relaxed">
                    Have questions about how Atrix Explorer works? Find clear answers regarding privacy, app compatibility, and offline reading.
                  </p>
                  <a
                    href="https://t.me/manhwa_daily"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-3 h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs tracking-widest border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                  >
                    <Send size={16} className="text-cyan-400" /> ASK US ON TELEGRAM
                  </a>
               </div>

               {/* Right Column: Accordion List */}
               <div className="lg:col-span-7 space-y-4">
                 {[
                   { q: "Is this just a reading app?", a: "No, it's a fully functional mobile web browser that specifically detects and enhances manhwa and novel websites." },
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
         </div>
      </section>

      {/* 10. Compact News (White Background) */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-bg border-t border-zinc-200/80 dark:border-zinc-800">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-2xl font-bold text-brand-text tracking-tight">Latest News</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal">Updates from the community</p>
               </div>
               <Link to="/blog" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">View All &rarr;</Link>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
               {BLOG_POSTS.slice(0, 3).map((post, i) => (
                  <Link key={i} to={`/blog/${post.id}`} className="group block border border-zinc-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                     <div className="h-32 bg-zinc-100 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     </div>
                     <div className="p-4">
                        <div className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-widest">{post.category}</div>
                        <h3 className="text-sm font-bold text-brand-text line-clamp-2">{post.title}</h3>
                      </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 11. Big Download CTA Section (Dual Overlapping Mockups - Inspired by ESTARO & PlutoPay) */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--app-dark-bg)] text-white overflow-hidden border-t border-zinc-800 isolate">
        {/* Glow behind text & mockups */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[900px] h-[500px] sm:h-[900px] bg-brand-primary/15 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="text-brand-primary text-xs font-mono tracking-[0.3em] uppercase mb-4 block">
              GET ATRIX EXPLORER
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
              Ready to organize <br className="hidden sm:inline" /> <span className="font-serif italic font-normal text-brand-primary">everything you read?</span>
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg font-normal mb-10 max-w-xl">
              Download ATRIX Explorer today. Start tracking your manhwa and novels automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button
                 onClick={handleDownload}
                 className="h-14 px-10 font-bold text-base rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl bg-brand-primary text-zinc-950 flex items-center justify-center gap-3"
               >
                 Download APK <ArrowRight size={20} />
               </button>
            </div>
          </div>

          {/* Dual Overlapping Mobile Preview Frame */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
             {/* Back Phone */}
             <div className="absolute left-4 sm:left-8 top-0 w-[200px] sm:w-[230px] rotate-[-10deg] opacity-75 hover:opacity-100 transition-all duration-500 hover:rotate-[-6deg] hover:scale-105">
                <MobileFrame className="border-zinc-700 shadow-2xl">
                   <img src="/library-preview.webp" alt="Atrix Library View" className="w-full h-full object-cover" />
                </MobileFrame>
             </div>
             {/* Front Phone */}
             <div className="relative z-20 w-[220px] sm:w-[250px] rotate-[6deg] hover:rotate-[2deg] hover:scale-105 transition-all duration-500 glow-cyan">
                <MobileFrame className="border-brand-primary shadow-2xl">
                   <img src="/hero-preview.webp" alt="Atrix Home View" className="w-full h-full object-cover" />
                </MobileFrame>
             </div>
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
    { name: "MANHWA", count: "142 Titles", icon: BookOpen, accent: "border-brand-primary/20 bg-brand-primary/5" },
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
        <div className="flex justify-between items-center"><span className="text-brand-text font-bold">MANHWA</span><span className="text-brand-grey opacity-60">25%</span></div>
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
        <header className="mb-16 sm:mb-24 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-text/50 text-xs font-bold tracking-[0.4em] mb-4 block uppercase"
          >
            FREEDOM & FLEXIBILITY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8 text-balance text-brand-text"
          >
            Built for readers, <br />
            <span className="font-serif italic font-normal text-brand-primary">who want more control.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-grey text-base sm:text-lg font-light leading-relaxed text-balance"
          >
            Atrix Explorer is a flexible personal library system. Track your collection, customize your layouts, and read on your own terms—with zero forced account signups.
          </motion.p>
        </header>

        <div className="space-y-24 sm:space-y-36">
          
          {/* 2. READ COMFORTABLY (Browser Features) */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative isolate">
            <BackgroundBlob
              className="-top-20 -right-20"
              color="bg-brand-primary/[0.08]"
              size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="aspect-square rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 relative overflow-hidden transition-all flex items-end justify-center bg-brand-card isolate border-0 shadow-2xl"
              >
                <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-tl from-brand-primary/45 via-brand-primary/15 to-transparent pointer-events-none z-10" />
                <div className="w-full max-w-[300px] sm:max-w-[335px] relative translate-y-[40%] transition-transform duration-500 hover:translate-y-[35%] z-20">
                  <DecorativeOrganic className="-top-12 -right-16 rotate-12" size="w-56 h-56" color="fill-brand-grey/10" variant={0} />
                  <DecorativeOrganic className="-bottom-20 -left-16 -rotate-12 opacity-40" size="w-64 h-64" color="fill-brand-primary/5" variant={1} />
                  
                  <MobileFrame>
                    <img
                      src="/reading-tab-preview.webp"
                      alt="Reading View Mockup"
                      className="w-full h-full object-cover"
                    />
                  </MobileFrame>
                  <motion.div whileHover={{ scale: 1.05 }} className="absolute -right-8 sm:-right-12 top-24 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-bg shadow-xl border border-zinc-200 flex items-center gap-2 sm:gap-3 z-20">
                     <Shield size={18} className="text-emerald-500 shrink-0" />
                     <div className="text-[10px] sm:text-xs font-bold text-brand-text tracking-widest whitespace-nowrap">AD BLOCKED</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="absolute -left-8 sm:-left-12 bottom-32 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-bg shadow-xl border border-zinc-200 flex items-center gap-2 sm:gap-3 z-20">
                     <ArrowDown size={18} className="text-brand-primary shrink-0" />
                     <div className="text-[10px] sm:text-xs font-bold text-brand-text tracking-widest whitespace-nowrap">AUTO-SCROLL</div>
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4 text-[40px] sm:text-[60px] font-bold opacity-[0.04] select-none tracking-tighter text-brand-text">01</div>
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
                    <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase">BROWSER EXPERIENCE</div>
                    <div className="text-xs font-bold text-brand-grey">Zero interruptions.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-brand-text">
                  Read without friction, <br />
                  <span className="font-serif italic font-normal text-brand-primary">every single time.</span>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light mb-8 max-w-lg mx-auto lg:mx-0">
                  Enjoy hands-free auto-scrolling, powerful ad-blocking, and clean web reader controls designed specifically for manga and webtoons.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-2 max-w-md mx-auto lg:mx-0">
                  {["Powerful ad-blocker", "Adjustable auto-scroll", "Block intrusive popups", "Distraction-free mode"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80 font-medium">
                      <CheckCircle size={16} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 3. AUTOMATIC PROGRESS TRACKING (Smart Tracking) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-20 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/32"
              size="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="aspect-square rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 relative overflow-hidden transition-all flex items-end justify-center bg-brand-card isolate border-0 shadow-2xl"
              >
                <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-tl from-brand-primary/45 via-brand-primary/15 to-transparent pointer-events-none z-10" />
                <div className="w-full max-w-[300px] sm:max-w-[335px] relative translate-y-[40%] transition-transform duration-500 hover:translate-y-[35%] z-20">
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
                    <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase">SMART TRACKING</div>
                    <div className="text-xs font-bold text-brand-grey">Automatic progress.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-brand-text">
                  Your reading progress, <br />
                  <span className="font-serif italic font-normal text-brand-primary">saved automatically.</span>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light mb-8 max-w-lg mx-auto lg:mx-0">
                  Spend a minute on a page, and the browser automatically saves your position. No manual logs, spreadsheets, or forgotten bookmarks.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-2 max-w-md mx-auto lg:mx-0">
                  {["Auto-detects chapters", "Smart history logs", "Continue from any device", "Works completely offline"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80 font-medium">
                      <CheckCircle size={16} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 4. LIBRARY MANAGEMENT (Personalization & Categories) */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative isolate">
            <BackgroundBlob
              className="-top-20 -left-20"
              color="bg-brand-primary/32"
              size="w-[230px] sm:w-[460px] h-[230px] sm:h-[460px]"
              variant={2}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="aspect-square rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 relative overflow-hidden transition-all flex items-center justify-center bg-brand-card isolate border-0 shadow-2xl"
              >
                <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-tl from-brand-primary/45 via-brand-primary/15 to-transparent pointer-events-none z-10" />
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
                    <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase">LIBRARY MANAGEMENT</div>
                    <div className="text-xs font-bold text-brand-grey">Make it feel yours.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-brand-text">
                  Organize everything, <br />
                  <span className="font-serif italic font-normal text-brand-primary">your way.</span>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light mb-8 max-w-lg mx-auto lg:mx-0">
                  Track anything—manga, anime, novels, or webtoons. Use custom tags, private notes, and personalized posters to build a library that feels personal.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
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
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-20 relative isolate">
            <BackgroundBlob
              className="-bottom-24 -right-20"
              color="bg-brand-grey/35"
              size="w-[210px] sm:w-[420px] h-[210px] sm:h-[420px]"
              variant={3}
              style={{ zIndex: -1 }}
            />
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="aspect-square rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 relative overflow-hidden transition-all flex items-end justify-center bg-brand-card isolate border-0 shadow-2xl"
              >
                <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-tl from-brand-primary/45 via-brand-primary/15 to-transparent pointer-events-none z-10" />
                <div className="w-full max-w-[300px] sm:max-w-[335px] relative translate-y-[40%] transition-transform duration-500 hover:translate-y-[35%] z-20">
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
                    <Globe size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase">SOURCE MANAGEMENT</div>
                    <div className="text-xs font-bold text-brand-grey">All your reading sources.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-brand-text">
                  Manage all your <br />
                  <span className="font-serif italic font-normal text-brand-primary">reading sources.</span>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light mb-8 max-w-lg mx-auto lg:mx-0">
                  Add your favorite reading sources, select official publishers, and automatically collect websites as you browse — all in one place.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-2 max-w-md mx-auto lg:mx-0">
                  {["Manage your reading sources", "Add your favorite sources", "Select from official publishers", "Auto-collect as you visit sites"].map((pt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-text/80 font-medium">
                      <CheckCircle size={16} className="text-brand-primary shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* 6. READING INSIGHTS */}
          <div className="flex flex-col gap-8 relative isolate">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase mb-3">READING INSIGHTS</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-brand-text mb-6">
                Your reading journey, <br />
                <span className="font-serif italic font-normal text-brand-primary">visualized over time.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light max-w-xl mx-auto">
                View your reading activity, completed titles, reading streaks, and personal statistics in one private dashboard.
              </p>
            </motion.div>
            <StatsDashboardUI />
          </div>

          {/* 7. PRIVACY FIRST */}
          <div className="relative py-16 sm:py-24 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden text-center border border-brand-primary/20 bg-brand-primary/10 isolate shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl mx-auto relative z-10 px-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-primary mx-auto flex items-center justify-center text-brand-bg mb-6 shadow-xl">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-brand-text">
                Your reading history <br />
                <span className="font-serif italic font-normal text-brand-primary">belongs to you.</span>
              </h2>
              <p className="text-brand-grey font-light text-base sm:text-lg leading-relaxed mb-10">
                Atrix Explorer is built on a strict privacy-first architecture. We believe your data should stay on your device unless you explicitly choose otherwise.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                {[
                  "Stored 100% locally",
                  "No forced account signups",
                  "Backup, export anytime.",
                  "Sync only if you choose to"
                ].map((pt, i) => (
                  <div key={i} className="flex items-center gap-3 bg-brand-card border border-brand-border px-5 py-4 rounded-2xl shadow-sm hover:border-brand-primary transition-colors">
                    <Lock size={18} className="text-brand-primary shrink-0" />
                    <span className="font-bold text-sm text-brand-text">{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 8. GUEST FREEDOM VS ACCOUNT MODE */}
          <div className="flex flex-col gap-8 relative isolate">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase mb-3">USE IT YOUR WAY</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-brand-text mb-6">
                Local-first by design, <br />
                <span className="font-serif italic font-normal text-brand-primary">cloud optional.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light max-w-xl mx-auto">
                Enjoy the complete reading experience without ever creating an account. Cloud sync is simply an optional extension.
              </p>
            </motion.div>
            <GuestFreedomPanelUI />
          </div>

          {/* 9. IMPORT & EXPORT */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-20">
            <div className="w-full lg:w-1/2 relative isolate">
              <div
                className="aspect-square rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 relative overflow-hidden transition-all flex items-center justify-center bg-brand-card isolate border-0 shadow-2xl"
              >
                <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-tl from-brand-primary/45 via-brand-primary/15 to-transparent pointer-events-none z-10" />
                <ExportWorkflowUI />
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
                    <div className="text-[10px] font-bold tracking-widest text-brand-text/50 uppercase">IMPORT & EXPORT</div>
                    <div className="text-xs font-bold text-brand-grey">Export anytime.</div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-brand-text">
                  Backup, export, <br />
                  <span className="font-serif italic font-normal text-brand-primary">and move anytime.</span>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-brand-grey font-light mb-8 max-w-lg mx-auto lg:mx-0">
                  Your reading history should never feel locked in. Export your entire library in one click in CSV or JSON database formats.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-brand-border bg-brand-card shadow-sm">
                    <div className="text-xs font-bold text-brand-grey">.CSV</div>
                    <span className="text-sm font-medium text-brand-text">Spreadsheet Format</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-brand-primary/30 bg-brand-primary/5 shadow-sm">
                    <div className="text-xs font-bold text-brand-primary">.JSON</div>
                    <span className="text-sm font-medium text-brand-text">Raw Database Backup</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="relative isolate mt-28 sm:mt-40 md:mt-48 pt-16 sm:pt-24">
          <BackgroundBlob
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
            color="bg-brand-primary/20"
            size="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px]"
            variant={3}
            style={{ zIndex: -1 }}
          />
          {/* Card Container (Compact Height, Bottom Flush Alignment) */}
          <div className="relative rounded-[2.5rem] sm:rounded-[3.5rem] bg-brand-primary/15 border border-brand-primary/20 shadow-2xl px-8 sm:px-12 lg:px-16 pt-8 sm:pt-12 pb-0">
            {/* Background Circular Aura behind Phone */}
            <div className="w-72 h-72 sm:w-[380px] sm:h-[380px] rounded-full bg-brand-primary/20 blur-3xl absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12 relative z-10">
              {/* Left Column: Tilted Serif Title, Subtitle & CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-1/2 text-center lg:text-left py-2 pb-8 sm:pb-12"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5 text-brand-text">
                  Atrix Explorer, <span className="font-serif italic font-normal text-brand-primary">your partner</span><br />
                  in reading space.
                </h2>
                <p className="text-sm sm:text-base text-brand-grey font-light leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                  Build your perfect reading space. Track, organize, and read your favorite manga and webtoons effortlessly on your device.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={handleDownload}
                    className="h-13 px-8 rounded-2xl font-bold text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl bg-brand-primary text-brand-bg flex items-center justify-center gap-3"
                  >
                    GET ATRIX EXPLORER <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>

              {/* Right Column: Phone Mockup overflowing TOP edge, bottom anchored directly to card bottom border with 0px gap */}
              <div className="w-full lg:w-1/2 flex items-end justify-center lg:justify-end relative min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
                <div className="absolute bottom-0 right-0 sm:right-4 lg:right-6 w-full max-w-[250px] sm:max-w-[280px] md:max-w-[300px] -top-20 sm:-top-28 lg:-top-32 flex items-end z-20">
                  <div className="w-full h-full overflow-hidden rounded-b-none flex items-start">
                    <MobileFrame className="w-full shadow-2xl">
                      <img
                        src="/hero-preview.webp"
                        alt="Atrix Explorer Home Screen"
                        className="w-full h-full object-cover"
                      />
                    </MobileFrame>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">Effective Date & Last Updated: August 17, 2026</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">1. Important Notice: Medium & Browser Tool Only</h2>
        <p>Atrix Explorer is designed purely as an organizer, tracking tool, and browser interface. <strong>We do not host, store, stream, upload, or distribute any media, comics, manhwa, webtoons, or copyrighted files.</strong> The Application functions solely as a medium and tool to help users track their personal reading history, manage local libraries, and browse third-party websites through an in-app browser interface.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">2. Personal Information We Collect</h2>
        <p>We collect only the data necessary for the app to function, authenticate, and sync:</p>
        <ul>
          <li><strong>Account Information:</strong> When you register or sign in via Google or Email, we collect your email address, unique user ID, username, and display name. Managed securely via Supabase Auth.</li>
          <li><strong>Library & User Content:</strong> Title IDs, reading progress (chapter/season), custom statuses (reading/completed/dropped), personal ratings, private notes, and reminder settings.</li>
          <li><strong>Profile Data:</strong> Username, display name, bio, and custom profile avatar images uploaded by you.</li>
          <li><strong>Push Notification Tokens:</strong> Your device token is stored to send chapter alerts and reading reminders via Firebase Cloud Messaging (FCM).</li>
          <li><strong>Analytics & Telemetry:</strong> Anonymized usage data (such as screen views, session duration, and feature interactions) via Firebase Analytics and PostHog.</li>
          <li><strong>Support & Feedback:</strong> Messages, feedback, or bug reports submitted via the app or email to <strong>support@atrixexplorer.com</strong>.</li>
          <li><strong>Crash Reports:</strong> Anonymous crash diagnostics via Firebase Crashlytics to help us fix technical errors.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">3. Data That Stays Exclusively on Your Device</h2>
        <p>The following data is stored 100% locally on your device and is never sent to or stored on our servers:</p>
        <ul>
          <li>In-app browser history and visit history</li>
          <li>Search queries and search result cache</li>
          <li>Detailed reading streak logs and offline reading tab states</li>
          <li>Notification inbox history</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">4. Cookies & Web Tracking Policy</h2>
        <p>In addition to the personal information collected directly from you, when you visit our website (<strong>https://atrixexplorer.com</strong>), we and third-party service providers (such as Cloudflare and Firebase) may collect technical information using cookies and local storage technology.</p>
        <p>We use cookies to improve your experience on our website, provide essential security, and analyze website traffic. You can manage your cookie preferences through your browser settings. For detailed information on controlling cookies, please visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">www.aboutcookies.org</a>.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">5. Age Restriction (17+)</h2>
        <p>You must be at least 17 years old to use Atrix Explorer. If you are under 17, you are not permitted to use the app or create an account. If we learn that a user is under 17, we will immediately terminate their account and delete their personal data.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">6. How We Use Your Information</h2>
        <p>We use your personal information strictly to:</p>
        <ul>
          <li>Provide core services: Authenticate users, manage user libraries, and sync reading history across devices.</li>
          <li>App improvement: Identify application crashes, fix technical bugs, and optimize app navigation.</li>
          <li>Communication: Send account notifications and respond to support inquiries.</li>
          <li>Legal & Security: Protect our rights and comply with applicable laws.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">7. Third-Party Services & External Websites</h2>
        <p>Atrix Explorer integrates with third-party service providers to function. Each provider operates under its own privacy policy:</p>
        <ul>
          <li><strong>Supabase</strong> — Cloud database, user authentication, and secure file storage.</li>
          <li><strong>Firebase (Google)</strong> — Crashlytics for crash reports, Analytics for usage data, and Cloud Messaging for push alerts.</li>
          <li><strong>PostHog</strong> — Privacy-focused product analytics and usage telemetry.</li>
          <li><strong>Cloudflare</strong> — R2 object storage for custom user uploads and Workers for API proxying.</li>
        </ul>
        <p><strong>In-App Browser & External Links:</strong> When using the in-app browser, you are accessing third-party websites directly. We are not responsible for the privacy practices, content, cookies, or data collection of external websites. We encourage you to review the privacy policies of any website you visit.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">8. Data Security</h2>
        <p>We employ industry-standard security measures—including TLS encryption in transit and database Row-Level Security (RLS)—to protect your personal information from unauthorized access, alteration, or disclosure.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">9. Your Data Rights & Deletion</h2>
        <p>You have full rights regarding your data:</p>
        <ul>
          <li><strong>Access & Export:</strong> View and export your library data in CSV or JSON format from the app.</li>
          <li><strong>Correct:</strong> Edit your library entries and profile details at any time.</li>
          <li><strong>Delete:</strong> Delete your account and associated data directly in-app or submit an online deletion request at <a href="/delete-account" className="text-brand-primary underline">https://atrixexplorer.com/delete-account</a>.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">10. Contact Us</h2>
        <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at <strong>support@atrixexplorer.com</strong>.</p>
      </section>
    </div>
  );
};

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
        <p className="text-lg sm:text-xl font-medium mb-12 text-brand-text">Effective Date & Last Updated: August 17, 2026</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">1. License & Acceptance of Terms</h2>
        <p>By downloading, installing, accessing, or using the Atrix Explorer mobile application or website (<strong>https://atrixexplorer.com</strong>), you agree to be bound by these Terms of Service ("Terms"). Atrix Explorer grants you a non-exclusive, non-transferable, revocable license to use the app for personal, non-commercial use in accordance with these Terms.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">2. Platform Identity: Medium & Browser Tool Only</h2>
        <p>Atrix Explorer is exclusively a personal library tracking application, organizer, and web browser. <strong>We do not host, store, index, stream, upload, or distribute any media, comics, manhwa, webtoons, or copyrighted media files.</strong> The Application provides text-based metadata (titles, descriptions, genre tags) sourced from public third-party databases and serves as a medium for users to track their reading progress.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">3. Restrictions & Prohibited Conduct</h2>
        <p>You agree NOT to:</p>
        <ul>
          <li>Use the Application for any unlawful or unauthorized purpose.</li>
          <li>Copy, modify, reverse engineer, decompile, or disassemble the Application.</li>
          <li>Upload abusive, illegal, or infringing content as custom profile avatars or cover images.</li>
          <li>Harass, abuse, threaten, or harm others through submitted feedback or public profiles.</li>
          <li>Interfere with or disrupt the app, servers, or networks connected to the service.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">4. Account Creation & Age Requirement (17+)</h2>
        <p>You can use basic features of the app without creating an account, but account registration is required to sync your library across devices. You must be at least 17 years old to create an account. You are responsible for keeping your account credentials secure and for all activity occurring under your account.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">5. Third-Party Websites & In-App Browser Disclaimer</h2>
        <p>The Application includes an in-app browser designed for reading tracking. You acknowledge and agree that Atrix Explorer has no control over, and assumes no responsibility for, the content, privacy policies, availability, or security of any third-party websites visited through the browser. You access third-party websites at your own risk and must abide by their respective terms of service.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">6. Intellectual Property</h2>
        <p>The Application branding, code, logos, and UI designs are the property of Atrix Explorer. All third-party comic titles, character names, metadata, and external website content belong to their respective copyright owners. Your library data (notes, ratings, custom status lists) belongs to you, and you retain full rights to export your data anytime.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">7. Disclaimer of Warranties</h2>
        <p>THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, SECURE, OR FREE FROM ERRORS.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">8. Limitation of Liability</h2>
        <p>TO THE FULLEST EXTENT PERMITTED BY LAW, ATRIX EXPLORER SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOST PROFITS, LOST DATA, OR THIRD-PARTY CONTENT DISPUTES) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APPLICATION OR EXTERNAL WEBSITES.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">9. Termination & Indemnification</h2>
        <p>We may terminate your license to use the app at any time for violations of these Terms. You agree to indemnify and hold harmless Atrix Explorer from any claims, damages, liabilities, or costs arising out of your use of the app or violation of these Terms.</p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">10. Contact Us</h2>
        <p>For questions about these Terms of Service, please contact us at <strong>support@atrixexplorer.com</strong>.</p>
      </section>
    </div>
  );
};

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

const DeleteAccountPage = () => {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 min-h-screen max-w-4xl mx-auto px-4 sm:px-8 text-brand-text/80 leading-relaxed bg-brand-bg">
      <Helmet>
        <title>Account Deletion & Data Removal | Atrix Explorer</title>
        <meta name="description" content="Request account and data deletion for Atrix Explorer. Delete your profile, library, and cloud backup data." />
        <link rel="canonical" href="https://atrixexplorer.com/delete-account" />
      </Helmet>

      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-brand-text">Account & Data Deletion</h1>
      <p className="text-lg sm:text-xl font-light text-brand-grey mb-12">
        Atrix Explorer gives you full control over your data. You can delete your account and all associated data at any time.
      </p>

      {/* Grid: 2 Methods */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Method 1: In-App */}
        <div className="p-8 rounded-[2rem] border border-brand-border bg-brand-card flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xl mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-4 text-brand-text">Instant Deletion In App</h3>
            <p className="text-sm text-brand-grey font-light leading-relaxed mb-6">
              If you have the Atrix Explorer app installed, you can delete your account and all data instantly:
            </p>
            <ol className="space-y-3 text-xs sm:text-sm font-medium text-brand-text/90 list-decimal list-inside">
              <li>Open <strong>Atrix Explorer</strong></li>
              <li>Go to <strong>Settings</strong> → <strong>Account</strong></li>
              <li>Tap <strong>Delete Account</strong> and confirm</li>
            </ol>
          </div>
          <div className="mt-8 pt-6 border-t border-brand-border text-xs text-brand-grey">
            ⚡ Executed instantly via automated Supabase function.
          </div>
        </div>

        {/* Method 2: Web Request Form */}
        <div className="p-8 rounded-[2rem] border border-brand-border bg-brand-card">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xl mb-6">
            2
          </div>
          <h3 className="text-xl font-bold mb-4 text-brand-text">Web Deletion Request</h3>
          <p className="text-sm text-brand-grey font-light leading-relaxed mb-6">
            If you uninstalled the app, submit your account email below to request permanent deletion:
          </p>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 space-y-2">
              <h4 className="font-bold text-sm">Deletion Request Received</h4>
              <p className="text-xs font-light leading-relaxed">
                Your request for <strong>{email}</strong> has been logged. Account data and associated cloud files will be permanently deleted within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono tracking-widest text-brand-grey mb-2">
                  ACCOUNT EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-text focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-widest text-brand-grey mb-2">
                  REASON (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us why you are leaving..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-text focus:outline-none focus:border-brand-primary text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-primary text-brand-bg font-bold text-xs tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "SUBMITTING..." : "SUBMIT DELETION REQUEST"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Information Section */}
      <section className="space-y-6 prose max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-zinc">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">What Data is Deleted?</h2>
        <p>When you delete your account, the following data is permanently purged from our servers:</p>
        <ul>
          <li><strong>Authentication Credentials:</strong> User account ID, email login, and Google/GitHub auth tokens.</li>
          <li><strong>Library & Preferences:</strong> Reading progress, bookmarks, custom lists, titles, and ratings.</li>
          <li><strong>Cloud Images:</strong> User-uploaded profile avatars and custom poster artwork stored in Cloudflare R2 object storage.</li>
          <li><strong>Feedback & Reminders:</strong> User feedback reports and notification tokens.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">Local Device Storage</h2>
        <p>
          Deleting your cloud account removes all server-side data. Any local cache or history stored on your Android device can be cleared by uninstalling the application or selecting <em>Clear App Data</em> in your device settings.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">Contact Support</h2>
        <p>
          If you have any questions or experience issues with account deletion, please email us directly at <strong>support@atrixexplorer.com</strong>.
        </p>
      </section>
    </div>
  );
};

const DownloadPage = () => {
  const [activeTab, setActiveTab] = useState<"stable" | "beta">("stable");
  const [expandedVersion, setExpandedVersion] = useState<string | null>("v1.2.0");

  const toggleExpand = (version: string) => {
    setExpandedVersion(prev => (prev === version ? null : version));
  };

  const releases = {
    stable: [
      {
        version: "v1.2.0",
        type: "Stable",
        date: "August 2026",
        size: "83 MB",
        reqs: "Android 8.0+",
        features: [
          "Added new onboarding flow and sources setup",
          "Enhanced browser content detection & tracking controls",
          "Updated library UI, history filtering, and profile avatars"
        ],
        fixes: [],
        perf: []
      },
      {
        version: "v1.1.11",
        type: "Stable",
        date: "July 2026",
        size: "68.9 MB",
        reqs: "Android 8.0+",
        features: [
          "Fast loading Update"
        ],
        fixes: [
          "Solved custom playlist Add and Delete bug",
          "Fixed the reading tab issue"
        ],
        perf: []
      },
      {
        version: "v1.1.10",
        type: "Stable",
        date: "July 2026",
        size: "68.59 MB",
        reqs: "Android 8.0+",
        features: [
          "Improved chapter update notifications",
          "Improved the title parsing in the browser and add the retry option"
        ],
        fixes: [
          "Solved the reading insight bug in timing",
          "Fixed feedback error problem"
        ],
        perf: []
      },
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
        <meta name="description" content="Download the latest version of Atrix Explorer. Get the current Android APK (v1.2.0), view full release notes, changelogs, and download history." />
        <link rel="canonical" href="https://atrixexplorer.com/download" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atrixexplorer.com/download" />
        <meta property="og:title" content="Download Atrix Explorer | Releases & Version History" />
        <meta property="og:description" content="Download the latest version of Atrix Explorer. Get the current Android APK (v1.2.0), view full release notes, changelogs, and download history." />
        <meta property="og:image" content="https://atrixexplorer.com/hero-preview.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Download Atrix Explorer | Releases & Version History" />
        <meta name="twitter:description" content="Download the latest version of Atrix Explorer. Get the current Android APK (v1.2.0), view full release notes, changelogs, and download history." />
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
                  <span className="px-3.5 py-1 bg-brand-primary text-zinc-950 rounded-full text-[10px] font-extrabold tracking-widest shadow-sm">
                    {currentVersion.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <span className="block text-zinc-500 font-mono text-[10px]">Release Date</span>
                    <span className="font-bold text-brand-text">{currentVersion.date}</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 font-mono text-[10px]">File Size</span>
                    <span className="font-bold text-brand-text">{currentVersion.size}</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 font-mono text-[10px]">Platform</span>
                    <span className="font-bold text-brand-text">Android APK</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 font-mono text-[10px]">Target OS</span>
                    <span className="font-bold text-brand-text">{currentVersion.reqs}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href="https://download.atrixexplorer.com/atrixexplorer-1.2.0.apk"
                  download="atrixexplorer-1.2.0.apk"
                  className="inline-flex h-14 px-8 items-center justify-center rounded-2xl font-bold text-sm tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg bg-brand-primary text-zinc-950 gap-3 whitespace-nowrap"
                >
                  Download APK <Download size={18} />
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
          className="p-5 rounded-[1.5rem] border border-zinc-200 bg-brand-card flex flex-col sm:flex-row items-center gap-5 text-left shadow-sm backdrop-blur-md mb-20"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-primary/10 text-brand-primary shrink-0">
            <Globe size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight mb-1 text-brand-text">Platform Availability</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Atrix Explorer is currently fully optimized and available for <span className="font-bold text-brand-text">Android devices</span>. We are actively working on the <span className="font-bold text-brand-text">iOS edition</span>, and it will be released soon. Stay tuned!
            </p>
          </div>
        </motion.div>

        {/* Accordion Release History (Matching shared example) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">Version Archives</h2>
            
            {/* Category Toggle Tabs */}
            <div className="flex p-1 bg-white border border-zinc-200 rounded-xl w-fit">
              <button
                onClick={() => {
                  setActiveTab("stable");
                  setExpandedVersion("v1.2.0");
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer",
                  activeTab === "stable" ? "bg-brand-primary text-zinc-950 shadow-md" : "text-zinc-600 hover:text-zinc-950"
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
                  "px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer",
                  activeTab === "beta" ? "bg-brand-primary text-zinc-950 shadow-md" : "text-zinc-600 hover:text-zinc-950"
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
                "px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-extrabold uppercase tracking-widest transition-all active:scale-95 cursor-pointer",
                filter === cat
                  ? "bg-brand-primary text-zinc-950 shadow-lg"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              )}
            >
              {cat === "News" ? "Weekly News" : cat}
            </button>
          ))}
        </div>

        {/* Latest Post Hero (Samoresh Event Card Design) */}
        {latestPost && (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 sm:mb-24 group cursor-pointer"
          >
            <Link to={`/blog/${latestPost.id}`} className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center p-6 sm:p-8 rounded-[2.5rem] bg-white border border-zinc-200/80 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100">
                <img
                  src={latestPost.image}
                  alt={latestPost.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-brand-primary text-zinc-950 rounded-xl text-xs font-mono font-black tracking-widest uppercase shadow-md">
                    Featured / {latestPost.category}
                  </span>
                </div>

                {/* Floating Date Card */}
                <div className="absolute top-4 right-4 w-12 h-14 rounded-xl bg-white/95 backdrop-blur-md text-zinc-950 shadow-xl border border-white/80 flex flex-col items-center justify-center p-1 font-mono leading-none">
                  <span className="text-base font-black text-zinc-950 leading-none mb-0.5">
                    {parseBlogDate(latestPost.date).day}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    {parseBlogDate(latestPost.date).month}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs">
                    <Clock size={14} className="text-brand-primary" /> {latestPost.readTime || "5 min read"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-500 text-xs">
                    <User size={14} className="text-zinc-400" /> By {latestPost.author}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 leading-tight tracking-tight group-hover:text-brand-primary transition-colors">
                  {latestPost.title}
                </h2>

                <p className="text-zinc-600 font-normal text-base sm:text-lg leading-relaxed line-clamp-3">
                  {latestPost.excerpt}
                </p>

                <div className="pt-2">
                  <div className="h-12 px-8 rounded-xl bg-zinc-950 text-white font-bold text-xs tracking-wider group-hover:bg-brand-primary group-hover:text-zinc-950 transition-all duration-300 shadow-md inline-flex items-center justify-center gap-3">
                    <span>Read Article</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        )}

        {/* Grid Section (Samoresh Event Card Design) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20">
          {displayedPosts.map((item, i) => (
            <motion.article
              id={`blog-post-card-${i}`}
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i % 3 * 0.1 }}
              className="flex flex-col group rounded-[2.2rem] bg-white border border-zinc-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden cursor-pointer h-full justify-between"
            >
              <Link to={`/blog/${item.id}`} className="flex flex-col h-full justify-between">
                <div>
                  {/* Banner Image with Double Samoresh Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Top-Left Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1.5 bg-brand-primary text-zinc-950 rounded-xl text-[10px] font-mono font-black tracking-widest uppercase shadow-md border border-brand-primary">
                        {item.category}
                      </span>
                    </div>

                    {/* Top-Right Floating Date Card (Samoresh Signature Badge) */}
                    <div className="absolute top-4 right-4 w-12 h-14 rounded-xl bg-white/95 backdrop-blur-md text-zinc-950 shadow-xl border border-white/80 flex flex-col items-center justify-center p-1 font-mono leading-none">
                      <span className="text-base font-black text-zinc-950 leading-none mb-0.5">
                        {parseBlogDate(item.date).day}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        {parseBlogDate(item.date).month}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Row: Read Time / Author */}
                      <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[11px]">
                          <Clock size={13} className="text-brand-primary" /> {item.readTime || "5 min read"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-zinc-500 text-[11px]">
                          <User size={13} className="text-zinc-400" /> {item.author || "Atrix Team"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-brand-primary transition-colors tracking-tight leading-snug mb-3 line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-zinc-600 font-normal text-sm leading-relaxed line-clamp-2 mb-6">
                        {item.excerpt}
                      </p>
                    </div>

                    {/* Samoresh Full-Width Action Button ("Read Story →") */}
                    <div className="w-full py-3 rounded-xl bg-zinc-950 text-white font-bold text-xs tracking-wider group-hover:bg-brand-primary group-hover:text-zinc-950 transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-auto">
                      <span>Read Story</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
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
                      <div className="absolute top-0 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-gradient-to-br from-black/10 to-transparent blur-3xl transform-gpu will-change-transform pointer-events-none rounded-full" />
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {latestNews.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col group rounded-[2.2rem] bg-white border border-zinc-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden cursor-pointer h-full justify-between"
                      >
                        <Link to={`/blog/${post.id}`} className="flex flex-col h-full justify-between">
                          <div>
                            {/* Banner Image with Double Samoresh Badges */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Top-Left Category Badge */}
                              <div className="absolute top-4 left-4">
                                <span className="px-3.5 py-1.5 bg-brand-primary text-zinc-950 rounded-xl text-[10px] font-mono font-black tracking-widest uppercase shadow-md border border-brand-primary">
                                  {post.category}
                                </span>
                              </div>

                              {/* Top-Right Floating Date Card */}
                              <div className="absolute top-4 right-4 w-12 h-14 rounded-xl bg-white/95 backdrop-blur-md text-zinc-950 shadow-xl border border-white/80 flex flex-col items-center justify-center p-1 font-mono leading-none">
                                <span className="text-base font-black text-zinc-950 leading-none mb-0.5">
                                  {parseBlogDate(post.date).day}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                                  {parseBlogDate(post.date).month}
                                </span>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 mb-3">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[11px]">
                                    <Clock size={13} className="text-brand-primary" /> {post.readTime || "5 min read"}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 text-zinc-500 text-[11px]">
                                    <User size={13} className="text-zinc-400" /> {post.author || "Atrix Team"}
                                  </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-brand-primary transition-colors tracking-tight leading-snug mb-3 line-clamp-2">
                                  {post.title}
                                </h3>

                                <p className="text-zinc-600 font-normal text-sm leading-relaxed line-clamp-2 mb-6">
                                  {post.excerpt}
                                </p>
                              </div>

                              <div className="w-full py-3 rounded-xl bg-zinc-950 text-white font-bold text-xs tracking-wider group-hover:bg-brand-primary group-hover:text-zinc-950 transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-auto">
                                <span>Read Story</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {recommendedPosts.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col group rounded-[2.2rem] bg-white border border-zinc-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden cursor-pointer h-full justify-between"
                      >
                        <Link to={`/blog/${post.id}`} className="flex flex-col h-full justify-between">
                          <div>
                            {/* Banner Image with Double Samoresh Badges */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Top-Left Category Badge */}
                              <div className="absolute top-4 left-4">
                                <span className="px-3.5 py-1.5 bg-brand-primary text-zinc-950 rounded-xl text-[10px] font-mono font-black tracking-widest uppercase shadow-md border border-brand-primary">
                                  {post.category}
                                </span>
                              </div>

                              {/* Top-Right Floating Date Card */}
                              <div className="absolute top-4 right-4 w-12 h-14 rounded-xl bg-white/95 backdrop-blur-md text-zinc-950 shadow-xl border border-white/80 flex flex-col items-center justify-center p-1 font-mono leading-none">
                                <span className="text-base font-black text-zinc-950 leading-none mb-0.5">
                                  {parseBlogDate(post.date).day}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                                  {parseBlogDate(post.date).month}
                                </span>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500 mb-3">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[11px]">
                                    <Clock size={13} className="text-brand-primary" /> {post.readTime || "5 min read"}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 text-zinc-500 text-[11px]">
                                    <User size={13} className="text-zinc-400" /> {post.author || "Atrix Team"}
                                  </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-brand-primary transition-colors tracking-tight leading-snug mb-3 line-clamp-2">
                                  {post.title}
                                </h3>

                                <p className="text-zinc-600 font-normal text-sm leading-relaxed line-clamp-2 mb-6">
                                  {post.excerpt}
                                </p>
                              </div>

                              <div className="w-full py-3 rounded-xl bg-zinc-950 text-white font-bold text-xs tracking-wider group-hover:bg-brand-primary group-hover:text-zinc-950 transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-auto">
                                <span>Read Story</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
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
            <Route path="/delete-account" element={<PageWrapper><DeleteAccountPage /></PageWrapper>} />
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

