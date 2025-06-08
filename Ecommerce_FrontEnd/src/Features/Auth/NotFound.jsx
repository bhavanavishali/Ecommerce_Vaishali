import { Link } from "react-router-dom";
import { Gem, Home, Search } from "lucide-react";

const Button = ({ children, className, variant, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors";
  const variantStyles = variant === "outline"
    ? "border-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
    : "bg-[#7a2828] text-white hover:bg-[#5a1e1e]";
  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Decorative Header */}
        <div className="relative">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
            <Gem className="w-8 h-8 text-amber-500" />
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>

          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#7a2828] to-amber-600 mb-4 tracking-tight">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-[#7a2828] opacity-10 blur-sm">404</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-serif text-[#7a2828] mb-2">Page Not Found</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-[#7a2828] to-amber-500 mx-auto"></div>
          </div>

          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            The precious page you're looking for seems to have slipped away like a rare gem. Let us guide you back to our collection.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center space-x-8 py-8">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[#7a2828] rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-200"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>

          <Link to="/collections">
            <Button
              variant="outline"
              className="px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Collections
            </Button>
          </Link>
        </div>

        {/* Additional Navigation */}
        <div className="pt-8 border-t border-amber-200">
          <p className="text-sm text-gray-500 mb-4">Or explore our popular sections:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/rings"
              className="text-[#7a2828] hover:text-amber-600 transition-colors duration-200 hover:underline"
            >
              Rings
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/necklaces"
              className="text-[#7a2828] hover:text-amber-600 transition-colors duration-200 hover:underline"
            >
              Necklaces
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/earrings"
              className="text-[#7a2828] hover:text-amber-600 transition-colors duration-200 hover:underline"
            >
              Earrings
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/bracelets"
              className="text-[#7a2828] hover:text-amber-600 transition-colors duration-200 hover:underline"
            >
              Bracelets
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="pt-8">
          <p className="text-xs text-gray-400 italic">Crafted with precision, just like our jewelry</p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#7a2828] rounded-full opacity-5 animate-pulse delay-300"></div>
        <div className="absolute top-3/4 left-1/6 w-16 h-16 bg-amber-300 rounded-full opacity-15 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}