import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Footer from './components/Footer';
import WasteManager from './components/WasteManager';
import RecyclingTips from './components/RecyclingTips';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Onboarding from './components/onboarding/Onboarding';
import DisposeWaste from './components/dispose/DisposeWaste';
import DisposalLocations from './components/map/DisposalLocations';
import UserProfile from './components/profile/UserProfile';

// Mock pages for development
const Home = () => {
  return (
    <div className="container mx-auto px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Welcome to WasteWise</h1>
      <WasteManager />
      <div className="mt-8">
        <RecyclingTips />
      </div>
    </div>
  );
};


const Shop = () => <div className="container mx-auto px-4 pt-4 pb-24"><h1 className="text-2xl font-bold">Shop</h1></div>;

const NotFound = () => <div className="container mx-auto px-4 pt-4 pb-24"><h1 className="text-2xl font-bold">Page Not Found</h1></div>;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Set active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      setActiveTab('home');
    } else if (path.includes('map')) {
      setActiveTab('map');
    } else if (path.includes('dispose')) {
      setActiveTab('dispose');
    } else if (path.includes('shop')) {
      setActiveTab('shop');
    } else if (path.includes('profile')) {
      setActiveTab('profile');
    }
  }, [location]);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!location.pathname.includes('/login') && 
        !location.pathname.includes('/register') && 
        !location.pathname.includes('/onboarding') && (
        <Header currentUser={currentUser} />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<DisposalLocations />} />
          <Route path="/dispose" element={<DisposeWaste />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<UserProfile currentUser={currentUser} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {!location.pathname.includes('/login') && 
        !location.pathname.includes('/register') && 
        !location.pathname.includes('/onboarding') && (
        <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

export default App;