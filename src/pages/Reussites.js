import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reussites() {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ club_id: '', titre: '', description: '', date_competition: '', resultat: '' });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchClubs(); }, []);

  const fetchClubs = async () => {
    try { const res = await axios.get('http://localhost:3000/api/clubs'); setClubs(res.data); }
    catch (err) { console.error(err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/reussites', form, { headers: { authorization: token } });
      setMessage('Réussite enregistrée avec succès !'); setMsgType('success');
      setForm({ club_id: '', titre: '', description: '', date_competition: '', resultat: '' });
    } catch (err) { setMessage("Erreur lors de l'enregistrement"); setMsgType('error'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .r-input { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; }
        .r-input:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,0.12); background:#fff; }
        .r-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .r-row:hover { background:#f8fafc !important; }
      `}</style>

      <div style={s.header}>
        <div style={s.headerIcon}>🏆</div>
        <div>
          <h1 style={s.title}>Réussites & Scoring</h1>
          <p style={s.subtitle}>Valorisez les performances de vos clubs</p>
        </div>
      </div>

      <div style={s.formCard}>
        <h2 style={s.formTitle}>Enregistrer une réussite</h2>
        {message && (
          <div style={{ ...s.alert, background: msgType === 'success' ? '#d1fae5' : '#fee2e2', color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
            {msgType === 'success' ? '✅' : '❌'} {message}
          </div>
        )}
        <form onSubmit={handleCreate}>
          <div style={s.grid}>
            <div>
              <label className="r-label">Club</label>
              <select className="r-input" name="club_id" value={form.club_id} onChange={handleChange} required>
                <option value="">Sélectionner un club</option>
                {clubs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="r-label">Titre de la compétition</label>
              <input className="r-input" type="text" name="titre" value={form.titre} onChange={handleChange} placeholder="Ex: Hackathon national" required />
            </div>
            <div>
              <label className="r-label">Résultat</label>
              <input className="r-input" type="text" name="resultat" placeholder="Ex: 1er prix" value={form.resultat} onChange={handleChange} />
            </div>
            <div>
              <label className="r-label">Date de la compétition</label>
              <input className="r-input" type="date" name="date_competition" value={form.date_competition} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="r-label">Description</label>
            <textarea className="r-input" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Décrivez la réussite..." style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" style={s.submitBtn}>🏅 Enregistrer la réussite</button>
        </form>
      </div>

      <div style={s.rankCard}>
        <div style={s.rankHeader}>
          <span style={{ fontSize: 40 }}>🥇</span>
          <div>
            <h2 style={s.rankTitle}>Classement — Club de l'année</h2>
            <p style={s.rankSubtitle}>Basé sur les performances, événements et compétitions</p>
          </div>
        </div>
        {clubs.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div>
            <p style={s.emptyText}>Aucun club enregistré.</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Rang</th>
                <th style={s.th}>Club</th>
                <th style={s.th}>Score</th>
                <th style={s.th}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club, i) => (
                <tr key={club.id} className="r-row" style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', transition: 'background .15s' }}>
                  <td style={s.td}>
                    <span style={{ fontSize: i < 3 ? 24 : 14, fontWeight: 700, color: i < 3 ? 'inherit' : '#64748b' }}>
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#0d1b4b' }}>{club.nom}</td>
                  <td style={s.td}>
                    <div style={s.scoreBar}>
                      <div style={{ ...s.scoreBarFill, width: `${Math.max(10, 100 - i * 15)}%` }} />
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                      background: i === 0 ? '#fef3c7' : '#f1f5f9',
                      color: i === 0 ? '#92400e' : '#64748b'
                    }}>
                      {i === 0 ? '⭐ Leader' : 'Actif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '32px', fontFamily: "'DM Sans', sans-serif", background: '#f1f5f9', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  headerIcon: { fontSize: 36, background: 'linear-gradient(135deg, #c9a84c, #f0c040)', borderRadius: 16, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  formCard: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 32 },
  formTitle: { fontSize: 18, fontWeight: 600, color: '#0d1b4b', marginBottom: 24, fontFamily: "'Playfair Display', serif" },
  alert: { padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #c9a84c, #f0c040)', color: '#0d1b4b', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  rankCard: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  rankHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' },
  rankTitle: { fontSize: 20, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 },
  rankSubtitle: { fontSize: 13, color: '#94a3b8', margin: '4px 0 0' },
  empty: { textAlign: 'center', padding: '40px 0' },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '2px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: 14, borderBottom: '1px solid #f1f5f9' },
  scoreBar: { height: 6, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden', width: 100 },
  scoreBarFill: { height: '100%', background: 'linear-gradient(90deg, #c9a84c, #f0c040)', borderRadius: 10 },
};

export default Reussites;