import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Check, Flame, RefreshCw, Lock } from 'lucide-react';
import { GlassPane } from '../ui/GlassPane';
import { cn } from '../../lib/utils';
import { checkInHabit, getHabitStreak } from '../../services/habit.service';

const HabitCard = ({ habit, userId, onCheckIn, onAdopt }) => {
    const [flipped, setFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [streak, setStreak] = useState(0);

    const isActive = habit.status === 'ACTIVE';
    // Logic: If I am NOT the owner, I can adopt it.
    // Ensure both are numbers or strings for comparison
    const isOwner = userId && habit.userId && (String(userId) === String(habit.userId));

    useEffect(() => {
        if (userId && habit.id) {
            getHabitStreak(habit.id, userId).then(setStreak).catch(console.error);
        }
    }, [userId, habit.id]);

    // Swipe Logic
    const x = useMotionValue(0);
    const backgroundArgs = useTransform(x, [-100, 0, 100], ["rgba(239,68,68,0.2)", "rgba(255,255,255,0)", "rgba(34,197,94,0.2)"]);
    const rotate = useTransform(x, [-100, 100], [-5, 5]);

    const handleDragEnd = async (event, info) => {
        // Swipe Right -> Check In (Only if Active and Owned)
        if (info.offset.x > 100) {
            if (!isActive || !userId) return; // Silent return if not active
            try {
                if (!completed) {
                    await checkInHabit(habit.id, userId);
                    setCompleted(true);
                    setStreak(s => s + 1);
                    if (onCheckIn) onCheckIn(habit.id);
                }
            } catch (err) {
                console.error("Check-in failed", err);
            }
        }
        // Swipe Left -> Flip (Always allowed to see details/adopt)
        else if (info.offset.x < -100) {
            setFlipped(!flipped);
        }
    };

    return (
        <div className="relative h-48 w-full perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-700"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* FRONT FACE */}
                <motion.div
                    style={{
                        x,
                        rotate: isActive ? rotate : 0,
                        background: backgroundArgs,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        position: 'absolute',
                        inset: 0,
                        zIndex: flipped ? 0 : 1,
                        opacity: flipped ? 0 : 1,
                        transition: 'opacity 0s 0.35s' // Switch visibility exactly halfway
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className={cn(
                        "rounded-2xl p-0",
                        (isActive || !isOwner) ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed grayscale"
                    )}
                >
                    <GlassPane className={cn(
                        "h-full flex flex-col justify-between border-l-4 transition-all duration-300 relative overflow-hidden",
                        completed ? "border-l-green-400 bg-green-500/5" : "border-l-neon-cyan hover:border-l-neon-purple"
                    )} hoverEffect={isActive} style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>

                        {!isActive && isOwner && (
                            <div className="absolute top-2 right-2 text-white/20">
                                <Lock size={16} />
                            </div>
                        )}

                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl font-bold text-neon-cyan">
                                    {habit.title ? habit.title.charAt(0).toUpperCase() : "H"}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-lg text-white truncate pr-2">{habit.title}</h3>
                                    <p className="text-xs text-white/40 truncate">{habit.description || 'No description'}</p>
                                </div>
                            </div>
                            {completed && <div className="bg-green-500/20 text-green-400 p-1 rounded-full"><Check size={16} /></div>}
                        </div>

                        <div className="flex items-center justify-between text-white/60 text-sm">
                            <div className={cn("flex items-center gap-1 transition-colors", streak > 0 ? "text-orange-400" : "text-white/30")}>
                                <motion.div animate={streak > 0 ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <Flame size={16} fill={streak > 0 ? "currentColor" : "none"} />
                                </motion.div>
                                <span>{streak} Day Streak</span>
                            </div>
                            <div className="text-xs text-white/30 uppercase tracking-wider">
                                {habit.status || 'ACTIVE'}
                            </div>
                        </div>

                        {/* Celebration Overlay */}
                        <AnimatePresence>
                            {completed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.5 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="text-6xl filter drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">✨</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassPane>
                </motion.div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0"
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        opacity: flipped ? 1 : 0,
                        transition: 'opacity 0s 0.35s' // Switch visibility exactly halfway
                    }}
                >
                    <GlassPane className="h-full flex flex-col justify-between items-center text-center bg-black border border-white/10 p-3" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
                        <div>
                            <div className="text-[9px] text-neon-gold uppercase tracking-widest leading-none mb-1">DETAILS</div>
                            <h4 className="text-white font-bold leading-tight line-clamp-1 px-1">{habit.title}</h4>
                        </div>

                        <p className="text-[10px] text-white/50 px-2 line-clamp-3 leading-snug">{habit.description || 'No description available.'}</p>

                        <div className="grid grid-cols-2 gap-2 w-full px-2">
                            <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                                <div className="text-[9px] text-white/40 uppercase">Duration</div>
                                <div className="font-bold text-white text-sm">{habit.durationDays} Days</div>
                            </div>
                            <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                                <div className="text-[9px] text-white/40 uppercase">Streak</div>
                                <div className="font-bold text-white text-sm">{streak}</div>
                            </div>
                        </div>

                        <div className="flex w-full gap-2 px-2 mt-auto">
                            <button
                                onClick={() => setFlipped(false)}
                                className="flex-1 text-[10px] text-white/30 hover:text-white flex items-center justify-center gap-1 transition-colors py-1 rounded bg-white/5 hover:bg-white/10"
                            >
                                <RefreshCw size={10} /> Flip Back
                            </button>

                            {!isOwner && onAdopt && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onAdopt(); }}
                                    className="flex-1 text-[10px] bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/40 font-bold uppercase tracking-wider py-1 rounded transition-colors"
                                >
                                    Adopt
                                </button>
                            )}
                        </div>
                    </GlassPane>
                </div>
            </motion.div>
        </div>
    );
};

export default HabitCard;
