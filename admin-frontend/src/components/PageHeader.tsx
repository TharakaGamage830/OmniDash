import React from 'react';

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    welcome?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, welcome = true }) => {
    return (
        <div className="mb-10">
            {welcome && (
                <div className="flex flex-col gap-1 mb-4">
                    <h2 className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em] opacity-80">
                        Admin Dashboard
                    </h2>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Admin</span>
                    </h1>
                </div>
            )}
            <div className="flex flex-col gap-2">
                {title && <h3 className="text-2xl font-bold text-slate-800 italic">{title}</h3>}
                {subtitle && <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">{subtitle}</p>}
                {!subtitle && welcome && <p className="text-slate-500 font-medium text-lg leading-relaxed">Here's what's happening with Anu's Touch today.</p>}
            </div>
            <div className="h-1 w-20 bg-indigo-600 rounded-full mt-6 opacity-20" />
        </div>
    );
};
