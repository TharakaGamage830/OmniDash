import { LayoutDashboard, Package, Inbox, History, LogOut, ListFilter, Users, X, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const { logout } = useAuth();

    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/products', icon: Package, label: 'Products' },
        { to: '/categories', icon: ListFilter, label: 'Categories' },
        { to: '/inventory', icon: Inbox, label: 'Inventory' },
        { to: '/history', icon: History, label: 'History' },
        { to: '/admins', icon: Users, label: 'Admins' },
        { to: '/settings', icon: User, label: 'Settings' },
    ];

    return (
        <aside className="w-64 lg:w-72 bg-slate-900 h-screen flex flex-col p-6 text-slate-400 relative shadow-2xl border-r border-slate-800 lg:border-none">
            <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white shadow-xl backdrop-blur-md transition-all active:scale-95 z-20"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-12 px-2 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden ring-4 ring-slate-800 shadow-2xl shrink-0">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-white font-black text-base tracking-tight leading-none uppercase italic truncate">Anu's Touch</span>
                    <span className="text-[10px] text-indigo-400 font-black tracking-[0.3em] uppercase mt-1 truncate">Admin Panel</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-hide">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 font-bold scale-[1.02]' : 'hover:bg-slate-800 hover:text-white active:scale-95'
                            }`
                        }
                    >
                        <link.icon className={`w-5 h-5 ${link.label === 'Dashboard' ? 'stroke-[2.5px]' : ''}`} />
                        <span className="text-sm tracking-wide">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-500 active:scale-95"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
