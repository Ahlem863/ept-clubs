import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LogoEPT = () => (
  <svg viewBox="0 0 200 200" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="160" height="160" rx="8" fill="#0d1b4b" stroke="#c9a84c" strokeWidth="3"/>
    <rect x="28" y="28" width="144" height="144" rx="6" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>
    <g transform="translate(100,95)" opacity="0.15">
      <circle r="55" fill="none" stroke="#c9a84c" strokeWidth="8"/>
      <circle r="35" fill="none" stroke="#c9a84c" strokeWidth="4"/>
      <rect x="-6" y="-63" width="12" height="14" fill="#c9a84c"/>
      <rect x="-6" y="49" width="12" height="14" fill="#c9a84c"/>
      <rect x="49" y="-6" width="14" height="12" fill="#c9a84c"/>
      <rect x="-63" y="-6" width="14" height="12" fill="#c9a84c"/>
      <rect x="30" y="-50" width="12" height="14" fill="#c9a84c" transform="rotate(45 36 -43)"/>
      <rect x="-42" y="-50" width="12" height="14" fill="#c9a84c" transform="rotate(-45 -36 -43)"/>
      <rect x="30" y="36" width="12" height="14" fill="#c9a84c" transform="rotate(-45 36 43)"/>
      <rect x="-42" y="36" width="12" height="14" fill="#c9a84c" transform="rotate(45 -36 43)"/>
    </g>
    <text x="100" y="105" textAnchor="middle" fontFamily="Georgia, serif" fontSize="52" fontWeight="bold" fill="white" letterSpacing="4">EPT</text>
    <rect x="35" y="115" width="130" height="3" rx="1.5" fill="#c9a84c"/>
    <text x="100" y="145" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="18" fontWeight="bold" fill="#c9a84c" letterSpacing="6">CLUBS</text>
    <rect x="30" y="30" width="8" height="8" fill="#c9a84c"/>
    <rect x="162" y="30" width="8" height="8" fill="#c9a84c"/>
    <rect x="30" y="162" width="8" height="8" fill="#c9a84c"/>
    <rect x="162" y="162" width="8" height="8" fill="#c9a84c"/>
  </svg>
);

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: '/dashboard', label: 'Accueil' },
    { to: '/clubs', label: 'Clubs' },
    { to: '/membres', label: 'Membres' },
    { to: '/evenements', label: 'Événements' },
    { to: '/seances', label: 'Séances' },
    { to: '/reussites', label: 'Réussites' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <LogoEPT />
        <span style={styles.logoText}>EPT <span style={styles.logoGold}>Clubs</span></span>
      </div>
      <div style={styles.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{ ...styles.link, ...(isActive(l.to) ? styles.linkActive : {}) }}>
            {l.label}
            {isActive(l.to) && <div style={styles.activeDot} />}
          </Link>
        ))}
      </div>
      <div style={styles.user}>
        <span style={styles.nom}>👤 {user?.prenom} {user?.nom}</span>
        <span style={styles.role}>{user?.role}</span>
        <button style={styles.btn} onClick={handleLogout}>Déconnexion</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d1b4b', padding: '8px 30px', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', color: 'white' },
  logoGold: { color: '#c9a84c' },
  links: { display: 'flex', gap: '20px' },
  link: { color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', position: 'relative', paddingBottom: '4px', transition: 'color .2s' },
  linkActive: { color: '#c9a84c', fontWeight: '700' },
  activeDot: { position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#c9a84c' },
  user: { display: 'flex', alignItems: 'center', gap: '12px' },
  nom: { fontSize: '14px', color: 'white' },
  role: { fontSize: '12px', background: '#c9a84c', color: '#0d1b4b', padding: '2px 10px', borderRadius: '20px', fontWeight: 'bold', textTransform: 'capitalize' },
  btn: { padding: '6px 14px', background: '#c9a84c', color: '#0d1b4b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Navbar;