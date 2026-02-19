// D:\studiosadmin\studiosadmin\components\dashboard\MockChart.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, FiPieChart, FiMoreHorizontal, FiActivity, FiLayers 
} from "react-icons/fi";

// --- INTERFACE DEFINITIONS ---
interface MockChartProps {
  title: string;
  type: string;
  data: any; // Expected format: { [key: string]: number }
  color: string;
  dataType: 'distribution' | 'memberUsage';
}

// Helper to map keys to readable labels and colors (matching the main page)
const getModuleConfig = (key: string) => {
  const config: { [k: string]: { label: string; color: string } } = {
    posterEditor: { label: 'Poster Editor', color: 'bg-pink-500' },
    certificateEditor: { label: 'Certificate Editor', color: 'bg-blue-500' },
    visitingCard: { label: 'Visiting Card', color: 'bg-amber-500' },
    idCard: { label: 'ID Card Generator', color: 'bg-emerald-500' },
    bgRemover: { label: 'Background Remover', color: 'bg-violet-500' },
    imageEnhancer: { label: 'Image Enhancer', color: 'bg-cyan-500' },
  };
  return config[key] || { label: key, color: 'bg-slate-500' };
};

const MockChart: React.FC<MockChartProps> = ({ title, data, dataType }) => {
  
  // 1. Process Data for Visualization
  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];
    
    // Convert object to array
    const items = Object.entries(data).map(([key, value]) => ({
      key,
      value: Number(value),
      ...getModuleConfig(key)
    }));

    // Sort by value (descending) for better visual flow
    return items.sort((a, b) => b.value - a.value);
  }, [data]);

  // Calculate max value to normalize bar widths
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(d => d.value), 1); // Avoid div by zero
  }, [chartData]);

  const totalUsers = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  // --- RENDERING ---
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            {dataType === 'distribution' ? <FiPieChart className="w-5 h-5"/> : <FiBarChart2 className="w-5 h-5"/>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
               Total Active Permissions: <span className="text-indigo-600 font-bold">{totalUsers}</span>
            </p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <FiMoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Chart Body */}
      <div className="flex-1 p-6 flex flex-col justify-center min-h-[250px] bg-slate-50/30">
        
        {chartData.length > 0 ? (
          <div className="space-y-5">
            {chartData.map((item, index) => {
              // Calculate width percentage relative to the highest value
              const percentage = Math.round((item.value / maxValue) * 100);

              return (
                <div key={item.key} className="relative group">
                  {/* Label Row */}
                  <div className="flex justify-between items-end mb-2 text-xs font-semibold">
                    <span className="text-slate-600 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                       {item.label}
                    </span>
                    <span className="text-slate-800">
                      {item.value} <span className="text-slate-400 font-normal">users</span>
                    </span>
                  </div>

                  {/* Bar Background */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                    {/* Animated Bar Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, type: "spring", stiffness: 50 }}
                      className={`h-full rounded-full ${item.color} opacity-90 relative`}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center h-full opacity-60">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <FiLayers className="w-8 h-8 text-slate-400" />
             </div>
             <p className="text-sm font-bold text-slate-500">No Data Available</p>
             <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
               Assign modules to users to see analytics here.
             </p>
          </div>
        )}

      </div>
      
      {/* Footer / Legend area (Optional) */}
      <div className="px-6 py-3 border-t border-slate-100 bg-white text-[10px] text-slate-400 font-medium flex justify-between items-center">
         <span className="flex items-center gap-1"><FiActivity className="text-emerald-500"/> Live Data</span>
         <span>Updated just now</span>
      </div>
    </div>
  );
};

export default MockChart;