// ============================================
// APP.JSX — Core Router & Layout Wrapper
// Routes across all 6 workspace pages with
// dynamic time & weather ambient background
// ============================================

import { WardrobeProvider, useWardrobe } from './context/WardrobeContext';
import Navbar from './components/Navbar';
import DynamicBackground from './components/DynamicBackground';
import LandingAuth from './pages/LandingAuth';
import ProfileOnboarding from './pages/ProfileOnboarding';
import ClosetDashboard from './pages/ClosetDashboard';
import OutfitGenerator from './pages/OutfitGenerator';
import TravelPlanner from './pages/TravelPlanner';
import ShoppingList from './pages/ShoppingList';

function AppContent() {
  const { state } = useWardrobe();

  const renderPage = () => {
    if (!state.isAuthenticated) return <LandingAuth />;

    switch (state.currentPage) {
      case 'onboarding':
        return <ProfileOnboarding />;
      case 'closet':
        return <ClosetDashboard />;
      case 'outfits':
        return <OutfitGenerator />;
      case 'travel':
        return <TravelPlanner />;
      case 'shopping':
        return <ShoppingList />;
      default:
        return <ClosetDashboard />;
    }
  };

  return (
    <>
      <DynamicBackground />
      <Navbar />
      <main>{renderPage()}</main>
    </>
  );
}

export default function App() {
  return (
    <WardrobeProvider>
      <AppContent />
    </WardrobeProvider>
  );
}
