// D:\studiosadmin\studiosadmin\components\dashboard\QuickMetrics.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiGrid, FiStar, FiDatabase, FiArrowUpRight } from "react-icons/fi";

// --- TYPES ---
interface StorageData {
    usedStorageKB: number;
    usedStorageMB: number;
    totalStorageMB: number;
}

interface MemberStats {
    totalMembers: number;
    totalUsageMinutes: string;
    accessDistribution: { [key: string]: number };
}

interface QuickMetricsProps {
    memberStats: MemberStats;
    storageUsedData: StorageData | null;
    storageUsagePercentage: number;
}

// --- SUB-COMPONENTS ---

// 1. Standard Metric Card
const MetricCard = ({ 
    label, 
    value, 
    icon: Icon, 
    color, 
    bgColor,
    borderColor 
}: { 
    label: string; 
    value: string | number; 
    icon: any; 
    color: string; 
    bgColor: string;
    borderColor: string;
}) => (
    <motion.div 
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`bg-white p-5 rounded-2xl border ${borderColor} shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden group`}
    >
        {/* Decorative Background Blob */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgColor} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />

        <div className="relative z-10 flex items-start justify-between">
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <h4 className="text-3xl font-extrabold text-slate-800 tracking-tight tabular-nums">
                    {value}
                </h4>
            </div>
            <div className={`p-3 rounded-xl ${bgColor} ${color} shadow-inner`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </motion.div>
);

// 2. Storage Card (Special Layout)
const StorageCard = ({ 
    data, 
    percentage 
}: { 
    data: StorageData | null; 
    percentage: number; 
}) => {
    // Determine color based on usage
    const isCritical = percentage > 90;
    const isWarning = percentage > 75;
    
    let colorClass = "from-emerald-400 to-emerald-600";
    let bgClass = "bg-emerald-500";
    if (isWarning) { colorClass = "from-amber-400 to-amber-600"; bgClass = "bg-amber-500"; }
    if (isCritical) { colorClass = "from-red-400 to-red-600"; bgClass = "bg-red-500"; }

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Cloud Storage</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-extrabold text-slate-800 tabular-nums">
                            {data ? data.usedStorageMB.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">MB</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl bg-violet-50 text-violet-600`}>
                    <FiDatabase className="w-6 h-6" />
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, type: "spring", bounce: 0 }}
                        className={`h-full rounded-full bg-gradient-to-r ${colorClass} shadow-lg`}
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>{percentage.toFixed(1)}% Used</span>
                    <span>{data?.totalStorageMB || 512} MB Total</span>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---

const QuickMetrics: React.FC<QuickMetricsProps> = ({ memberStats, storageUsedData, storageUsagePercentage }) => {
    
    // Animation Stagger
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 lg:col-span-1 h-fit"
        >
            {/* 1. Members */}
            <motion.div variants={item}>
                <MetricCard 
                    label="Total Members"
                    value={memberStats.totalMembers}
                    icon={FiUsers}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    borderColor="border-indigo-100"
                />
            </motion.div>

            {/* 2. Usage Time */}
            <motion.div variants={item}>
                <MetricCard 
                    label="Total Minutes"
                    value={memberStats.totalUsageMinutes}
                    icon={FiClock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
            </motion.div>

            {/* 3. Storage (Complex Card) */}
            <motion.div variants={item}>
                <StorageCard 
                    data={storageUsedData}
                    percentage={storageUsagePercentage}
                />
            </motion.div>

            {/* 4. Feature Usage */}
            <motion.div variants={item}>
                <MetricCard 
                    label="AI Enhancements"
                    value={memberStats.accessDistribution['Image Enhancer'] || 0}
                    icon={FiStar}
                    color="text-pink-600"
                    bgColor="bg-pink-50"
                    borderColor="border-pink-100"
                />
            </motion.div>

        </motion.div>
    );
};

export default QuickMetrics;