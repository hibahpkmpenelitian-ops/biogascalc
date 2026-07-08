import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import AboutReactor from '../components/sections/AboutReactor';
import HowItWorks from '../components/sections/HowItWorks';
import Faq from '../components/sections/Faq';
import Footer from '../components/layouts/Footer';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <AboutReactor />
      <HowItWorks />
      <div style={{ backgroundColor: "#ffffff" }}>
        <Faq />
        <div style={{ height: 180 }} aria-hidden="true" />
        <Footer />
      </div>
    </div>
  );
}
