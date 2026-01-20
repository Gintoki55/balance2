const ROCbaseColumns = [
  [
    { key: "ROC", value: "Design", editable: false, info: "NULL" },
    { key: "Na", value: [1], editable: false, info: "Trains in the first pass Na,About 1 ∼  Md/500" },
    { key: "Nc", value: [1], editable: false, info: "Trains in the second pass Nc,about  0.5*Na" },
    { key: "Ja", value: [1], editable: false, info: "Number of elements in pressure vessel Ja, about 1~ 9" },
    { key: "Jc", value: [1], editable: false, info: "Number of elements in pressure vessel Jc, about 1~ 9" },
  ],
  [
    { key: "FF", value: [0.940, 0.940], editable: false, info: "Fouling factor in each stage FF,about 1  0.5" },
    { key: "A", value: [37100, 37200], editable: false, info: "Element active area in each stage A [m²]" },
    { key: "w", value: [1.01, 5.874], editable: false, info: "Water permability in each stage w [l/m².h.bar]" },
    { key: "x", value: [0.073, 0.339], editable: false, info: "Salt permability in each stage  x [g/m².h.(g/l)]" },
    { key: "-", value: [0, 0], editable: false, info: "",locked: true},
  ],
  [
    { key: "Pf", value: [263.121, 1000], editable: false, info: "Feed water pressure to each stage Pf [bar]" },
    { key: "Pp", value: [0.000, 0.000], editable: false, info: "Permeate water pressurefrom each stage Pp [bar],normally Pp=0" },
    { key: "PV", value: [291.796, 170.268], editable: false, info: "Pressure vessels in each stage PV" },
    { key: "k", value: [0.800, 0.000], editable: false, info: "permeate splitting ratio to the second pass k, about 0.10 ~1.00" },
    { key: "l", value: [0.8, 0.0], editable: false, info: "Return water ratio from the second pass l,about 0.10 ~ 0.50" },
  ],
  [
    { key: "M0", value: [6987.712], editable: false, info: "Raw water M0 [t/h]" },
    { key: "T0", value: [30000], editable: false, info: "Raw water temperature T0 [⁰C] about 10 ~ 50" },
    { key: "S0", value: [40000], editable: false, info: "Raw water salinity S0 [g/l] about 1 ~ 50" },
    { key: "Sp", value: [0.500], editable: false, info: "First pass permeate salinity Sp [g/l], about 0.300 ~ 0.700" },
    { key: "Sd", value: [0.200], editable: false, info: "Product water salinity Sd [g/l],about 0.100 ~ 0.500" },
  ],
  [
    { key: "Md", value: [1000.0], editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "WR", value: [60.0], editable: false, info: "Water recovery WR [%],where WR=100*Md/M0" },
    { key: "SEC", value: [230.155], editable: false, info: "Specific exergy consumption SEC [MJ/t],which 1 [kWh] is 3.6 [MJ]" },
    { key: "sA", value: [37.14], editable: false, info: "Specific active area sA [m²/(t/h)]" },
    { key: "SR", value: [99.5], editable: false, info: "Overal salt rejection SR [%]" },
  ],
];

export const StationValueData = ROCbaseColumns;
