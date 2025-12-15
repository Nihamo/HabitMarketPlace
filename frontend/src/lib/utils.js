import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Gift, Coffee, Tv, Music, CreditCard, Palette, Zap, Crown, Utensils, Smartphone, Headphones, ShoppingBag, Shield, Crop, Medal, Sprout, Flame, Award } from 'lucide-react';

export const BADGE_DEFINITIONS = [
    { name: "Beginner", description: "Complete your day 1", icon: Sprout, color: "text-green-400", from: "from-green-400", to: "to-emerald-600" },
    { name: "7-Day Streak", description: "Maintain consistency for 7 days on any habit.", icon: Flame, color: "text-orange-400", from: "from-orange-400", to: "to-red-600" },
    { name: "30-Day Streak", description: "Achieve 30 days of unbroken discipline.", icon: Zap, color: "text-blue-400", from: "from-blue-400", to: "to-purple-600" },
    { name: "Habit Master", description: "Maintaining 5 active habits", icon: Crown, color: "text-yellow-400", from: "from-yellow-400", to: "to-amber-600" }
];

export const getBadgeConfig = (name) => {
    return BADGE_DEFINITIONS.find(b => b.name === name) || { icon: Award, color: "text-white", from: "from-gray-500", to: "to-gray-700" };
};

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function getRewardIcon(name) {
    if (!name) return Gift;
    const lower = name.toLowerCase();

    if (lower.includes('coffee') || lower.includes('drink')) return Coffee;
    if (lower.includes('netflix') || lower.includes('movie') || lower.includes('stream') || lower.includes('tv')) return Tv;
    if (lower.includes('spotify') || lower.includes('music') || lower.includes('audio')) return Music;
    if (lower.includes('amazon') || lower.includes('card') || lower.includes('voucher') || lower.includes('money')) return CreditCard;
    if (lower.includes('food') || lower.includes('meal') || lower.includes('pizza') || lower.includes('burger')) return Utensils;
    if (lower.includes('theme') || lower.includes('skin') || lower.includes('color')) return Palette;
    if (lower.includes('boost') || lower.includes('power') || lower.includes('energy')) return Zap;
    if (lower.includes('premium') || lower.includes('pro') || lower.includes('vip') || lower.includes('gold')) return Crown;
    if (lower.includes('phone') || lower.includes('call') || lower.includes('mobile')) return Smartphone;
    if (lower.includes('headphone') || lower.includes('earphone')) return Headphones;
    if (lower.includes('shop') || lower.includes('store') || lower.includes('buy')) return ShoppingBag;

    // User Requested Specifics
    if (lower.includes('shield') || lower.includes('protect')) return Shield;
    if (lower.includes('frame') || lower.includes('border')) return Crop;
    if (lower.includes('badge') || lower.includes('medal') || lower.includes('award')) return Medal;

    return Gift;
}
