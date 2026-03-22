import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        mot_de_passe: motDePasse
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) { setErreur('Email ou mot de passe incorrect'); }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .l-input { width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border .2s,box-shadow .2s; box-sizing:border-box; }
        .l-input:focus { border-color:#0d1b4b; box-shadow:0 0 0 3px rgba(13,27,75,0.08); background:#fff; }
        .l-label { display:block; font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.6px; }
        .l-btn { width:100%; padding:13px; background:#0d1b4b; color:#c9a84c; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:opacity .2s; }
        .l-btn:hover { opacity:.9; }
        .l-link { color:#0d1b4b; font-weight:600; text-decoration:none; }
        .l-link:hover { text-decoration:underline; }
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

        <h2 style={s.title}>Bon retour !</h2>
        <p style={s.subtitle}>Connectez-vous à votre espace EPT Clubs</p>

        {erreur && (
          <div style={s.alert}>❌ {erreur}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={s.field}>
            <label className="l-label">Email</label>
            <input
              className="l-input"
              type="email"
              placeholder="ahmed@ept.tn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={s.field}>
            <label className="l-label">Mot de passe</label>
            <input
              className="l-input"
              type="password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <button className="l-btn" type="submit">Se connecter</button>
        </form>

        <p style={s.registerText}>
          Pas encore de compte ?{' '}
          <Link to="/register" className="l-link">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' },
  bgLeft: { position: 'absolute', top: -100, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(13,27,75,0.06)' },
  bgRight: { position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(201,168,76,0.10)' },
  card: { background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 },
  logoBox: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, justifyContent: 'center' },
  logoEPT: { fontSize: 22, fontWeight: 700, color: '#fff', background: '#0d1b4b', padding: '4px 10px', borderRadius: 8 },
  logoClubs: { fontSize: 22, fontWeight: 700, color: '#c9a84c', fontFamily: "'Playfair Display', serif" },
  title: { fontSize: 26, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", textAlign: 'center', margin: '0 0 6px' },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 28 },
  alert: { padding: '11px 14px', borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500, background: '#fee2e2', color: '#991b1b' },
  field: { marginBottom: 18 },
  registerText: { textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 },
};

export default Login;