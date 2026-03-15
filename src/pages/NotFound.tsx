
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { translate } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            {translate('pageNotFound')}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {translate('pageNotFoundDescription')}
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <Home className="mr-2" size={18} />
            {translate('home')}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
