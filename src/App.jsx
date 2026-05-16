import { useState, useEffect, useCallback } from 'react';
import { slides } from './slides.js';
import Topbar from './components/Topbar.jsx';
import Slide from './components/Slide.jsx';

export default function App() {
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState('en');

  const navigate = useCallback((dir) => {
    setCurrent((c) => Math.max(0, Math.min(slides.length - 1, c + dir)));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const slide = { ...slides[current], ...slides[current][lang] };

  return (
    <div className="presentation">
      <Topbar
        current={current}
        total={slides.length}
        lang={lang}
        onLang={setLang}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
      />
      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
      <div className="slide-area">
        <Slide key={current} slide={slide} lang={lang} />
      </div>
      <span className="keyboard-hint">← → to navigate</span>
    </div>
  );
}
