export const roaRules = {
  editableFieldsByScenario: {
    Design: ["N", "A", "FF", "J", "T0", "l", "w", "x", "Pp", "S0", "Sd", "Md", "WR"],
    Demand: ["A", "FF", "PV", "T0", "l", "w", "x", "Pp", "S0", "Sd", "Md"],
    Energy: ["A", "FF", "PV", "T0", "l", "w", "x", "Pf", "Pp", "S0", "Sd"],
    Rating: ["N", "A", "FF", "J", "PV", "T0", "l", "w", "x", "Pf", "Pp", "M0", "S0"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    N: { min: 1, max: 20 },
    J: { min: 1, max: 9 },
  },
};
