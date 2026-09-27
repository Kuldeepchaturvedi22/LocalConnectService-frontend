import { AuthProvider, useAuth } from './AuthContext';
import Dashboard from './Dashboard';
import Login from './Login';

function Router() {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot-screen">LocalConnectService loading…</div>;
  return user ? <Dashboard /> : <Login />;
}

export default function App() { return <AuthProvider><Router /></AuthProvider>; }
