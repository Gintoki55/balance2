
export const INFO_RO = {
  Na: "Number of trains in first pass",
  Nc: "Number of trains in second pass",

  PV1: "Number of pressure vessels in first stage",
  PV2: "Number of pressure vessels in second stage",
  PV3: "Number of pressure vessels in third stage",
  PV4: "Number of pressure vessels in fourth stage",

  Mem1: "Number of elements in each pressure vessel of first stage",
  Mem2: "Number of elements in each pressure vessel of second stage",
  Mem3: "Number of elements in each pressure vessel of third stage",
  Mem4: "Number of elements in each pressure vessel of fourth stage",

  Md: "Product water capacity",
  M0: "Raw feed water",
  Mb: "Brine water",
  Mfa: "First pass feed water",
  Mfc: "Second pass feed water; Mfc=k*Mp",

  Pfa: "First pass pressure",
  "ΔPfb": "Booster pump increment pressure; ΔPfb=BP·Pfb",
  Pfc: "Second pass pressure (0 if single pass)",
  Pf0: "Intake pump pressure",

  SEC: "Specific electricity consumption for main process",
  ELC: "Other electricity consumption",

  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",

  pV: "Feed water pH",
  T0: "Feed water temperature",
  S0: "Feed water salinity",
  Sd: "Product water salinity",

  // ===== Units =====
  "#": "Dimensionless",
  "t/h": "Metric tons per hour",
  bar: "Bar",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "-": "Dimensionless",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",

   // ===== Factors =====
  Y: "Plant life span",
  LF: "Annual load factor (availability)",
  r: "Discount rate (interest rate)",

  Cnn: "Cost factor per train",
  Cpv: "Pressure vessel cost factor",

  Cmem1: "Membrane element cost factor first pass",
  Cmem2: "Membrane element cost factor second pass",

  Cpfa: "First pass HP pump cost factor",
  Cpfb: "Booster pump cost factor",
  Cpfc: "Second pass HP pump cost factor",
  Cp0: "Intake pump cost factor",

  Cwt: "Water pretreatment and posttreatment cost factor",
  Cintake: "Intake structure cost factor",

  Ccivil: "Civil works cost % of CAPEX_equip",
  Cinstr: "Instrumentation cost % of equipment",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Celc: "Electricity price",
  Rmem: "Membrane replacement rate",

  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Cwash: "Washing chemical cost per element per event",

  W: "Washing events per year",

  Clabor: "Labor cost factor",
  Cfilter: "Cartridge filter replacement cost factor",

  Cmaint: "Maintenance cost rate",
  Cover: "Overhead cost % of OPEX-total",

  // ===== Units =====
  yr: "Years",
  "-": "Dimensionless",
  "$/train": "Dollars per train",
  "$/vessel": "Dollars per vessel",
  "$/elem": "Dollars per element",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(t/h)": "Dollars per t/h",
  "%": "Percent of equipment cost",
  "$/MJ": "Dollars per megajoule",
  "%/yr": "Percent per year",
  "$/L": "Dollars per liter",
  "$/elem/ev": "Dollars per element per event",
  "#/yr": "Events per year",
  "$/t": "Dollars per metric ton",

    // ===== CAPEX =====
  CAPEX_pv: "Pressure vessel cost",
  CAPEX_mem: "Membrane cost",
  CAPEX_pumps: "Total pump cost",
  CAPEX_wt: "Pretreatment and post-treatment system cost",
  CAPEX_intake: "Intake/outfall cost",

  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works cost",
  CAPEX_instr: "Instrumentation cost",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",

  CAPEX_nn: "Multi-train branching cost",
  CAPEX_total: "Total CAPEX",
  CAPEX_spec: "Specific CAPEX",

  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost",

  // ===== OPEX =====
  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Other electricity cost",
  OPEX_mem: "Membrane replacement cost",
  OPEX_anti: "Antiscalant cost",
  OPEX_acid: "Acid dosing cost",
  OPEX_wash: "Washing chemicals cost",

  OPEX_labor: "Labor cost",
  OPEX_filter: "Cartridge filter replacement cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",

  OPEX_total: "Total OPEX with overhead",
  UPC: "Unit Production Cost",

  // ===== Units =====
  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton",

};

