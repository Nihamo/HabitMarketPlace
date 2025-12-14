import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Home, Zap, Trophy, BarChart2, Plus, LogOut, CreditCard, User, Menu, X, Award } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getCurrentUser, logout } from '../../services/auth.service';
import { getUserProfile } from '../../services/user.service';
import { GlassPane } from '../ui/GlassPane';
import { NeonButton } from '../ui/NeonButton';

export const Layout = ({ children }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const location = useLocation();
    const user = getCurrentUser();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Fetch full profile for Avatar
        if (user) {
            getUserProfile(user.id).then(setUserProfile).catch(console.error);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [user?.id]);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans selection:bg-neon-cyan/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-start/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="bg-particles opacity-30 fixed inset-0" />
            </div>

            {/* Navbar */}
            {user && (
                <motion.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                        (scrolled || mobileMenuOpen) && "bg-black/60 backdrop-blur-xl border-white/5"
                    )}
                >
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link to="/dashboard" className="text-xl font-bold font-display tracking-wider flex items-center gap-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">HABIT NEXUS</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <NavIcon to="/dashboard" icon={Home} label="Focus" active={location.pathname === '/dashboard'} />
                            <NavIcon to="/habits" icon={Zap} label="Market" active={location.pathname === '/habits'} />
                            <NavIcon to="/analytics" icon={BarChart2} label="Analytics" active={location.pathname === '/analytics'} />
                            <NavIcon to="/leaderboard" icon={Trophy} label="Rankings" active={location.pathname === '/leaderboard'} />
                            <NavIcon to="/achievements" icon={Award} label="Achievements" active={location.pathname === '/achievements'} />
                            <NavIcon to="/shop" icon={CreditCard} label="Shop" active={location.pathname === '/shop'} />

                            {/* Profile Link with Avatar */}
                            <Link to="/profile" className={cn(
                                "flex items-center gap-2 px-3 py-1 rounded-full transition-all",
                                location.pathname === '/profile' ? "bg-white/10" : "hover:bg-white/5"
                            )}>
                                <div className="w-8 h-8 rounded-full bg-neon-cyan/20 overflow-hidden ring-1 ring-white/20">
                                    {userProfile?.profilePictureUrl ? (
                                        <img src={userProfile.profilePictureUrl} alt="Me" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-white">
                                            <User size={14} />
                                        </div>
                                    )}
                                </div>
                                <span className={cn("text-sm font-bold", location.pathname === '/profile' ? "text-white" : "text-white/50")}>
                                    Profile
                                </span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="ml-4 p-2 text-white/50 hover:text-red-400 transition-colors"
                                title="Disconnect"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Mobile Nav Overlay */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
                            >
                                <div className="p-4 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-2">
                                        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                                            {userProfile?.profilePictureUrl && <img src={userProfile.profilePictureUrl} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{userProfile?.username || user.username}</div>
                                            <div className="text-xs text-white/50">{user.email}</div>
                                        </div>
                                    </div>

                                    <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                                    <MobileNavLink to="/habits" onClick={() => setMobileMenuOpen(false)}>Marketplace</MobileNavLink>
                                    <MobileNavLink to="/analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</MobileNavLink>
                                    <MobileNavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>Leaderboard</MobileNavLink>
                                    <MobileNavLink to="/achievements" onClick={() => setMobileMenuOpen(false)}>Achievements</MobileNavLink>
                                    <MobileNavLink to="/shop" onClick={() => setMobileMenuOpen(false)}>Cyber Shop</MobileNavLink>
                                    <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</MobileNavLink>
                                    <button onClick={handleLogout} className="text-left py-3 text-red-400 font-bold">DISCONNECT</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            )}

            {/* Main Content */}
            <main className={cn(
                "relative z-10 w-full min-h-screen px-4 pb-20 max-w-7xl mx-auto",
                user ? "pt-24" : "pt-0 flex items-center justify-center"
            )}>
                {children}
            </main>
        </div>
    );
};

const NavIcon = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className="group relative flex flex-col items-center">
        <div className={cn(
            "p-2 rounded-xl transition-all duration-300",
            active ? "bg-neon-cyan/20 text-neon-cyan shadow-[0_0_15px_rgba(114,245,255,0.3)]" : "text-white/40 group-hover:text-white"
        )}>
            <Icon size={20} />
        </div>
        {active && (
            <motion.div layoutId="nav-glow" className="absolute -bottom-2 w-1 h-1 rounded-full bg-neon-cyan" />
        )}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block py-3 text-lg font-display text-white/80 border-b border-white/5 hover:text-neon-cyan hover:pl-2 transition-all"
    >
        {children}
    </Link>
);
