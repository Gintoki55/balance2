const RODbaseColumns = [
  [
    { key: "ROD", value: "Design", editable: false, info: "Scenario type" },
    { key: "Na", value: [2], editable: false, info: "Trains in the first pass Na,About 1 ∼  Md/500" },
    { key: "Nc", value: [1], editable: false, info: "Trains in the second pass Nc,about  0.5*Na" },
    { key: "Ja", value: [1], editable: false, info: "Number of membrane elements in pressure vessel Ja,about 1 ~ 9" },
    { key: "Jc", value: [1], editable: false, info: "Number of membrane elements in pressure vessel Jc,about1 ~ 9" },
    { key: "Jd", value: [1], editable: false, info: "Number of membrane elements in pressure vessel Jd,about 1 ~ 9" },
  ],
  [
    { key: "Pp", value: [0.0, 0.0, 0.0], editable: false, info: "Permeate water pressure from each stage Pp [bar],normally Pp = 0" },
    { key: "FF", value: [0.94, 0.94, 0.94], editable: false, info: "Fouling factor in each stage FF,about 1 ~ 0.5" },
    { key: "A", value: [40900, 37200, 37200], editable: false, info: "Element active area in each stage A [m²]" },
    { key: "w", value: [1.018, 5.874, 5.874], editable: false, info: "Water permeability in each stage w [l/m².h.bar]" },
    { key: "x", value: [0.074, 0.339, 0.339], editable: false, info: "Salt permeability in each stage x [g/m².h.(g/l)]" },
    { key: "-", value: [0, 0, 0], editable: false, info: "" },
  ],
  [
    { key: "Pfa", value: [69.004], editable: false, info: "Feed pressure to the First pass Pfa [bar]" },
    { key: "Pfc", value: [1000], editable: false, info: "Feed pressure  to the second pass Pfc [bar]" },
    { key: "PVa", value: [144.602], editable: false, info: " Pressure vessels in stage PVa" },
    { key: "PVc", value: [93.765], editable: false, info: " Pressure vessels in stage PVc" },
    { key: "PVd", value: [50.0], editable: false, info: " Pressure vessels in stage PVd" },
    { key: "-", value: [0], editable: false, info: "" },
  ],
  [
    { key: "M0", value: [9647.047], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "T0", value: [30.0], editable: false, info: "Raw water temperature T0 [⁰C],about 10 ~ 50" },
    { key: "S0", value: [40.0], editable: false, info: "Raw water salinity S0 [g/l],about 1 ~ 50" },
    { key: "Sp", value: [0.4], editable: false, info: "First pass permeate salinity Sp [g/l], about 0.300 ~ 0.700" },
    { key: "Sd", value: [0.2], editable: false, info: "Product water salinity Sd [g/l],about 0.100 ~ 0.300" },
    { key: "k", value: [0.8], editable: false, info: "Permeate spliting ratio to the second pass k,about 0.10 ~ 1.00" },
  ],
  [
    { key: "Md", value: [1000.0], editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "WR", value: [60.0], editable: false, info: "Water recovery WR [%],where WR=100*Md/M0" },
    { key: "SEC", value: [83.254], editable: false, info: "Specific exergy consumption SEC [MJ/t],which 1 [kWh] is 3.6 [MJ]" },
    { key: "sA", value: [17.408], editable: false, info: "Specific active area sA [m²/(t/h)]" },
    { key: "SR", value: [99.5], editable: false, info: "Overal salt rejection SR [%]" },
    { key: "l", value: [0.1], editable: false, info: "Return water ratio from the second pass l,about 0.10 ~ 0.50" },
  ],
];

export const StationValueData = RODbaseColumns;
