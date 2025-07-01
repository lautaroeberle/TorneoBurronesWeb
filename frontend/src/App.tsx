import { useEffect } from "react";
import Hero from './components/Hero';

function App() {

   useEffect(() => {
    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      if (window.scrollY > 80) {
        navbar?.classList.add("transparent");
      } else {
        navbar?.classList.remove("transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <Hero />
    </>
  );
}

export default App;
