import React, { useState, useEffect, lazy } from 'react';
import { Route } from 'react-router-dom';
const NetworkDashboard = lazy(() => import('./NetworkDashboard/src/NetworkDashboard'));
import ConcentricCirclesDashboard from './ConcentricCirclesDashboard/ConcentricCirclesDashboard';
import ConnectedSystemDashboard from './ConnectedSystemDashboard';
import { getDashboardDetails } from '../services/dashboard.js';
import CatsDashboard from './CatsDashboard/CatsDashboard';
import DiagnosemeHome from '../components/Diagnoseme/home';
import DiagnosemeHomeClone from '../components/Diagnoseme-clone/home';
import ConnectedSystemDashboardRedesign from 'components/connectedSystemRedesign/ConnectedSystemDashboardRedesign.jsx';
import AdminHome from 'components/connectedSystemRedesign/Admin/AdminHome.jsx';
import SingularDashboard from 'components/Marketing/SingularDashboard.jsx';

export default function DashboardsWrapper(props) {
    const [dashboard, setDashboard] = useState(null);
    const [isConnSystem, setIsConnSystem] = useState(false);
    const [connSystemId, setConnSystemId] = useState(null);

    const getDashboardDetailsCallback = (dashboardDetails) => {
        dashboardDetails && setDashboard(dashboardDetails);
    };

    useEffect(() => {
        const connSystemId = props.match.params['conn_system_dashboard_id'];
        const dashboardId = props.match.params['dashboard_id'];
        const dashboardUrl = props.match.params['dashboard_url'];

        if (connSystemId) {
            setConnSystemId(connSystemId);
            setIsConnSystem(true);
        } else {
            getDashboardDetails({
                payload: {
                    ...(dashboardId && { dashboard_id: dashboardId }),
                    ...(dashboardUrl && { dashboard_url: dashboardUrl })
                },
                callback: getDashboardDetailsCallback
            });
        }
    }, []);

    if (isConnSystem) {
        return [
            <Route
                key="connected-systems"
                exact
                path="/connected-system/:conn_system_dashboard_id"
                component={() => (
                    <ConnectedSystemDashboardRedesign connSystemDashboardId={connSystemId} />
                )}
            />,
            <Route
                key="connected-systems-admin"
                path="/connected-system/:conn_system_dashboard_id/admin"
                component={() => <AdminHome connSystemDashboardId={connSystemId} />}
            />
        ];
    }

    if (!dashboard?.template?.name) return null;

    switch (dashboard?.template?.name.toLowerCase()) {
        case 'diagnoseme':
            return <DiagnosemeHome dashboardId={dashboard.id} />;
        case 'diagnoseme-clone':
            return <DiagnosemeHomeClone dashboardId={dashboard.id} />;
        case 'network':
            return <NetworkDashboard dashboardId={dashboard.id} />;
        case 'concentric circles':
            return <ConcentricCirclesDashboard dashboardId={dashboard.id} />;
        case 'connected system':
            return (
                <ConnectedSystemDashboard
                    dashboardId={dashboard.id}
                    dashboardCode={dashboard.code}
                />
            );
        case 'connected system redesign':
            return [
                <Route
                    key="dashboards"
                    exact
                    path="/dashboards/:dashboard_id"
                    component={() => (
                        <ConnectedSystemDashboardRedesign
                            dashboardId={dashboard.id}
                            connSystemDashboardId={dashboard.conn_system_dashboard_id}
                            dashboardCode={dashboard.code}
                        />
                    )}
                />,
                <Route
                    key="dashboards-admin"
                    path="/dashboards/:dashboard_id/admin"
                    component={() => (
                        <AdminHome
                            dashboardId={dashboard.id}
                            connSystemDashboardId={dashboard.conn_system_dashboard_id}
                            dashboardCode={dashboard.code}
                        />
                    )}
                />
            ];
        case 'cats':
            return <CatsDashboard dashboardId={dashboard.id} />;
        case 'nucilos revenue management':
            return <SingularDashboard />;
        default:
            return null;
    }
}
