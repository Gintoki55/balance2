const MEDbaseColumns = [
  [
    { key: "MED", value: "Design", editable: false, info: "NUll" },
    { key: "Ka", value: "1.00", editable: false, info: "Heat transfer correction factor Recommended range: 0.5 ~ 3" },
    { key: "Kb", value: "1.00", editable: false, info: "Heat transfer correction factor Recommended range: 0.5 ~ 3 Kb =0, for process without preheaters" },
    { key: "Kc", value: "1.00", editable: false, info: "Heat transfer correction factor Recommended range: 0.5 ~ 3" },
    { key: "ER", value: "1.00", editable: false, info: "Entrainment ratio ER= Me/Mss =Me/(Ms-Me) ER= 0.1~ 2, for plant with vapour compression ER =0, for plant without vapour compression" },
  ],
  [
    { key: "Ja", value: "1", editable: false, info: "Number of effects J #" },
    { key: "Aa", value: "1000", editable: false, info: "Evaporators area, Aa; m2" },
    { key: "Ab", value: "1000", editable: false, info: "First preheater area Ab; m2 preheater area in each effect, Abj =j*A" },
    { key: "Ac", value: "1000", editable: false, info: "Condenser area, Ac; m2" },
    { key: "Ve", value: "1000", editable: false, info: "Volume of the entrained vapour, Ve; m3/s" },
  ],
  [
    { key: "WR", value: "10.00", editable: false, info: "Water recovery, WR;% Where WR=100*Md/M0" },
    { key: "cg", value: "10.00", editable: false, info: "Condensation gain ≈ 0.5 ~ 1" },
    { key: "δb", value: "10.00", editable: false, info: "Approach temperature ≈1~ 9 [⁰C]" },
    { key: "δc", value: "10.00", editable: false, info: "Approach temperature ≈1~ 9 [⁰C]" },
    { key: "CR", value: "10.00", editable: false, info: "Compression ratio, CR= Ps/Pe" },
  ],
  [
    { key: "Ts", value: "20.00", editable: false, info: "Heating steam temperature, Ts; ⁰C Recommended range: 60 ~ 120" },
    { key: "Td", value: "20.00", editable: false, info: "Product water temperature, Td; ⁰C Recommended range: 40 ~ 50" },
    { key: "T0", value: "20.00", editable: false, info: "Raw water temperature, T0; ⁰C Recommended range: 10 ~ 40" },
    { key: "S0", value: "20.00", editable: false, info: "Raw water salinity, S0; g/l Recommended range: 1 ~ 60" },
    { key: "Sh", value: "20.00", editable: false, info: "Brine salinity at the highes temperature, Sh; g/l Recommended range: 60~ 90" },
  ],
  [
    { key: "M0", value: "50.0", editable: false, info: "Raw water, M0; t/h" },
    { key: "Mf", value: "50.0", editable: false, info: "Feed water, Mf;: t/h" },
    { key: "Mx", value: "50.0", editable: false, info: "Excess cooling watert, Mx; t/h" },
    { key: "Ml", value: "50.0", editable: false, info: "Parallel feed to each effect, Ml; t/h" },
    { key: "sA", value: "50.0", editable: false, info: "Specific heat transfer area, sA; m2/(t/h)" },
  ],
  [
    { key: "Md", value: "1000.00", editable: false, info: "Fresh water production, Md; t/h Recommended range: 1 ~ 9999" },
    { key: "Ms", value: "1000.00", editable: false, info: "Heating steam, Ms; t/h" },
    { key: "Me", value: "1000.00", editable: false, info: "Entrained vapour, Me ; t/h" },
    { key: "GOR", value: "1000.00", editable: false, info: "Gain output ratio, GOR =Md/(Ms-Me)" },
    { key: "SEC", value: "1000.00", editable: false, info: "Specific exergy consumption, SEC; MJ/t1 kWh = 3.6 MJ" },
  ],
];

export const StationValueData =  MEDbaseColumns;