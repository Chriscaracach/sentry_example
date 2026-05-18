export default function CompaniesSlide({ slide }) {
  return (
    <div className="slide centered">
      {slide.eyebrow && <p className="speaker-eyebrow">{slide.eyebrow}</p>}
      {slide.title && <h2 className="companies-heading">{slide.title}</h2>}
      <div className="marquee-viewport">
        <div className="marquee-track">
          {[...slide.images, ...slide.images].map((src, i) => (
            <img key={i} src={src} alt="" className="marquee-img" />
          ))}
        </div>
      </div>
    </div>
  );
}
