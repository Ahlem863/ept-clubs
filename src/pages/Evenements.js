import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Evenements() {
  const [evenements, setEvenements] = useState([]);
  const [form, setForm] = useState({ club_id: '', titre: '', description: '', lieu: '', date_debut: '', date_fin: '', theme: '' });
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [inscriptions, setInscriptions] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchEvenements(); fetchClubs(); }, []);

  const fetchEvenements = async () => {
    try { const res = await axios.get('http://localhost:3000/api/evenements'); setEvenements(res.data); }
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
      await axios.post('http://localhost:3000/api/evenements', form, { headers: { authorization: token } });
      setMessage('Événement créé avec succès !'); setMsgType('success');
      setForm({ club_id: '', titre: '', description: '', lieu: '', date_debut: '', date_fin: '', theme: '' });
      fetchEvenements();
    } catch (err) { setMessage('Erreur lors de la création'); setMsgType('error'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet événement ?')) {
      try { await axios.delete(`http://localhost:3000/api/evenements/${id}`, { headers: { authorization: token } }); fetchEvenements(); }
      catch (err) { console.error(err); }
    }
  };

  const handleInscrire = async (eventId) => {
    try {
      await axios.post(`http://localhost:3000/api/evenements/${eventId}/inscrire`,
        { user_id: user.id },
        { headers: { authorization: token } }
      );
      setInscriptions({ ...inscriptions, [eventId]: true });
      setMessage('Inscription réussie !'); setMsgType('success');
    } catch (err) { setMessage('Erreur lors de l\'inscription'); setMsgType('error'); }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .e-input { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; }
        .e-input:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,0.12); background:#fff; }
        .e-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .e-card { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:transform .2s,box-shadow .2s; }
        .e-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.10); }
        .e-delete { padding:8px 16px; border:1.5px solid #ef4444; border-radius:8px; background:transparent; color:#ef4444; font-size:12px; font-weight:500; cursor:pointer; transition:all .2s; }
        .e-delete:hover { background:#ef4444; color:#fff; }
        .e-inscrire { padding:8px 16px; border:none; border-radius:8px; background:#0d1b4b; color:#c9a84c; font-size:12px; font-weight:600; cursor:pointer; transition:opacity .2s; }
        .e-inscrire:hover { opacity:.85; }
        .e-inscrit { padding:8px 16px; border:none; border-radius:8px; background:#d1fae5; color:#065f46; font-size:12px; font-weight:600; cursor:default; }
      `}</style>

      <div style={s.header}>
        <div style={s.headerIcon}>📅</div>
        <div>
          <h1 style={s.title}>Gestion des Événements</h1>
          <p style={s.subtitle}>{evenements.length} événement{evenements.length > 1 ? 's' : ''} organisé{evenements.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {message && (
        <div style={{ ...s.alertGlobal, background: msgType === 'success' ? '#d1fae5' : '#fee2e2', color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
          {msgType === 'success' ? '✅' : '❌'} {message}
        </div>
      )}

      <div style={s.formCard}>
        <h2 style={s.formTitle}>Créer un nouvel événement</h2>
        <form onSubmit={handleCreate}>
          <div style={s.grid}>
            <div>
              <label className="e-label">Club</label>
              <select className="e-input" name="club_id" value={form.club_id} onChange={handleChange} required>
                <option value="">Sélectionner un club</option>
                {clubs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="e-label">Titre</label>
              <input className="e-input" type="text" name="titre" value={form.titre} onChange={handleChange} placeholder="Ex: Journée portes ouvertes" required />
            </div>
            <div>
              <label className="e-label">Lieu</label>
              <input className="e-input" type="text" name="lieu" value={form.lieu} onChange={handleChange} placeholder="Ex: Amphithéâtre A" />
            </div>
            <div>
              <label className="e-label">Thème</label>
              <input className="e-input" type="text" name="theme" value={form.theme} onChange={handleChange} placeholder="Ex: Innovation & Tech" />
            </div>
            <div>
              <label className="e-label">Date début</label>
              <input className="e-input" type="datetime-local" name="date_debut" value={form.date_debut} onChange={handleChange} required />
            </div>
            <div>
              <label className="e-label">Date fin</label>
              <input className="e-input" type="datetime-local" name="date_fin" value={form.date_fin} onChange={handleChange} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="e-label">Description</label>
            <textarea className="e-input" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Décrivez l'événement..." style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" style={s.submitBtn}>+ Créer l'événement</button>
        </form>
      </div>

      <h2 style={s.sectionTitle}>Événements à venir</h2>
      {evenements.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎪</div>
          <p style={s.emptyText}>Aucun événement pour le moment.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {evenements.map(ev => (
            <div key={ev.id} className="e-card">
              <div style={s.cardTop}>
                {ev.theme && <span style={s.themeBadge}>{ev.theme}</span>}
                <h3 style={s.cardTitle}>{ev.titre}</h3>
              </div>
              <div style={s.cardBody}>
                {ev.lieu && <p style={s.infoRow}>📍 <span>{ev.lieu}</span></p>}
                <p style={s.infoRow}>🗓 <span>{new Date(ev.date_debut).toLocaleString('fr-FR')}</span></p>
                {ev.description && <p style={s.desc}>{ev.description}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {inscriptions[ev.id] ? (
                    <button className="e-inscrit">✅ Inscrit</button>
                  ) : (
                    <button className="e-inscrire" onClick={() => handleInscrire(ev.id)}>
                      S'inscrire à l'événement
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button className="e-delete" onClick={() => handleDelete(ev.id)}>Supprimer</button>
                  )}
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
  headerIcon: { fontSize: 36, background: '#c9a84c', borderRadius: 16, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  alertGlobal: { padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14, fontWeight: 500 },
  formCard: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 32 },
  formTitle: { fontSize: 18, fontWeight: 600, color: '#0d1b4b', marginBottom: 24, fontFamily: "'Playfair Display', serif" },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  submitBtn: { padding: '12px 28px', background: '#c9a84c', color: '#0d1b4b', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", marginBottom: 20 },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  cardTop: { background: 'linear-gradient(135deg, #0d1b4b, #1a2f6b)', padding: '20px 24px' },
  themeBadge: { fontSize: 11, color: '#c9a84c', background: 'rgba(201,168,76,0.15)', padding: '3px 10px', borderRadius: 20, fontWeight: 600, display: 'inline-block', marginBottom: 8 },
  cardTitle: { fontSize: 17, fontWeight: 600, color: '#fff', fontFamily: "'Playfair Display', serif", margin: 0 },
  cardBody: { padding: '20px 24px' },
  infoRow: { fontSize: 13, color: '#64748b', margin: '6px 0', display: 'flex', gap: 8 },
  desc: { fontSize: 13, color: '#94a3b8', marginBottom: 16, lineHeight: 1.6 },
};

export default Evenements;