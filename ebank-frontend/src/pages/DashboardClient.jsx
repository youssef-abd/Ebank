import { useState, useEffect } from 'react';
import { dashboardService, compteService } from '../services/services';
import Navbar from '../components/Navbar';
import './DashboardClient.css';

const DashboardClient = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comptes, setComptes] = useState([]);
    const [selectedRib, setSelectedRib] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getDashboard();
            setDashboardData(data);
            setSelectedRib(data.rib);

            // Charger la liste des comptes pour le sélecteur
            // Note: Idéalement, on aurait un endpoint dédié pour lister les comptes du client connecté
            // Ici on suppose que le user a l'ID du client dans le token ou via un appel
            // Pour simplifier, on utilisera seulement le compte principal chargé
        } catch (err) {
            setError("Impossible de charger le tableau de bord.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountChange = async (e) => {
        const newRib = e.target.value;
        setSelectedRib(newRib);
        setPage(0);
        loadDashboardData(newRib, 0);
    };

    const loadDashboardData = async (rib, pageNum) => {
        try {
            setLoading(true);
            const data = await dashboardService.getDashboardByRib(rib, pageNum);
            setDashboardData(data);
        } catch (err) {
            setError("Erreur lors du chargement des données du compte.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadDashboardData(selectedRib, newPage);
    };

    if (loading && !dashboardData) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container dashboard-container fade-in">
                <header className="dashboard-header">
                    <div>
                        <h1>Tableau de bord</h1>
                        <p className="text-gray-500">Bienvenue sur votre espace personnel</p>
                    </div>
                    <div className="account-selector">
                        <select
                            value={selectedRib}
                            onChange={handleAccountChange}
                            className="form-select"
                        >
                            <option value={dashboardData?.rib}>{dashboardData?.rib}</option>
                            {/* Autres comptes si disponibles */}
                        </select>
                    </div>
                </header>

                {error && <div className="alert alert-error">{error}</div>}

                {dashboardData && (
                    <div className="dashboard-grid">
                        {/* Carte Solde */}
                        <div className="card balance-card">
                            <h3>Solde Disponible</h3>
                            <div className="balance-amount">
                                {dashboardData.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                            </div>
                            <div className="balance-rib">RIB: {dashboardData.rib}</div>
                            <div className="balance-date">
                                Dernière opération : {new Date(dashboardData.dateDerniereOperation).toLocaleDateString('fr-FR')}
                            </div>
                        </div>

                        {/* Historique des opérations */}
                        <div className="card operations-card">
                            <h3>Dernières Opérations</h3>
                            <div className="operations-list">
                                {dashboardData.dernieresOperations.length > 0 ? (
                                    <table className="operations-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Opération</th>
                                                <th>Type</th>
                                                <th className="text-right">Montant</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.dernieresOperations.map((op) => (
                                                <tr key={op.id}>
                                                    <td>{new Date(op.dateOperation).toLocaleDateString('fr-FR')}</td>
                                                    <td>
                                                        <div className="op-title">{op.intitule}</div>
                                                        {op.motif && <div className="op-motif">{op.motif}</div>}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${op.type === 'CREDIT' ? 'badge-success' : 'badge-warning'}`}>
                                                            {op.type}
                                                        </span>
                                                    </td>
                                                    <td className={`text-right font-bold ${op.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                                                        {op.type === 'CREDIT' ? '+' : '-'}
                                                        {op.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Aucune opération récente</p>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="pagination">
                                <button
                                    className="btn btn-outline btn-sm"
                                    disabled={page === 0}
                                    onClick={() => handlePageChange(page - 1)}
                                >
                                    Précédent
                                </button>
                                <span>Page {page + 1} / {dashboardData.totalPages || 1}</span>
                                <button
                                    className="btn btn-outline btn-sm"
                                    disabled={page >= dashboardData.totalPages - 1}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DashboardClient;
