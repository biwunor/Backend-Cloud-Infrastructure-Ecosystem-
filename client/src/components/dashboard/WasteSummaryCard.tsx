import { Card } from "@/components/ui/card";

interface WasteSummaryProps {
  generalWaste: number;
  recycling: number;
  compost: number;
  total: number;
  comparison: number;
}

const WasteSummaryCard = ({ 
  generalWaste, 
  recycling, 
  compost, 
  total, 
  comparison 
}: WasteSummaryProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="p-4 bg-primary text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">Waste Summary</h2>
        <div>
          <button className="text-white p-1 rounded hover:bg-primary-dark">
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
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
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
              <span>General Waste</span>
            </div>
            <div className="font-semibold">{generalWaste} kg</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
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
              <span>Recycling</span>
            </div>
            <div className="font-semibold">{recycling} kg</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
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
              <span>Compost</span>
            </div>
            <div className="font-semibold">{compost} kg</div>
          </div>
          <div className="mt-2 pt-4 border-t border-neutral-light">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-semibold">{total} kg</span>
            </div>
            <div className="mt-1 text-sm text-green-600 flex items-center">
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
                <path d="m2 12 7 7 13-14" />
              </svg>
              <span>{Math.abs(comparison)}% {comparison < 0 ? 'less' : 'more'} than last month</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WasteSummaryCard;
