import { useEffect, useState } from 'react';
import { companyApi } from './api';

const CATEGORIES = ['Loan', 'Insurance', 'Investment', 'Credit Card', 'Other'];

export default function Companies() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', contactName: '', mobile: '', serviceCategory: 'Loan' });

  function load(p = page) {
    companyApi.list(p).then(setData).catch(e => setError(e.message));
  }

  useEffect(() => { load(); }, [page]);

  function field(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await companyApi.create(form);
      setShowForm(false); setForm({ name: '', contactName: '', mobile: '', serviceCategory: 'Loan' }); load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function toggleStatus(company) {
    const status = company.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try { const updated = await companyApi.update(company.id, { status }); setData(d => ({ ...d, content: d.content.map(x => x.id === updated.id ? updated : x) })); }
    catch (err) { setError(err.message); }
  }

  return (
    <div>
      {error && <div className="error">⚠ {error}</div>}
      <div className="module-header">
        <div><h2 style={{margin:0}}>Companies</h2><p className="muted">{data?.totalElements ?? '…'} total</p></div>
        <button className="primary" onClick={() => setShowForm(true)}>+ Add Company</button>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <form className="modal-card" onSubmit={submit}>
            <h3>Add Company</h3>
            <label>Company Name<input value={form.name} onChange={field('name')} required /></label>
            <label>Contact Person<input value={form.contactName} onChange={field('contactName')} required /></label>
            <label>Mobile (10 digits)<input value={form.mobile} onChange={field('mobile')} pattern="\d{10}" required /></label>
            <label>Service Category
              <select value={form.serviceCategory} onChange={field('serviceCategory')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            {error && <div className="error">⚠ {error}</div>}
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Mobile</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>
            {data?.content?.map(c => (
              <tr key={c.id}>
                <td><code>{c.id}</code></td>
                <td>{c.name}</td>
                <td>{c.contactName}</td>
                <td>{c.mobile}</td>
                <td>{c.serviceCategory}</td>
                <td><button className={`badge badge-${c.status.toLowerCase()}`} onClick={() => toggleStatus(c)}>{c.status}</button></td>
              </tr>
            ))}
            {data?.content?.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',color:'#64748b'}}>No companies yet</td></tr>}
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
