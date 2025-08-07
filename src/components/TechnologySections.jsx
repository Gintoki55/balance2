"use client";
import * as React from 'react';

// cn function بسيطة
const cn = (...classes) => classes.filter(Boolean).join(' ');

// بديل يدوي لـ badgeVariants مع variant
const getBadgeClasses = (variant = 'default', selected = false) => {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    default:
      'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive:
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
  };

  const selectedStyle = selected ? 'outline outline-2 outline-blue-500' : '';

  return cn(base, variants[variant] || variants.default, selectedStyle);
};

function Badge({ className, variant, selected, onClick, children, ...props }) {
  return (
    <div
      className={cn(getBadgeClasses(variant, selected), className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

// Main Section
export default function TechnologySections() {
  const technologies = [
    {
      id: 'med',
      title: 'MED – Multi-Effect Distillation',
      description:
        'A multiple series evaporation and film formation based desalination process with heat reuse. High efficiency with low operating temperatures, reducing the required heating.',
      image: './images/b1.png',
      badges: [
        'MED',
        'MED-AB',
        'MED-VC',
        'MEDB',
        'MEDF',
        'MEDX',
        'MEDX_AB',
        'MVC',
      ],
    },
    {
      id: 'msf',
      title: 'MSF – Multi-Stage Flash',
      description:
        'A high-temperature process used for desalination based on multistage evaporation and heat recovery. A traditional, well-established method for seawater desalination.',
      image: './images/b2.png',
      badges: ['MSF', 'BRFO', 'BRFG', 'MSF-MZ', 'HBA-T', 'MR-ES'],
    },
    {
      id: 'ro',
      title: 'RO – Reverse Osmosis',
      description:
        'A membrane-based water treatment technology that uses high-pressure seawater to push water through the membrane. Modern and energy-efficient method for water treatment.',
      image: './images/b3.png',
      badges: ['RO-1', 'RO-P', 'RO-C', 'STC', 'BPLS', 'PRO', 'RCC', 'BRD'],
    },
  ];

  // تتبع العنصر المحدد فقط لكل تقنية
  const [selectedBadges, setSelectedBadges] = React.useState({});

  const selectBadge = (techId, badge) => {
    setSelectedBadges((prev) => ({
      ...prev,
      [techId]: badge,
    }));
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {technologies.map((tech, index) => {
            const isReverse = index % 2 === 1; // لعكس الاتجاه

            return (
              <div
                key={tech.id}
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-2 items-center gap-8 bg-white rounded-lg p-6 shadow-sm',
                  isReverse ? 'lg:flex-row-reverse' : ''
                )}
              >
                {/* صورة */}
                <div className="relative h-64 w-full">
                  <img
                    src={tech.image}
                    alt={tech.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* محتوى */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {tech.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {tech.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tech.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="text-xs sm:text-sm bg-gray-300 text-gray-900 rounded-none cursor-pointer"
                        selected={selectedBadges[tech.id] === badge}
                        onClick={() => selectBadge(tech.id, badge)}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
