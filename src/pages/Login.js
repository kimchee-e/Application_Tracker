import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './../styles/Auth.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            window.location.href = '/tableView';
        } catch (err) {
            setError(isLogin 
                ? 'Failed to sign in. Please check your credentials.' 
                : 'Failed to create account. Please try again.'
            );
        }
        setIsLoading(false);
    };

    const switchMode = (mode) => {
        setIsLogin(mode);
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                
                <div className="auth-toggle">
                    <button 
                        className={isLogin ? 'active' : ''} 
                        onClick={() => switchMode(true)}
                    >
                        Sign In
                    </button>
                    <button 
                        className={!isLogin ? 'active' : ''} 
                        onClick={() => switchMode(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="auth-button"
                    >
                        {isLoading 
                            ? (isLogin ? 'Signing in...' : 'Creating account...') 
                            : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login; 