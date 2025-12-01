const MEDbaseColumns = [
  [
    { key: "MED", value: "Design", editable: false, info: "NUll" },
    { key: "Ka", value: "1.00", editable: false, info: "Heat transfer correction factor for evaporators Ka,about 0.5 ~ 3" },
    { key: "Kb", value: "1.00", editable: false, info: "Heat transfer correction factor for preheaters Kb,about 0.5 ~ 3 for process with preheaters,or 0 for process without preheaters" },
    { key: "Kc", value: "1.00", editable: false, info: "Heat transfer correction factor for condenser Kc,about 0.5 ~ 3" },
    { key: "ER", value: "1.00", editable: false, info: "Entrainment ratio ER which is Me/(Ms-Me),about 0.1 ~ 2 for plant with vapour compression,or 0 for plant without vapour compression" },
  ],
  [
    { key: "Ja", value: "1", editable: false, info: "Number of effects J #" },
    { key: "Aa", value: "1000", editable: false, info: "Each evaporator area Aa [m²]" },
    { key: "Ab", value: "1000", editable: false, info: "First preheater area Ab [m²],for other preheaters Abj =j*Ab" },
    { key: "Ac", value: "1000", editable: false, info: "Condenser area Ac [m²]" },
    { key: "Ve", value: "1000", editable: false, info: "Volume of the entrained vapour Ve [m³/s]" },
  ],
  [
    { key: "WR", value: "10.00", editable: false, info: "Water recovery WR [%],Which is 100*Md/M0" },
    { key: "cg", value: "10.00", editable: false, info: "Condensation gain cg,about 0.5 ~ 1" },
    { key: "δb", value: "10.00", editable: false, info: "Approach temperature at first preheater δb [⁰C],about 1 ~ 9" },
    { key: "δc", value: "10.00", editable: false, info: "Approach temperature at condenser δc [⁰C],about 1 ~ 9" },
    { key: "CR", value: "10.00", editable: false, info: "Entrained vapor compression ratio CR,which is Ps/Pe" },
  ],
  [
    { key: "Ts", value: "20.00", editable: false, info: "Heating steam temperature Ts [⁰C],about 60 ~ 120" },
    { key: "Td", value: "20.00", editable: false, info: "Product water temperature Td [⁰C],about 40 ~ 50" },
    { key: "T0", value: "20.00", editable: false, info: "Raw water temperature T0 [⁰C],about 10 ~ 40" },
    { key: "S0", value: "20.00", editable: false, info: "Raw water salinity S0 [g/l],about 1 ~ 60" },
    { key: "Sh", value: "20.00", editable: false, info: "Brine salinity at the highes temperature Sh [g/l],about 60 ~ 80" },
  ],
  [
    { key: "M0", value: "50.0", editable: false, info: "Raw water flow M0 [t/h]" },
    { key: "Mf", value: "50.0", editable: false, info: "Feed water flow Mf [t/h]" },
    { key: "Mx", value: "50.0", editable: false, info: "Excess cooling water Mx [t/h]" },
    { key: "Ml", value: "50.0", editable: false, info: "Parallel feed to each effect Ml [t/h]" },
    { key: "sA", value: "50.0", editable: false, info: "Specific heat transfer area sA [m²/(t/h)]" },
  ],
  [
    { key: "Md", value: "1000.00", editable: false, info: "Fresh water production Md [t/h],about 1 ~ 9999" },
    { key: "Ms", value: "1000.00", editable: false, info: "Heating steam Ms [t/h]" },
    { key: "Me", value: "1000.00", editable: false, info: "Entrained vapour Me [t/h]" },
    { key: "GOR", value: "1000.00", editable: false, info: "Gain output ratio GOR,which is Md/(Ms-Me)" },
    { key: "SEC", value: "1000.00", editable: false, info: "Specific exergy consumption SEC [MJ/t],where 1 [kWh] is 3.6 [MJ]" },
  ],
];

export const StationValueData =  MEDbaseColumns;