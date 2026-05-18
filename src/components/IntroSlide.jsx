export default function IntroSlide({ slide }) {
  return (
    <div className="slide centered">
      <img src={slide.image} alt={slide.title} width={700} height={600} />
    </div>
  );
}
