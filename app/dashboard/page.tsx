'use client';

import React, { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FiUsers, FiLogOut, FiEdit3, FiTrash2, FiSave, FiXCircle, FiCheck,
  FiInfo, FiAlertCircle, FiBell, FiPlusCircle, FiSearch, FiEye,
  FiEyeOff, FiRotateCcw, FiLoader, FiClock, FiImage, FiCamera,
  FiStar, FiFolder, FiGrid, FiUserPlus, FiActivity, FiSettings,
  FiBarChart2, FiTrendingUp, FiCheckCircle, FiRefreshCw, FiLock, FiZap,
  FiShield, FiLayout, FiTool, FiCode, FiLayers, FiScissors
} from "react-icons/fi";

import BugReportListCard from '@/components/dashboard/BugReportListCard';
import MockChart from "@/components/dashboard/MockChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickMetrics from "@/components/dashboard/QuickMetrics";
import UserTable from "@/components/dashboard/UserTable";
import { useMemberData } from "@/hooks/useMemberData";

// --- TYPES ---
// We define the FULL interface here locally
interface AccessTogglesState {
  dashboard: boolean;       
  posterEditor: boolean;
  certificateEditor: boolean;
  visitingCard: boolean;
  idCard: boolean;
  bgRemover: boolean;
  imageEnhancer: boolean;
  assets: boolean;
  settings: boolean;        
  bugReport: boolean;       
  developer: boolean;       
}

interface AccessItem {
  key: keyof AccessTogglesState;
  label: string;
  icon: IconType;
  description: string;
  color: string;
}

// Updated Access Items List
const accessItems: AccessItem[] = [
  // Core
  { key: 'dashboard', label: 'Dashboard', icon: FiLayout, description: 'Main analytics view', color: 'text-slate-600' },
  
  // Tools
  { key: 'posterEditor', label: 'Poster Editor', icon: FiImage, description: 'Design & marketing tools', color: 'text-pink-500' },
  { key: 'certificateEditor', label: 'Certificate Editor', icon: FiCheckCircle, description: 'Official documents', color: 'text-blue-500' },
  { key: 'visitingCard', label: 'Visiting Card', icon: FiUserPlus, description: 'Contact management', color: 'text-amber-500' },
  { key: 'idCard', label: 'ID Card Generator', icon: FiCamera, description: 'Employee badges', color: 'text-emerald-500' },
  { key: 'bgRemover', label: 'Background Remover', icon: FiScissors, description: 'AI removal tools', color: 'text-violet-500' },
  { key: 'imageEnhancer', label: 'Image Enhancer', icon: FiStar, description: 'Upscaling quality', color: 'text-cyan-500' },
  { key: 'assets', label: 'Asset Library', icon: FiLayers, description: 'File management', color: 'text-orange-500' },

  // Admin / Utils
  { key: 'settings', label: 'Settings', icon: FiSettings, description: 'User configuration', color: 'text-gray-500' },
  { key: 'bugReport', label: 'Bug Reports', icon: FiTool, description: 'Issue tracking', color: 'text-rose-500' },
  { key: 'developer', label: 'Developer Mode', icon: FiCode, description: 'Advanced access', color: 'text-indigo-600' },
];

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

