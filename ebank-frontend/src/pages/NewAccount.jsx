import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { compteService, clientService } from '../services/services';
import Navbar from '../components/Navbar';

const NewAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numeroIdentite: '',
        rib: ''
    });
    const [clientInfo, setClientInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchClient = async () => {
        if (!formData.numeroIdentite) return;

        setSearching(true);
        setClientInfo(null);
        setError('');

        try {
            const client = await clientService.getClientByNumeroIdentite(formData.numeroIdentite);
            setClientInfo(client);
        } catch (err) {
            setError("Client non trouvé avec ce numéro d'identité (RG_8)");
        } finally {
            setSearching(false);
        }
    };

    const generateRandomRIB = () => {
        // Générateur simple de RIB pour faciliter les tests (24 caractères)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 24; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, rib: result }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clientInfo) {
            setError("Veuillez d'abord valider l'identité du client");
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await compteService.createCompte({
                numeroIdentite: formData.numeroIdentite,
                rib: formData.rib
            });
            setSuccess("Compte créé avec succès ! Statut: OUVERT (RG_10)");
            setFormData({ numeroIdentite: '', rib: '' });
            setClientInfo(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du compte");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Nouveau Compte Bancaire</h2>

                    {error && <div className="alert alert-error fade-in">{error}</div>}
                    {success && <div className="alert alert-success fade-in">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="numeroIdentite" className="form-label">Identité du Client (CIN)</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <input
                                    id="numeroIdentite"
                                    name="numeroIdentite"
                                    type="text"
                                    className="form-input"
                                    value={formData.numeroIdentite}
                                    onChange={handleChange}
                                    placeholder="Saisir CIN pour rechercher"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleSearchClient}
                                    disabled={searching || !formData.numeroIdentite}
                                >
                                    {searching ? '...' : 'Vérifier'}
                                </button>
                            </div>
                        </div>

                        {clientInfo && (
                            <div className="alert alert-info fade-in" style={{ marginBottom: 'var(--space-5)' }}>
                                <strong>Client identifié :</strong><br />
                                {clientInfo.nom} {clientInfo.prenom}<br />
                                {clientInfo.email}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="rib" className="form-label">RIB (24 caractères)</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <input
                                    id="rib"
                                    name="rib"
                                    type="text"
                                    className="form-input"
                                    value={formData.rib}
                                    onChange={handleChange}
                                    placeholder="Saisir ou générer un RIB"
                                    required
                                    maxLength={24}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={generateRandomRIB}
                                    title="Générer un RIB aléatoire pour test"
                                >
                                    Générer
                                </button>
                            </div>
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
                                disabled={loading || !clientInfo}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Création...' : 'Créer le compte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NewAccount;
