import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Work from '@/components/sections/Work';
import Projects from '@/components/sections/Projects';
import Team from '@/components/sections/Team';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import Intro from '@/components/intro/Intro';

export default function Home() {
  return (
    <>
      <Intro />
      <Nav />
      <Hero />
      <Work />
      <Projects />
      <Team />
      <Contact />
      <Footer />
    </>
  );
}

