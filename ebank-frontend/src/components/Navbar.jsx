import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/services';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const getNavLinks = () => {
        if (user?.role === 'AGENT_GUICHET') {
            return [
                { to: '/agent/dashboard', label: 'Tableau de bord' },
                { to: '/agent/nouveau-client', label: 'Nouveau client' },
                { to: '/agent/nouveau-compte', label: 'Nouveau compte' },
            ];
        } else if (user?.role === 'CLIENT') {
            return [
                { to: '/client/dashboard', label: 'Tableau de bord' },
                { to: '/client/virement', label: 'Nouveau virement' },
            ];
        }
        return [];
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-brand">
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
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
                    <span>eBank</span>
                </Link>

                <div className="navbar-links">
                    {getNavLinks().map((link) => (
                        <Link key={link.to} to={link.to} className="navbar-link">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    <Link to="/change-password" className="navbar-link">
                        Changer mot de passe
                    </Link>
                    <div className="navbar-user">
                        <span className="user-name">{user?.username}</span>
                        <span className="user-role badge badge-info">
                            {user?.role === 'AGENT_GUICHET' ? 'Agent' : 'Client'}
                        </span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline btn-sm">
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
