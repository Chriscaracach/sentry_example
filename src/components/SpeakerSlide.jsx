export default function SpeakerSlide({ slide }) {
  return (
    <div className="slide centered">
      <div className="speaker-card">
        <div className="speaker-photo" />
        <div className="speaker-info">
          <p className="speaker-eyebrow">{slide.eyebrow}</p>
          <h1 className="speaker-name">Christian Caracach</h1>
          <p className="speaker-role">Software Developer</p>
          <p className="speaker-company">CodingIT / Tiny Health</p>
          <div className="speaker-divider" />
          <p className="speaker-bio">
            Software developer desde hace 3 años. Creador del Club de
            Programación de Córdoba. Profesor de música. Músico. Me encanta
            pararme al frente de gente y hablar de cosas
          </p>
        </div>
      </div>
    </div>
  );
}
