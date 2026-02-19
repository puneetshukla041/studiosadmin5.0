import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiLogOut, FiRefreshCw, FiCommand, FiActivity, FiZapOff, FiAlertTriangle, FiLoader 
} from "react-icons/fi";

interface DashboardHeaderProps {
  isApiLoading: boolean;
  refreshAllData: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isApiLoading, 
  refreshAllData, 
  handleLogout 
}) => {
  const [isCrashed, setIsCrashed] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // 1. Fetch Initial State from DB on Load
  useEffect(() => {
    const fetchCrashState = async () => {
      try {
        const res = await fetch('/api/admin/crash');
        if (res.ok) {
            const data = await res.json();
            setIsCrashed(data.crashed);
        }
      } catch (error) {
        console.error("Failed to fetch system state", error);
      }
    };
    fetchCrashState();
  }, []);

  // 2. Toggle Crash State via API (Updates MongoDB)
  const toggleSystemCrash = async () => {
    setIsToggling(true);
    // Determine the new state based on current state
    const newState = !isCrashed;
    
    try {
      // Optimistic UI Update immediately
      setIsCrashed(newState);

      const res = await fetch('/api/admin/crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crashed: newState }),
      });

      if (!res.ok) throw new Error("Failed to update");
      
      // Optional: Ensure state sync with server response
      const data = await res.json();
      setIsCrashed(data.crashed);

    } catch (error) {
      console.error(error);
      setIsCrashed(!newState); // Revert UI on error
      // You might want to show a toast/alert here
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full"
    >
      {/* Glassmorphism Background Container */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm" />

      <div className="relative px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LEFT: Branding */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300
            ${isCrashed ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-500/20'}
          `}>
            {isCrashed ? <FiAlertTriangle className="text-xl" /> : <FiCommand className="text-xl" />}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                SSI Studios
              </h1>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
                ${isCrashed ? 'bg-red-100 border-red-200 text-red-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}
              `}>
                {isCrashed ? 'SYSTEM ERROR' : 'Admin'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
               <span>Control Panel</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          
          {/* Status Indicator */}
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border mr-2 transition-colors duration-300
            ${isCrashed ? 'bg-red-50 border-red-200' : 'bg-emerald-50/50 border-emerald-100'}
          `}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCrashed ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isCrashed ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${isCrashed ? 'text-red-700' : 'text-emerald-700'}`}>
              {isCrashed ? 'CRITICAL FAILURE' : 'System Online'}
            </span>
          </div>

          {/* CRASH TOGGLE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSystemCrash}
            disabled={isToggling}
            className={`
              flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all border min-w-[120px]
              ${isCrashed 
                ? 'bg-red-600 text-white border-red-700 shadow-red-500/50 animate-pulse' 
                : 'bg-white text-slate-500 border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
              }
            `}
            title={isCrashed ? "Restore System" : "Simulate Crash"}
          >
            {isToggling ? <FiLoader className="animate-spin"/> : (isCrashed ? <FiRefreshCw /> : <FiZapOff />)}
            <span className="hidden sm:inline">{isCrashed ? 'RESTORE' : 'CRASH'}</span>
          </motion.button>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshAllData}
            disabled={isApiLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm disabled:opacity-50"
          >
            <FiRefreshCw className={`text-sm ${isApiLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </motion.button>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={isApiLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <FiLogOut className="text-sm" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;