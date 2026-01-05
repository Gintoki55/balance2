const ROGbaseColumns = [
  [
    { key: "ROG", value: "Design", editable: false, info: "Scenario type" },
    { key: "N", value: [2], editable: false, info: "Elements per pressure vessel (stage A)" },
    { key: "Ja", value: [1], editable: false, info: "Elements per pressure vessel (stage A)" },
    { key: "Jb", value: [1], editable: false, info: "Elements per pressure vessel (stage B)" },
    { key: "l", value: [0.1], editable: false, info: "Brine recycle ratio l" },
  ],
  [
   
    { key: "FF", value: [0.94, 0.94], editable: false, info: "Fouling factor FF" },
    { key: "A", value: [40900, 37200], editable: false, info: "Membrane active area A [m²]" },
    { key: "w", value: [1.018, 5.874], editable: false, info: "Water permeability w [L/m²·h·bar]" },
    { key: "x", value: [0.074, 0.339], editable: false, info: "Salt permeability x" },
    { key: "-", value: [0.074, 0.339], editable: false, info: "Salt permeability x" },
  ],
  [
    { key: "Pf", value: [0.0, 0.0], editable: false, info: "Permeate pressure Pp [bar]" },
    { key: "Pp", value: [0.0, 0.0], editable: false, info: "Permeate pressure Pp [bar]" },
    { key: "PV", value: [0.0, 0.0,], editable: false, info: "Permeate pressure Pp [bar]" },
    { key: "SR", value: [99.5, 0.0], editable: false, info: "Salt rejection SR [%]" },
    { key: "-", value: [99.5, 0.0], editable: false, info: "Salt rejection SR [%]" },
  ],
  [
    { key: "M0", value: [9647.047], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "T0", value: [30.0], editable: false, info: "Raw water temperature T0 [°C]" },
    { key: "S0", value: [40.0], editable: false, info: "Raw water salinity S0 [g/L]" },
    { key: "Sp", value: [0.5], editable: false, info: "Permeate salinity Sp [g/L]" },
    { key: "Sd", value: [0.2], editable: false, info: "Product water salinity Sd [g/L]" },
  ],
  [
    { key: "Md", value: [1000.0], editable: false, info: "Fresh water production Md [t/h]" },
    { key: "WR", value: [60.0], editable: false, info: "Water recovery WR [%]" },
    { key: "SEC", value: [90.192], editable: false, info: "Specific energy consumption SEC" },
    { key: "sA", value: [16.688], editable: false, info: "Specific membrane area sA" },
    { key: "-", value: [16.688], editable: false, info: "Specific membrane area sA" },
  ],
];

export const StationValueData = ROGbaseColumns;
