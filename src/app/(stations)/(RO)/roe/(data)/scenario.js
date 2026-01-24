export const roeRules = {
  editableFieldsByScenario: {
    Design: ["Na","Nc", "Ja", "Jb", "Jc","Pp","FF", "A", "w", "x", "Pfa","Pfb","b","PVa","PVb","PVc","M0","T0", "S0","Sp","Sd","k", "Md","WR","l"],
    Demand: ["Na","Nc", "Ja", "Jb", "Jc","Pp","FF", "A", "w", "x","b","PVa","PVb","PVc","T0", "S0","Sp","Sd", "Md","l"],
    Energy: ["Na","Nc", "Ja", "Jb", "Jc","Pp","FF", "A", "w", "x","Pfa","b","PVa","PVb","PVc","T0", "S0","Sp","Sd","l"],
    Rating: ["Na","Nc", "Ja", "Jb", "Jc","Pp","FF", "A", "w", "x","Pfa","b","PVa","PVb","PVc","M0","T0", "S0","k","l"],
  },

  scenarioOptions: ["Design", "Demand", "Energy", "Rating"],
   
  selectRules: {
    Na: { min: 1, max: 20 },
    Nc: { min: 1, max: 20 },

    Ja: { min: 1, max: 9 },
    Jb: { min: 1, max: 9 },
    Jc: { min: 1, max: 9 },
  },
};
