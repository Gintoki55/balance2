export const desalinationData = {
  project: {
    title: "Reverse Osmosis Desalination",
    description: "Reverse osmosis (RO) is a water purification process that uses a semi-permeable membrane to remove ions, unwanted molecules, and larger particles from drinking water. In reverse osmosis, an applied pressure is used to overcome osmotic pressure, a colligative property that is driven by chemical potential differences of the solvent, a thermodynamic parameter.",
    image: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1200",
    caption: "Modern reverse osmosis water treatment facility"
  },

  technologies: [
    {
      id: "roa",
      name: "Reverse Osmosis Stage A (ROA)",
      shortName: "ROA",
      description: "The primary filtration stage using high-pressure membrane systems to remove dissolved salts and impurities. This stage operates at the highest pressure to achieve maximum salt rejection.",
      features: [
        "High-pressure operation (55-70 bar)",
        "Thin-film composite membranes",
        "Salt rejection rate: 99.5-99.8%",
        "Energy recovery system integration",
        "Pre-treatment requirement: 5-micron filtration"
      ],
      capacity: "10,000 m³/day",
      recovery: "45%",
      pressure: "65 bar"
    },
    {
      id: "rob",
      name: "Reverse Osmosis Stage B (ROB)",
      shortName: "ROB",
      description: "Secondary treatment stage focusing on polishing the permeate from ROA. Operates at moderate pressure with emphasis on stability and consistent output quality.",
      features: [
        "Medium-pressure operation (40-55 bar)",
        "Enhanced fouling resistance",
        "Salt rejection rate: 99.2-99.5%",
        "Lower energy consumption per cubic meter",
        "Optimized for consistent quality"
      ],
      capacity: "8,500 m³/day",
      recovery: "50%",
      pressure: "50 bar"
    },
    {
      id: "roc",
      name: "Reverse Osmosis Stage C (ROC)",
      shortName: "ROC",
      description: "Tertiary treatment stage designed for final polishing and removal of trace contaminants. Features advanced membrane technology for ultra-pure water production.",
      features: [
        "Low-pressure operation (30-45 bar)",
        "Ultra-low fouling membranes",
        "Salt rejection rate: 98.5-99.2%",
        "Extended membrane life (5-7 years)",
        "Minimal pre-treatment requirements"
      ],
      capacity: "7,200 m³/day",
      recovery: "55%",
      pressure: "40 bar"
    },
    {
      id: "rod",
      name: "Reverse Osmosis Stage D (ROD)",
      shortName: "ROD",
      description: "Advanced treatment stage utilizing brackish water RO technology. Optimized for lower salinity feed water with improved recovery rates.",
      features: [
        "Brackish water optimization (15-35 bar)",
        "High recovery potential (65-75%)",
        "Salt rejection rate: 97.5-98.5%",
        "Reduced operational costs",
        "Hybrid membrane configuration"
      ],
      capacity: "12,000 m³/day",
      recovery: "70%",
      pressure: "28 bar"
    },
    {
      id: "roe",
      name: "Reverse Osmosis Stage E (ROE)",
      shortName: "ROE",
      description: "Specialized stage for brine concentration and zero liquid discharge applications. Handles high-salinity streams with specialized membrane technology.",
      features: [
        "High-salinity operation (70-85 bar)",
        "Brine concentration capability",
        "Salt rejection rate: 99.0-99.5%",
        "Zero liquid discharge support",
        "Specialized anti-scaling system"
      ],
      capacity: "5,000 m³/day",
      recovery: "35%",
      pressure: "78 bar"
    },
    {
      id: "rof",
      name: "Reverse Osmosis Stage F (ROF)",
      shortName: "ROF",
      description: "Industrial-scale seawater desalination stage with maximum throughput capacity. Designed for large-scale municipal water supply applications.",
      features: [
        "Ultra-high capacity design",
        "Seawater operation (60-70 bar)",
        "Salt rejection rate: 99.6-99.9%",
        "Integrated monitoring systems",
        "Redundant pump configuration"
      ],
      capacity: "25,000 m³/day",
      recovery: "42%",
      pressure: "68 bar"
    },
    {
      id: "rog",
      name: "Reverse Osmosis Stage G (ROG)",
      shortName: "ROG",
      description: "Next-generation stage featuring cutting-edge membrane technology and AI-driven optimization. Represents the future of desalination with enhanced efficiency and sustainability.",
      features: [
        "AI-optimized operation",
        "Variable pressure control (35-75 bar)",
        "Salt rejection rate: 99.7-99.95%",
        "Real-time adaptive algorithms",
        "Carbon-neutral operation capable",
        "Predictive maintenance system"
      ],
      capacity: "15,000 m³/day",
      recovery: "48%",
      pressure: "62 bar"
    }
  ],

  parameters: [
    {
      name: "Feed Water TDS",
      description: "Total Dissolved Solids in the incoming water stream",
      unit: "mg/L",
      example: "35,000-45,000",
      category: "Input"
    },
    {
      name: "Permeate TDS",
      description: "Total Dissolved Solids in the treated water output",
      unit: "mg/L",
      example: "150-500",
      category: "Output"
    },
    {
      name: "Operating Pressure",
      description: "Applied hydraulic pressure across the membrane",
      unit: "bar",
      example: "55-70",
      category: "Operation"
    },
    {
      name: "Recovery Rate",
      description: "Percentage of feed water converted to permeate",
      unit: "%",
      example: "35-50",
      category: "Efficiency"
    },
    {
      name: "Salt Rejection",
      description: "Percentage of salt removed from feed water",
      unit: "%",
      example: "99.2-99.8",
      category: "Performance"
    },
    {
      name: "Flux Rate",
      description: "Water flow rate through membrane per unit area",
      unit: "L/m²/h",
      example: "15-25",
      category: "Performance"
    },
    {
      name: "Temperature",
      description: "Operating temperature of the feed water",
      unit: "°C",
      example: "15-35",
      category: "Operation"
    },
    {
      name: "pH Level",
      description: "Acidity/alkalinity of the feed water",
      unit: "pH",
      example: "6.5-7.5",
      category: "Operation"
    },
    {
      name: "Energy Consumption",
      description: "Electrical energy required per cubic meter of water",
      unit: "kWh/m³",
      example: "2.5-4.5",
      category: "Efficiency"
    },
    {
      name: "Membrane Life",
      description: "Expected operational lifespan of RO membranes",
      unit: "years",
      example: "3-7",
      category: "Maintenance"
    },
    {
      name: "Turbidity",
      description: "Cloudiness or haziness of feed water",
      unit: "NTU",
      example: "<1.0",
      category: "Input"
    },
    {
      name: "SDI",
      description: "Silt Density Index - measure of particulate fouling potential",
      unit: "SDI",
      example: "<5.0",
      category: "Input"
    }
  ],

  faq: [
    {
      question: "What is reverse osmosis desalination?",
      answer: "Reverse osmosis (RO) desalination is a water purification technology that uses a semi-permeable membrane to remove dissolved salts, minerals, and other impurities from seawater or brackish water. By applying pressure greater than the osmotic pressure, water molecules are forced through the membrane while salt ions and other contaminants are retained, producing fresh drinking water."
    },
    {
      question: "How much energy does RO desalination consume?",
      answer: "Modern seawater RO plants typically consume between 2.5 to 4.5 kWh per cubic meter of water produced. With energy recovery devices, this can be reduced to as low as 2.0 kWh/m³. Brackish water RO requires significantly less energy, typically 0.5 to 1.5 kWh/m³, due to lower operating pressures required."
    },
    {
      question: "What is the typical recovery rate?",
      answer: "For seawater desalination, typical recovery rates range from 35% to 50%, meaning that for every 100 liters of seawater fed to the system, 35-50 liters of fresh water is produced. Brackish water systems can achieve higher recovery rates of 65% to 85% due to lower initial salinity levels."
    },
    {
      question: "How long do RO membranes last?",
      answer: "With proper pre-treatment and maintenance, RO membranes typically last 3 to 7 years. Membrane life depends on factors such as feed water quality, operating conditions, cleaning frequency, and adherence to manufacturer guidelines. Regular monitoring and timely cleaning can extend membrane lifespan."
    },
    {
      question: "What happens to the brine concentrate?",
      answer: "The concentrated brine (reject stream) is typically diluted and returned to the ocean in seawater desalination plants, with careful environmental monitoring to minimize impact. In brackish water systems or zero liquid discharge facilities, brine may be further concentrated through evaporation or crystallization, with salts recovered for commercial use."
    },
    {
      question: "What pre-treatment is required?",
      answer: "Pre-treatment is critical for RO system performance and typically includes: coagulation and flocculation to remove suspended solids, multimedia filtration, cartridge filtration (5-micron), pH adjustment, and addition of anti-scalant chemicals. The specific pre-treatment requirements depend on the feed water quality and type of RO membranes used."
    },
    {
      question: "How does RO compare to other desalination methods?",
      answer: "RO is the most widely used desalination technology, accounting for over 65% of global desalination capacity. Compared to thermal methods like Multi-Stage Flash (MSF) or Multi-Effect Distillation (MED), RO is more energy-efficient, has lower capital costs, and is easier to scale. However, thermal methods can handle higher-salinity water and have longer equipment life in some cases."
    },
    {
      question: "What is the cost per cubic meter?",
      answer: "The cost of RO desalinated water varies significantly based on location, plant size, energy costs, and feed water quality. For large seawater plants, costs typically range from $0.50 to $1.50 per cubic meter. Brackish water desalination is generally cheaper, ranging from $0.20 to $0.60 per cubic meter. Costs continue to decrease with technological improvements."
    }
  ],

  images: [
    {
      url: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1200",
      caption: "Modern water treatment facility",
      credit: "Pexels"
    },
    {
      url: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&w=1200",
      caption: "Industrial water purification plant",
      credit: "Pexels"
    },
    {
      url: "https://images.pexels.com/photos/1268362/pexels-photo-1268362.jpeg?auto=compress&cs=tinysrgb&w=1200",
      caption: "Clean water flowing",
      credit: "Pexels"
    }
  ],

  links: [
    {
      title: "International Desalination Association",
      url: "https://idadesal.org",
      description: "Global organization advancing desalination and water reuse"
    },
    {
      title: "American Membrane Technology Association",
      url: "https://www.amtaorg.com",
      description: "Industry association for membrane water treatment"
    },
    {
      title: "Desalination Journal",
      url: "https://www.journals.elsevier.com/desalination",
      description: "Leading scientific journal on desalination research"
    },
    {
      title: "World Health Organization - Drinking Water",
      url: "https://www.who.int/health-topics/drinking-water",
      description: "Global standards and guidelines for drinking water quality"
    }
  ],

  statistics: {
    totalParameters: 12,
    mainTechnology: "Reverse Osmosis",
    stages: 7,
    globalCapacity: "95 million m³/day",
    plantCount: "20,000+"
  }
};
