import SpeakerSlide from './SpeakerSlide.jsx';
import IntroSlide from './IntroSlide.jsx';
import DemoSlide from './DemoSlide.jsx';

export default function Slide({ slide, lang }) {
  if (slide.type === 'speaker') return <SpeakerSlide slide={slide} />;
  if (slide.type === 'intro')   return <IntroSlide slide={slide} />;
  return <DemoSlide slide={slide} lang={lang} />;
}
