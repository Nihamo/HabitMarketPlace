import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import { getLeaderboard, getUserProfile } from '../services/user.service';
import { Crown, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await getLeaderboard();
            const resolvedData = await Promise.all(data.map(async (entry) => {
                try {
                    const profile = await getUserProfile(entry.userId);
                    return { ...entry, profilePictureUrl: profile.profilePictureUrl };
                } catch (e) {
                    return entry;
                }
            }));
            setLeaderboard(resolvedData);
        } catch (e) {
            console.error(e);
        }
    };

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    const first = top3[0];
    const second = top3[1];
    const third = top3[2];

    return (
        <Layout>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-display font-bold text-white mb-2">NEURAL RANKINGS</h1>
                <p className="text-white/50">Top high-performance agents.</p>
            </div>

            {/* PODIUM SECTION */}
            {leaderboard.length > 0 && (
                <div className="flex justify-center items-end gap-8 mb-16 mt-12 max-w-4xl mx-auto px-4 min-h-[24rem] relative">
                    {/* Spotlight Effect */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-neon-cyan/10 blur-[100px] rounded-full pointer-events-none" />

                    {/* 2nd Place (Left) */}
                    <div className="flex flex-col items-center justify-end flex-1 z-10">
                        {second && (
                            <Link to={`/profile/${second.userId}`} className="flex flex-col items-center w-full group">
                                <div className="relative mb-2">
                                    <Avatar src={second.profilePictureUrl} name={second.username} size="md" borderColor="border-slate-300" className="group-hover:ring-4 ring-slate-300/30 transition-all" />
                                    <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1 border border-slate-500">
                                        <Medal size={16} className="text-slate-300" />
                                    </div>
                                </div>
                                <div className="text-white font-bold truncate max-w-full text-sm mb-1 group-hover:text-neon-cyan transition-colors">{second.username}</div>
                                <div className="text-neon-cyan/80 font-mono text-xs mb-2">{second.coins} CR</div>
                                <div className="w-full bg-gradient-to-t from-slate-500/20 to-slate-500/5 backdrop-blur-sm border-t border-slate-500/50 rounded-t-lg h-32 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white/20">2</span>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* 1st Place (Center) */}
                    <div className="flex flex-col items-center justify-end flex-1 z-20">
                        {first && (
                            <Link to={`/profile/${first.userId}`} className="flex flex-col items-center w-full pb-8 group">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="mb-1"
                                >
                                    <Crown size={32} className="text-neon-gold fill-neon-gold/20" />
                                </motion.div>
                                <div className="relative mb-3">
                                    <Avatar src={first.profilePictureUrl} name={first.username} size="lg" borderColor="border-neon-gold" glow="shadow-[0_0_20px_rgba(255,215,0,0.5)]" className="group-hover:ring-4 ring-neon-gold/30 transition-all" />
                                    <div className="absolute -bottom-1 -right-1 bg-amber-950 rounded-full p-1 border border-neon-gold">
                                        <Medal size={20} className="text-neon-gold fill-neon-gold/20" />
                                    </div>
                                </div>
                                <div className="text-white font-bold text-lg mb-1 group-hover:text-neon-gold transition-colors">{first.username}</div>
                                <div className="text-neon-gold font-bold font-mono text-sm mb-3">{first.coins} CR</div>
                                <div className="w-full bg-gradient-to-t from-neon-gold/20 to-neon-gold/5 backdrop-blur-md border-t border-neon-gold/50 rounded-t-xl h-48 flex items-center justify-center relative overflow-hidden shadow-[0_-4px_20px_rgba(255,215,0,0.1)]">
                                    <div className="absolute inset-0 bg-neon-gold/10 animate-pulse" />
                                    <span className="text-5xl font-bold text-white/30 relative z-10">1</span>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* 3rd Place (Right) */}
                    <div className="flex flex-col items-center justify-end flex-1 z-10">
                        {third && (
                            <Link to={`/profile/${third.userId}`} className="flex flex-col items-center w-full group">
                                <div className="relative mb-2">
                                    <Avatar src={third.profilePictureUrl} name={third.username} size="md" borderColor="border-orange-700" className="group-hover:ring-4 ring-orange-700/30 transition-all" />
                                    <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1 border border-orange-700">
                                        <Medal size={16} className="text-orange-400" />
                                    </div>
                                </div>
                                <div className="text-white font-bold truncate max-w-full text-sm mb-1 group-hover:text-neon-cyan transition-colors">{third.username}</div>
                                <div className="text-neon-cyan/80 font-mono text-xs mb-2">{third.coins} CR</div>
                                <div className="w-full bg-gradient-to-t from-orange-900/40 to-orange-900/10 backdrop-blur-sm border-t border-orange-700/50 rounded-t-lg h-24 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white/20">3</span>
                                </div>
                            </Link>
                        )}
                    </div>

                </div>
            )}

            {/* REST OF LIST */}
            <div className="max-w-2xl mx-auto space-y-4">
                {rest.map((entry, index) => (
                    <Link to={`/profile/${entry.userId}`} key={entry.userId} className="block group">
                        <GlassPane className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors relative overflow-hidden group-hover:border-neon-cyan/30">
                            <div className="w-12 text-center font-display font-medium text-lg text-white/50">
                                #{index + 4}
                            </div>
                            <Avatar src={entry.profilePictureUrl} name={entry.username} size="sm" />
                            <div className="flex-1">
                                <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">{entry.username}</h3>
                                <div className="text-xs text-white/40 font-mono">ID: {entry.userId}</div>
                            </div>
                            <div className="text-right font-bold text-neon-cyan">
                                {entry.coins} <span className="text-xs text-white/40">CR</span>
                            </div>
                        </GlassPane>
                    </Link>
                ))}

                {leaderboard.length === 0 && (
                    <div className="text-center text-white/30 py-12">
                        System calculating rankings...
                    </div>
                )}
            </div>
        </Layout>
    );
};

const Avatar = ({ src, name, size = 'md', borderColor = 'border-white/20', glow = '', className = '' }) => {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-black/40 border-2 ${borderColor} ${glow} overflow-hidden flex items-center justify-center ${className}`}>
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className="font-bold text-white/50 text-xl">{name?.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
};

export default Leaderboard;
