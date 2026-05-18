import SpeakerSlide from './SpeakerSlide.jsx';
import IntroSlide from './IntroSlide.jsx';
import DemoSlide from './DemoSlide.jsx';
import TitleSlide from './TitleSlide.jsx';
import CompaniesSlide from './CompaniesSlide.jsx';
import ImagesSlide from './ImagesSlide.jsx';
import ThanksSlide from './ThanksSlide.jsx';
import FullImageSlide from './FullImageSlide.jsx';

export default function Slide({ slide }) {
  if (slide.type === 'title')     return <TitleSlide slide={slide} />;
  if (slide.type === 'speaker')   return <SpeakerSlide slide={slide} />;
  if (slide.type === 'companies') return <CompaniesSlide slide={slide} />;
  if (slide.type === 'images')    return <ImagesSlide slide={slide} />;
  if (slide.type === 'thanks')    return <ThanksSlide slide={slide} />;
  if (slide.type === 'intro')     return <IntroSlide slide={slide} />;
  if (slide.type === 'fullimage') return <FullImageSlide slide={slide} />;
  return <DemoSlide slide={slide} />;
}
