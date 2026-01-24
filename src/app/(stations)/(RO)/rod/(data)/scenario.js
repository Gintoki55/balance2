export const rodRules = {
  editableFieldsByScenario: {
    Design: ["Na","Nc", "Ja", "Jc", "Jd","Pp","FF", "A", "w", "x", "Pf", "T0", "S0","Sp","Sd","k", "Md","WR", "l"],
    Demand: ["Na","Nc", "Ja", "Jc", "Jd","Pp","FF", "A", "w", "x","PVa","PVc","PVd", "Pf", "T0", "S0","Sp","Sd", "Md","l"],
    Energy: ["Na","Nc", "Ja", "Jc", "Jd","Pp","FF", "A", "w", "x","Pfa","PVa","PVc","PVd", "Pf", "T0", "S0","Sp","Sd","l"],
    Rating: ["Na","Nc", "Ja", "Jc", "Jd","Pp","FF", "A", "w", "x","Pfa","PVa","PVc","PVd","M0", "T0", "S0","k","l"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    Na: { min: 1, max: 20 },
    Nc: { min: 1, max: 20 },

    Ja: { min: 1, max: 9 },
    Jc: { min: 1, max: 9 },
    Jd: { min: 1, max: 9 },
  },
};
