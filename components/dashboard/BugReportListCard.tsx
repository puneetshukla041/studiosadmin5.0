// BugReportListCard.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiStar, FiAlertCircle, FiX, FiCheckCircle, FiSend, FiMessageSquare, 
    FiUser, FiClock, FiActivity, FiArchive, FiInbox
} from "react-icons/fi"; 

// --- INTERFACE DEFINITION ---
interface BugReport {
    _id: string;
    userId: string;
    title: string;
    username: string; 
    description: string;
    rating: number;
    status: string; 
    createdAt: string; 
    resolutionMessage?: string; 
}

interface BugReportListCardProps {
    reports: BugReport[];
    onResolveReport: (reportId: string, resolutionMessage: string) => Promise<void>; 
}

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
    let styles = "";
    let icon = null;

    switch (status) {
        case "Open": 
            styles = "bg-red-100 text-red-700 border-red-200";
            icon = <FiAlertCircle className="w-3 h-3" />;
            break;
        case "In Progress": 
            styles = "bg-amber-100 text-amber-700 border-amber-200";
            icon = <FiActivity className="w-3 h-3" />;
            break;
        case "Resolved": 
            styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
            icon = <FiCheckCircle className="w-3 h-3" />;
            break;
        case "Closed": 
            styles = "bg-slate-100 text-slate-500 border-slate-200";
            icon = <FiArchive className="w-3 h-3" />;
            break;
        default: 
            styles = "bg-gray-100 text-gray-500 border-gray-200";
    }

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles}`}>
            {icon} {status}
        </span>
    );
};

const UserAvatar = ({ name }: { name: string }) => {
    // Generate initials
    const initials = name 
        ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
        : '??';
        
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {initials}
        </div>
    );
};

// --- MAIN COMPONENT ---

const BugReportListCard: React.FC<BugReportListCardProps> = ({ reports, onResolveReport }) => {
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [resolutionMessage, setResolutionMessage] = useState('');
    const [isResolving, setIsResolving] = useState(false);

    const selectedReport = useMemo(() => reports.find(r => r._id === selectedReportId), [reports, selectedReportId]);
    
    // Sort logic
    const sortedReports = useMemo(() => {
        const statusOrder: { [key: string]: number } = { "Open": 1, "In Progress": 2, "Resolved": 3, "Closed": 4 };
        return [...reports].sort((a, b) => {
            const statusA = statusOrder[a.status] || 5;
            const statusB = statusOrder[b.status] || 5;
            if (statusA !== statusB) return statusA - statusB;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [reports]);

    const getRatingStars = (rating: number) => (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <FiStar key={i} className={`w-3 h-3 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
        </div>
    );

    const closeModal = useCallback(() => {
        setSelectedReportId(null);
        setResolutionMessage('');
    }, []);

    const handleResolve = useCallback(async () => {
        if (!selectedReport || resolutionMessage.trim().length === 0) return;
        setIsResolving(true);
        try {
            await onResolveReport(selectedReport._id, resolutionMessage);
            closeModal();
        } catch (error) {
            console.error("Error resolving bug report:", error);
        } finally {
            setIsResolving(false);
        }
    }, [selectedReport, resolutionMessage, onResolveReport, closeModal]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 h-full overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                                <FiAlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-800">Issue Tracker</h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    {reports.filter(r => r.status === 'Open').length} Open Tickets
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-100">
                            Total: {reports.length}
                        </div>
                    </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {reports.length > 0 ? (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-3"
                        >
                            {sortedReports.map((report) => (
                                <motion.div 
                                    key={report._id} 
                                    variants={itemVariants}
                                    layoutId={`card-${report._id}`}
                                    onClick={() => setSelectedReportId(report._id)}
                                    className="group relative bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={report.username} />
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                    {report.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={report.status} />
                                    </div>

                                    <div className="pl-[44px]"> {/* Align with text, skipping avatar */}
                                        <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            {report.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            {getRatingStars(report.rating)}
                                            <span className="text-[10px] font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                View Details <FiSend className="w-3 h-3 rotate-45" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <FiInbox className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm font-medium">All clear! No bug reports found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div 
                            layoutId={`card-${selectedReport._id}`}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="pt-1">
                                        <UserAvatar name={selectedReport.username} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{selectedReport.title}</h2>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="font-semibold text-slate-700">{selectedReport.username}</span>
                                            <span>•</span>
                                            <span>{new Date(selectedReport.createdAt).toLocaleString()}</span>
                                            <span>•</span>
                                            {getRatingStars(selectedReport.rating)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button onClick={closeModal} className="p-2 bg-white rounded-full hover:bg-slate-200 transition-colors">
                                        <FiX className="w-5 h-5 text-slate-500" />
                                    </button>
                                    <StatusBadge status={selectedReport.status} />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto bg-white">
                                <div className="prose prose-sm max-w-none">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedReport.description}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    {(selectedReport.status === 'Resolved' || selectedReport.status === 'Closed') ? (
                                        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                                            <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                                <FiCheckCircle className="fill-emerald-200 text-emerald-600" /> Official Resolution
                                            </h4>
                                            <p className="text-sm text-emerald-900/80">
                                                {selectedReport.resolutionMessage || "No resolution message recorded."}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-white">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2 flex items-center gap-2">
                                                <FiMessageSquare /> Resolution Action
                                            </h4>
                                            <textarea 
                                                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm resize-none placeholder:text-slate-300"
                                                rows={4}
                                                placeholder="Describe the fix or solution provided to the user..."
                                                value={resolutionMessage}
                                                onChange={(e) => setResolutionMessage(e.target.value)}
                                                disabled={isResolving}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                                <button 
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Close
                                </button>
                                {selectedReport.status !== 'Resolved' && selectedReport.status !== 'Closed' && (
                                    <button 
                                        onClick={handleResolve}
                                        disabled={isResolving || !resolutionMessage.trim()}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                                    >
                                        {isResolving ? <FiClock className="animate-spin"/> : <FiSend />}
                                        Resolve Ticket
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BugReportListCard;