import { useEffect, useState } from 'react';
import { dashboardApi } from './api';
import { useAuth } from './AuthContext';

const navigation = ['Dashboard', 'Enquiries', 'Operations', 'Users & Hierarchy', 'Companies', 'Complaints', 'Wallet & Commission', 'Reports', 'Audit Log'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.summary().then(setSummary).catch(err => setError(err.message));
  }, []);

  function choose(item) {
    setActive(item);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-brand"><span>LC</span><strong>Local Connect</strong></div>
        <small>Logged in as {user.roleLabel}</small>
        <nav>{navigation.map(item => <button className={active === item ? 'active' : ''} onClick={() => choose(item)} key={item}>{item}</button>)}</nav>
        <button className="logout" onClick={logout}>Logout</button>
      </aside>
      {menuOpen && <button className="backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
      <div className="page">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <div><p className="eyebrow">{user.roleLabel}</p><h1>{active}</h1></div>
          <div className="top-actions"><button title="Search">⌕</button><button title="Notifications">🔔</button><button className="avatar" title="Profile">{user.initials}</button></div>
        </header>
        <main className="content">
          {error && <div className="error">API connection: {error}</div>}
          {active === 'Dashboard' ? <DashboardHome summary={summary} user={user} /> : <ModulePlaceholder name={active} />}
        </main>
      </div>
      <nav className="bottom-nav">{['Dashboard', 'Enquiries', 'Operations'].map(item => <button onClick={() => choose(item)} key={item}>{item}</button>)}</nav>
    </div>
  );
}

function DashboardHome({ summary, user }) {
  const cards = summary?.cards || [];
  return <>
    <section className="welcome"><div><h2>नमस्ते, {user.name}</h2><p>आपके authorized scope का live overview</p></div><button className="primary">+ New Enquiry</button></section>
    <section className="kpi-grid">{cards.length ? cards.map(card => <article className="kpi" key={card.label}><span>{card.label}</span><strong>{card.value}</strong><small>{card.note}</small></article>) : [1,2,3,4].map(i => <article className="kpi skeleton" key={i} />)}</section>
    <section className="panel"><div className="section-head"><div><h2>Priority Work Queue</h2><p>New enquiries पहले और सामान्य finance work अंत में</p></div><button className="link-button">View all →</button></div><div className="empty-state"><span>✓</span><h3>Queue ready है</h3><p>Java API से assigned work आते ही यहाँ दिखाई देगा।</p></div></section>
    <section className="two-column"><article className="panel"><h2>Hierarchy</h2><p className="muted">Client → AP → SAP → Branch → HOD → Operations → Company → Admin</p></article><article className="panel"><h2>Recent Activity</h2><p className="muted">Login और महत्वपूर्ण actions audit trail में सुरक्षित होंगे।</p></article></section>
  </>;
}

function ModulePlaceholder({ name }) {
  return <section className="panel module-placeholder"><span>◫</span><h2>{name}</h2><p>इस module का React route और Java API अगली migration unit में मौजूदा demo data के साथ जोड़ा जाएगा।</p></section>;
}
