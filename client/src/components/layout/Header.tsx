import { Link, useLocation } from "wouter";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-white"
          >
            <path d="M2 22c1.25-1.25 2.5-2.5 3.75-2.5 1.25 0 1.25 1.25 2.5 1.25 1.25 0 1.25-1.25 2.5-1.25 1.25 0 1.25 1.25 2.5 1.25 1.25 0 1.25-1.25 2.5-1.25 1.25 0 2.5 1.25 3.75 2.5" />
            <path d="M19.13 4.96l.97.26c.81.21.79 1.05-.02 1.25l-1.74.44c-1.44.36-2.67 1.27-3.5 2.55l-2.95 4.59c-.62.97-1.28.81-1.75 0l-2.67-4.59c-.82-1.28-2.05-2.19-3.49-2.55l-1.73-.44c-.81-.21-.83-1.04-.02-1.25l.97-.26c2.07-.56 3.92-1.77 5.22-3.47l.23-.29c.36-.47 1.12-.21 1.19.37l.63 7.99h3.33l.63-7.99c.06-.58.82-.84 1.18-.37l.23.3c1.3 1.68 3.15 2.9 5.22 3.45z" />
          </svg>
          <h1 className="text-white text-xl font-semibold">EcoWaste Manager</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`${isActive('/') ? 'text-white' : 'text-white/80 hover:text-white'} font-medium`}>
              Dashboard
            </a>
          </Link>
          <Link href="/schedule">
            <a className={`${isActive('/schedule') ? 'text-white' : 'text-white/80 hover:text-white'} font-medium`}>
              Schedule
            </a>
          </Link>
          <Link href="/recycling-guide">
            <a className={`${isActive('/recycling-guide') ? 'text-white' : 'text-white/80 hover:text-white'} font-medium`}>
              Recycling Guide
            </a>
          </Link>
          <Link href="/locations">
            <a className={`${isActive('/locations') ? 'text-white' : 'text-white/80 hover:text-white'} font-medium`}>
              Locations
            </a>
          </Link>
          <Link href="/resources">
            <a className={`${isActive('/resources') ? 'text-white' : 'text-white/80 hover:text-white'} font-medium`}>
              Resources
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 rounded-full hover:bg-primary-dark md:hidden"
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <button
            className="text-white p-2 rounded-full hover:bg-primary-dark"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
          <button
            className="text-white p-2 rounded-full hover:bg-primary-dark hidden md:block"
            aria-label="Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
