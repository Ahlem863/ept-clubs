import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clubs: 0, evenements: 0, seances: 0, reussites: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clubs, evs, seances] = await Promise.all([
          axios.get('http://localhost:3000/api/clubs'),
          axios.get('http://localhost:3000/api/evenements'),
          axios.get('http://localhost:3000/api/seances/1'),
        ]);
        setStats({
          clubs: clubs.data.length,
          evenements: evs.data.length,
          seances: seances.data.length,
          reussites: 0,
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: '🏫', titre: 'Clubs', desc: 'Gérer les clubs étudiants', route: '/clubs', color1: '#0d1b4b', color2: '#1a2f6b' },
    { icon: '📅', titre: 'Événements', desc: 'Organiser les événements', route: '/evenements', color1: '#c9a84c', color2: '#e8c05a' },
    { icon: '📋', titre: 'Séances', desc: 'Planifier les séances', route: '/seances', color1: '#1a2f6b', color2: '#0d1b4b' },
    { icon: '🏆', titre: 'Réussites', desc: 'Suivre les performances', route: '/reussites', color1: '#b8860b', color2: '#c9a84c' },
  ];

  const statsData = [
    { label: 'Clubs actifs', value: stats.clubs, icon: '🏫' },
    { label: 'Événements', value: stats.evenements, icon: '📅' },
    { label: 'Séances', value: stats.seances, icon: '📋' },
    { label: 'Réussites', value: stats.reussites, icon: '🏆' },
  ];

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .dash-card { border-radius:20px; padding:32px; cursor:pointer; transition:transform .25s,box-shadow .25s; position:relative; overflow:hidden; }
        .dash-card:hover { transform:translateY(-6px); box-shadow:0 20px 40px rgba(0,0,0,0.15) !important; }
        .dash-card::before { content:''; position:absolute; top:-30px; right:-30px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.08); }
        .dash-card::after { content:''; position:absolute; bottom:-20px; left:-20px; width:70px; height:70px; border-radius:50%; background:rgba(255,255,255,0.05); }
        .stat-card { background:#fff; border-radius:16px; padding:20px; text-align:center; box-shadow:0 2px 10px rgba(0,0,0,0.05); transition:transform .2s; }
        .stat-card:hover { transform:translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.welcome}>Bienvenue, {user?.prenom} {user?.nom} ! 👋</h1>
          <p style={s.sub}>Tableau de bord — <span style={s.role}>{user?.role}</span></p>
        </div>
        <div style={s.avatar}>{user?.prenom?.charAt(0)?.toUpperCase() || 'A'}</div>
      </div>

      {/* Banner */}
      <div style={s.banner}>
        <span style={{ fontSize: 20 }}>🎓</span>
        <span style={s.bannerText}>École Polytechnique de Tunisie — Plateforme de gestion des clubs étudiants</span>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {statsData.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0d1b4b', fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <h2 style={s.sectionTitle}>Accès rapide</h2>
      <div style={s.grid}>
        {cards.map((card, i) => (
          <div
            key={i}
            className="dash-card"
            style={{ background: `linear-gradient(135deg, ${card.color1}, ${card.color2})`, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            onClick={() => navigate(card.route)}
          >
            <div style={{ fontSize: 44, marginBottom: 16, display: 'block' }}>{card.icon}</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0 0 8px' }}>{card.titre}</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '0 0 20px' }}>{card.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#c9a84c', fontWeight: 700, fontSize: 14, background: 'rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: 8 }}>
              <span>Accéder</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '32px', fontFamily: "'DM Sans', sans-serif", background: '#f1f5f9', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  welcome: { fontSize: 28, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: 0 },
  sub: { fontSize: 14, color: '#64748b', margin: '6px 0 0' },
  role: { color: '#c9a84c', fontWeight: 700, textTransform: 'capitalize' },
  avatar: { width: 52, height: 52, borderRadius: '50%', background: '#0d1b4b', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  banner: { background: '#0d1b4b', borderLeft: '4px solid #c9a84c', borderRadius: 12, padding: '14px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 },
  bannerText: { color: '#e2e8f0', fontSize: 14, fontWeight: 500 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
};

export default Dashboard;