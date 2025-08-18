import * as React from 'react';
import { Building, Zap, Database } from 'lucide-react';

// استبدال دالة cn لو ما عندك وحدة
const cn = (...classes) => classes.filter(Boolean).join(' ');

// مكونات الكارد كاملة
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export default function FeaturesSection() {
  const features = [
    {
      icon: Building,
      title: 'Custom Design Inputs',
      description: 'Design your plant with customizable parameters for optimal performance.'
    },
    {
      icon: Zap,
      title: 'Scenario Simulation',
      description: 'Run advanced simulations to analyze different operational scenarios.'
    },
    {
      icon: Database,
      title: 'Save & Export Projects',
      description: 'Save your work and export detailed reports for further analysis.'
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-300">
            Built for Precision
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl mx-auto px-4">
            Discover precise engineering solutions that enable seamless modeling, 
            scenario testing, and comprehensive analysis with unmatched technical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors duration-300 card-hover">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-teal-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
