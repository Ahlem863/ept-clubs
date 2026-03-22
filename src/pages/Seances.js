import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Seances() {
  const [seances, setSeances] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ club_id: '', titre: '', theme: '', salle: '', date_seance: '', responsable_id: '' });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchSeances(); fetchClubs(); }, []);

  const fetchSeances = async () => {
    try { const res = await axios.get('http://localhost:3000/api/seances/1'); setSeances(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchClubs = async () => {
    try { const res = await axios.get('http://localhost:3000/api/clubs'); setClubs(res.data); }
    catch (err) { console.error(err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/seances', form, { headers: { authorization: token } });
      setMessage('Séance planifiée avec succès !'); setMsgType('success');
      setForm({ club_id: '', titre: '', theme: '', salle: '', date_seance: '', responsable_id: '' });
      fetchSeances();
    } catch (err) { setMessage('Erreur lors de la création'); setMsgType('error'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStatut = async (id, statut) => {
    try {
      await axios.put(`http://localhost:3000/api/seances/${id}`, { statut }, { headers: { authorization: token } });
      fetchSeances();
    } catch (err) { console.error(err); }
  };

  const getStatut = (statut) => {
    const map = {
      confirmee: { label: 'Confirmée', color: '#10b981', bg: '#d1fae5' },
      annulee:   { label: 'Annulée',   color: '#ef4444', bg: '#fee2e2' },
      planifiee: { label: 'Planifiée', color: '#3b82f6', bg: '#dbeafe' },
    };
    return map[statut] || map['planifiee'];
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .s-input { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; }
        .s-input:focus { border-color:#0d1b4b; box-shadow:0 0 0 3px rgba(13,27,75,0.08); background:#fff; }
        .s-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .s-btn-confirm { padding:7px 14px; border:none; border-radius:8px; background:#10b981; color:#fff; font-size:12px; font-weight:500; cursor:pointer; transition:opacity .2s; }
        .s-btn-confirm:hover { opacity:.85; }
        .s-btn-cancel { padding:7px 14px; border:none; border-radius:8px; background:#ef4444; color:#fff; font-size:12px; font-weight:500; cursor:pointer; transition:opacity .2s; }
        .s-btn-cancel:hover { opacity:.85; }
        .s-card { background:#fff; border-radius:16px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.06); border-left:4px solid #0d1b4b; transition:transform .2s,box-shadow .2s; }
        .s-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.10); }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerIcon}>📋</div>
        <div>
          <h1 style={s.title}>Gestion des Séances</h1>
          <p style={s.subtitle}>{seances.length} séance{seances.length > 1 ? 's' : ''} enregistrée{seances.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div style={s.formCard}>
        <h2 style={s.formTitle}>Planifier une nouvelle séance</h2>
        {message && (
          <div style={{ ...s.alert, background: msgType === 'success' ? '#d1fae5' : '#fee2e2', color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
            {msgType === 'success' ? '✅' : '❌'} {message}
          </div>
        )}
        <form onSubmit={handleCreate}>
          <div style={s.grid}>
            <div>
              <label className="s-label">Club</label>
              <select className="s-input" name="club_id" value={form.club_id} onChange={handleChange} required>
                <option value="">Sélectionner un club</option>
                {clubs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="s-label">Titre</label>
              <input className="s-input" type="text" name="titre" value={form.titre} onChange={handleChange} placeholder="Ex: Atelier robotique" required />
            </div>
            <div>
              <label className="s-label">Thème</label>
              <input className="s-input" type="text" name="theme" value={form.theme} onChange={handleChange} placeholder="Ex: Intelligence artificielle" />
            </div>
            <div>
              <label className="s-label">Salle</label>
              <input className="s-input" type="text" name="salle" value={form.salle} onChange={handleChange} placeholder="Ex: Salle B201" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="s-label">Date et heure</label>
              <input className="s-input" type="datetime-local" name="date_seance" value={form.date_seance} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" style={s.submitBtn}>
            + Planifier la séance
          </button>
        </form>
      </div>

      {/* Liste des séances */}
      <h2 style={s.sectionTitle}>Séances planifiées</h2>
      {seances.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p style={s.emptyText}>Aucune séance pour le moment.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {seances.map(s2 => {
            const st = getStatut(s2.statut);
            return (
              <div key={s2.id} className="s-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 }}>{s2.titre}</h3>
                  <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: '4px 10px', borderRadius: 20 }}>{st.label}</span>
                </div>
                {s2.theme && <p style={s.infoRow}>📚 <span>{s2.theme}</span></p>}
                {s2.salle && <p style={s.infoRow}>🏫 <span>{s2.salle}</span></p>}
                <p style={s.infoRow}>🗓 <span>{new Date(s2.date_seance).toLocaleString('fr-FR')}</span></p>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="s-btn-confirm" onClick={() => handleStatut(s2.id, 'confirmee')}>✓ Confirmer</button>
                  <button className="s-btn-cancel" onClick={() => handleStatut(s2.id, 'annulee')}>✕ Annuler</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '32px', fontFamily: "'DM Sans', sans-serif", background: '#f1f5f9', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  headerIcon: { fontSize: 40, background: '#0d1b4b', borderRadius: 16, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  formCard: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 32 },
  formTitle: { fontSize: 18, fontWeight: 600, color: '#0d1b4b', marginBottom: 24, fontFamily: "'Playfair Display', serif" },
  alert: { padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  submitBtn: { padding: '12px 28px', background: '#0d1b4b', color: '#c9a84c', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '.3px' },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", marginBottom: 20 },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  infoRow: { fontSize: 13, color: '#64748b', margin: '6px 0', display: 'flex', gap: 8 },
};

export default Seances;