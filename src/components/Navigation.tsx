import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, ChevronDown, Leaf } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth(); // Changed logout to signOut which should match the AuthContextType
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(); // Changed from logout to signOut
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <NavLink to="/" className="text-2xl font-bold text-primary">
          <span className="font-bold">Kisaan</span>
          <span className="text-primary-dark">Mitra</span>
        </NavLink>
      </div>
      
      <div className="hidden md:flex space-x-1">
        <NavLink 
          to="/" 
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {translate('home')}
        </NavLink>
        
        <NavLink 
          to="/features" 
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/features') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {translate('features')}
        </NavLink>
        
        <NavLink 
          to="/demo" 
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/demo') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {translate('demo')}
        </NavLink>
        
        <NavLink 
          to="/government" 
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isActive('/government') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {translate('government')}
        </NavLink>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center"
              >
                {translate('services')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <NavLink to="/dashboard" className="w-full cursor-pointer">
                  {translate('dashboard')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/farm-planner" className="w-full cursor-pointer">
                  {translate('farmPlanner')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/marketplace" className="w-full cursor-pointer">
                  {translate('marketplace')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/weather" className="w-full cursor-pointer">
                  {translate('weather')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/market-prices" className="w-full cursor-pointer">
                  {translate('marketPrices')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/loans" className="w-full cursor-pointer">
                  {translate('loans')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/ask-expert" className="w-full cursor-pointer">
                  {translate('askExpert')}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/crop-calendar" className="w-full cursor-pointer">
                  {translate('cropCalendar')}
                </NavLink>
              </DropdownMenuItem>
              
              {/* New services */}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink to="/cold-chain-solution" className="w-full cursor-pointer">
                  Cold Chain Solution
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/crop-analysis" className="w-full cursor-pointer">
                  {translate('cropAnalysis')}
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="hidden md:flex items-center space-x-2">
        {user ? (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-8 w-8 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="cursor-pointer">
                    {translate('settings')}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  {translate('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <NavLink to="/sign-in">
              <Button variant="outline" size="sm">{translate('signin')}</Button>
            </NavLink>
            <NavLink to="/sign-up">
              <Button size="sm">{translate('signup')}</Button>
            </NavLink>
          </>
        )}
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 p-4">
          <div className="flex flex-col space-y-2">
            <NavLink 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={toggleMenu}
            >
              {translate('home')}
            </NavLink>
            
            <NavLink 
              to="/features" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/features') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={toggleMenu}
            >
              {translate('features')}
            </NavLink>
            
            <NavLink 
              to="/demo" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/demo') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={toggleMenu}
            >
              {translate('demo')}
            </NavLink>
            
            <NavLink 
              to="/government" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/government') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={toggleMenu}
            >
              {translate('government')}
            </NavLink>
            
            {user && (
              <>
                <div className="pt-2 pb-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Services</p>
                </div>
                
                <NavLink 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('dashboard')}
                </NavLink>
                
                <NavLink 
                  to="/farm-planner" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/farm-planner') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('farmPlanner')}
                </NavLink>
                
                <NavLink 
                  to="/marketplace" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/marketplace') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('marketplace')}
                </NavLink>
                
                <NavLink 
                  to="/weather" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/weather') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('weather')}
                </NavLink>
                
                <NavLink 
                  to="/market-prices" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/market-prices') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('marketPrices')}
                </NavLink>
                
                <NavLink 
                  to="/loans" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/loans') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('loans')}
                </NavLink>
                
                <NavLink 
                  to="/ask-expert" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/ask-expert') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('askExpert')}
                </NavLink>
                
                <NavLink 
                  to="/crop-calendar" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/crop-calendar') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('cropCalendar')}
                </NavLink>
                
                {/* New services for mobile menu */}
                <div className="pt-2 pb-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Advanced Features</p>
                </div>
                
                <NavLink 
                  to="/cold-chain-solution" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/cold-chain-solution') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  Cold Chain Solution
                </NavLink>
                
                <NavLink 
                  to="/crop-analysis" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/crop-analysis') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={toggleMenu}
                >
                  {translate('cropAnalysis')}
                </NavLink>
              </>
            )}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <Button 
                  className="w-full" 
                  variant="destructive"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  {translate('logout')}
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <NavLink to="/sign-in" onClick={toggleMenu} className="w-full">
                    <Button variant="outline" className="w-full">{translate('signin')}</Button>
                  </NavLink>
                  <NavLink to="/sign-up" onClick={toggleMenu} className="w-full">
                    <Button className="w-full">{translate('signup')}</Button>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
