export default function TitleSlide({ slide }) {
  return (
    <div className="slide centered">
      <div className="title-slide-content">
        <h1 className="title-slide-heading">{slide.title}</h1>
        <i className="description">
          O "cómo hacer que te feliciten por romper producción"
        </i>
        <p className="title-slide-name">Christian Caracach</p>
      </div>
    </div>
  );
}
