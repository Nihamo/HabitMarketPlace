import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { GlassPane } from '../../components/ui/GlassPane';
import { GlassInput } from '../../components/ui/GlassInput';
import { NeonButton } from '../../components/ui/NeonButton';
import { login } from '../../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Updated to use email per backend requirement
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            <div className="bg-particles" />
            <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary-start/20 rounded-full blur-[100px] animate-pulse-glow" />

            <GlassPane className="w-full max-w-md p-8 border-t border-white/20 backdrop-blur-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-white via-neon-cyan to-white bg-clip-text text-transparent">
                        WELCOME BACK
                    </h1>
                    <p className="text-white/50">Enter the Nexus</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <GlassInput
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
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

                    <NeonButton className="w-full justify-center" disabled={loading}>
                        {loading ? 'Initializing...' : 'LOGIN'} <ArrowRight size={18} />
                    </NeonButton>
                </form>

                <div className="mt-6 text-center text-sm text-white/40">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-neon-cyan hover:text-white transition-colors font-semibold">
                        Register
                    </Link>
                </div>
            </GlassPane>
        </div>
    );
};

export default Login;
