export const mainStationLinkData = {
  MED: ["Multiple Effect Distillation concept"],
  MSF: ["Multi-Stage Flash concept"],
  RO: ["Reverse Osmosis concept"],
};

export const sections = [
  {
    title: "RO - Reverse Osmosis",
    description:
      "A membrane-based technique that pushes seawater through semipermeable membranes to remove salt and impurities-compact for stand alone plants.",
    badges: ["roa", "rob", "roc", "rod", "roe", "rof", "rog"],
    image: "/images/b3.png",
    link: "/roa",
    paidLink: "premium",
    key: "ROs",
  },

  {
    title: "MSF - Multi-Stage Flash",
    description:
      "A high-temperature process where heated seawater rapidly flashes’ into steam across multiple low-pressure chambers-ideal for integration of power and water production.",
    badges: ["MSF", "MSFR", "MSFX", "MSFX-Ab", "MSH","MSH-Ab"],
    image: "/images/b2.png",
    link: "/msf",
    paidLink: "premium",
    key: "MSFs",
  },
    {
    title: "MED - Multi Effect Distillation",
    description:
      "A thermal desalination method that uses multiple stages of evaporation, where each effect reuses the energy from the previous one efficient for low heat source.",
    badges: ["MED", "MED-Ab", "MED-VC", "MEDB", "MEDF", "MEDM", "MEDX","MEDX-Ab","MVC"],
    image: "/images/bb1.png",
    link: "/med",
    paidLink: "premium",
    key: "MEDs",
  },
];

export const stationLinksData = {
  MEDs: [
    { title: "MED", info: "Parallel feed MED process" },
    { title: "MED-Ab", info: "Vapor absorption MED process" },
    { title: "MED-VC", info: "Middle vapor compression MED process" },
    { title: "MEDB", info: "Backward feed MED process " },
    { title: "MEDF", info: "Forward feed MED process" },
    { title: "MEDM", info: "Mixed feed MED process (parallel and back feed)" },
    { title: "MEDX", info: "Excess feed MED process" },
    { title: "MEDX-Ab", info: "Excess feed MED process (with vapor absorption)" },
    { title: "MVC", info: "Mechanical Vapours Compression process" },
  ],
  MSFs: [
    { title: "MSF", info: "once through Multi-Stage Flash process" },
    { title: "MSFR", info: "Recirculating brine Multi-Stage Flash process" },
    { title: "MSFX", info: "Excess feed Multi-Stage Flash process" },
    { title: "MSFX-Ab", info: "Excess feed Multi-Stage Flash process (with vapor absorption)" },
    { title: "MSH", info: "Multi-Stage Hybrid process (MSFR + MED)" },
    { title: "MSH-Ab", info: "Multi-Stage Hybrid process  (with vapor absorption)" },
  ],
  ROs: [
    { title: "roa", info: "RO process (contains stage a)" },
    { title: "rob", info: "RO process (contains stages a; b)" },
    { title: "roc", info: "RO process (contains stages a; c)" },
    { title: "rod", info: "RO process (contains stages a; c; d)" },
    { title: "roe", info: "RO process (contains stages a; b; c)" },
    { title: "rof", info: "RO process (contains stages a; b; c; d)" },
    {
      title: "rog",
      info: "RO process (contains stages a; b with feed mixing)",
    },
  ],
};
