import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import HabitCard from '../components/habits/HabitCard';
import { getCurrentUser } from '../services/auth.service';
import { getUserStats, getUserCoins } from '../services/user.service';
import { getUserHabits } from '../services/habit.service';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({});
    const [coins, setCoins] = useState(0);
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            loadData(currentUser.id);
        } else {
            // Need redirects if not handled by PrivateRoute
        }
    }, []);

    const loadData = async (userId) => {
        try {
            const [statsData, habitsData, coinsData] = await Promise.all([
                getUserStats(userId).catch(err => { console.error("Stats Error", err); return {}; }),
                getUserHabits(userId).catch(err => { console.error("Habits Error", err); return []; }),
                getUserCoins(userId).catch(err => { console.error("Coins Error", err); return 0; })
            ]);
            setStats(statsData);
            setHabits(habitsData);
            setCoins(coinsData);
        } catch (e) {
            console.error("Dashboard Load Error", e);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-2">
                        Welcome back, <span className="text-neon-cyan">{user?.username || 'Agent'}</span> 👋
                    </h1>
                    <p className="text-white/60">Your evolution continues.</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {/* Map DTO: longestStreak */}
                    <StatBox label="Best Streak" value={stats.longestStreak || 0} icon="🔥" color="text-orange-500" />

                    {/* Map Coins */}
                    <StatBox label="Credits" value={coins || 0} icon="💎" color="text-neon-cyan" />

                    {/* Map DTO: completedHabits */}
                    <StatBox label="Completed" value={stats.completedHabits || 0} icon="✅" color="text-neon-purple" />

                    {/* Map DTO: totalCompletedDays (Total Checkins) */}
                    <StatBox label="Total Days" value={stats.totalCompletedDays || 0} icon="📅" color="text-neon-gold" />
                </motion.div>

                {/* Active Habits */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Active Habits</h2>
                        <span className="text-xs text-white/40 animate-pulse hidden md:block">Swipe Right to Check In &bull; Swipe Left for Details</span>
                        <span className="text-xs text-white/40 animate-pulse md:hidden">Swipe Right to Check In &bull; Swipe Left for Details</span>
                    </div>

                    {loading ? (
                        <div className="text-white/30 text-center py-10">Syncing neural link...</div>
                    ) : habits.length === 0 ? (
                        <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-white/50 mb-4">No active habits found.</p>
                            <button className="text-neon-cyan font-semibold">Explore Marketplace</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {habits.map((habit, i) => (
                                <HabitCard key={habit.id || i} habit={habit} userId={user?.id} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};

const StatBox = ({ label, value, icon, color }) => (
    <motion.div
        variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <GlassPane hoverEffect={true} className="flex flex-col items-center justify-center py-6 cursor-default group">
            <div className="text-3xl mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-float">{icon}</div>
            <div className={`text-3xl font-bold font-display ${color} drop-shadow-md`}>{value}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest mt-1 group-hover:text-white/70 transition-colors">{label}</div>
        </GlassPane>
    </motion.div>
);

export default Dashboard;
