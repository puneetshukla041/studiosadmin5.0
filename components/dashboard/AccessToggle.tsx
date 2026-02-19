// D:\studiosadmin\studiosadmin\components\dashboard\AccessToggle.tsx
import React from 'react';
import { IconType } from "react-icons";
import { motion } from "framer-motion";

// --- INTERFACE DEFINITIONS ---
interface AccessToggleProps {
  label: string;
  icon: IconType;
  checked: boolean;
  onChange: () => void;
  description?: string; // Optional: adds more context if you ever need it
}

// --- CUSTOM ACCESS TOGGLE COMPONENT ---
const AccessToggle: React.FC<AccessToggleProps> = ({ 
  label, 
  icon: Icon, 
  checked, 
  onChange,
  description 
}) => {
  return (
    <motion.div
      layout
      onClick={onChange}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group cursor-pointer rounded-xl border-2 p-3 transition-colors duration-300
        flex items-center justify-between overflow-hidden
        ${checked 
          ? 'bg-indigo-50/60 border-indigo-500 shadow-lg shadow-indigo-500/10' 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }
      `}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange();
        }
      }}
    >
      {/* Background Decorator (Optional Glow) */}
      {checked && (
        <motion.div 
          layoutId="highlight"
          className="absolute inset-0 bg-indigo-500/5 z-0" 
        />
      )}

      {/* Left Side: Icon & Label */}
      <div className="flex items-center gap-3 z-10">
        <div className={`
          p-2 rounded-lg transition-colors duration-300
          ${checked ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:text-slate-600'}
        `}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col">
          <span className={`
            text-sm font-bold transition-colors duration-300
            ${checked ? 'text-indigo-900' : 'text-slate-700'}
          `}>
            {label}
          </span>
          {description && (
             <span className="text-[10px] text-slate-400 font-medium">
               {description}
             </span>
          )}
        </div>
      </div>

      {/* Right Side: Animated Switch */}
      <div className={`
        relative w-12 h-7 rounded-full transition-colors duration-300 z-10
        ${checked ? 'bg-indigo-600' : 'bg-slate-200'}
      `}>
        <motion.div
          className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md"
          animate={{
            x: checked ? 20 : 0,
            scale: checked ? 1 : 0.85 
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </div>
    </motion.div>
  );
};

export default AccessToggle;