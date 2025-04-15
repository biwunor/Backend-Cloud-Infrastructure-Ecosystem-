import { Card } from "@/components/ui/card";
import { Collection } from "@shared/schema";
import { Link } from "wouter";

interface UpcomingCollectionCardProps {
  collections: Collection[];
}

const UpcomingCollectionCard = ({ collections }: UpcomingCollectionCardProps) => {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getWasteTypeIcon = (wasteType: string) => {
    switch (wasteType) {
      case 'recycling':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-2 text-[#FFB300]"
          >
            <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
            <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
            <path d="m14 16-3 3 3 3" />
            <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
            <path d="m9.344 5.811 1.093-1.892A1.81 1.81 0 0 1 11.985 3a1.81 1.81 0 0 1 1.547.919l3.707 6.416" />
            <path d="M17.657 9.174 21 8.5l-.674 3.343" />
          </svg>
        );
      case 'general':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-2 text-[#00796B]"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        );
      case 'compost':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-2 text-[#43A047]"
          >
            <path d="M2 22c1.25-1.25 2.5-2.5 3.75-2.5 1.25 0 1.25 1.25 2.5 1.25 1.25 0 1.25-1.25 2.5-1.25 1.25 0 1.25 1.25 2.5 1.25 1.25 0 1.25-1.25 2.5-1.25 1.25 0 2.5 1.25 3.75 2.5" />
            <path d="M12 6c-1.39.64-2 2-2 4 0 4 2.5 5.5 2.5 8.5 0 1.5-2 2.5-4 2.5-1.5 0-2.5-.5-2.5-1.5C6 18.5 9 17 9 14c0-3-8-1-8-9 0-1.667.5-3 1.5-4" />
            <path d="M18.5 6c-1.5 0-4.5 1.5-4.5 4 0 4.5 4.5 4.5 4.5 9 0 .5 0 1-1 1-3 0-6-2-10-2-2 0-3 1-3 3" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-2 text-gray-500"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        );
    }
  };

  const getWasteTypeTitle = (wasteType: string) => {
    return wasteType.charAt(0).toUpperCase() + wasteType.slice(1) + ' Collection';
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="p-4 bg-[#00796B] text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">Upcoming Collections</h2>
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
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {collections.length > 0 ? (
            collections.map((collection) => (
              <div
                key={collection.id}
                className="schedule-item p-3 rounded-md border border-neutral-light transition-colors hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      {getWasteTypeIcon(collection.wasteType)}
                      <span className="font-medium">{getWasteTypeTitle(collection.wasteType)}</span>
                    </div>
                    <p className="text-sm text-neutral-medium mt-1">
                      {formatDate(collection.scheduledDate)}, {collection.timeWindow}
                    </p>
                  </div>
                  <button className="text-primary hover:text-primary-dark text-sm font-medium">
                    Remind Me
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-neutral-medium">
              No upcoming collections scheduled
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <Link href="/schedule">
            <a className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
              <span>View Full Schedule</span>
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

export default UpcomingCollectionCard;
