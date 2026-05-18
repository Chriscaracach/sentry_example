export default function FullImageSlide({ slide }) {
  return (
    <div className="slide centered full-image">
      <img src={slide.image} alt={slide.alt || ''} className="full-image-img" />
    </div>
  );
}
