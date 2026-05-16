export default function IntroSlide({ slide }) {
  return (
    <div className="slide centered">
      <h1 dangerouslySetInnerHTML={{ __html: slide.title.replace('\n', '<br>') }} />
      <p className="intro-description">{slide.description}</p>
      <div className="intro-chips">
        {slide.chips.map((c) => (
          <div key={c} className="intro-chip">{c}</div>
        ))}
      </div>
    </div>
  );
}
