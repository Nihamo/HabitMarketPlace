import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Globe, Layout as LayoutIcon, Trash2, Edit2 } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { GlassPane } from '../components/ui/GlassPane';
import { GlassInput } from '../components/ui/GlassInput';
import { NeonButton } from '../components/ui/NeonButton';
import HabitCard from '../components/habits/HabitCard';
import { createHabit, getMarketplaceHabits, getHabitTemplates, getPublicHabits, searchHabitsByTitle, deleteHabit, updateHabit, getUserHabits, adoptHabit } from '../services/habit.service';
import { getCurrentUser } from '../services/auth.service';

const Habits = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [habits, setHabits] = useState([]);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [newHabit, setNewHabit] = useState({ title: '', description: '', durationDays: 21 });
    const [editingHabit, setEditingHabit] = useState(null);
    const user = getCurrentUser();

    useEffect(() => {
        loadHabits();
    }, [activeTab]);

    const loadHabits = async () => {
        try {
            let data = [];
            if (activeTab === 'ALL') data = await getMarketplaceHabits();
            else if (activeTab === 'TEMPLATES') data = await getHabitTemplates();
            else if (activeTab === 'PUBLIC') data = await getPublicHabits();
            else if (activeTab === 'PERSONAL') data = await getUserHabits(user.id);
            setHabits(data || []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadHabits();
            return;
        }
        try {
            const results = await searchHabitsByTitle(searchQuery);
            setHabits(results);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Terminate Protocol?")) {
            try {
                await deleteHabit(id);
                setHabits(habits.filter(h => h.id !== id));
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newHabit, userId: user.id, status: 'ACTIVE', startDate: new Date().toISOString().split('T')[0] };
            await createHabit(payload);
            setIsCreateModalOpen(false);
            setActiveTab('PERSONAL');
            // loadHabits will trigger via useEffect
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (habit) => {
        setEditingHabit({ ...habit });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateHabit(editingHabit.id, editingHabit);
            setIsEditModalOpen(false);
            loadHabits();
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    const handleAdopt = async (habit) => {
        if (window.confirm(`Adopt "${habit.title}" into your routine?`)) {
            try {
                await adoptHabit(user.id, habit.id);
                alert("Protocol Adopted Successfully!");
                setActiveTab('PERSONAL'); // Switch to personal tab to see it
            } catch (err) {
                console.error(err);
                alert("Adoption Failed.");
            }
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Habit Marketplace</h1>
                    <p className="text-white/50">Discover and adopt new protocols.</p>
                </div>
                <NeonButton onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={20} /> Create Custom
                </NeonButton>
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <GlassInput
                    icon={Search}
                    placeholder="Search protocols..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <NeonButton type="submit" variant="outline">Search</NeonButton>
            </form>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 text-sm font-semibold">
                {['ALL', 'PERSONAL', 'TEMPLATES', 'PUBLIC'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                        className={`px-4 py-2 rounded-lg transition-all ${activeTab === tab ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                    <div key={habit.id} className="relative group">
                        <HabitCard habit={habit} userId={user?.id} onCheckIn={(id) => console.log("Checked in", id)} onAdopt={() => handleAdopt(habit)} />
                        {/* Admin Actions for Owner */}
                        {user && habit.userId === parseInt(user.id) && (
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={() => openEditModal(habit)}
                                    className="p-2 bg-neon-cyan/20 text-neon-cyan rounded-full hover:bg-neon-cyan/40"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(habit.id)}
                                    className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-lg">
                            <GlassPane>
                                <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24} /></button>
                                <h2 className="text-2xl font-bold text-white mb-6">New Protocol</h2>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-neon-cyan uppercase tracking-wider mb-2 block">Habit Title</label>
                                        <GlassInput value={newHabit.title} onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })} placeholder="e.g. Morning Meditation" required />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neon-cyan uppercase tracking-wider mb-2 block">Description</label>
                                        <GlassInput value={newHabit.description} onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} placeholder="Brief description..." />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neon-cyan uppercase tracking-wider mb-2 block">Duration</label>
                                        <GlassInput type="number" value={newHabit.durationDays} onChange={(e) => setNewHabit({ ...newHabit, durationDays: e.target.value })} placeholder="21" />
                                    </div>
                                    <NeonButton className="w-full mt-4">Initialize Protocol</NeonButton>
                                </form>
                            </GlassPane>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingHabit && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-lg">
                            <GlassPane>
                                <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24} /></button>
                                <h2 className="text-2xl font-bold text-white mb-6">Edit Protocol</h2>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-neon-blue uppercase tracking-wider mb-2 block">Habit Title</label>
                                        <GlassInput value={editingHabit.title} onChange={(e) => setEditingHabit({ ...editingHabit, title: e.target.value })} required />
                                    </div>

                                    <div>
                                        <label className="text-xs text-neon-blue uppercase tracking-wider mb-2 block">Description</label>
                                        <GlassInput value={editingHabit.description} onChange={(e) => setEditingHabit({ ...editingHabit, description: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs text-neon-blue uppercase tracking-wider mb-2 block">Duration (Days)</label>
                                            <GlassInput type="number" value={editingHabit.durationDays} onChange={(e) => setEditingHabit({ ...editingHabit, durationDays: parseInt(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neon-blue uppercase tracking-wider mb-2 block">Start Date</label>
                                            <GlassInput type="date" value={editingHabit.startDate} onChange={(e) => setEditingHabit({ ...editingHabit, startDate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neon-blue uppercase tracking-wider mb-2 block">End Date</label>
                                            <GlassInput type="date" value={editingHabit.endDate} onChange={(e) => setEditingHabit({ ...editingHabit, endDate: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={editingHabit.isPublic}
                                                onChange={(e) => setEditingHabit({ ...editingHabit, isPublic: e.target.checked })}
                                                className="form-checkbox bg-transparent border-neon-blue text-neon-blue rounded focus:ring-0"
                                            />
                                            Public (Marketplace)
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={editingHabit.isTemplate}
                                                onChange={(e) => setEditingHabit({ ...editingHabit, isTemplate: e.target.checked })}
                                                className="form-checkbox bg-transparent border-neon-blue text-neon-blue rounded focus:ring-0"
                                            />
                                            Save as Template
                                        </label>
                                    </div>

                                    <NeonButton className="w-full mt-4" variant="primary">Update Protocol</NeonButton>
                                </form>
                            </GlassPane>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default Habits;