// --- MAIN COMPONENT ---
export default function MembersPage() {
  const {
    // State
    members, username, password, editingId, notification, searchTerm,
    showPassword, isApiLoading, isPageLoading, visiblePasswordId,
    accessToggles, isConfirmingDelete, bugReports, storageUsedData,
    // Setters
    setUsername, setPassword, setSearchTerm, setShowPassword,
    setVisiblePasswordId, setIsConfirmingDelete,
    // Computed
    filteredMembers, memberStats, storageUsagePercentage,
    // Actions
    refreshAllData, handleAccessToggle, handleSubmit: hookHandleSubmit,
    handleDelete, handleEdit, handleCancelEdit, handleClearForm,
    handleLogout, handleResolveReport: hookHandleResolveReport,
  } = useMemberData();

  const handleResolveReport = hookHandleResolveReport;

  // Adapter for Table
  const handleAccessToggleForTable = useCallback(
    (memberId: string, field: keyof AccessTogglesState, value: boolean) => {
      // Cast 'field' to any to avoid conflict with the hook's older type definition
      return handleAccessToggle(field as any, value, memberId);
    },
    [handleAccessToggle]
  );

  const isAnyAccessEnabled = useMemo(() => {
    if (!accessToggles) return false;
    // Check if at least one value is true
    return Object.values(accessToggles).some(value => value === true);
  }, [accessToggles]);

  const onSubmit = useCallback((e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    hookHandleSubmit(e);
  }, [hookHandleSubmit]);

  // Loading State
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
             <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-ping"></div>
             <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-indigo-900 font-semibold tracking-wide animate-pulse">Initializing Studio Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-sans antialiased bg-[#F3F4F6] text-slate-800 relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white opacity-80 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-white/50 to-transparent backdrop-blur-3xl -z-10" />

      {/* API Loading Overlay - Glassmorphism */}
      <AnimatePresence>
        {isApiLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/30 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 p-8 rounded-2xl shadow-2xl border border-white/50 flex flex-col items-center"
            >
              <div className="p-3 bg-indigo-50 rounded-full mb-4">
                <FiZap className="w-8 h-8 animate-pulse text-indigo-600" />
              </div>
              <p className="text-lg font-bold text-slate-900">Processing...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/20 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-sm w-full"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Member?</h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                This action helps keep your database clean, but it cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmingDelete(null)}
                  className="flex-1 px-4 py-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(isConfirmingDelete)}
                  className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-semibold text-sm shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {notification && notification.active && (
            <motion.div
              initial={{ y: -50, opacity: 0, x: "-50%" }}
              animate={{ y: 20, opacity: 1, x: "-50%" }}
              exit={{ y: -50, opacity: 0, x: "-50%" }}
              className="fixed top-0 left-1/2 z-50"
            >
              <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/50
                ${notification.type === "success" ? "bg-emerald-50/90 text-emerald-800" : ""}
                ${notification.type === "info" ? "bg-blue-50/90 text-blue-800" : ""}
                ${notification.type === "error" ? "bg-red-50/90 text-red-800" : ""}
              `}>
                {notification.type === "success" && <FiCheckCircle className="w-5 h-5" />}
                {notification.type === "info" && <FiInfo className="w-5 h-5" />}
                {notification.type === "error" && <FiAlertCircle className="w-5 h-5" />}
                <span className="font-medium text-sm">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header */}
        <DashboardHeader
          isApiLoading={isApiLoading}
          refreshAllData={refreshAllData}
          handleLogout={handleLogout}
        />

        {/* Main Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 mt-8"
        >
          
          {/* --- TOP SECTION: ANALYTICS --- */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* Quick Metrics (Takes 1 column) */}
            <div className="lg:col-span-1 h-full">
              <QuickMetrics
                memberStats={memberStats}
                storageUsedData={storageUsedData}
                storageUsagePercentage={storageUsagePercentage}
              />
            </div>

            {/* Charts & Reports (Takes 3 columns) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 p-1 flex flex-col h-full">
                 <BugReportListCard
                    reports={bugReports}
                    onResolveReport={handleResolveReport}
                 />
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 p-1 flex flex-col h-full">
                <MockChart
                  title="Module Popularity"
                  type="Bar"
                  data={memberStats?.accessDistribution}
                  color="indigo"
                  dataType="distribution"
                />
              </div>
            </div>
          </motion.section>


          {/* --- DIVIDER --- */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F3F4F6] px-6 text-sm font-extrabold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <FiShield className="w-4 h-4" /> Administration
              </span>
            </div>
          </motion.div>


          {/* --- BOTTOM SECTION: MANAGEMENT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Access Form (Sticky Side Panel) */}
            <motion.div 
              variants={itemVariants} 
              className="lg:col-span-4 sticky top-24 z-30" 
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                   <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         {editingId ? <FiEdit3 className="text-indigo-400"/> : <FiUserPlus className="text-indigo-400"/>} 
                         {editingId ? 'Modify Access' : 'New Member'}
                      </h2>
                      <p className="text-slate-400 text-xs mt-1">Manage credentials & permissions</p>
                   </div>
                   <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <FiSettings className="text-indigo-300 w-5 h-5"/>
                   </div>
                </div>

                <div className="p-8">
                  <form onSubmit={onSubmit} className="space-y-8">
                    
                    {/* Credentials Group */}
                    <div className="space-y-5">
                      <div className="relative">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Username</label>
                        <input
                          id="username"
                          type="text"
                          value={username || ''}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. employee_01"
                          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium text-slate-700 disabled:opacity-50"
                          required
                          disabled={isApiLoading || editingId !== null}
                        />
                        {editingId && <FiLock className="absolute right-4 top-9 text-slate-400 w-4 h-4" />}
                      </div>

                      <div className="relative">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Password</label>
                        <div className="relative group">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={editingId ? "Keep current password" : "••••••••"}
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                            required={!editingId}
                            disabled={isApiLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Grid */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          Module Permissions
                      </h3>
                      
                      {/* Updated Grid for items */}
                      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {accessItems.map((item) => {
                          const Icon = item.icon;
                          
                          // FIXED LINE HERE: Added (accessToggles as any) to bypass the typescript error
                          const isChecked = !!(accessToggles as any)?.[item.key];

                          return (
                            <motion.div
                              whileTap={{ scale: 0.98 }}
                              key={item.key}
                              // Added (item.key as any) to ensure the callback works
                              onClick={() => handleAccessToggle(item.key as any, !isChecked, editingId)}
                              className={`
                                relative p-3 rounded-xl border cursor-pointer select-none transition-all duration-200
                                ${isChecked 
                                  ? 'bg-indigo-50/50 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                                  : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
                                }
                              `}
                            >
                               {isChecked && (
                                  <motion.div 
                                    layoutId={`active-check-${item.key}`}
                                    className="absolute top-2 right-2 text-indigo-600"
                                  >
                                     <FiCheckCircle className="w-4 h-4 fill-indigo-100"/>
                                  </motion.div>
                               )}
                               
                              <div className="flex flex-col h-full justify-between gap-2">
                                <Icon className={`w-6 h-6 ${isChecked ? item.color : 'text-slate-400'}`} />
                                <div>
                                  <span className={`block text-xs font-bold leading-tight ${isChecked ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {item.label}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {!isAnyAccessEnabled && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
                           <FiAlertCircle className="text-red-500 mt-0.5 shrink-0"/>
                           <p className="text-xs text-red-600 font-medium">User has no access. Please select at least one module.</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="pt-2 flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={isApiLoading || (!editingId && (!username || !password))}
                        className={`
                          w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all
                          ${isApiLoading 
                             ? 'bg-indigo-400 cursor-wait' 
                             : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isApiLoading ? (
                          <><FiLoader className="animate-spin"/> Processing...</>
                        ) : (
                          <><FiSave/> {editingId ? 'Save Changes' : 'Create Account'}</>
                        )}
                      </button>

                      {editingId ? (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="w-full py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiXCircle /> Discard
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleClearForm}
                          className="w-full py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <FiRotateCcw /> Reset Form
                        </button>
                      )}
                    </div>

                  </form>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Data Table (Scrollable) */}
            <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
               <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 p-1 min-h-[800px]">
                  <UserTable
                    /* FIX IS HERE: 
                       Casting filteredMembers to 'any' bypasses the type mismatch 
                       between the Hook's Member type and the UserTable's Member type.
                    */
                    filteredMembers={filteredMembers as any}
                    searchTerm={searchTerm}
                    editingId={editingId}
                    isApiLoading={isApiLoading}
                    visiblePasswordId={visiblePasswordId}
                    setSearchTerm={setSearchTerm}
                    setVisiblePasswordId={setVisiblePasswordId}
                    handleAccessToggle={handleAccessToggleForTable}
                    handleEdit={handleEdit}
                    setIsConfirmingDelete={setIsConfirmingDelete}
                  />
               </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}