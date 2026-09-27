import { useEffect, useState } from 'react';
import { userApi } from './api';

const ROLES = ['CLIENT','ASSOCIATE','SUPER_ASSOCIATE','BRANCH','HOD','OPERATIONS','COMPANY_PARTNER','ADMIN','SUPER_ADMIN'];
const ROLE_LABELS = { CLIENT:'Client', ASSOCIATE:'AP', SUPER_ASSOCIATE:'SAP', BRANCH:'Branch', HOD:'HOD', OPERATIONS:'Operation Team', COMPANY_PARTNER:'Company', ADMIN:'Admin', SUPER_ADMIN:'Super Admin' };

export default function Users() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '', password: '', role: 'CLIENT' });

  function load(p = page) {
    userApi.list(p).then(setData).catch(e => setError(e.message));
  }

  useEffect(() => { load(); }, [page]);

  function field(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await userApi.create(form);
      setShowForm(false); setForm({ fullName: '', mobile: '', email: '', password: '', role: 'CLIENT' }); load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div>
      {error && <div className="error">⚠ {error}</div>}
      <div className="module-header">
        <div><h2 style={{margin:0}}>Users & Hierarchy</h2><p className="muted">{data?.totalElements ?? '…'} total</p></div>
        <button className="primary" onClick={() => setShowForm(true)}>+ Add User</button>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <form className="modal-card" onSubmit={submit}>
            <h3>Add User</h3>
            <label>Full Name<input value={form.fullName} onChange={field('fullName')} required /></label>
            <label>Mobile (10 digits)<input value={form.mobile} onChange={field('mobile')} pattern="\d{10}" required /></label>
            <label>Email<input type="email" value={form.email} onChange={field('email')} /></label>
            <label>Password<input type="password" value={form.password} onChange={field('password')} required minLength={6} /></label>
            <label>Role
              <select value={form.role} onChange={field('role')}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </label>
            {error && <div className="error">⚠ {error}</div>}
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Add User'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            {data?.content?.map(u => (
              <tr key={u.id}>
                <td><code>{u.id}</code></td>
                <td>{u.fullName}</td>
                <td>{u.mobile}</td>
                <td><span className="badge badge-role">{u.roleLabel}</span></td>
                <td><span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {data?.content?.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',color:'#64748b'}}>No users yet</td></tr>}
          </tbody>
        </table>
      </div>
      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page + 1} of {data.totalPages}</span>
          <button disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
