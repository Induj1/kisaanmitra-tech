// Fix the Seed import error by using a different icon from lucide-react
import { Calendar, Leaf } from "lucide-react"; // Changed from Seed to Leaf
import PageLayout from "@/components/PageLayout";

const CropCalendar = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Crop Calendar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Example Crop Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <Leaf className="h-5 w-5 mr-2 text-green-500" />
              <h2 className="text-lg font-semibold">Wheat</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Best planting time: October - November
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Harvest time: March - April
            </p>
          </div>
          {/* Add more crop cards here */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 mr-2 text-green-500" />
              <h2 className="text-lg font-semibold">Rice</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Best planting time: June - July
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Harvest time: September - October
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CropCalendar;
