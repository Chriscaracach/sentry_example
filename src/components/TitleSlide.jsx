export default function TitleSlide({ slide }) {
  return (
    <div className="slide centered">
      <div className="title-slide-content">
        <h1 className="title-slide-heading">{slide.title}</h1>
        {slide.subtitle && (
          <i className="description">{slide.subtitle}</i>
        )}
        <p className="title-slide-name">Christian Caracach</p>
      </div>
    </div>
  );
}
