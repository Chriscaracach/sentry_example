export default function Topbar({ current, total, onPrev, onNext }) {
  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-dot" />
        Observabilidad en JS
      </div>
      <div className="nav-controls">
        <span className="counter">{current + 1} / {total}</span>
        <button className="nav-btn" onClick={onPrev} disabled={current === 0}>←</button>
        <button className="nav-btn" onClick={onNext} disabled={current === total - 1}>→</button>
      </div>
    </header>
  );
}
