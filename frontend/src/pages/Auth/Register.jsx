import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { GlassPane } from '../../components/ui/GlassPane';
import { GlassInput } from '../../components/ui/GlassInput';
import { NeonButton } from '../../components/ui/NeonButton';
import { register } from '../../services/auth.service';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.username, formData.password, formData.email);
            // Auto login or redirect to login? Let's redirect to login for simplicity or auto-login.
            // Requirement says usage of POST /auth/register then POST /auth/login usually.
            // I'll redirect to login page with a success message or just navigate.
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError('Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            <div className="bg-particles" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-neon-purple/20 rounded-full blur-[100px] animate-float" />

            <GlassPane className="w-full max-w-md p-8 border-t border-white/20">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon-cyan/10 text-neon-cyan mb-4 box-shadow-glow">
                        <Sparkles size={24} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        JOIN THE GRID
                    </h1>
                    <p className="text-white/50">Begin your evolution today</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <GlassInput
                        icon={User}
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <GlassInput
                        icon={Mail}
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <GlassInput
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <NeonButton className="w-full justify-center mt-6" disabled={loading}>
                        {loading ? 'Creating...' : 'INITIATE'} <ArrowRight size={18} />
                    </NeonButton>
                </form>

                <div className="mt-6 text-center text-sm text-white/40">
                    Already an agent?{' '}
                    <Link to="/login" className="text-neon-cyan hover:text-white transition-colors font-semibold">
                        Login
                    </Link>
                </div>
            </GlassPane>
        </div>
    );
};

export default Register;
