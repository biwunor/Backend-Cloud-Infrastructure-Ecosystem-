import { Card } from "@/components/ui/card";
import { DisposalLocation } from "@shared/schema";
import { Link } from "wouter";

interface DisposalLocationsCardProps {
  locations: DisposalLocation[];
}

const DisposalLocationsCard = ({ locations }: DisposalLocationsCardProps) => {
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Simple Euclidean distance calculation - not accurate for real maps but fine for demo
    const a = lat1 - lat2;
    const b = lon1 - lon2;
    return Math.sqrt(a * a + b * b) * 69; // Rough miles conversion
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="p-4 bg-[#00796B] text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">Disposal Locations</h2>
        <div>
          <button className="text-white p-1 rounded hover:bg-[#004d40]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
          </button>
        </div>
      </div>
      <div 
        className="h-[300px] bg-neutral-100 bg-cover bg-center relative"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" 
        }}
      >
        {locations.map((location) => (
          <div 
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ 
              top: `${(location.latitude / 90) * 100}%`, 
              left: `${((location.longitude + 180) / 360) * 100}%` 
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#D32F2F"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {locations.length > 0 ? (
            locations.map((location) => {
              // Calculate a mock distance - in a real app, this would use geolocation
              const distance = calculateDistance(
                47.6553, // UW's approximate latitude
                -122.3035, // UW's approximate longitude
                location.latitude,
                location.longitude
              ).toFixed(1);

              return (
                <div key={location.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-neutral-medium">
                      {location.address}, {location.city} - {distance} miles
                    </p>
                  </div>
                  <button className="text-primary font-medium hover:text-primary-dark">
                    Directions
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center p-4 text-neutral-medium">
              No nearby disposal locations found
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <Link href="/locations">
            <a className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
              <span>View All Locations</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 ml-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default DisposalLocationsCard;
