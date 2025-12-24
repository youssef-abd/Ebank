import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/services';
import Navbar from '../components/Navbar';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);

        try {
            await authService.changePassword(formData.oldPassword, formData.newPassword);
            setSuccess("Mot de passe modifié avec succès !");
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                authService.logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Changer mot de passe</h2>

                    {error && <div className="alert alert-error fade-in">{error}</div>}
                    {success && <div className="alert alert-success fade-in">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="oldPassword" className="form-label">Ancien mot de passe</label>
                            <input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                className="form-input"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                className="form-input"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirmer nouveau mot de passe</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: 'var(--space-2)' }}
                        >
                            {loading ? 'Modification...' : 'Modifier le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
