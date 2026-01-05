const MSFbaseColumns = [
  [
    { key: "MSF", value: "Design", editable: false, info: "NULL" },
    { key: "Jb", value: [2], editable: false, info: "Number of upper stages Jb" },
    { key: "Ka", value: [100], editable: false, info: "Heat transfer correction factor for brine heater Ka,about 0.5 ~ 3" },
    { key: "Kb", value: [100], editable: false, info: "Heat transfer correction factor for upper stages Kb,about 0.5 ~ 3" },
    { key: "Kc", value: [100], editable: false, info: "Heat transfer correction factor for lower stages Kc,about 0.5 ~ 3" },
  ],
  [
    { key: "-", value: [0], editable: false, info: "" },
    { key: "Jc", value: [2], editable: false, info: "Number of lower stages Jc" },
    { key: "Aa", value: [1000], editable: false, info: "Brine heater area Aa [m²]" },
    { key: "Ab", value: [1000], editable: false, info: "Each upper stage area Ab [m²]" },
    { key: "Ac", value: [1000], editable: false, info: "Each lower stage area Ac [m²]" },
  ],
  [
    { key: "-", value: [0], editable: false, info: "" },
    { key: "cg", value: [1000], editable: false, info: "Condensation gain cg,about 0.5 ~ 1" },
    { key: "δa", value: [1000], editable: false, info: "Brine heater approach temperature δa [⁰C],about 1 ~ 9" },
    { key: "δb", value: [1000], editable: false, info: "Upper stages approach temperature δb [⁰C],about 1 ~ 5" },
    { key: "δc", value: [1000], editable: false, info: "Lower stages approach temperature δc [⁰C],about 1 ~ 5" },
  ],
  [
    { key: "Ts", value: [2000], editable: false, info: "Heating steam temperature Ts [⁰C]" },
    { key: "Th", value: [2000], editable: false, info: "Top brine temperature Th [⁰C],about 90 ~ 120" },
    { key: "T0", value: [2000], editable: false, info: "Raw water temperature T0 [⁰C],about 10 ~ 50" },
    { key: "Tm", value: [2000], editable: false, info: "Mixed raw water temperature Tm [⁰C]" },
    { key: "WR", value: [2000], editable: false, info: "Water recovery WR [%],which is 100*Md/M0" },
  ],
  [
    { key: "M0", value: [50], editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "Mm", value: [50], editable: false, info: "Portion of brine water for mixing Mm [t/h]" },
    { key: "m", value: [50], editable: false, info: "Mixing ratio m,which is Mm/M0" },
    { key: "S0", value: [50], editable: false, info: "Raw water salinity S0 [g/l],about 1 ~ 60" },
    { key: "Sm", value: [50], editable: false, info: "Mixed feed water salinity Sm [g/l]" },
  ],
  [
    { key: "Md", value: [10000], editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "Ms", value:[10000], editable: false, info: "Heating steam Ms [t/h]" },
    { key: "GOR", value: [10000], editable: false, info: "Gain output ratio GOR,which is Md/Ms" },
    { key: "SEC", value:[10000], editable: false, info: "Specific exergy consumption SEC [MJ/t],where 1 [kWh] is 3.6 [MJ]" },
    { key: "sA", value: [10000], editable: false, info: "Specific heat transfer area sA [m²/(t/h)]" },
  ],
];

export const StationValueData =  MSFbaseColumns;