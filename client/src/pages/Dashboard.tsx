import { useQuery } from "@tanstack/react-query";
import DashboardHero from "@/components/dashboard/DashboardHero";
import WasteSummaryCard from "@/components/dashboard/WasteSummaryCard";
import UpcomingCollectionCard from "@/components/dashboard/UpcomingCollectionCard";
import RecyclingTipsCard from "@/components/dashboard/RecyclingTipsCard";
import WasteTrackingCard from "@/components/dashboard/WasteTrackingCard";
import DisposalLocationsCard from "@/components/dashboard/DisposalLocationsCard";
import EducationalResourcesSection from "@/components/dashboard/EducationalResourcesSection";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  // For demonstration purposes, using userId 1
  const userId = 1;
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/dashboard-summary/${userId}`],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 m-4">
        <p className="text-red-500">Error loading dashboard: {(error as Error).message}</p>
      </div>
    );
  }

  const today = format(new Date(), "MMMM d, yyyy");

  return (
    <>
      <DashboardHero 
        name={data?.user?.name || "User"} 
        date={today} 
      />
      
      <section className="py-6 px-4 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WasteSummaryCard
            generalWaste={data?.wasteSummary?.generalWaste || 0}
            recycling={data?.wasteSummary?.recycling || 0}
            compost={data?.wasteSummary?.compost || 0}
            total={data?.wasteSummary?.total || 0}
            comparison={data?.wasteSummary?.comparison || 0}
          />
          
          <UpcomingCollectionCard
            collections={data?.upcomingCollections || []}
          />
          
          <RecyclingTipsCard
            tips={data?.recyclingTips || []}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <WasteTrackingCard
            chartData={data?.wasteTracking?.chartData || []}
            weeklyAverage={data?.wasteTracking?.weeklyAverage || 0}
            recyclingRate={data?.wasteTracking?.recyclingRate || 0}
            weeklyComparison={data?.wasteTracking?.weeklyComparison || 0}
            recyclingComparison={data?.wasteTracking?.recyclingComparison || 0}
          />
          
          <DisposalLocationsCard
            locations={data?.disposalLocations || []}
          />
        </div>

        <EducationalResourcesSection
          resources={data?.educationalResources || []}
        />
      </section>
    </>
  );
};

const DashboardSkeleton = () => {
  return (
    <>
      <section className="bg-primary-light bg-opacity-10 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-6 px-4 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-12 w-full" />
              <div className="p-4">
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                  <div className="mt-2 pt-4 border-t border-neutral-light">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-24 mt-2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-12 w-full" />
              <div className="p-4">
                <Skeleton className="h-60 w-full" />
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-40" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
