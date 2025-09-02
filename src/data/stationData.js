export const mainStationLinkData = {
  MED: ["Multiple Effect Distillation concept"],
  MSF: ["Multi-Stage Flash concept"],
  RO: ["Reverse Osmosis concept"],
};

export const sections = [
  {
    title: "MED – Multi-Effect Distillation",
    description:
      "A thermal desalination method that uses multiple stages of evaporation, where each effect reuses the energy from the previous one — efficient for low heat source.",
    badges: ["med", "medb", "medf", "medm", "medr", "medr-ab", "mvc"],
    image: "/images/bb1.png",
    link: "/medpage",
    paidLink: "premium",
    key: "MEDs",
  },
  {
    title: "MSF - Multi-Stage Flash",
    description:
      "A high-temperature process where heated seawater rapidly flashes’ into steam across multiple low-pressure chambers — ideal for integration of power and water production.",
    badges: ["msf", "msfr", "msfx", "msh", "msh-ab"],
    image: "/images/b3.png",
    link: "/msfpage",
    paidLink: "premium",
    key: "MSFs",
  },
  {
    title: "ROA - Reverse Osmosis",
    description:
      "A membrane-based technique that pushes seawater through semipermeable membranes to remove salt and impurities — compact for stand alone plants.",
    badges: ["roa", "rob", "roc", "rod", "roe", "rof", "rog"],
    image: "/images/b2.png",
    link: "/ropage",
    paidLink: "premium",
    key: "ROs",
  },
];

export const stationLinksData = {
  MEDs: [
    { title: "med", info: "MED process (parallel feed flow)" },
    { title: "medb", info: "MED process (backward feed flow)" },
    { title: "medf", info: "MED process (forward feed flow)" },
    { title: "medm", info: "MED process (mixed feed flow)" },
    { title: "medr", info: "MED process (mixed feed recirculating)" },
    { title: "medr-ab", info: "MED process (mixed vapor absorption)" },
    {
      title: "mvc",
      info: "Mechanical vapour compression process (single effect)",
    },
  ],
  MSFs: [
    { title: "msf", info: "MSF process (once through)" },
    { title: "msfr", info: "MSF process (brine recycle)" },
    { title: "msfx", info: "MSF process (excess cooling water mixing)" },
    { title: "msh", info: "Multi-stage hybrid process (MSFR + MED)" },
    { title: "msh-ab", info: "MSH process with vapor absorption" },
  ],
  ROs: [
    { title: "roa", info: "RO process (contains stage a)" },
    { title: "rob", info: "RO process (contains stages a, b)" },
    { title: "roc", info: "RO process (contains stages a, c)" },
    { title: "rod", info: "RO process (contains stages a, c, d)" },
    { title: "roe", info: "RO process (contains stages a, b, c)" },
    { title: "rof", info: "RO process (contains stages a, b, c, d)" },
    {
      title: "rog",
      info: "RO process (contains stages a, b with feed mixing)",
    },
  ],
};

