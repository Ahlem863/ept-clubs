import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '', email_contact: '' });
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
      await axios.post('http://localhost:3000/api/clubs', form, { headers: { authorization: token } });
      setMessage('Club créé avec succès !'); setMsgType('success');
      setForm({ nom: '', description: '', email_contact: '' });
      fetchClubs();
    } catch (err) { setMessage('Erreur lors de la création'); setMsgType('error'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce club ?')) {
      try { await axios.delete(`http://localhost:3000/api/clubs/${id}`, { headers: { authorization: token } }); fetchClubs(); }
      catch (err) { console.error(err); }
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .c-input { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; margin-bottom:0; }
        .c-input:focus { border-color:#0d1b4b; box-shadow:0 0 0 3px rgba(13,27,75,0.08); background:#fff; }
        .c-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .c-card { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:transform .2s,box-shadow .2s; }
        .c-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.10); }
        .c-delete { padding:8px 16px; border:1.5px solid #ef4444; border-radius:8px; background:transparent; color:#ef4444; font-size:12px; font-weight:500; cursor:pointer; transition:all .2s; }
        .c-delete:hover { background:#ef4444; color:#fff; }
      `}</style>

      <div style={s.header}>
        <div style={s.headerIcon}>🏫</div>
        <div>
          <h1 style={s.title}>Gestion des Clubs</h1>
          <p style={s.subtitle}>{clubs.length} club{clubs.length > 1 ? 's' : ''} enregistré{clubs.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div style={s.formCard}>
        <h2 style={s.formTitle}>Créer un nouveau club</h2>
        {message && (
          <div style={{ ...s.alert, background: msgType === 'success' ? '#d1fae5' : '#fee2e2', color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
            {msgType === 'success' ? '✅' : '❌'} {message}
          </div>
        )}
        <form onSubmit={handleCreate}>
          <div style={s.grid}>
            <div>
              <label className="c-label">Nom du club</label>
              <input className="c-input" type="text" name="nom" placeholder="Ex: Club Robotique" value={form.nom} onChange={handleChange} required />
            </div>
            <div>
              <label className="c-label">Email de contact</label>
              <input className="c-input" type="email" name="email_contact" placeholder="Ex: club@ept.tn" value={form.email_contact} onChange={handleChange} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="c-label">Description</label>
            <textarea className="c-input" name="description" placeholder="Décrivez le club..." value={form.description} onChange={handleChange} rows="3" style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" style={s.submitBtn}>+ Créer le club</button>
        </form>
      </div>

      <h2 style={s.sectionTitle}>Clubs enregistrés</h2>
      {clubs.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
          <p style={s.emptyText}>Aucun club pour le moment.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {clubs.map((club, i) => (
            <div key={club.id} className="c-card">
              <div style={{ ...s.cardTop, background: i % 2 === 0 ? 'linear-gradient(135deg, #0d1b4b, #1a2f6b)' : 'linear-gradient(135deg, #1a2f6b, #c9a84c)' }}>
                <div style={s.clubInitial}>{club.nom.charAt(0).toUpperCase()}</div>
                <h3 style={s.cardTitle}>{club.nom}</h3>
              </div>
              <div style={s.cardBody}>
                {club.description && <p style={s.desc}>{club.description}</p>}
                {club.email_contact && <p style={s.infoRow}>📧 <span>{club.email_contact}</span></p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={s.badge}>Actif</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => window.location.href = `/clubs/${club.id}`}
                      style={s.detailBtn}>
                      Voir détails
                    </button>
                    <button className="c-delete" onClick={() => handleDelete(club.id)}>Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
  formTitle: { fontSize: 18, fontWeight: 600, color: '#0d1b4b', marginBottom: 24, fontFamily: "'Playfair Display', serif" },
  alert: { padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  submitBtn: { padding: '12px 28px', background: '#0d1b4b', color: '#c9a84c', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  detailBtn: { padding: '8px 16px', background: '#0d1b4b', color: '#c9a84c', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", marginBottom: 20 },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  cardTop: { padding: '24px', display: 'flex', alignItems: 'center', gap: 16 },
  clubInitial: { width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,168,76,0.25)', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  cardTitle: { fontSize: 17, fontWeight: 600, color: '#fff', fontFamily: "'Playfair Display', serif", margin: 0 },
  cardBody: { padding: '20px 24px' },
  desc: { fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.6 },
  infoRow: { fontSize: 13, color: '#64748b', margin: '6px 0', display: 'flex', gap: 8 },
  badge: { fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: '#d1fae5', color: '#065f46' },
};

export default Clubs;