import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const GlassPane = ({ children, className, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? {
                y: -5,
                boxShadow: "0 15px 30px -10px rgba(114, 245, 255, 0.15)",
                borderColor: "rgba(255,255,255,0.3)"
            } : {}}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className={cn(
                "glass-panel rounded-2xl p-6 relative overflow-hidden transition-colors",
                hoverEffect && "cursor-pointer group hover:bg-white/10",
                className
            )}
            {...props}
        >
            {/* Cinematic Shine Overlay */}
            {hoverEffect && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer-slide_1.5s_infinite] pointer-events-none" />
                </>
            )}
            {children}
        </motion.div>
    );
};
