import { Card } from "@/components/ui/card";
import { RecyclingTip } from "@shared/schema";
import { Link } from "wouter";

interface RecyclingTipsCardProps {
  tips: RecyclingTip[];
}

const RecyclingTipsCard = ({ tips }: RecyclingTipsCardProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="p-4 bg-[#FFB300] text-white flex justify-between items-center">
        <h2 className="font-semibold text-lg">Recycling Tips</h2>
        <div>
          <button className="text-white p-1 rounded hover:bg-[#ff8f00]">
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {tips.length > 0 ? (
            tips.map((tip) => (
              <div key={tip.id} className="flex space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-[#FFB300]"
                  >
                    <path d="M12 2v12l4.5-4.5" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-sm text-neutral-medium">{tip.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-neutral-medium">
              No recycling tips available
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <Link href="/recycling-guide">
            <a className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
              <span>View All Tips</span>
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

export default RecyclingTipsCard;
