import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import { getCurrentUser } from '../services/auth.service';
import { getUserHabits, getHabitProgress } from '../services/habit.service';
import { getUserStats } from '../services/user.service';

const Analytics = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [weeklyData, setWeeklyData] = useState(new Array(7).fill(0));
    const [stats, setStats] = useState({});

    // Helper to format Date object to YYYY-MM-DD (Local Time)
    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            loadAnalytics(user.id);
        }
    }, []);

    const loadAnalytics = async (userId) => {
        try {
            // 1. Get User Stats
            const userStats = await getUserStats(userId);
            setStats(userStats);

            // 2. Get All Habits -> Get All Progress
            const habits = await getUserHabits(userId);
            let enrichedProgress = [];

            // Parallel fetch & Enrich with Title
            await Promise.all(habits.map(async (h) => {
                const prog = await getHabitProgress(h.id, userId);
                // Attach habit title to each progress entry
                const withTitle = prog.map(p => ({ ...p, habitTitle: h.title }));
                enrichedProgress = [...enrichedProgress, ...withTitle];
            }));

            // 3. Process Calendar Data (Map: Date -> Array of Titles)
            // We want to show the current month
            const progressMap = {};
            enrichedProgress.forEach(p => {
                // Ensure backend date is YYYY-MM-DD
                const dateKey = String(p.date).substring(0, 10);
                if (!progressMap[dateKey]) progressMap[dateKey] = [];
                progressMap[dateKey].push(p.habitTitle);
            });
            setHeatmapData(progressMap);

            // 4. Process Weekly Data (Last 7 days Rolling)
            const today = new Date();
            const last7Days = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);

                const dateKey = formatDateKey(d); // Uses Local Time

                // Format Label: "Mon 15"
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const label = `${dayName} ${dayNum}`;

                const count = enrichedProgress.filter(p => {
                    const pDate = String(p.date).substring(0, 10);
                    return pDate === dateKey;
                }).length;

                last7Days.push({ label, value: count, fullDate: dateKey });
            }

            // Normalize for graph height
            const maxVal = Math.max(...last7Days.map(d => d.value), 1);
            const normalizedGraph = last7Days.map(d => ({
                ...d,
                height: Math.round((d.value / maxVal) * 100)
            }));

            setWeeklyData(normalizedGraph);

        } catch (err) {
            console.error(err);
        }
    };

    // Helper to generate calendar grid for current month
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0-6

    // Create array of empty slots for padding + days
    const calendarGrid = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarGrid.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        calendarGrid.push({
            day: i,
            dateKey: formatDateKey(d) // Uses Local Time
        });
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white">Neural Analytics</h1>
                <p className="text-white/50">Performance metrics and growth tracking.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart (Rolling 7 Days) */}
                <GlassPane className="h-auto min-h-[22rem] flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6">Activity by Day</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 h-64">
                        {weeklyData.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group">
                                <div className="relative w-full flex justify-center items-end h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.height}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="w-full max-w-[40px] bg-gradient-to-t from-primary-start to-neon-cyan rounded-t-lg relative min-h-[4px] group-hover:opacity-80 transition-opacity"
                                    >
                                        {/* Tooltip for Value */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {item.value}
                                        </div>
                                    </motion.div>
                                </div>
                                <span className="text-[10px] md:text-xs text-white/40 text-center whitespace-nowrap">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </GlassPane>

                {/* Calendar View */}
                <GlassPane className="h-auto min-h-[22rem] flex flex-col relative overflow-visible">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Monthly Consistency</h3>
                        <span className="text-xs text-white/40">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 mb-2 text-center text-xs text-white/30">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 flex-grow content-start">
                        {calendarGrid.map((cell, i) => {
                            if (!cell) return <div key={i} />; // Empty slot

                            const habits = heatmapData[cell.dateKey] || [];
                            const hasActivity = habits.length > 0;

                            return (
                                <div key={i} className="relative group aspect-square">
                                    <div className={`w-full h-full rounded-lg flex items-center justify-center text-xs transition-all duration-300
                                        ${hasActivity
                                            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(114,245,255,0.1)]'
                                            : 'bg-white/5 text-white/20 hover:bg-white/10'}`
                                    }>
                                        {cell.day}
                                    </div>

                                    {/* Hover Tooltip - Shows List of Habits */}
                                    {hasActivity && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl">
                                                <div className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">{cell.dateKey}</div>
                                                <div className="space-y-1">
                                                    {habits.map((h, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-xs text-white">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                                            <span className="truncate">{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </GlassPane>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                {/* Real Stats from DTO */}
                <StatCard title="Completion Rate" value={`${stats.habitCompletionRate || 0}%`} sparkline="📈" />
                <StatCard title="Active Habits" value={stats.activeHabits || 0} sparkline="⚡" />
                <StatCard title="Best Streak" value={`${stats.longestStreak || 0} days`} sparkline="🔥" />
                <StatCard title="Total Days" value={stats.totalCompletedDays || 0} sparkline="📅" />
            </div>
        </Layout>
    );
};

const StatCard = ({ title, value, sparkline }) => (
    <motion.div whileHover={{ y: -5 }}>
        <GlassPane className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-neon-cyan/10 transition-colors" />
            <div className="text-white/50 text-sm mb-1 uppercase tracking-wider relative z-10">{title}</div>
            <div className="text-3xl font-bold text-white flex gap-2 items-center relative z-10">
                {value} <span className="text-lg filter drop-shadow-md animate-pulse">{sparkline}</span>
            </div>
        </GlassPane>
    </motion.div>
);

export default Analytics;
