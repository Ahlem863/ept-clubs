import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Membres() {
  const [clubs, setClubs] = useState([]);
  const [membres, setMembres] = useState([]);
  const [clubSelectionne, setClubSelectionne] = useState('');
  const [form, setForm] = useState({ user_id: '', club_id: '', role_interne: 'membre' });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchClubs(); }, []);

  const fetchClubs = async () => {
    try { const res = await axios.get('http://localhost:3000/api/clubs'); setClubs(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchMembres = async (club_id) => {
    try { const res = await axios.get(`http://localhost:3000/api/membres/${club_id}`); setMembres(res.data); }
    catch (err) { console.error(err); }
  };

  const handleClubChange = (e) => {
    setClubSelectionne(e.target.value);
    setForm({ ...form, club_id: e.target.value });
    if (e.target.value) fetchMembres(e.target.value);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAjouter = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/membres', form, { headers: { authorization: token } });
      setMessage('Membre ajouté avec succès !'); setMsgType('success');
      fetchMembres(clubSelectionne);
      setForm({ ...form, user_id: '', role_interne: 'membre' });
    } catch (err) { setMessage("Erreur lors de l'ajout"); setMsgType('error'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSupprimer = async (id) => {
    if (window.confirm('Retirer ce membre du club ?')) {
      try { await axios.delete(`http://localhost:3000/api/membres/${id}`, { headers: { authorization: token } }); fetchMembres(clubSelectionne); }
      catch (err) { console.error(err); }
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(`http://localhost:3000/api/membres/${id}`, { role_interne: role }, { headers: { authorization: token } });
      fetchMembres(clubSelectionne);
    } catch (err) { console.error(err); }
  };

  const getRoleBadge = (role) => {
    const map = {
      responsable: { color: '#7c3aed', bg: '#ede9fe' },
      tresorier:   { color: '#b45309', bg: '#fef3c7' },
      secretaire:  { color: '#0369a1', bg: '#e0f2fe' },
      membre:      { color: '#16a34a', bg: '#dcfce7' },
    };
    return map[role] || map['membre'];
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .m-input { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; }
        .m-input:focus { border-color:#0d1b4b; box-shadow:0 0 0 3px rgba(13,27,75,0.08); background:#fff; }
        .m-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .m-row:hover { background:#f8fafc !important; }
        .m-select-role { padding:5px 10px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:12px; font-family:'DM Sans',sans-serif; color:#1e293b; background:#fff; outline:none; cursor:pointer; }
      `}</style>

      <div style={s.header}>
        <div style={s.headerIcon}>👥</div>
        <div>
          <h1 style={s.title}>Gestion des Membres</h1>
          <p style={s.subtitle}>Gérez les membres et leurs rôles dans chaque club</p>
        </div>
      </div>

      <div style={s.formCard}>
        <h2 style={s.formTitle}>Sélectionner un club</h2>
        <div style={{ marginBottom: clubSelectionne ? 28 : 0 }}>
          <label className="m-label">Club</label>
          <select className="m-input" value={clubSelectionne} onChange={handleClubChange}>
            <option value="">-- Choisir un club --</option>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>

        {clubSelectionne && (
          <>
            <div style={s.divider} />
            <h2 style={s.formTitle}>Ajouter un membre</h2>
            {message && (
              <div style={{ ...s.alert, background: msgType === 'success' ? '#d1fae5' : '#fee2e2', color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
                {msgType === 'success' ? '✅' : '❌'} {message}
              </div>
            )}
            <form onSubmit={handleAjouter}>
              <div style={s.grid}>
                <div>
                  <label className="m-label">ID Utilisateur</label>
                  <input className="m-input" type="number" name="user_id" value={form.user_id} onChange={handleChange} required placeholder="Ex: 1, 2, 3..." />
                </div>
                <div>
                  <label className="m-label">Rôle interne</label>
                  <select className="m-input" name="role_interne" value={form.role_interne} onChange={handleChange}>
                    <option value="membre">Membre</option>
                    <option value="responsable">Responsable</option>
                    <option value="tresorier">Trésorier</option>
                    <option value="secretaire">Secrétaire</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={s.submitBtn}>+ Ajouter le membre</button>
            </form>
          </>
        )}
      </div>

      {membres.length > 0 && (
        <>
          <h2 style={s.sectionTitle}>
            Membres — <span style={{ color: '#c9a84c' }}>{clubs.find(c => c.id == clubSelectionne)?.nom}</span>
            <span style={s.countBadge}>{membres.length} membre{membres.length > 1 ? 's' : ''}</span>
          </h2>
          <div style={s.tableCard}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Membre</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Rôle</th>
                  <th style={s.th}>Date d'adhésion</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {membres.map((m, i) => {
                  const badge = getRoleBadge(m.role_interne);
                  return (
                    <tr key={m.id} className="m-row" style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={s.avatar}>{m.prenom?.charAt(0)}{m.nom?.charAt(0)}</div>
                          <span style={{ fontWeight: 600, color: '#0d1b4b' }}>{m.prenom} {m.nom}</span>
                        </div>
                      </td>
                      <td style={{ ...s.td, color: '#64748b' }}>{m.email}</td>
                      <td style={s.td}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: badge.bg, color: badge.color }}>
                          {m.role_interne}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: '#64748b' }}>{new Date(m.date_adhesion).toLocaleDateString('fr-FR')}</td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <select className="m-select-role" value={m.role_interne} onChange={(e) => handleRoleChange(m.id, e.target.value)}>
                            <option value="membre">Membre</option>
                            <option value="responsable">Responsable</option>
                            <option value="tresorier">Trésorier</option>
                            <option value="secretaire">Secrétaire</option>
                          </select>
                          <button onClick={() => handleSupprimer(m.id)} style={s.deleteBtn}>✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {clubSelectionne && membres.length === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
          <p style={s.emptyText}>Aucun membre dans ce club pour le moment.</p>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '32px', fontFamily: "'DM Sans', sans-serif", background: '#f1f5f9', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  headerIcon: { fontSize: 36, background: '#0d1b4b', borderRadius: 16, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  formCard: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 32 },
  formTitle: { fontSize: 18, fontWeight: 600, color: '#0d1b4b', marginBottom: 20, fontFamily: "'Playfair Display', serif" },
  divider: { height: 1, background: '#f1f5f9', margin: '24px 0' },
  alert: { padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  submitBtn: { padding: '12px 28px', background: '#0d1b4b', color: '#c9a84c', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 },
  countBadge: { fontSize: 13, fontWeight: 500, color: '#64748b', background: '#f1f5f9', padding: '3px 12px', borderRadius: 20 },
  tableCard: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '2px solid #f1f5f9', background: '#fafafa' },
  td: { padding: '14px 16px', fontSize: 14, borderBottom: '1px solid #f1f5f9' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#0d1b4b', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  deleteBtn: { width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 700 },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyText: { color: '#94a3b8', fontSize: 15 },
};

export default Membres;