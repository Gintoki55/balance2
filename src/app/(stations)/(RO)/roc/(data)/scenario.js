export const rocRules = {
  editableFieldsByScenario: {
    Design: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x", "Pf", "Pp", "PV", "k", "l", "M0", "T0", "S0","Sp","Sd", "Md","WR"],
    Demand: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x","Pp", "PV", "l", "T0", "S0","Sp","Sd", "Md"],
    Energy: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x", "Pf", "Pp", "PV", "l", "T0", "S0","Sp","Sd"],
    Rating: ["Na","Nc", "Ja", "Jc", "FF", "A", "w", "x", "Pf", "Pp", "PV", "k", "l", "M0", "T0", "S0"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    Na: { min: 1, max: 20 },
    Nc: { min: 1, max: 20 },

    Ja: { min: 1, max: 9 },
    Jc: { min: 1, max: 9 },
  },
};
