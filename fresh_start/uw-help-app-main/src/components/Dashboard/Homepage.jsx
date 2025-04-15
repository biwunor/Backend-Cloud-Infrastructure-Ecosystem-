import React, { useState, useEffect } from "react"; // Import useEffect
import Header from "../shared/Header";
import UserGreeting from "./UserGreeting";
import SearchBar from "./SearchBar";
import Carousel from "./Carousel";
import WasteCollectors from "./WasteCollectors";
import FooterNavBar from "../shared/FooterNavBar";

const Homepage = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to the top when the page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenChange = (open) => {
    setIsMenuOpen(open);
  };

  return (
    <div className="relative">
      <Header isMenuOpen={isMenuOpen} handleOpenChange={handleOpenChange} />
      <UserGreeting />
      <SearchBar />
      <Carousel
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <WasteCollectors />
      <FooterNavBar />
    </div>
  );
};

export default Homepage;
