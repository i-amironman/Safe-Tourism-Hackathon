import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, Globe } from "lucide-react";
import { Link } from 'react-router-dom';

export function GlobalFooter() {
  return (
    <footer className="bg-white text-gray-900 py-16 px-4 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <span className="font-bold text-3xl text-gray-900">SafeTravel</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Travel with confidence using real-time safety data and intelligent planning tools.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-gray-700" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">Product</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/map" className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Safety Maps
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-sky-400">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/travel-guide" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link to="/safety-tips" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/emergency-contacts" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Emergency Contacts
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-pink-400">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Press
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 my-12"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="flex items-center gap-2">
              <span className="text-gray-700">© 2025 SafeTravel. All rights reserved.</span>
            </p>
            <div className="flex items-center gap-6">
              <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Official Travel Advice
              </a>
              <a href="https://www.who.int/health-topics/travel" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors duration-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                WHO Travel Health
              </a>
            </div>
          </div>
          <p className="flex items-center gap-2">
            <span className="text-gray-700">Built with</span>
            <span className="text-pink-500 animate-pulse">♥</span>
            <span className="text-gray-700">for safer travels worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}