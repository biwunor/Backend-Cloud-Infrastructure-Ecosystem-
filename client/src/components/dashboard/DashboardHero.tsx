import { Link } from "wouter";

interface DashboardHeroProps {
  name: string;
  date: string;
}

const DashboardHero = ({ name, date }: DashboardHeroProps) => {
  return (
    <section className="bg-primary-light bg-opacity-10 py-6 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-primary-dark">
              Welcome back, {name}!
            </h1>
            <p className="text-neutral-medium mt-1">
              Your waste management dashboard for {date}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link href="/schedule">
              <a className="inline-flex items-center px-4 py-2 bg-[#FFB300] rounded text-white font-medium shadow hover:bg-[#ff8f00] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-1"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Schedule Pickup
              </a>
            </Link>
            <Link href="/locations">
              <a className="inline-flex items-center px-4 py-2 bg-white border border-primary rounded text-primary font-medium hover:bg-primary-light/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-1"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                Find Location
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
