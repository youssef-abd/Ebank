import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/services';

const PrivateRoute = ({ allowedRoles, children }) => {
    const currentUser = authService.getCurrentUser();

    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Si l'utilisateur n'a pas le droit, on affiche le message d'erreur spécifique demandé
        return (
            <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                <div className="alert alert-error" style={{ display: 'inline-block', padding: '20px' }}>
                    <h3>Accès Refusé</h3>
                    <p>Vous n’avez pas le droit d’accéder à cette fonctionnalité. Veuillez contacter votre administrateur.</p>
                    <button
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '10px' }}
                        onClick={() => window.history.back()}
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return children ? children : <Outlet />;
};

export default PrivateRoute;
