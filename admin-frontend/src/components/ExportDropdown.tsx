import React, { useState } from 'react';
import { FileText, Download, ChevronDown } from 'lucide-react';

interface ExportDropdownProps {
    onExportCSV: () => void;
    onExportPDF: () => void;
    disabled?: boolean;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExportCSV, onExportPDF, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <button
                            onClick={() => { onExportPDF(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={() => { onExportCSV(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download CSV
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
