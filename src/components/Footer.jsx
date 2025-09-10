import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-hexagons_footer text-black py-8 sm:py-10 lg:py-12 2xl:py-16 border-t-gray-200 border">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 2xl:gap-12">
          
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4 2xl:mb-6">
              <a href="/" className="flex items-center">
                <img
                  src="/images/logo-balance.png"
                  alt="Balance Desalination Simulator Logo"
                  className="h-8 sm:h-10 2xl:h-12 w-auto object-contain transition-transform duration-150 active:scale-95 cursor-pointer"
                />
              </a>
              <h1 className="text-gray-700 font-bold text-sm sm:text-base 2xl:text-lg">
                Balance Desalination Simulator
              </h1>
            </div>
            <p className="text-[rgb(66,153,136)] mb-4 text-sm sm:text-base 2xl:text-lg">
              Dr. Ahmed Issa Qutan
            </p>
            <p className="text-gray-700 font-bold mb-4 text-sm sm:text-base 2xl:text-lg">
              PO box 775, PC 215, Salalah, Oman
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 2xl:mb-6 text-sm sm:text-base 2xl:text-lg text-[rgb(66,153,136)]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-700 font-bold text-sm sm:text-base 2xl:text-lg">
              <li><a href="#" className="hover:text-black transition-colors">About</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Home</a></li>
            </ul>
          </div>

          {/* Start Desalination */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 2xl:mb-6 text-sm sm:text-base 2xl:text-lg text-[rgb(66,153,136)]">
              Start Desalination
            </h4>
            <ul className="space-y-2 text-gray-700 font-bold text-sm sm:text-base 2xl:text-lg">
              <li><a href="/medpage" className="hover:text-black transition-colors">MED</a></li>
              <li><a href="/msfpage" className="hover:text-black transition-colors">MSF</a></li>
              <li><a href="/ropage" className="hover:text-black transition-colors">ROA</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 mt-6 sm:mt-8 2xl:mt-10 pt-6 sm:pt-8 2xl:pt-10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-black text-xs sm:text-sm 2xl:text-base mb-4 sm:mb-0 text-center sm:text-left">
            © 2025 Balance Desalination Simulator. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-5 2xl:space-x-8 text-gray-700 font-bold">
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 hover:text-black cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 hover:text-black cursor-pointer transition-colors" />
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 hover:text-black cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 hover:text-black cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
