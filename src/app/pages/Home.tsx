import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Featured } from "../components/sections/Featured";
import { CollectionPreview } from "../components/sections/CollectionPreview";
import { Services } from "../components/sections/Services";
import { Process } from "../components/sections/Process";
import { Testimonials } from "../components/sections/Testimonials";
import { FAQ } from "../components/sections/FAQ";
import { Contact } from "../components/sections/Contact";
import { VehicleDrawer } from "../components/VehicleDrawer";
import { Vehicle } from "../data/vehicles";

export function Home() {
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const location = useLocation();

  // support /#hash navigation coming from other routes
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <About />
      <Featured />
      <CollectionPreview onOpen={setSelected} />
      <Services />
      <Process />
      <Testimonials />
      <FAQ />
      <Contact />
      <VehicleDrawer vehicle={selected} onClose={() => setSelected(null)} />
    </>
  );
}
