import { Separator } from "@/components/ui/separator";
import { MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, Globe } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-16 px-4 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
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
                <Link href="/map">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Safety Maps
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/trips">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Trip Planning
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/features">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Features
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Pricing
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-sky-400">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/travel-guide">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Travel Guide
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/safety-tips">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Safety Tips
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/emergency-contacts">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Emergency Contacts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/api-docs">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    API Documentation
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-pink-400">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/about">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Contact
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Careers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/press">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Press
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Partners
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/privacy">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Cookie Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/gdpr">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    GDPR Compliance
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/accessibility">
                  <a className="hover:text-gray-900 transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Accessibility
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-400">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <a href="mailto:support@safetravel.com" className="hover:text-gray-900 transition-colors duration-300">
                  support@safetravel.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-700" />
                </div>
                <a href="tel:+442012345678" className="hover:text-gray-900 transition-colors duration-300">
                  +44 20 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-gray-700" />
                </div>
                <span>Available 24/7 Worldwide</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-sky-400">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to get travel safety tips and updates
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-50 transition-all"
              />
              <button className="px-6 py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-300" />

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
                Health Guidelines
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