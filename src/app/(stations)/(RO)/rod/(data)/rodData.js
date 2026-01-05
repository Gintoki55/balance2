const RODbaseColumns = [
  [
    { key: "ROD", value: "Design", editable: false, info: "Scenario type" },
    { key: "Na", value: [2], editable: false, info: "Number of trains Na" },
    { key: "Nc", value: [1], editable: false, info: "Number of stages Nc" },
    { key: "Ja", value: [1], editable: false, info: "Elements per pressure vessel (stage A)" },
    { key: "Jc", value: [1], editable: false, info: "Elements per pressure vessel (stage C)" },
    { key: "Jd", value: [1], editable: false, info: "Elements per pressure vessel (stage D)" },
  ],
  [
    { key: "Pp", value: [0.0, 0.0, 0.0], editable: false, info: "Permeate pressure Pp [bar]" },
    { key: "FF", value: [0.94, 0.94, 0.94], editable: false, info: "Fouling factor FF" },
    { key: "A", value: [40900, 37200, 37200], editable: false, info: "Membrane active area A [m²]" },
    { key: "w", value: [1.018, 5.874, 5.874], editable: false, info: "Water permeability w [L/m²·h·bar]" },
    { key: "x", value: [0.074, 0.339, 0.339], editable: false, info: "Salt permeability x" },
    { key: "-", value: [0, 0, 0], editable: false, info: "" },
  ],
  [
    { key: "Pfa", value: [69.004], editable: false, info: "Feed pressure at stage A Pf,a [bar]" },
    { key: "Pfc", value: [1000], editable: false, info: "Feed pressure at stage C Pf,c [bar]" },
    { key: "PVa", value: [144.602], editable: false, info: "Pressure vessels in stage A" },
    { key: "PVc", value: [93.765], editable: false, info: "Pressure vessels in stage C" },
    { key: "PVd", value: [50.0], editable: false, info: "Pressure vessels in stage D" },
    { key: "-", value: [0], editable: false, info: "" },
  ],
  [
    { key: "M0", value: [9647.047], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "T0", value: [30.0], editable: false, info: "Raw water temperature T0 [°C]" },
    { key: "S0", value: [40.0], editable: false, info: "Raw water salinity S0 [g/L]" },
    { key: "Sp", value: [0.4], editable: false, info: "Permeate salinity Sp [g/L]" },
    { key: "Sd", value: [0.2], editable: false, info: "Product water salinity Sd [g/L]" },
    { key: "k", value: [0.8], editable: false, info: "Pressure loss coefficient k" },
  ],
  [
    { key: "Md", value: [1000.0], editable: false, info: "Fresh water production Md [t/h]" },
    { key: "WR", value: [60.0], editable: false, info: "Water recovery WR [%]" },
    { key: "SEC", value: [83.254], editable: false, info: "Specific energy consumption SEC" },
    { key: "sA", value: [17.408], editable: false, info: "Specific membrane area sA" },
    { key: "SR", value: [99.5], editable: false, info: "Salt rejection SR [%]" },
    { key: "l", value: [0.1], editable: false, info: "Brine recycle ratio l" },
  ],
];

export const StationValueData = RODbaseColumns;
