export const rofRules = {
  editableFieldsByScenario: {
    Design: ["Na","Nc", "Ja", "Jb", "Jc","Jd","Pp","FF", "A", "w", "x","T0", "S0","Sp","Sd","k","l","Md","WR","b"],
    Demand: ["Na","Nc", "Ja", "Jb", "Jc","Jd","Pp","PV","FF", "A", "w", "x","T0", "S0","Sp","Sd","l","Md","b"],
    Energy: ["Na","Nc", "Ja", "Jb", "Jc","Jd","Pf","Pp","PV","FF", "A", "w", "x","T0", "S0","Sp","Sd","l","b"],
    Rating: ["Na","Nc", "Ja", "Jb", "Jc","Jd","Pf","Pp","PV","FF", "A", "w", "x","M0","T0", "S0","k","l","b"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    Na: { min: 1, max: 20 },
    Nc: { min: 1, max: 20 },

    Ja: { min: 1, max: 9 },
    Jb: { min: 1, max: 9 },
    Jc: { min: 1, max: 9 },
    Jd: { min: 1, max: 9 },
  },
};
