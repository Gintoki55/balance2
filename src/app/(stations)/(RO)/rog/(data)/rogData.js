const ROGbaseColumns = [
  [
    { key: "ROG", value: "Design", editable: false, info: "Scenario type" },
    { key: "N", value: [2], editable: false, info: "Trains in the plant N,about 1~ Md/500" },
    { key: "Ja", value: [1], editable: false, info: "Elements in pressure vessel Ja,about 1 ~ 9" },
    { key: "Jb", value: [1], editable: false, info: "Elements in pressure vessel Jb,about 1 ~ 9" },
    { key: "l", value: [0.1], editable: false, info: "Second permeate ratio l, about 0.1 ~ 1where Mr = l*M0" },
  ],
  [
   
    { key: "FF", value: [0.94, 0.94], editable: false, info: "Fouling factor in each stage FF,about 1 ~ 0.5" },
    { key: "A", value: [40900, 37200], editable: false, info: "Element active area in each stage A [m²]" },
    { key: "w", value: [1.018, 5.874], editable: false, info: "Water permability in each stage w [L/m²·h·bar]" },
    { key: "x", value: [0.074, 0.339], editable: false, info: "Salt permability in each stage x [g/m².h.(g/l)]" },
    { key: "-", value: [0.074, 0.339], editable: false, info: "" },
  ],
  [
    { key: "Pf", value: [0.0, 0.0], editable: false, info: "Feed water pressure to each stage Pf [bar]" },
    { key: "Pp", value: [0.0, 0.0], editable: false, info: "Permeate water pressure from each stage Pp [bar],normally Pp = 0" },
    { key: "PV", value: [0.0, 0.0,], editable: false, info: " Pressure vessels in each stage PV" },
    { key: "SR", value: [99.5, 0.0], editable: false, info: "Overal salt rejection in each stage SR [%]" },
    { key: "-", value: [99.5, 0.0], editable: false, info: "" },
  ],
  [
    { key: "M0", value: [9647.047], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "T0", value: [30.0], editable: false, info: "Raw water Temperature T0 [⁰C],about 10 ~ 37" },
    { key: "S0", value: [40.0], editable: false, info: "Raw water salinity S0 [g/l],about 1 ~ 50" },
    { key: "Sd", value: [0.2], editable: false, info: "Product water salinity Sd [g/l],about 0.100 ~ 0.500" },
    { key: "-", value: [99.5, 0.0], editable: false, info: "" },
  ],
  [
    { key: "Md", value: [1000.0], editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "WR", value: [60.0], editable: false, info: "Water recovery WR [%],where WR = 100*Md/M0" },
    { key: "SEC", value: [90.192], editable: false, info: "Specific exergy consumption SEC [MJ/t],which 1 [kWh] is 3.6 [MJ]" },
    { key: "sA", value: [16.688], editable: false, info: "Specific active area sA [m²/(t/h)]" },
    { key: "-", value: [16.688], editable: false, info: "" },
  ],
];

export const StationValueData = ROGbaseColumns;
