import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Users, ArrowLeft, Camera, Globe, Calendar, Award, Gift, UserPlus, UserCheck } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import { GlassInput } from '../components/ui/GlassInput';
import { NeonButton } from '../components/ui/NeonButton';
import { cn, getRewardIcon, getBadgeConfig } from '../lib/utils';
import { getCurrentUser } from '../services/auth.service';
import { getUserProfile, updateProfile, getFollowers, getFollowing, checkAndAwardAchievements, followUser, unfollowUser } from '../services/user.service';
import { getUserAchievements } from '../services/gamification.service';
import { getUserRedemptions } from '../services/reward.service';

const Profile = () => {
    const { userId } = useParams(); // userId param from URL
    const currentUser = getCurrentUser(); // Logged in user

    const [profile, setProfile] = useState({});
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); // Am I following this profile?
    const [loadingFollow, setLoadingFollow] = useState(false);

    // Determine if we are viewing our own profile
    const isOwner = !userId || (currentUser && userId === currentUser.id);
    const targetId = isOwner ? currentUser.id : userId;

    const [editForm, setEditForm] = useState({
        username: '',
        bio: '',
        profilePictureUrl: '',
        gender: '',
        country: '',
        birthdate: ''
    });

    useEffect(() => {
        if (targetId) {
            loadProfile(targetId);
        }
    }, [targetId]);

    const loadProfile = async (id) => {
        try {
            if (isOwner) {
                await checkAndAwardAchievements(id).catch(err => console.error("Badge Check Failed", err));
            }

            const [p, f1Data, f2Data, achData, redData] = await Promise.all([
                getUserProfile(id),
                getFollowers(id),
                getFollowing(id),
                getUserAchievements(id).catch(() => []),
                getUserRedemptions(id).catch(() => [])
            ]);

            setProfile(p);
            const resolvedFollowers = f1Data ? await resolveUsers(f1Data, 'followerId') : [];
            const resolvedFollowing = f2Data ? await resolveUsers(f2Data, 'followedId') : [];

            setFollowers(resolvedFollowers);
            setFollowing(resolvedFollowing);
            setAchievements(achData);
            setRedemptions(redData || []);

            if (isOwner) {
                setEditForm({
                    username: p.username || '',
                    bio: p.bio || '',
                    profilePictureUrl: p.profilePictureUrl || '',
                    gender: p.gender || '',
                    country: p.country || '',
                    birthdate: p.birthdate ? p.birthdate.toString() : ''
                });
            } else {
                // Check if I follow them
                // We need MY following list. 
                // Optimization: calling getFollowing(currentUser.id) to check status
                const myFollowing = await getFollowing(currentUser.id);
                const amIFollowing = myFollowing.some(f => f.followedId == id); // Loose equality for string/number
                setIsFollowing(amIFollowing);
            }

        } catch (e) {
            console.error(e);
        }
    };

    const resolveUsers = async (list, idKey) => {
        // Parallel fetch for details (N+1 fix)
        return await Promise.all(list.map(async (item) => {
            try {
                const u = await getUserProfile(item[idKey]);
                return { ...item, user: u };
            } catch {
                return item;
            }
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Sanitize payload: convert empty strings to null for backend compatibility (e.g. LocalDate)
            const payload = Object.fromEntries(
                Object.entries(editForm).map(([k, v]) => [k, v === '' ? null : v])
            );

            const updated = await updateProfile(currentUser.id, payload);
            setProfile(updated);
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data || "Update failed. Check format.";
            alert(msg);
        }
    };

    const toggleFollow = async () => {
        if (loadingFollow) return;
        setLoadingFollow(true);
        try {
            if (isFollowing) {
                await unfollowUser(currentUser.id, targetId);
                setIsFollowing(false);
                setFollowers(prev => prev.filter(f => f.followerId !== currentUser.id)); // Optimistic update
            } else {
                await followUser(currentUser.id, targetId);
                setIsFollowing(true);
                // Optimistic add to followers list
                loadProfile(targetId); // Reload to get fresh list + my details
            }
        } catch (err) {
            console.error(err);
            // If 400, it likely means state was out of sync (already following).
            // We can opt to reload profile to sync true state.
            if (err.response && err.response.status === 400) {
                loadProfile(targetId);
            }
        } finally {
            setLoadingFollow(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Profile Card */}
                <GlassPane className="relative overflow-hidden p-8 border-neon-cyan/30">
                    <div className="absolute top-0 right-0 p-4 z-20">
                        {isOwner ? (
                            <NeonButton variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                <Settings size={18} /> {isEditing ? 'Cancel' : 'Edit Neural Profile'}
                            </NeonButton>
                        ) : (
                            <NeonButton
                                variant={isFollowing ? "outline" : "primary"}
                                size="sm"
                                onClick={toggleFollow}
                                disabled={loadingFollow}
                                className={cn("min-w-[140px]", isFollowing && "border-red-500/50 text-red-400 hover:bg-red-500/10")}
                            >
                                {isFollowing ? (
                                    <><UserCheck size={18} /> Following</>
                                ) : (
                                    <><UserPlus size={18} /> Follow</>
                                )}
                            </NeonButton>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 z-10 relative">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full ring-4 ring-neon-cyan/50 shadow-[0_0_50px_rgba(114,245,255,0.2)] overflow-hidden bg-black/50 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full ring-4 ring-neon-cyan/50 animate-ping opacity-20 pointer-events-none" />
                                {profile.profilePictureUrl ? (
                                    <img src={profile.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover relative z-10" />
                                ) : (
                                    <span className="text-5xl font-bold text-white/20 relative z-10">{profile.username?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left space-y-2 flex-1">
                            <h1 className="text-4xl font-display font-bold text-white">{profile.username}</h1>
                            <p className="text-neon-cyan font-mono text-sm">{profile.email} | ID: {profile.id}</p>

                            {profile.bio && (
                                <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-2 border-neon-purple text-white/70 italic text-sm max-w-lg">
                                    "{profile.bio}"
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/40 uppercase tracking-widest">
                                {profile.country && <span className="flex items-center gap-1"><Globe size={12} /> {profile.country}</span>}
                                {profile.birthdate && <span className="flex items-center gap-1"><Calendar size={12} /> {profile.birthdate}</span>}
                                {profile.gender && <span className="flex items-center gap-1"><User size={12} /> {profile.gender}</span>}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-6 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">{followers.length}</div>
                                <div className="text-xs text-white/40 uppercase">Followers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{following.length}</div>
                                <div className="text-xs text-white/40 uppercase">Following</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{achievements.length}</div>
                                <div className="text-xs text-white/40 uppercase">Badges</div>
                            </div>
                        </div>
                    </div>
                </GlassPane>

                {/* Edit Form */}
                <AnimatePresence>
                    {isEditing && isOwner && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <GlassPane className="border-neon-gold/30">
                                <h3 className="text-lg font-bold text-neon-gold mb-6">Update Protocol Parameters</h3>
                                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-white/50 uppercase mb-1 block">Username</label>
                                            <GlassInput value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/50 uppercase mb-1 block">Profile Image URL</label>
                                            <GlassInput icon={Camera} placeholder="https://..." value={editForm.profilePictureUrl} onChange={e => setEditForm({ ...editForm, profilePictureUrl: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/50 uppercase mb-1 block">Bio / Status</label>
                                            <GlassInput placeholder="Enter your status..." value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-white/50 uppercase mb-1 block">Country</label>
                                            <GlassInput icon={Globe} placeholder="e.g. Neo Tokyo" value={editForm.country} onChange={e => setEditForm({ ...editForm, country: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/50 uppercase mb-1 block">Gender</label>
                                            <select
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-cyan outline-none"
                                                value={editForm.gender}
                                                onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                            >
                                                <option value="">Select Identity</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Non-binary">Non-binary</option>
                                                <option value="Cybernetic">Cybernetic</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/50 uppercase mb-1 block">Birth Date</label>
                                            <GlassInput type="date" value={editForm.birthdate} onChange={e => setEditForm({ ...editForm, birthdate: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <NeonButton className="w-full justify-center">Save Parameters</NeonButton>
                                    </div>
                                </form>
                            </GlassPane>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Social & Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Social Network */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-neon-cyan" /> Network</h3>

                        <GlassPane className="max-h-60 overflow-y-auto custom-scrollbar">
                            <div className="text-xs text-neon-cyan uppercase tracking-widest mb-3 sticky top-0 bg-black/50 backdrop-blur p-2">Followers</div>
                            {followers.length === 0 ? <p className="text-white/30 text-sm p-2">No signals detected.</p> : (
                                <div className="space-y-2">
                                    {followers.map((f, i) => (
                                        <Link to={`/profile/${f.followerId}`} key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10 group-hover:ring-neon-cyan transition-all">
                                                {f.user?.profilePictureUrl ? <img src={f.user.profilePictureUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">{f.user?.username?.[0]}</div>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">{f.user?.username || `ID: ${f.followerId}`}</div>
                                                <div className="text-[10px] text-white/40">Since {new Date(f.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </GlassPane>

                        <GlassPane className="max-h-60 overflow-y-auto custom-scrollbar">
                            <div className="text-xs text-neon-purple uppercase tracking-widest mb-3 sticky top-0 bg-black/50 backdrop-blur p-2">Following</div>
                            {following.length === 0 ? <p className="text-white/30 text-sm p-2">No outgoing links.</p> : (
                                <div className="space-y-2">
                                    {following.map((f, i) => (
                                        <Link to={`/profile/${f.followedId}`} key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10 group-hover:ring-neon-purple transition-all">
                                                {f.user?.profilePictureUrl ? <img src={f.user.profilePictureUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">{f.user?.username?.[0]}</div>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white group-hover:text-neon-purple transition-colors">{f.user?.username || `ID: ${f.followedId}`}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </GlassPane>
                    </div>

                    {/* Achievements */}
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Award className="text-neon-gold" /> Achievements</h3>
                        <GlassPane className="min-h-[400px]">
                            {achievements.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/30 text-center">
                                    <Award size={48} className="mb-4 opacity-50" />
                                    <p>No accolades earned yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {achievements.map((ach, i) => {
                                        const config = getBadgeConfig(ach.badgeName);
                                        const Icon = config.icon;
                                        return (
                                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.from} ${config.to} flex items-center justify-center text-lg shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                                    <Icon size={24} className="text-white drop-shadow-md" />
                                                </div>
                                                <div className="font-bold text-white text-sm mb-1 relative z-10">{ach.badgeName}</div>
                                                <div className="text-[10px] text-white/40">{new Date(ach.earnedAt).toLocaleDateString()}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </GlassPane>
                    </div>

                    {/* Inventory / Redemptions */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Gift className="text-neon-purple" /> Inventory (Rewards)</h3>
                        <GlassPane className="min-h-[200px]">
                            {redemptions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/30 text-center py-10">
                                    <Gift size={48} className="mb-4 opacity-50" />
                                    <p>No rewards redeemed.</p>
                                    <p className="text-xs">Visit the Cyber Shop to spend credits.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {redemptions.map((red, i) => {
                                        const Icon = getRewardIcon(red.rewardName);
                                        return (
                                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 bg-neon-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                                    -{red.cost}
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple mb-3 group-hover:scale-110 transition-transform">
                                                    <Icon size={24} />
                                                </div>
                                                <div className="font-bold text-white text-sm mb-1 line-clamp-1">{red.rewardName}</div>
                                                <div className="text-[10px] text-white/40">{new Date(red.redeemedAt).toLocaleDateString()}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </GlassPane>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
