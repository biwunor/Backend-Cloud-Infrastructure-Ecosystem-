import { Link, useLocation } from "wouter";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [location] = useLocation();

  useEffect(() => {
    // Close the menu when location changes
    onClose();
  }, [location, onClose]);

  useEffect(() => {
    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-dark/50 z-50">
      <div className="bg-white h-full w-4/5 max-w-xs shadow-lg transform transition-transform">
        <div className="p-4 bg-primary flex justify-between items-center">
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
            <h2 className="text-white text-lg font-semibold">EcoWaste Manager</h2>
          </div>
          <button onClick={onClose} className="text-white">
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link href="/">
                <a className={`flex items-center space-x-3 p-2 rounded ${location === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-lightest text-neutral-dark'} font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 9h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/schedule">
                <a className={`flex items-center space-x-3 p-2 rounded ${location === '/schedule' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-lightest text-neutral-dark'} font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <span>Schedule</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/recycling-guide">
                <a className={`flex items-center space-x-3 p-2 rounded ${location === '/recycling-guide' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-lightest text-neutral-dark'} font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>Recycling Guide</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/locations">
                <a className={`flex items-center space-x-3 p-2 rounded ${location === '/locations' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-lightest text-neutral-dark'} font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Locations</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/resources">
                <a className={`flex items-center space-x-3 p-2 rounded ${location === '/resources' ? 'bg-primary/10 text-primary' : 'hover:bg-neutral-lightest text-neutral-dark'} font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  <span>Resources</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
