// path: components/dashboard/UserTable.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUsers, FiSearch, FiClock, FiEye, FiEyeOff, FiEdit3, FiTrash2, 
    FiImage, FiInfo, FiCamera, FiStar, FiCheck, FiX, FiShield, FiMoreHorizontal,
    FiLayout, FiSettings, FiTool, FiCode, FiLayers, FiScissors, FiCheckCircle, FiUserPlus
} from "react-icons/fi";

// --- TYPES ---
interface Member {
    _id: string;
    username: string;
    password: string;
    // Updated Access Interface
    access?: {
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
    };
    createdAt?: string;
    updatedAt?: string;
}

interface UserTableProps {
    filteredMembers: Member[];
    searchTerm: string;
    editingId: string | null;
    isApiLoading: boolean;
    visiblePasswordId: string | null;
    setSearchTerm: (val: string) => void;
    setVisiblePasswordId: (updater: (prevId: string | null) => string | null) => void;
    handleAccessToggle: (memberId: string, field: keyof NonNullable<Member['access']>, value: boolean) => Promise<void>;
    handleEdit: (member: Member) => void;
    setIsConfirmingDelete: (id: string | null) => void;
}

// --- CONFIG ---
// Expanded Access Map for ALL Sidebar Items
const inlineAccessMap = {
    // 1. Core
    dashboard: { label: "Dash", icon: FiLayout, color: "text-slate-600", bg: "bg-slate-100" },
    
    // 2. Tools
    posterEditor: { label: "Poster", icon: FiImage, color: "text-pink-500", bg: "bg-pink-50" },
    certificateEditor: { label: "Cert.", icon: FiCheckCircle, color: "text-blue-500", bg: "bg-blue-50" },
    visitingCard: { label: "V-Card", icon: FiUserPlus, color: "text-amber-500", bg: "bg-amber-50" },
    idCard: { label: "ID Card", icon: FiInfo, color: "text-emerald-500", bg: "bg-emerald-50" },
    bgRemover: { label: "BG Rmv", icon: FiScissors, color: "text-violet-500", bg: "bg-violet-50" },
    imageEnhancer: { label: "Enhance", icon: FiStar, color: "text-cyan-500", bg: "bg-cyan-50" },
    assets: { label: "Assets", icon: FiLayers, color: "text-orange-500", bg: "bg-orange-50" },
    
    // 3. Utilities & Admin
    settings: { label: "Setngs", icon: FiSettings, color: "text-gray-500", bg: "bg-gray-100" },
    bugReport: { label: "Bug", icon: FiTool, color: "text-rose-500", bg: "bg-rose-50" },
    developer: { label: "Dev", icon: FiCode, color: "text-indigo-600", bg: "bg-indigo-50" },
};

const UserAvatar = ({ username }: { username: string }) => {
    const initial = username.charAt(0).toUpperCase();
    const colors = [ 'bg-red-100 text-red-600', 'bg-orange-100 text-orange-600', 'bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600', 'bg-purple-100 text-purple-600' ];
    const colorClass = colors[username.length % colors.length];
    return <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${colorClass}`}>{initial}</div>;
};

const DateBadge = ({ date }: { date?: string }) => {
    if (!date) return <span className="text-slate-300">-</span>;
    return (
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-700">{new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            <span className="text-[10px] text-slate-400">{new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    );
};

// --- MAIN COMPONENT ---
const UserTable: React.FC<UserTableProps> = ({
    filteredMembers, searchTerm, editingId, isApiLoading, visiblePasswordId,
    setSearchTerm, setVisiblePasswordId, handleAccessToggle, handleEdit, setIsConfirmingDelete,
}) => {
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-full"
        >
            {/* Table Toolbar */}
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">User Directory</h3>
                        <p className="text-xs text-slate-500 font-medium">{filteredMembers.length} active accounts</p>
                    </div>
                </div>

                <div className="relative group w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Filter by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        disabled={isApiLoading}
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User Profile</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Credentials</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline</th>
                            {/* Widen the Module Access Column */}
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[350px]">Module Access</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        <AnimatePresence>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((m) => (
                                    <motion.tr
                                        key={m._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`group transition-colors duration-200 ${editingId === m._id ? "bg-indigo-50/30" : "hover:bg-slate-50/50"}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar username={m.username} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{m.username}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono tracking-tight">ID: {m._id.substring(0, 6)}...</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
                                                <span className="font-mono text-xs text-slate-600 min-w-[60px]">
                                                    {visiblePasswordId === m._id ? m.password : "••••••••"}
                                                </span>
                                                <button 
                                                    onClick={() => setVisiblePasswordId(prevId => (prevId === m._id ? null : m._id))}
                                                    className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                                >
                                                    {visiblePasswordId === m._id ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <DateBadge date={m.createdAt} />
                                                <FiClock className="text-slate-200 w-4 h-4" />
                                            </div>
                                        </td>

                                        {/* MODULE ACCESS GRID - Updated for 4 columns */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {Object.entries(inlineAccessMap).map(([key, config]) => {
                                                        const isEnabled = m.access?.[key as keyof NonNullable<Member['access']>] || false;
                                                        return (
                                                            <motion.button
                                                                key={key}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleAccessToggle(m._id, key as any, !isEnabled)}
                                                                disabled={isApiLoading}
                                                                className={`
                                                                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                                                                    ${isEnabled 
                                                                        ? `${config.bg} ${config.color} shadow-sm border border-transparent` 
                                                                        : 'bg-slate-50 text-slate-300 border border-slate-100 hover:border-slate-300'
                                                                    }
                                                                `}
                                                                title={`${config.label} (${isEnabled ? 'Enabled' : 'Disabled'})`}
                                                            >
                                                                <config.icon className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(m)}
                                                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <FiEdit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setIsConfirmingDelete(m._id)}
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <FiSearch className="w-6 h-6" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Showing {filteredMembers.length} results</span>
                <span>End of list</span>
            </div>
        </motion.div>
    );
};

export default UserTable;