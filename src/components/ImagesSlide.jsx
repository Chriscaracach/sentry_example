export default function ImagesSlide({ slide }) {
  return (
    <div className="slide centered">
      {slide.eyebrow && <p className="speaker-eyebrow">{slide.eyebrow}</p>}
      {slide.title && <h2 className="images-slide-heading">{slide.title}</h2>}
      {slide.description && <p className="description">{slide.description}</p>}
      <div className="images-placeholder-grid">
        {(slide.images || []).map((src, i) => (
          <div key={i} className="image-placeholder-wrap">
            <img src={src} alt="" className="slide-image" />
          </div>
        ))}
        {(!slide.images || slide.images.length === 0) && (
          <p className="ph" style={{ gridColumn: '1 / -1' }}>Imágenes próximamente</p>
        )}
      </div>
    </div>
  );
}