export const INFO_MED = {
  Nef1: "Number of MED effects in first section",
  Nef2: "Number of MED effects in second section",
  Aa: "Area of each effect in first section",
  Ab: "Area of each effect in second section",
  Ac: "Area of condenser",
  Ad: "Area of preheater",
  Ae: "Area of absorber",
  P0: "Intake pump pressure",
  Pd: "Discharge pump pressure",
  VC: "Vapor compressor capacity",
  AZ: "Absorber capacity",
  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",
  SEC: "Specific steam exergy",
  ELC: "Electricity consumption",
  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",
  pV: "Feed water pH",
  Ts: "Steam temperature",
  Td: "Distillate temperature",
  T0: "Feed water temperature",
  S0: "Feed water salinity",

  "#": "Dimensionless",
  "m²": "Square meters",
  "bar": "Bar",
  "m³/s": "Cubic meters per second",
  "t/h": "Metric tons per hour",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "-": "Dimensionless",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
   Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Caa: "Brine heater area cost",
  Cab: "MSF stage area cost",
  Cac: "Upper MED effect area cost",
  Cad: "Lower MED effect area cost",
  Cae: "Preheater area cost",
  Caf: "Absorber area cost",
  Cp0: "Intake pump cost factor",
  Cpd: "Discharge pump cost factor",
  Cvc: "Vapor compressor capacity factor",
  Caz: "Absorber capacity factor",
  Cwt: "Water treatment cost factor",
  Cintake: "Intake structure cost factor",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Steam exergy cost",
  Celc: "Electricity price",
  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Clabor: "Labor cost factor",
  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",

  "yr": "Years",
  "-": "Dimensionless",
  "$/m²": "Dollars per square meter",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/(t/h)": "Dollars per t/h",
  "%": "Percent",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "$/t": "Dollars per metric ton",
  "%/yr": "Percent of CAPEX per year",
  CAPEX_area: "Total heat transfer area CAPEX",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_az: "Absorber CAPEX",
  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",
  CAPEX_total: "Total CAPEX",
  CAPX_spec: "Specific CAPEX",
  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost",

  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Electricity cost",
  OPEX_anti: "Antiscalant cost",
  OPEX_acid: "Acid cost",
  OPEX_labor: "Labor cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",
  OPEX_total: "Total OPEX",
  UPC: "Unit Production Cost",

  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton"
};

export const INFO_MSF = {
  Nst1: "Number of stages in first section",
  Nst2: "Number of stages in second section",
  Nst3: "Number of stages in third section",

  Aa: "Area of brine heater",
  Ab: "Area of each stage in the first section",
  Ac: "Area of each stage in the second section",
  Ad: "Area of each stage in the third section",

  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",
  Mr: "Recirculating brine flow",

  P0: "Intake pump pressure",
  Pr: "Recirculation pump pressure",
  Pd: "Discharge pump pressure",

  VC: "Vapor compressor capacity",
  AZ: "Absorber capacity",

  SEC: "Specific steam exergy",
  ELC: "Electricity consumption",

  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",

  pV: "Feed water pH",

  Th: "Brine heater temperature",
  Tb: "Brine blowdown temperature",
  T0: "Feed water temperature",

  S0: "Feed water salinity",
   Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Caa: "Heat transfer area cost section A",
  Cab: "Heat transfer area cost section B",
  Cac: "Heat transfer area cost section C",
  Cad: "Heat transfer area cost section D",

  Cp0: "Intake pump cost factor",
  Cpr: "Recirculation pump cost factor",
  Cpd: "Discharge pump cost factor",

  Cvc: "Vapor compressor capacity factor",
  Caz: "Absorber capacity factor",

  Cwt: "Water pretreatment and posttreatment cost factor",
  Cintake: "Intake structure cost factor",

  Ccivil: "Civil works cost % of CAPEX_equip",
  Cinstr: "Instrumentation cost % of equipment",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Steam exergy cost",
  Celc: "Electricity price",

  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",

  Clabor: "Labor cost factor",
  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",
  CAPEX_area: "Cost of heat transfer areas",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_az: "Absorber CAPEX",

  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_instr: "Instrumentation cost",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",

  CAPEX_total: "Total CAPEX",
  CAPEX_spec: "Specific CAPEX per unit capacity",

  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost per ton",

  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Electricity cost",
  OPEX_anti: "Antiscalant dosing cost",
  OPEX_acid: "Acid dosing cost",

  OPEX_labor: "Labor cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",

  OPEX_total: "Total OPEX with overhead",
  UPC: "Unit Production Cost (UPC)",
   "#": "Dimensionless",
  "m²": "Square meters",
  "t/h": "Metric tons per hour",
  bar: "Bar",
  "m³/s": "Cubic meters per second",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
  "-": "Dimensionless",

  yr: "Years",
  "-": "Dimensionless",

  "$/m²": "Dollars per square meter",

  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/(t/h)": "Dollars per t/h",

  "%": "Percent of equipment cost",
  "%/yr": "Percent per year",

  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",

  "$/t": "Dollars per metric ton",
  "$": "Dollars",

  "$/(t/h)": "Dollars per t/h",
  "$/t": "Dollars per metric ton",

  "-": "Dimensionless"
};

