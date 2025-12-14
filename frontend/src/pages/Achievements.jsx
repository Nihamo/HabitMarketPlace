import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import { getUserAchievements } from '../services/gamification.service';
import { checkAndAwardAchievements } from '../services/user.service';
import { getCurrentUser } from '../services/auth.service';
import { BADGE_DEFINITIONS, getBadgeConfig } from '../lib/utils';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]); // List<AchievementDTO>
    const user = getCurrentUser();

    useEffect(() => {
        if (user) {
            // Trigger check first, then load
            checkAndAwardAchievements(user.id)
                .then(() => getUserAchievements(user.id))
                .then(setAchievements)
                .catch(console.error);
        }
    }, [user]);

    return (
        <Layout>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-display font-bold text-white mb-2">HALL OF FAME</h1>
                <p className="text-white/50">Badges earned through discipline.</p>
            </div>

            {achievements.length === 0 ? (
                <div className="text-center text-white/30 py-10 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    No achievements yet. Keep grinding.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {achievements.map((ach, i) => {
                        const config = getBadgeConfig(ach.badgeName);
                        const Icon = config.icon;
                        return (
                            <GlassPane key={i} className="flex flex-col items-center justify-center p-6 text-center" hoverEffect>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: i * 0.1 }}
                                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.from} ${config.to} flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
                                >
                                    <Icon size={32} className="text-white" />
                                </motion.div>
                                <h3 className="font-bold text-white mb-1">{ach.badgeName}</h3>
                                <p className="text-xs text-white/40">
                                    Earned: {new Date(ach.earnedAt).toLocaleDateString()}
                                </p>
                            </GlassPane>
                        );
                    })}
                </div>
            )}

            {/* BADGE CODEX */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold font-display text-white mb-6 text-center text-neon-cyan">CODEX: AVAILABLE BADGES</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {BADGE_DEFINITIONS.map((def, i) => (
                        <GlassPane key={i} className="flex items-center gap-4 p-4 border-white/5 bg-white/5">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${def.from} ${def.to} flex items-center justify-center bg-opacity-20`}>
                                <def.icon size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{def.name}</h3>
                                <p className="text-sm text-white/50">{def.description}</p>
                            </div>
                        </GlassPane>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Achievements;
