
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-10 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-primary text-xl font-bold mr-1">Kisaan</span>
              <span className="text-primary-dark text-xl font-bold">Mitra</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Empowering farmers with technology to improve agricultural productivity and livelihood.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-noto">
              आपका साथी, आपकी फ़सल
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Farm Planner</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Marketplace</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Weather Alerts</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Scheme Matcher</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Credit Tracker</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Farmer Stories</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Government Schemes</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">AI Advisor</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary text-sm">FAQ</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">Email: info@kisaanmitra.org</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Phone: +91 98765 43210</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Address: New Delhi, India</li>
            </ul>
            <div className="mt-4">
              <h5 className="text-sm font-bold mb-2">Download Our App</h5>
              <div className="flex space-x-2">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  <span className="sr-only">Google Play</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  <span className="sr-only">App Store</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M11.07,17.07H8.07V10.85H11.07V17.07M15.07,17.07H12.07V10.85H15.07V17.07M15.07,9.55H8.07V6.55H15.07V9.55Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} KisaanMitra. All rights reserved.
            </p>
            <div className="flex items-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Made with <Heart size={14} className="inline text-red-500" /> for Indian Farmers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