export const INFO_MSH = {
  Nst: "Number of MSF stages",
  Nef1: "Number of upper MED effects",
  Nef2: "Number of lower MED effects",

  Aa: "Brine heater area",
  Ab: "Each MSF stage area",
  Ac: "Each upper MED effect area",
  Ad: "Each lower MED effect area",
  Ae: "Each preheater area",
  Af: "Absorber heat transfer area",

  P0: "Intake pump pressure",
  Pd: "Discharge pump pressure",

  VC: "Vapor compressor capacity",
  AZ: "Absorber capacity",

  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",

  SEC: "Specific steam exergy",
  ELC: "Electricity consumption",

  Danti: "Antiscalant dosing rate",
  Dacid: "Acid dosing rate",

  pV: "Feed water pH",

  Th: "Brine heater temperature",
  Td: "Distillate temperature",
  T0: "Feed water temperature",
  S0: "Feed water salinity",

  "#": "Dimensionless",
  "m²": "Square meters",
  "bar": "Bar",
  "m³/s": "Cubic meters per second",
  "t/h": "Metric tons per hour",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "-": "Dimensionless",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
    Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Caa: "Brine heater area cost",
  Cab: "MSF stage area cost",
  Cac: "Upper MED effect area cost",
  Cad: "Lower MED effect area cost",
  Cae: "Preheater area cost",
  Caf: "Absorber area cost",

  Cp0: "Intake pump cost factor",
  Cpd: "Discharge pump cost factor",
  Cvc: "Vapor compressor capacity factor",
  Caz: "Absorber capacity factor",
  Cwt: "Water treatment cost factor",
  Cintake: "Intake structure cost factor",

  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Steam exergy cost",
  Celc: "Electricity price",
  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Clabor: "Labor cost factor",

  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",

  "$": "Dollars",
  "$/(m²)": "Dollars per square meter",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/(t/h)": "Dollars per t/h",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "%": "Percent",
  "%/yr": "Percent per year",
  "-": "Dimensionless",
  "yr": "Years",
  CAPEX_area: "Total heat transfer area CAPEX",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_az: "Absorber CAPEX",
  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",
  CAPEX_total: "Total CAPEX",
  CAPX_spec: "Specific CAPEX",
  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost",

  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Electricity cost",
  OPEX_anti: "Antiscalant cost",
  OPEX_acid: "Acid cost",
  OPEX_labor: "Labor cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",
  OPEX_total: "Total OPEX",
  UPC: "Unit Production Cost",

  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton",
  "$/(m²)": "Dollars per square meter",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(m³/s)": "Dollars per m³/s",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "%": "Percent",
  "%/yr": "Percent per year",
  "yr": "Years",
  "$/m²":"Dollars per square meter"
};

