export const robRules = {
  editableFieldsByScenario: {
    Design: ["N", "Ja", "Jb", "T0", "FF", "A", "w", "x","Pp", "b", "S0", "Sd", "l", "Md","WR"],
    Demand: ["N", "Ja", "Jb", "T0", "FF", "A", "w", "x","Pp","PV", "b", "S0", "Sd", "l", "Md"],
    Energy: ["N", "Ja", "Jb", "T0", "FF", "A", "w", "x","Pf","Pp","PV", "b", "S0", "Sd", "l"],
    Rating: ["N", "Ja", "Jb", "T0", "FF", "A", "w", "x","Pf","Pp","PV", "b", "M0", "S0", "l"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    N: { min: 1, max: 20 },

    Ja: { min: 1, max: 9 },
    Jb: { min: 1, max: 9 },
  },
};
