import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/services';
import Navbar from '../components/Navbar';

const NewClient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        numeroIdentite: '',
        dateAnniversaire: '',
        email: '',
        adressePostale: ''
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
        setLoading(true);

        try {
            const response = await clientService.createClient(formData);
            setSuccess(`Client créé avec succès ! Login généré : ${response.username}`);
            setFormData({
                nom: '',
                prenom: '',
                numeroIdentite: '',
                dateAnniversaire: '',
                email: '',
                adressePostale: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du client");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Nouveau Client</h2>

                    {error && <div className="alert alert-error fade-in">{error}</div>}
                    {success && <div className="alert alert-success fade-in">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label htmlFor="nom" className="form-label">Nom *</label>
                                <input
                                    id="nom"
                                    name="nom"
                                    type="text"
                                    className="form-input"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="prenom" className="form-label">Prénom *</label>
                                <input
                                    id="prenom"
                                    name="prenom"
                                    type="text"
                                    className="form-input"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label htmlFor="numeroIdentite" className="form-label">N° Identité (CIN) *</label>
                                <input
                                    id="numeroIdentite"
                                    name="numeroIdentite"
                                    type="text"
                                    className="form-input"
                                    value={formData.numeroIdentite}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateAnniversaire" className="form-label">Date de Naissance *</label>
                                <input
                                    id="dateAnniversaire"
                                    name="dateAnniversaire"
                                    type="date"
                                    className="form-input"
                                    value={formData.dateAnniversaire}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px' }}>
                                Les identifiants seront envoyés par mail (RG_7)
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressePostale" className="form-label">Adresse Postale *</label>
                            <textarea
                                id="adressePostale"
                                name="adressePostale"
                                className="form-textarea"
                                value={formData.adressePostale}
                                onChange={handleChange}
                                required
                                style={{ minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/agent/dashboard')}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Création...' : 'Créer le client'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NewClient;
