import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { virementService, dashboardService } from '../services/services';
import Navbar from '../components/Navbar';

const Virement = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ribSource: '',
        ribDestinataire: '',
        montant: '',
        motif: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [solde, setSolde] = useState(0);
    const [comptes, setComptes] = useState([]);

    useEffect(() => {
        loadUserAccounts();
    }, []);

    const loadUserAccounts = async () => {
        try {
            const data = await dashboardService.getDashboard();
            // On met dans la liste le compte principal récupéré
            // Note: Dans une version réelle, on appellerait un endpoint qui liste TOUS les comptes
            setComptes([{ rib: data.rib, solde: data.solde }]);

            // Sélection par défaut
            setFormData(prev => ({ ...prev, ribSource: data.rib }));
            setSolde(data.solde);
        } catch (err) {
            console.error("Erreur chargement comptes", err);
            setError("Impossible de charger les informations du compte");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSourceAccountChange = (e) => {
        const selectedRib = e.target.value;
        const selectedAccount = comptes.find(c => c.rib === selectedRib);
        if (selectedAccount) {
            setFormData(prev => ({ ...prev, ribSource: selectedRib }));
            setSolde(selectedAccount.solde);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation RG_12: Solde suffisant
        if (parseFloat(formData.montant) > solde) {
            setError("Solde insuffisant pour effectuer ce virement");
            setLoading(false);
            return;
        }

        try {
            await virementService.effectuerVirement(formData);
            setSuccess("Virement effectué avec succès !");
            setFormData(prev => ({
                ...prev,
                ribDestinataire: '',
                montant: '',
                motif: ''
            }));
            // Recharger le solde
            loadUserAccounts();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors du virement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Nouveau Virement</h2>

                    {error && <div className="alert alert-error fade-in">{error}</div>}
                    {success && <div className="alert alert-success fade-in">{success}</div>}

                    <div className="alert alert-info">
                        Solde disponible : <strong>{solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}</strong>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Compte à débiter</label>
                            <select
                                name="ribSource"
                                className="form-select"
                                value={formData.ribSource}
                                onChange={handleSourceAccountChange}
                                required
                            >
                                {comptes.map(compte => (
                                    <option key={compte.rib} value={compte.rib}>
                                        {compte.rib}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ribDestinataire" className="form-label">RIB Destinataire</label>
                            <input
                                id="ribDestinataire"
                                name="ribDestinataire"
                                type="text"
                                className="form-input"
                                placeholder="Saisir le RIB du bénéficiaire"
                                value={formData.ribDestinataire}
                                onChange={handleChange}
                                required
                                maxLength={24}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="montant" className="form-label">Montant (MAD)</label>
                            <input
                                id="montant"
                                name="montant"
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="form-input"
                                placeholder="0.00"
                                value={formData.montant}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="motif" className="form-label">Motif (Optionnel)</label>
                            <textarea
                                id="motif"
                                name="motif"
                                className="form-textarea"
                                placeholder="Raison du virement..."
                                value={formData.motif}
                                onChange={handleChange}
                                style={{ minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/client/dashboard')}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Traitement en cours...' : 'Valider le virement'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Virement;
