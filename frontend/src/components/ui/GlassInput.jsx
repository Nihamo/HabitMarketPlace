import React from 'react';
import { cn } from '../../lib/utils';

export const GlassInput = ({ className, icon: Icon, ...props }) => {
    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-neon-cyan transition-colors">
                    <Icon size={20} />
                </div>
            )}
            <input
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(114,245,255,0.1)] transition-all duration-300 font-sans",
                    Icon && "pl-12",
                    className
                )}
                {...props}
            />
        </div>
    );
};
