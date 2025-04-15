import { Card } from "@/components/ui/card";
import { EducationalResource } from "@shared/schema";
import { Link } from "wouter";

interface EducationalResourcesSectionProps {
  resources: EducationalResource[];
}

const EducationalResourcesSection = ({ resources }: EducationalResourcesSectionProps) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary-dark">Educational Resources</h2>
        <Link href="/resources">
          <a className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
            <span>View All</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{resource.title}</h3>
                <p className="text-neutral-medium mt-1 text-sm">{resource.description}</p>
                <Link href={resource.contentUrl}>
                  <a className="mt-3 inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm">
                    <span>Read More</span>
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
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center p-8 border rounded-lg bg-white">
            <p className="text-neutral-medium">No educational resources available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalResourcesSection;