export const INFO_MVC = {
  Nef: "Number of effects",
  Aa: "Area of each effect",
  Ab: "Heat exchanger area",
  Md: "Product water capacity",
  M0: "Raw feed water",
  Mf: "Feed water flow",
  Mb: "Brine blowdown flow",

  P0: "Intake pump pressure",
  Pf: "Feed water pump pressure",
  Pb: "Brine discharge pump pressure",
  Pd: "Product pump pressure",

  VC: "Vapor compressor capacity",
  Pvc: "Vapor compressor power",

  SEC: "Specific compression exergy",
  ELC: "Electricity consumption",

  Danti: "Antiscalant chemical dosing rate",
  Dacid: "Acid chemical dosing rate",

  pV: "Feed water pH",

  Ts: "Steam temperature",
  Te: "Entrained vapor temperature",
  T0: "Feed water temperature",
  S0: "Feed water salinity",

  "#": "Dimensionless",
  "m²": "Square meters",
  "t/h": "Metric tons per hour",
  "bar": "Bar",
  "m³/s": "Cubic meters per second",
  "kW": "Kilowatts",
  "MJ/t": "Megajoules per metric ton",
  "L/h": "Liters per hour",
  "°C": "Degrees Celsius",
  "g/L": "Grams per liter",
  "-": "Dimensionless",
  Y: "Life span",
  LF: "Load factor",
  r: "Discount rate",

  Cef: "Effect installation cost factor",
  Caa: "Effect area cost factor",
  Cab: "Heat exchanger area cost factor",

  Cvc: "Vapor compressor capacity factor",

  Cp0: "Intake pump cost factor",
  Cpf: "Feed pump cost factor",
  Cpb: "Brine discharge pump cost factor",
  Cpd: "Product pump cost factor",

  Cwt: "Water pretreatment and posttreatment cost factor",
  Cintake: "Intake structure cost factor",

  Ccivil: "Civil works cost % of CAPEX_equip",
  Cinstr: "Instrumentation cost % of equipment",
  Cinst: "Installation cost % of equipment",
  Ceng: "Engineering cost % of equipment",

  Csec: "Specific compression exergy cost",
  Celc: "Electricity price",

  Canti: "Antiscalant cost factor",
  Cacid: "Acid cost factor",
  Clabor: "Labor cost factor",

  Cmain: "Annual maintenance cost as percentage of total CAPEX",
  Cover: "Overhead cost % of OPEX-total",

  "$/(effect)": "Dollars per effect",
  "$/(m²)": "Dollars per square meter",
  "$/(m³/s)": "Dollars per m³ per second",
  "$/(bar·t/h)": "Dollars per bar per t/h",
  "$/(t/h)": "Dollars per t/h",
  "$/MJ": "Dollars per megajoule",
  "$/L": "Dollars per liter",
  "%": "Percent",
  "%/yr": "Percent per year",
  "-": "Dimensionless",
  "yr": "Years",
  CAPEX_ef: "Effect CAPEX",
  CAPEX_area: "Total heat transfer area CAPEX",
  CAPEX_vc: "Vapor compressor CAPEX",
  CAPEX_Pump: "Pump CAPEX",
  CAPEX_wt: "Water treatment CAPEX",
  CAPEX_intake: "Intake structure CAPEX",
  CAPEX_equip: "Total equipment CAPEX",
  CAPEX_civil: "Civil works CAPEX",
  CAPEX_instr: "Instrumentation cost",
  CAPEX_inst: "Installation cost",
  CAPEX_eng: "Engineering cost",
  CAPEX_total: "Total CAPEX",
  CAPX_spec: "Specific CAPEX per unit capacity",
  CRF: "Capital recovery factor",
  Ucap: "Annualized capital cost per ton",

  OPEX_sec: "Specific exergy consumption cost",
  OPEX_elc: "Electricity cost",
  OPEX_anti: "Antiscalant dosing cost",
  OPEX_acid: "Acid dosing cost",
  OPEX_labor: "Labor cost",
  OPEX_maint: "Maintenance cost",
  OPEX_over: "Overhead cost",
  OPEX_total: "Total OPEX with overhead",
  UPC: "Unit Production Cost (UPC)",

  "$": "Dollars",
  "$/(t/h)": "Dollars per t/h",
  "-": "Dimensionless",
  "$/t": "Dollars per metric ton",
  "$/effect":"Dollars per effect",
  "$/m²":"Dollars per square meter"
};