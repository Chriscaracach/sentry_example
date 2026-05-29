export default function PillarsSlide({ slide }) {
  return (
    <div className="slide pillars-slide">
      {slide.title && <h2 className="pillars-heading">{slide.title}</h2>}
      <div className="pillars-grid">
        {slide.pillars.map((pillar) => (
          <div className="pillar-col" key={pillar.name}>
            <div className="pillar-cap">
              <span className="pillar-name">{pillar.name}</span>
            </div>
            <div className="pillar-shaft">
              <p className="pillar-description">{pillar.description}</p>
              <ul className="pillar-examples">
                {pillar.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
            <div className="pillar-base" />
          </div>
        ))}
      </div>
    </div>
  );
}
