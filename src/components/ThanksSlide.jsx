export default function ThanksSlide({ slide }) {
  return (
    <div className="slide centered">
      <div className="thanks-content">
        <h1 className="thanks-heading">¡Gracias!</h1>
        {slide.subtitle && <p className="thanks-subtitle">{slide.subtitle}</p>}
        {slide.handle && <p className="speaker-handle">{slide.handle}</p>}
      </div>
    </div>
  );
}
