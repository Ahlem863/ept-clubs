import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '', role: 'membre' });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      setMessage('Compte créé avec succès !'); setMsgType('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) { setMessage('Erreur lors de la création du compte'); setMsgType('error'); }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .r-input { width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; }
        .r-input:focus { border-color:#0d1b4b; box-shadow:0 0 0 3px rgba(13,27,75,0.08); background:#fff; }
        .r-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .r-btn { width:100%; padding:13px; background:#0d1b4b; color:#c9a84c; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:opacity .2s; }
        .r-btn:hover { opacity:.9; }
        .r-link { color:#0d1b4b; font-weight:600; text-decoration:none; }
        .r-link:hover { text-decoration:underline; }
      `}</style>

      {/* Fond décoratif */}
      <div style={s.bgLeft} />
      <div style={s.bgRight} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoBox}>
          <span style={s.logoEPT}>EPT</span>
          <span style={s.logoClubs}>Clubs</span>
        </div>
        <h2 style={s.title}>Créer un compte</h2>
        <p style={s.subtitle}>Rejoignez la plateforme EPT Clubs</p>

        {message && (
          <div style={{ ...s.alert, background: msgType === 'success' ? '#d1fae5' : '#fee2e2', color: msgType === 'success' ? '#065f46' : '#991b1b' }}>
            {msgType === 'success' ? '✅' : '❌'} {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={s.row}>
            <div style={s.half}>
              <label className="r-label">Nom</label>
              <input className="r-input" type="text" name="nom" placeholder="Ben Ali" value={form.nom} onChange={handleChange} required />
            </div>
            <div style={s.half}>
              <label className="r-label">Prénom</label>
              <input className="r-input" type="text" name="prenom" placeholder="Ahmed" value={form.prenom} onChange={handleChange} required />
            </div>
          </div>

          <div style={s.field}>
            <label className="r-label">Email</label>
            <input className="r-input" type="email" name="email" placeholder="ahmed@ept.tn" value={form.email} onChange={handleChange} required />
          </div>

          <div style={s.field}>
            <label className="r-label">Mot de passe</label>
            <input className="r-input" type="password" name="mot_de_passe" placeholder="••••••••" value={form.mot_de_passe} onChange={handleChange} required />
          </div>

          <div style={s.field}>
            <label className="r-label">Rôle</label>
            <select className="r-input" name="role" value={form.role} onChange={handleChange}>
              <option value="membre">Membre</option>
              <option value="responsable">Responsable</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="r-btn" type="submit">S'inscrire</button>
        </form>

        <p style={s.loginText}>
          Déjà un compte ?{' '}
          <Link to="/login" className="r-link">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' },
  bgLeft: { position: 'absolute', top: -100, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(13,27,75,0.06)' },
  bgRight: { position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(201,168,76,0.10)' },
  card: { background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 },
  logoBox: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, justifyContent: 'center' },
  logoEPT: { fontSize: 22, fontWeight: 700, color: '#fff', background: '#0d1b4b', padding: '4px 10px', borderRadius: 8 },
  logoClubs: { fontSize: 22, fontWeight: 700, color: '#c9a84c', fontFamily: "'Playfair Display', serif" },
  title: { fontSize: 24, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", textAlign: 'center', margin: '0 0 6px' },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 28 },
  alert: { padding: '11px 14px', borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500 },
  row: { display: 'flex', gap: 12, marginBottom: 16 },
  half: { flex: 1 },
  field: { marginBottom: 16 },
  loginText: { textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 },
};

export default Register;