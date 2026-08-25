import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Plus } from "lucide-react";

export const ProgressUpdateMockup = ({
  title,
  chapter,
  isSaved
}: {
  title: string;
  chapter: number;
  isSaved?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative z-10 p-4 rounded-2xl shadow-xl border flex items-center gap-4 max-w-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 w-full text-left"
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary text-slate-950 shadow-md shadow-brand-primary/20 shrink-0">
      {isSaved ? <CheckCircle size={20} /> : <Plus size={20} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-0.5">
        {isSaved ? "Progress Saved" : "New Detected"}
      </div>
      <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">{title}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
        {isSaved ? `Chapter ${chapter} saved to phone` : `Chapter ${chapter} detected on page`}
      </div>
    </div>
  </motion.div>
);
