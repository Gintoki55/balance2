const ROBbaseColumns = [
  [
    { key: "ROB", value: "Design", editable: false, info: "NULL" },
    { key: "N", value: [1], editable: false, info: "Trains in the plant N,About 1 ∼  Md/500" },
    { key: "Ja", value: [1], editable: false, info: "Elements in the pressure vessel Ja,about 1 ~ 9" },
    { key: "Jb", value: [1], editable: false, info: "Elements in the pressure vessel Jb,about 1 ~ 9" },
    { key: "T0", value: [30000], editable: false, info: "Raw water Temperature T0 [⁰C],about 10 ~ 37" },
    // F
  ],
  [
    { key: "FF", value: [1000, 1000], editable: false, info: "Fouling factor in each stage FF,about 1 ~ 0.5" },
    { key: "A", value: [40900, 40900], editable: false, info: "Element active area in each stage A [m²]" },
    { key: "w", value: [1018, 1018], editable: false, info: "Water permability in each stage w [l/m².h.bar]" },
    { key: "x", value: [0.074, 0.074], editable: false, info: "Salt permability in each stage  x [g/m².h.(g/l)]" },
    { key: "-", value: [0, 0], editable: false, info: "" ,locked: true},
    // F
  ],
  [
    { key: "Pf", value: [98381, 1000], editable: false, info: "Feed water pressure for each stage Pf [bar]" },
    { key: "Pp", value: [0.00, 0.00], editable: false, info: "Permeate water pressure from each stage Pp [bar],normally Pp = 0" },
    { key: "PV", value: [46883, 30000], editable: false, info: " Pressure vessels in each stage PV" },
    { key: "b", value:  [1250, 0.00], editable: false, info: "Booster pressure ratio b,b ≈1.1 ~ 2.5 with booster pump,b ≈ 0.99 without booster pump" },
    { key: "-", value: [0, 0], editable: false, info: "",locked: true },
    // F
  ],
  [
    { key: "M0", value: [9647047], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "S0", value: [40000], editable: false, info: "Raw water salinity S0 [g/l],about 1 ~ 50" },
    { key: "Sd", value: [0.200], editable: false, info: "Product water salinity Sd [g/l],about 0.100 ~ 0.500" },
    { key: "l", value: [0.000], editable: false, info: "Brine return ratio l, where Mr= l*M0 Recommended range: 0 ~ 1" },
    { key: "-", value: [0], editable: false, info: "",locked: true },
    // F
  ],
  [
    { key: "Md", value: [100000], editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "WR", value: [60000], editable: false, info: "Water recovery WR [%],100*Md/M0" },
    { key: "SEC", value: [118636], editable: false, info: "Specific exergy consumption SEC [MJ/t],where 1 [kWh] = 3.6 [MJ]" },
    { key: "sA", value: [6289], editable: false, info: "Specific active area sA [m²/(t/h)]" },
    { key: "SR", value: [99500], editable: false, info: "Overal salt rejection SR [%]" },
    // F
  ],
];

export const StationValueData = ROBbaseColumns;
