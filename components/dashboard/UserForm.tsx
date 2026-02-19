// path: components/dashboard/UserForm.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiEdit3, FiUserPlus, FiSettings, FiPlusCircle, FiSave, 
    FiRotateCcw, FiXCircle, FiEye, FiEyeOff, FiImage, 
    FiCamera, FiInfo, FiTrash2, FiStar, FiUser, FiLock, FiShield,
    FiLayout, FiTool, FiCode, FiLayers, FiScissors, FiCheckCircle
} from "react-icons/fi";
import { IconType } from "react-icons";
import AccessToggle from './AccessToggle';

// --- TYPES ---
interface AccessTogglesState {
    dashboard: boolean;       // NEW
    posterEditor: boolean;
    certificateEditor: boolean;
    visitingCard: boolean;
    idCard: boolean;
    bgRemover: boolean;
    imageEnhancer: boolean;
    assets: boolean;
    settings: boolean;        // NEW
    bugReport: boolean;       // NEW
    developer: boolean;       // NEW
}

interface UserFormProps {
    username: string;
    password: string;
    editingId: string | null;
    isApiLoading: boolean;
    showPassword: boolean;
    accessToggles: AccessTogglesState;
    setUsername: (val: string) => void;
    setPassword: (val: string) => void;
    setShowPassword: (val: boolean) => void;
    setAccessToggles: (updater: (prev: AccessTogglesState) => AccessTogglesState) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancelEdit: () => void;
    handleClearForm: () => void;
}

// --- CONFIG ---
// Expanded to match Schema
const moduleAccessMap = {
    // Core
    dashboard: { label: "Dashboard", icon: FiLayout, desc: "Main Analytics" },
    
    // Tools
    posterEditor: { label: "Poster Editor", icon: FiImage, desc: "Design & Marketing" },
    certificateEditor: { label: "Certificate", icon: FiCheckCircle, desc: "Document Generation" },
    visitingCard: { label: "Visiting Card", icon: FiUserPlus, desc: "Contact Mgmt" },
    idCard: { label: "ID Card", icon: FiInfo, desc: "Employee Badges" },
    bgRemover: { label: "BG Remover", icon: FiScissors, desc: "AI Background Tools" },
    imageEnhancer: { label: "Image Enhancer", icon: FiStar, desc: "Upscaling Tech" },
    assets: { label: "Assets", icon: FiLayers, desc: "File Library" },

    // Admin
    settings: { label: "Settings", icon: FiSettings, desc: "User Config" },
    bugReport: { label: "Bug Reports", icon: FiTool, desc: "Issue Tracking" },
    developer: { label: "Developer", icon: FiCode, desc: "Full Access" },
};

// --- MAIN COMPONENT ---
const UserForm: React.FC<UserFormProps> = ({
    username, password, editingId, isApiLoading, showPassword, accessToggles,
    setUsername, setPassword, setShowPassword, setAccessToggles,
    handleSubmit, handleCancelEdit, handleClearForm,
}) => {
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-1 shadow-xl shadow-slate-200/50 h-fit sticky top-24"
        >
            <div className="bg-white rounded-[20px] p-6 sm:p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-2xl ${editingId ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {editingId ? <FiEdit3 className="text-2xl" /> : <FiUserPlus className="text-2xl" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {editingId ? 'Update Profile' : 'New Account'}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                {editingId ? 'Modify user credentials & access' : 'Provision a new team member'}
                            </p>
                        </div>
                    </div>
                    {editingId && (
                        <div className="ml-14 px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 inline-block border border-slate-200">
                            Editing: <span className="font-bold text-slate-800">{username}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* 1. Credentials Group */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-2">
                            <FiShield className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Credentials</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Username Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    autoComplete="username"
                                    placeholder="Username"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isApiLoading}
                                />
                                <label htmlFor="username" className="absolute -top-2 left-4 px-1 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wide group-focus-within:text-indigo-500 transition-colors">
                                    Employee ID
                                </label>
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete={editingId ? "off" : "new-password"}
                                    placeholder={editingId ? "Leave blank to keep current" : "Set secure password"}
                                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={!editingId}
                                    disabled={isApiLoading}
                                />
                                <label htmlFor="password" className="absolute -top-2 left-4 px-1 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wide group-focus-within:text-indigo-500 transition-colors">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                    disabled={isApiLoading}
                                >
                                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* 2. Access Control Group */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FiSettings className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Module Permissions</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {Object.entries(moduleAccessMap).map(([key, { label, icon, desc }]) => (
                                <AccessToggle
                                    key={key}
                                    label={label}
                                    icon={icon as IconType}
                                    description={desc}
                                    checked={accessToggles[key as keyof AccessTogglesState]}
                                    onChange={() => setAccessToggles(prev => ({
                                        ...prev, [key]: !prev[key as keyof AccessTogglesState]
                                    }))}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 3. Actions Group */}
                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            className={`
                                w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300
                                ${editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                            `}
                            disabled={isApiLoading}
                        >
                            {editingId ? (
                                <><FiSave className="w-5 h-5" /> Save Changes</>
                            ) : (
                                <><FiPlusCircle className="w-5 h-5" /> Create Account</>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => editingId ? handleCancelEdit() : handleClearForm()}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300"
                            disabled={isApiLoading}
                        >
                            {editingId ? (
                                <><FiXCircle className="w-5 h-5" /> Cancel</>
                            ) : (
                                <><FiRotateCcw className="w-5 h-5" /> Reset Form</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default UserForm;