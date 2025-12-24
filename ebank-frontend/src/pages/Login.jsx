import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/services';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(username, password);

            // Rediriger selon le rôle
            if (response.role === 'AGENT_GUICHET') {
                navigate('/agent/dashboard');
            } else if (response.role === 'CLIENT') {
                navigate('/client/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login ou mot de passe erronés');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-content fade-in">
                <div className="login-card card-glass">
                    <div className="login-header">
                        <div className="logo">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="12" fill="url(#gradient1)" />
                                <path d="M24 14L32 18V30L24 34L16 30V18L24 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M24 24V34" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M16 18L24 22L32 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="gradient1" x1="0" y1="0" x2="48" y2="48">
                                        <stop offset="0%" stopColor="#0ea5e9" />
                                        <stop offset="100%" stopColor="#0284c7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h1>eBank</h1>
                        <p>Bienvenue sur votre espace bancaire</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Identifiant
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="form-input"
                                placeholder="Votre identifiant"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ width: '100%', marginTop: 'var(--space-4)' }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Première connexion ? Contactez votre agence</p>
                    </div>
                </div>

                <div className="login-info">
                    <div className="info-card card-glass">
                        <h3>🔒 Sécurisé</h3>
                        <p>Vos données sont protégées par cryptage SSL</p>
                    </div>
                    <div className="info-card card-glass">
                        <h3>⚡ Rapide</h3>
                        <p>Accédez à vos comptes en quelques secondes</p>
                    </div>
                    <div className="info-card card-glass">
                        <h3>📱 Accessible</h3>
                        <p>Disponible 24h/24 et 7j/7</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
