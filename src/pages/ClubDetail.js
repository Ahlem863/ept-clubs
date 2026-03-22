import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDetails(); }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/clubs/${id}/details`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getRoleConfig = (role) => {
    const map = {
      responsable: { label: 'Président', icon: '👑', color: '#7c3aed', bg: '#ede9fe' },
      tresorier:   { label: 'Trésorier', icon: '💰', color: '#b45309', bg: '#fef3c7' },
      secretaire:  { label: 'Secrétaire', icon: '📝', color: '#0369a1', bg: '#e0f2fe' },
      membre:      { label: 'Membre', icon: '👤', color: '#16a34a', bg: '#dcfce7' },
    };
    return map[role] || map['membre'];
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontFamily: "'DM Sans', sans-serif", color: '#64748b' }}>
      Chargement...
    </div>
  );

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '60px', fontFamily: "'DM Sans', sans-serif" }}>
      Club non trouvé.
    </div>
  );

  const { club, membres, reussites } = data;

  // Séparer bureau et membres simples
  const bureau = membres.filter(m => m.role_interne !== 'membre');
  const membresSImples = membres.filter(m => m.role_interne === 'membre');

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .bureau-card { background:#fff; border-radius:16px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.06); text-align:center; transition:transform .2s,box-shadow .2s; }
        .bureau-card:hover { transform:translateY(-4px); box-shadow:0 12px 28px rgba(0,0,0,0.10); }
        .m-row:hover { background:#f8fafc !important; }
      `}</style>

      {/* Bouton retour */}
      <button onClick={() => navigate('/clubs')} style={s.backBtn}>← Retour aux clubs</button>

      {/* Header du club */}
      <div style={s.clubHeader}>
        <div style={s.clubAvatar}>{club.nom?.charAt(0).toUpperCase()}</div>
        <div style={s.clubInfo}>
          <h1 style={s.clubName}>{club.nom}</h1>
          {club.description && <p style={s.clubDesc}>{club.description}</p>}
          {club.email_contact && <p style={s.clubEmail}>📧 {club.email_contact}</p>}
        </div>
        <div style={s.statsRow}>
          <div style={s.statBox}>
            <span style={s.statNum}>{membres.length}</span>
            <span style={s.statLabel}>Membres</span>
          </div>
          <div style={s.statBox}>
            <span style={s.statNum}>{reussites.length}</span>
            <span style={s.statLabel}>Réussites</span>
          </div>
        </div>
      </div>

      {/* Bureau du club */}
      {bureau.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>🏛️ Bureau du club</h2>
          <div style={s.bureauGrid}>
            {bureau.map(m => {
              const cfg = getRoleConfig(m.role_interne);
              return (
                <div key={m.id} className="bureau-card">
                  <div style={{ ...s.bureauAvatar, background: cfg.bg, color: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div style={{ ...s.bureauRole, color: cfg.color, background: cfg.bg }}>
                    {cfg.label}
                  </div>
                  <h3 style={s.bureauName}>{m.prenom} {m.nom}</h3>
                  <p style={s.bureauEmail}>{m.email}</p>
                  <p style={s.bureauDate}>Depuis {new Date(m.date_adhesion).toLocaleDateString('fr-FR')}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Membres simples */}
      {membresSImples.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>👥 Membres <span style={s.count}>{membresSImples.length}</span></h2>
          <div style={s.tableCard}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Nom</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Date d'adhésion</th>
                </tr>
              </thead>
              <tbody>
                {membresSImples.map((m, i) => (
                  <tr key={m.id} className="m-row" style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={s.avatar}>{m.prenom?.charAt(0)}{m.nom?.charAt(0)}</div>
                        <span style={{ fontWeight: 600, color: '#0d1b4b' }}>{m.prenom} {m.nom}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color: '#64748b' }}>{m.email}</td>
                    <td style={{ ...s.td, color: '#64748b' }}>{new Date(m.date_adhesion).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Réussites */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>🏆 Réussites & Compétitions</h2>
        {reussites.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <p style={s.emptyText}>Aucune réussite enregistrée pour ce club.</p>
          </div>
        ) : (
          <div style={s.reussiteGrid}>
            {reussites.map((r, i) => (
              <div key={r.id} style={s.reussiteCard}>
                <div style={s.reussiteMedal}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}</div>
                <div style={s.reussiteContent}>
                  <h3 style={s.reussiTitre}>{r.titre}</h3>
                  {r.resultat && <span style={s.resultatBadge}>{r.resultat}</span>}
                  <p style={s.reussiteDate}>📅 {new Date(r.date_competition).toLocaleDateString('fr-FR')}</p>
                  {r.description && <p style={s.reussiteDesc}>{r.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '32px', fontFamily: "'DM Sans', sans-serif", background: '#f1f5f9', minHeight: '100vh' },
  backBtn: { background: 'none', border: 'none', color: '#0d1b4b', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24, padding: 0, fontFamily: "'DM Sans', sans-serif" },
  clubHeader: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  clubAvatar: { width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #0d1b4b, #1a2f6b)', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  clubInfo: { flex: 1 },
  clubName: { fontSize: 28, fontWeight: 700, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", margin: '0 0 8px' },
  clubDesc: { fontSize: 14, color: '#64748b', margin: '0 0 6px', lineHeight: 1.6 },
  clubEmail: { fontSize: 13, color: '#94a3b8', margin: 0 },
  statsRow: { display: 'flex', gap: 16 },
  statBox: { background: '#f1f5f9', borderRadius: 12, padding: '12px 20px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: 24, fontWeight: 700, color: '#0d1b4b', fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: 500 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: '#0d1b4b', fontFamily: "'Playfair Display', serif", marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 },
  count: { fontSize: 13, fontWeight: 500, color: '#64748b', background: '#f1f5f9', padding: '3px 12px', borderRadius: 20 },
  bureauGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  bureauAvatar: { width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' },
  bureauRole: { fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.6px' },
  bureauName: { fontSize: 15, fontWeight: 600, color: '#0d1b4b', margin: '0 0 4px', fontFamily: "'Playfair Display', serif" },
  bureauEmail: { fontSize: 12, color: '#94a3b8', margin: '0 0 4px' },
  bureauDate: { fontSize: 11, color: '#cbd5e1', margin: 0 },
  tableCard: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '2px solid #f1f5f9', background: '#fafafa' },
  td: { padding: '14px 16px', fontSize: 14, borderBottom: '1px solid #f1f5f9' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#0d1b4b', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  reussiteGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
  reussiteCard: { background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: 16 },
  reussiteMedal: { fontSize: 36, flexShrink: 0 },
  reussiteContent: { flex: 1 },
  reussiTitre: { fontSize: 16, fontWeight: 600, color: '#0d1b4b', margin: '0 0 8px', fontFamily: "'Playfair Display', serif" },
  resultatBadge: { fontSize: 11, fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 8 },
  reussiteDate: { fontSize: 12, color: '#94a3b8', margin: '0 0 6px' },
  reussiteDesc: { fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 },
  empty: { textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 },
  emptyText: { color: '#94a3b8', fontSize: 15 },
};

export default ClubDetail;