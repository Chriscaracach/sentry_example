export default function SpeakerSlide({ slide }) {
  return (
    <div className="slide centered">
      <div className="speaker-card">
        <div className="speaker-photo" />
        <div className="speaker-info">
          <p className="speaker-eyebrow">{slide.eyebrow}</p>
          <h1 className="speaker-name ph">[Your Name]</h1>
          <p className="speaker-role ph">[Your Role / Title]</p>
          <p className="speaker-company ph">[Your Company]</p>
          <div className="speaker-divider" />
          <p className="speaker-bio ph">[A short bio or tagline]</p>
          <p className="speaker-handle ph">@[yourhandle]</p>
        </div>
      </div>
    </div>
  );
}
