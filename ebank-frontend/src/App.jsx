import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardClient from './pages/DashboardClient';
import DashboardAgent from './pages/DashboardAgent';
import Virement from './pages/Virement';
import NewClient from './pages/NewClient';
import NewAccount from './pages/NewAccount';
import ChangePassword from './pages/ChangePassword';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Routes Client */}
                <Route
                    path="/client/dashboard"
                    element={
                        <PrivateRoute allowedRoles={['CLIENT']}>
                            <DashboardClient />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/client/virement"
                    element={
                        <PrivateRoute allowedRoles={['CLIENT']}>
                            <Virement />
                        </PrivateRoute>
                    }
                />

                {/* Routes Agent */}
                <Route
                    path="/agent/dashboard"
                    element={
                        <PrivateRoute allowedRoles={['AGENT_GUICHET']}>
                            <DashboardAgent />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/agent/nouveau-client"
                    element={
                        <PrivateRoute allowedRoles={['AGENT_GUICHET']}>
                            <NewClient />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/agent/nouveau-compte"
                    element={
                        <PrivateRoute allowedRoles={['AGENT_GUICHET']}>
                            <NewAccount />
                        </PrivateRoute>
                    }
                />

                {/* Routes Communes */}
                <Route
                    path="/change-password"
                    element={
                        <PrivateRoute allowedRoles={['CLIENT', 'AGENT_GUICHET']}>
                            <ChangePassword />
                        </PrivateRoute>
                    }
                />

                {/* Redirection par défaut */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Route 404 : Redirection vers login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
