import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Schedule from "@/pages/Schedule";
import RecyclingGuide from "@/pages/RecyclingGuide";
import Locations from "@/pages/Locations";
import Resources from "@/pages/Resources";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import { useState } from "react";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleMobileMenu={toggleMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/recycling-guide" component={RecyclingGuide} />
          <Route path="/locations" component={Locations} />
          <Route path="/resources" component={Resources} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
