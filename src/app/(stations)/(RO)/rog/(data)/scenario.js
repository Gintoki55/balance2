export const rogRules = {
  editableFieldsByScenario: {
    Design: ["N","Ja", "Jb","l","FF", "A", "w","x","Pp","T0","S0","Sd","Md","WR"],
    Demand: ["N","Ja", "Jb","FF", "A", "w","x" ,"Pp","PV","T0", "S0","Sd","Md"],
    Energy: ["N","Ja", "Jb","FF", "A", "w","x" ,"Pf","Pp","PV","T0", "S0","Sd"],
    Rating: ["N","Ja", "Jb","FF", "A", "w","x" ,"Pf","Pp","PV","T0", "S0"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    N: { min: 1, max: 20 },

    Ja: { min: 1, max: 9 },
    Jb: { min: 1, max: 9 },
  },
};
