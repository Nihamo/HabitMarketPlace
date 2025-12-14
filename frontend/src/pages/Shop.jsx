import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Wallet, Lock } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import { NeonButton } from '../components/ui/NeonButton';
import { cn, getRewardIcon } from '../lib/utils';
import { getAllRewards, redeemReward } from '../services/reward.service';
import { getUserCoins } from '../services/user.service';
import { getCurrentUser } from '../services/auth.service';

const Shop = () => {
    const [rewards, setRewards] = useState([]);
    const [coins, setCoins] = useState(0);
    const user = getCurrentUser();

    useEffect(() => {
        if (user) {
            loadShop();
        }
    }, [user]);

    const loadShop = async () => {
        try {
            const [rData, cData] = await Promise.all([
                getAllRewards(),
                getUserCoins(user.id)
            ]);
            setRewards(rData || []);
            setCoins(cData || 0);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRedeem = async (reward) => {
        if (coins < reward.cost) {
            alert("Insufficient credits!");
            return;
        }
        if (!window.confirm(`Redeem ${reward.name} for ${reward.cost} credits?`)) return;

        try {
            await redeemReward(reward.id, user.id);
            alert("Reward redeemed!");
            loadShop(); // Refresh coins
        } catch (err) {
            console.error(err);
            alert("Redemption failed.");
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Cyber Market</h1>
                    <p className="text-white/50">Exchange credits for enhancements.</p>
                    <p className="text-neon-cyan/80 text-sm mt-1">Complete daily checkin to get 10 credits</p>
                </div>
                <GlassPane className="px-4 py-2 flex items-center gap-2 bg-neon-cyan/10 border-neon-cyan">
                    <Wallet size={20} className="text-neon-cyan" />
                    <span className="font-bold text-white text-xl">{coins}</span>
                </GlassPane>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward) => {
                    const Icon = getRewardIcon(reward.name);
                    const canAfford = coins >= reward.cost;

                    return (
                        <GlassPane key={reward.id} className={cn(
                            "relative overflow-hidden group transition-all duration-500",
                            canAfford ? "hover:border-neon-cyan/50" : "opacity-80 grayscale-[0.5] hover:grayscale-0"
                        )} hoverEffect={canAfford}>
                            <div className={cn(
                                "absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10",
                                canAfford ? "bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" : "bg-white/10"
                            )}>
                                {reward.cost} Credits
                            </div>

                            <div className="flex justify-center py-6 text-neon-cyan group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative">
                                {!canAfford && <div className="absolute inset-0 flex items-center justify-center text-white/10"><Lock size={64} /></div>}
                                <Icon size={48} className={cn("filter drop-shadow-[0_0_15px_rgba(114,245,255,0.3)]", !canAfford && "opacity-50 blur-[1px]")} />
                            </div>

                            <h3 className="font-bold text-white text-lg mb-1 relative z-10">{reward.name}</h3>
                            <p className="text-white/50 text-sm mb-4 h-10 line-clamp-2 relative z-10">{reward.description}</p>

                            <NeonButton
                                className={cn("w-full text-sm relative overflow-hidden", canAfford && "shimmer")}
                                variant={canAfford ? 'primary' : 'outline'}
                                onClick={() => handleRedeem(reward)}
                                disabled={!canAfford}
                            >
                                {canAfford ? 'REDEEM REWARD' : 'LOCKED'}
                            </NeonButton>
                        </GlassPane>
                    );
                })}

                {rewards.length === 0 && (
                    <div className="col-span-full text-center text-white/30 py-12">
                        Marketplace inventory offline. Check back later.
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Shop;
