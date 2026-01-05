const ROCbaseColumns = [
  [
    { key: "ROC", value: "Design", editable: false, info: "NULL" },
    { key: "Na", value: [2], editable: false, info: "Trains in the plant Na" },
    { key: "Nc", value: [1], editable: false, info: "Elements in the pressure vessel" },
    { key: "Ja", value: [1], editable: false, info: "Elements in the pressure vessel" },
    { key: "Jc", value: [30.0], editable: false, info: "Raw water Temperature T0 [°C]" },
  ],
  [
    { key: "FF", value: [0.940, 0.940], editable: false, info: "Fouling factor FF" },
    { key: "A", value: [37100, 37200], editable: false, info: "Element active area A [m²]" },
    { key: "w", value: [1.01, 5.874], editable: false, info: "Water permeability w" },
    { key: "x", value: [0.073, 0.339], editable: false, info: "Salt permeability x" },
    { key: "-", value: [0, 0], editable: false, info: "" },
  ],
  [
    { key: "Pf", value: [263.121, 1000], editable: false, info: "Feed water pressure Pf [bar]" },
    { key: "Pp", value: [0.0, 0.0], editable: false, info: "Permeate water pressure Pp [bar]" },
    { key: "PV", value: [291.796, 170.268], editable: false, info: "Pressure vessels in the stage PV" },
    { key: "k", value: [0.8, 0.0], editable: false, info: "Booster pressure ratio b" },
    { key: "l", value: [0.8, 0.0], editable: false, info: "Booster pressure ratio b" },
  ],
  [
    { key: "M0", value: [6987.712], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "TO", value: [6987.712], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "S0", value: [40.0], editable: false, info: "Raw water salinity S0 [g/l]" },
    { key: "Sp", value: [0.2], editable: false, info: "Product water salinity Sd [g/l]" },
    { key: "Sd", value: [0.2], editable: false, info: "Product water salinity Sd [g/l]" },
  ],
  [
    { key: "Md", value: [1000.0], editable: false, info: "Fresh water production Md [t/h]" },
    { key: "WR", value: [60.0], editable: false, info: "Water recovery WR [%]" },
    { key: "SEC", value: [230.155], editable: false, info: "Specific exergy consumption SEC" },
    { key: "sA", value: [37.14], editable: false, info: "Specific active area sA" },
    { key: "SR", value: [99.5], editable: false, info: "Overall salt rejection SR [%]" },
  ],
];

export const StationValueData = ROCbaseColumns;
