import { useEffect, useState } from 'react';
import { enquiryApi } from './api';

const SERVICE_TYPES = ['Loan', 'Insurance', 'Investment', 'Credit Card', 'Other'];
const STATUSES = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function Enquiries() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ customerName: '', mobile: '', serviceType: 'Loan', note: '' });

  function load(p = page) {
    enquiryApi.list(p).then(setData).catch(e => setError(e.message));
  }

  useEffect(() => { load(); }, [page]);

  function field(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await enquiryApi.create(form);
      setShowForm(false); setForm({ customerName: '', mobile: '', serviceType: 'Loan', note: '' }); load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function updateStatus(id, status) {
    try { const updated = await enquiryApi.update(id, { status }); setData(d => ({ ...d, content: d.content.map(x => x.id === updated.id ? updated : x) })); }
    catch (err) { setError(err.message); }
  }

  return (
    <div>
      {error && <div className="error">⚠ {error}</div>}
      <div className="module-header">
        <div><h2 style={{margin:0}}>Enquiries</h2><p className="muted">{data?.totalElements ?? '…'} total</p></div>
        <button className="primary" onClick={() => setShowForm(true)}>+ New Enquiry</button>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <form className="modal-card" onSubmit={submit}>
            <h3>New Enquiry</h3>
            <label>Customer Name<input value={form.customerName} onChange={field('customerName')} required /></label>
            <label>Mobile (10 digits)<input value={form.mobile} onChange={field('mobile')} pattern="\d{10}" required /></label>
            <label>Service Type
              <select value={form.serviceType} onChange={field('serviceType')}>
                {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Note<textarea value={form.note} onChange={field('note')} rows={3} /></label>
            {error && <div className="error">⚠ {error}</div>}
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{selected.customerName}</h3>
            <p className="muted">{selected.mobile} · {selected.serviceType}</p>
            <p>{selected.note || '—'}</p>
            <label>Update Status
              <select value={selected.status} onChange={e => { updateStatus(selected.id, e.target.value); setSelected(s => ({...s, status: e.target.value})); }}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Customer</th><th>Mobile</th><th>Service</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {data?.content?.map(e => (
              <tr key={e.id} onClick={() => setSelected(e)} style={{cursor:'pointer'}}>
                <td><code>{e.id}</code></td>
                <td>{e.customerName}</td>
                <td>{e.mobile}</td>
                <td>{e.serviceType}</td>
                <td><span className={`badge badge-${e.status.toLowerCase()}`}>{e.status}</span></td>
                <td>{new Date(e.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {data?.content?.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',color:'#64748b'}}>No enquiries yet</td></tr>}
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
