import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientService, compteService } from '../services/services';
import Navbar from '../components/Navbar';
import './DashboardAgent.css';

const DashboardAgent = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [clients, setClients] = useState([]);
    const [comptes, setComptes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'clients') {
            loadClients();
        } else if (activeTab === 'comptes') {
            loadComptes();
        }
    }, [activeTab]);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await clientService.getAllClients();
            setClients(data);
        } catch (err) {
            setError("Impossible de charger la liste des clients");
        } finally {
            setLoading(false);
        }
    };

    const loadComptes = async () => {
        try {
            setLoading(true);
            const data = await compteService.getAllComptes();
            setComptes(data);
        } catch (err) {
            setError("Impossible de charger la liste des comptes");
        } finally {
            setLoading(false);
        }
    };

    const renderAccueil = () => (
        <div className="dashboard-grid fade-in">
            <Link to="/agent/nouveau-client" className="menu-card decoration-none">
                <div className="menu-icon bg-primary-100 text-primary-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </div>
                <h3>Nouveau Client</h3>
                <p>Créer un profil client et générer ses identifiants.</p>
            </Link>

            <Link to="/agent/nouveau-compte" className="menu-card decoration-none">
                <div className="menu-icon bg-secondary-100 text-secondary-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                </div>
                <h3>Nouveau Compte</h3>
                <p>Ouvrir un compte bancaire pour un client existant.</p>
            </Link>

            <div className="menu-card pointer" onClick={() => setActiveTab('clients')}>
                <div className="menu-icon bg-info-100 text-info-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h3>Liste Clients</h3>
                <p>Consulter la liste de tous les clients.</p>
            </div>

            <div className="menu-card pointer" onClick={() => setActiveTab('comptes')}>
                <div className="menu-icon bg-warning-100 text-warning-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <h3>Liste Comptes</h3>
                <p>Consulter tous les comptes bancaires.</p>
            </div>
        </div>
    );

    const renderClientsList = () => (
        <div className="list-container fade-in">
            <div className="list-header">
                <h2>Liste des Clients</h2>
                <Link to="/agent/nouveau-client" className="btn btn-primary btn-sm">
                    + Nouveau
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Username (Login)</th>
                            <th>CIN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>{client.nom}</td>
                                <td>{client.prenom}</td>
                                <td>{client.email}</td>
                                <td><strong>{client.username}</strong></td>
                                <td>{client.numeroIdentite}</td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">Aucun client trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderComptesList = () => (
        <div className="list-container fade-in">
            <div className="list-header">
                <h2>Liste des Comptes</h2>
                <Link to="/agent/nouveau-compte" className="btn btn-primary btn-sm">
                    + Nouveau
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>RIB</th>
                            <th>Client</th>
                            <th>Solde</th>
                            <th>Statut</th>
                            <th>Date Création</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comptes.map(compte => (
                            <tr key={compte.rib}>
                                <td className="font-mono">{compte.rib}</td>
                                <td>{compte.clientNom} {compte.clientPrenom}</td>
                                <td className="font-bold">
                                    {compte.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                                </td>
                                <td>
                                    <span className={`badge badge-${compte.statut === 'OUVERT' ? 'success' : 'warning'}`}>
                                        {compte.statut}
                                    </span>
                                </td>
                                <td>{new Date(compte.dateCreation).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        ))}
                        {comptes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">Aucun compte trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="container dashboard-wrapper">
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'accueil' ? 'active' : ''}`}
                        onClick={() => setActiveTab('accueil')}
                    >
                        Accueil
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        Clients
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'comptes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('comptes')}
                    >
                        Comptes
                    </button>
                </div>

                <div className="dashboard-content">
                    {loading && <div className="spinner-center"><div className="spinner"></div></div>}
                    {error && <div className="alert alert-error">{error}</div>}

                    {!loading && activeTab === 'accueil' && renderAccueil()}
                    {!loading && activeTab === 'clients' && renderClientsList()}
                    {!loading && activeTab === 'comptes' && renderComptesList()}
                </div>
            </div>
        </>
    );
};

export default DashboardAgent;
