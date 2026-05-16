export default function Topbar({ current, total, lang, onLang, onPrev, onNext }) {
  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-dot" />
        Sentry — Live Demo
      </div>
      <div className="nav-controls">
        <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => onLang('en')}>EN</button>
        <button className={`lang-btn${lang === 'es' ? ' active' : ''}`} onClick={() => onLang('es')}>ES</button>
        <span className="counter">{current + 1} / {total}</span>
        <button className="nav-btn" onClick={onPrev} disabled={current === 0}>←</button>
        <button className="nav-btn" onClick={onNext} disabled={current === total - 1}>→</button>
      </div>
    </header>
  );
}
