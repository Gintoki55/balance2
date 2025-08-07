import * as React from 'react';

// cn function بديلة بسيطة
const cn = (...classes) => classes.filter(Boolean).join(' ');

// بديل يدوي لـ cva
const getButtonClasses = ({ variant = 'default', size = 'default' }) => {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return cn(base, variants[variant], sizes[size]);
};

// Button component
const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(getButtonClasses({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// Header component
export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="bg-teal-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-bold">
              BDS
            </div>
            <span className="text-gray-800 font-medium text-sm sm:text-base hidden sm:inline">
              Balance Desalination Simulator
            </span>
            <span className="text-gray-800 font-medium text-sm sm:hidden">
              BDS
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              Login
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
