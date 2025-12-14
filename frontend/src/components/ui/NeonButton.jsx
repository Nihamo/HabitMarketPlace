import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const NeonButton = ({ children, variant = 'primary', className, onClick, ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-primary-start to-primary-mid text-white shadow-[0_0_15px_rgba(168,116,240,0.5)] hover:shadow-[0_0_25px_rgba(168,116,240,0.8)] border border-white/20",
        secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(114,245,255,0.3)]",
        outline: "bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_10px_rgba(114,245,255,0.2)]",
        danger: "bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-3 rounded-xl font-display font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
};
