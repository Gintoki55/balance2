"use client"

import { useState, useCallback } from 'react'
import { Droplets, Thermometer, Gauge, Beaker, Calculator, FlaskConical, Info } from 'lucide-react'

// Tooltip component for abbreviation descriptions
function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <span 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="tooltip-trigger">{children}</span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs bg-foreground text-background rounded-md whitespace-nowrap z-50 shadow-lg">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  )
}

// Input row component
function InputRow({ 
  symbol, 
  value, 
  onChange, 
  unit, 
  tooltip,
  symbolTooltip = true,
  symbolTip,
  unitTip
}: { 
  symbol: string
  value: number
  onChange: (v: number) => void
  unit: string
  tooltip: string
  symbolTooltip?: boolean
  symbolTip?: string
  unitTip?: string
}) {
  const sTooltip = symbolTip || tooltip
  const uTooltip = unitTip || tooltip
  return (
    <div className="row-input">
      {symbolTooltip ? (
        <Tooltip content={sTooltip}><span className="symbol w-8">{symbol}</span></Tooltip>
      ) : (
        <span className="symbol w-8">{symbol}</span>
      )}
      <input
        type="number"
        step="any"
        className="input-field flex-1 min-w-0"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      <Tooltip content={uTooltip}>
        <span className="unit-label w-16 text-right">{unit}</span>
      </Tooltip>
    </div>
  )
}

// Output row component
function OutputRow({ 
  symbol, 
  value, 
  unit, 
  tooltip,
  symbolTooltip = true,
  symbolTip,
  unitTip
}: { 
  symbol: string
  value: number
  unit: string
  tooltip: string
  symbolTooltip?: boolean
  symbolTip?: string
  unitTip?: string
}) {
  const sTooltip = symbolTip || tooltip
  const uTooltip = unitTip || tooltip
  
  // Format number: 4 decimal places or scientific notation for very small/large numbers
  const formatNumber = (num: number): string => {
    if (!Number.isFinite(num)) return '—'
    if (num === 0) return '0.0000'
    const absNum = Math.abs(num)
    if (absNum < 0.0001 || absNum >= 1000000) {
      return num.toExponential(4)
    }
    return num.toFixed(4)
  }
  
  const displayValue = formatNumber(value)
  return (
    <div className="row-output">
      {symbolTooltip ? (
        <Tooltip content={sTooltip}><span className="symbol w-8 opacity-70">{symbol}</span></Tooltip>
      ) : (
        <span className="symbol w-8 opacity-70">{symbol}</span>
      )}
      <div className="output-field flex-1 min-w-0">{displayValue}</div>
      <Tooltip content={uTooltip}>
        <span className="unit-label w-16 text-right opacity-70">{unit}</span>
      </Tooltip>
    </div>
  )
}

// Section header component
function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="section-header flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
  )
}

// ==================== CONVERTERS ====================

// Temperature Converter
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0)
  const kelvin = celsius + 273.15
  const fahrenheit = 32 + 1.8 * celsius
  const rankine = (273.15 + celsius) * 9 / 5

  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [°C]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={celsius} onChange={setCelsius} unit="°C" tooltip="Celsius" symbolTooltip={false} />
        <OutputRow symbol="T" value={kelvin} unit="K" tooltip="Kelvin" symbolTooltip={false} />
        <OutputRow symbol="T" value={fahrenheit} unit="°F" tooltip="Fahrenheit" symbolTooltip={false} />
        <OutputRow symbol="T" value={rankine} unit="°R" tooltip="Rankine" symbolTooltip={false} />
      </div>
    </div>
  )
}

function TemperatureConverterK() {
  const [kelvin, setKelvin] = useState(273.15)
  const fahrenheit = 1.8 * kelvin - 459.67
  const rankine = kelvin * 9 / 5
  const celsius = kelvin - 273.15

  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [K]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={kelvin} onChange={setKelvin} unit="K" tooltip="Kelvin" symbolTooltip={false} />
        <OutputRow symbol="T" value={fahrenheit} unit="°F" tooltip="Fahrenheit" symbolTooltip={false} />
        <OutputRow symbol="T" value={rankine} unit="°R" tooltip="Rankine" symbolTooltip={false} />
        <OutputRow symbol="T" value={celsius} unit="°C" tooltip="Celsius" symbolTooltip={false} />
      </div>
    </div>
  )
}

function TemperatureConverterF() {
  const [fahrenheit, setFahrenheit] = useState(32)
  const rankine = fahrenheit + 459.67
  const celsius = (fahrenheit - 32) * 5 / 9
  const kelvin = (fahrenheit + 459.67) * 5 / 9

  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [°F]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={fahrenheit} onChange={setFahrenheit} unit="°F" tooltip="Fahrenheit" symbolTooltip={false} />
        <OutputRow symbol="T" value={rankine} unit="°R" tooltip="Rankine" symbolTooltip={false} />
        <OutputRow symbol="T" value={celsius} unit="°C" tooltip="Celsius" symbolTooltip={false} />
        <OutputRow symbol="T" value={kelvin} unit="K" tooltip="Kelvin" symbolTooltip={false} />
      </div>
    </div>
  )
}

function TemperatureConverterR() {
  const [rankine, setRankine] = useState(491.67)
  const celsius = rankine * 5 / 9 - 273.15
  const kelvin = rankine * 5 / 9
  const fahrenheit = rankine - 459.67

  return (
    <div className="converter-card">
      <SectionHeader title="Temperature Converter [°R]" icon={Thermometer} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={rankine} onChange={setRankine} unit="°R" tooltip="Rankine" symbolTooltip={false} />
        <OutputRow symbol="T" value={celsius} unit="°C" tooltip="Celsius" symbolTooltip={false} />
        <OutputRow symbol="T" value={kelvin} unit="K" tooltip="Kelvin" symbolTooltip={false} />
        <OutputRow symbol="T" value={fahrenheit} unit="°F" tooltip="Fahrenheit" symbolTooltip={false} />
      </div>
    </div>
  )
}

// Volume Converter
function VolumeConverterM3() {
  const [m3, setM3] = useState(1)
  const ft3 = m3 * 35.3147
  const ig = m3 * 220
  const gl = m3 * 264.2

  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [M³]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={m3} onChange={setM3} unit="M³" tooltip="Cubic meter" symbolTooltip={false} />
        <OutputRow symbol="V" value={ft3} unit="ft³" tooltip="Cubic foot" symbolTooltip={false} />
        <OutputRow symbol="V" value={ig} unit="IG" tooltip="Imperial gallon (UK)" symbolTooltip={false} />
        <OutputRow symbol="V" value={gl} unit="gl" tooltip="Gallon (US)" symbolTooltip={false} />
      </div>
    </div>
  )
}

function VolumeConverterFt3() {
  const [ft3, setFt3] = useState(35.3147)
  const ig = ft3 * 220 / 35.3147
  const gl = ft3 * 264.2 / 35.3147
  const m3 = ft3 / 35.3147

  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [ft³]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={ft3} onChange={setFt3} unit="ft³" tooltip="Cubic foot" symbolTooltip={false} />
        <OutputRow symbol="V" value={ig} unit="IG" tooltip="Imperial gallon (UK)" symbolTooltip={false} />
        <OutputRow symbol="V" value={gl} unit="gl" tooltip="Gallon (US)" symbolTooltip={false} />
        <OutputRow symbol="V" value={m3} unit="M³" tooltip="Cubic meter" symbolTooltip={false} />
      </div>
    </div>
  )
}

function VolumeConverterIG() {
  const [ig, setIG] = useState(220)
  const gl = ig * 264.2 / 220
  const m3 = ig / 220
  const ft3 = ig * 35.3147 / 220

  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [IG]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={ig} onChange={setIG} unit="IG" tooltip="Imperial gallon (UK)" symbolTooltip={false} />
        <OutputRow symbol="V" value={gl} unit="gl" tooltip="Gallon (US)" symbolTooltip={false} />
        <OutputRow symbol="V" value={m3} unit="M³" tooltip="Cubic meter" symbolTooltip={false} />
        <OutputRow symbol="V" value={ft3} unit="ft³" tooltip="Cubic foot" symbolTooltip={false} />
      </div>
    </div>
  )
}

function VolumeConverterGL() {
  const [gl, setGL] = useState(264.2)
  const ft3 = gl * 35.3147 / 264.2
  const m3 = gl / 264.2
  const ig = gl * 220 / 264.2

  return (
    <div className="converter-card">
      <SectionHeader title="Volume Converter [gl]" icon={Beaker} />
      <div className="p-4 space-y-1">
        <InputRow symbol="V" value={gl} onChange={setGL} unit="gl" tooltip="Gallon (US)" symbolTooltip={false} />
        <OutputRow symbol="V" value={ft3} unit="ft³" tooltip="Cubic foot" symbolTooltip={false} />
        <OutputRow symbol="V" value={m3} unit="M³" tooltip="Cubic meter" symbolTooltip={false} />
        <OutputRow symbol="V" value={ig} unit="IG" tooltip="Imperial gallon (UK)" symbolTooltip={false} />
      </div>
    </div>
  )
}

// Water Flow Converter
function WaterFlowConverterMIGD() {
  const [migd, setMIGD] = useState(1)
  const m3day = migd * 1000000 / 220
  const tph = migd * 1000000 / (220 * 24)
  const kgs = migd * 4545454 / 86400

  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [MIGD]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={migd} onChange={setMIGD} unit="MIGD" tooltip="Million Imperial Gallon per day (Liquid water flow)" symbolTooltip={false} />
        <OutputRow symbol="M" value={m3day} unit="m³/day" tooltip="Cubic meter per day (liquid water flow)" symbolTooltip={false} />
        <OutputRow symbol="M" value={tph} unit="t/h" tooltip="Metric ton per hour (as m³/h for liquid water)" symbolTooltip={false} />
        <OutputRow symbol="M" value={kgs} unit="kg/s" tooltip="Kilogram per second (as l/s for liquid water)" symbolTooltip={false} />
      </div>
    </div>
  )
}

function WaterFlowConverterM3Day() {
  const [m3day, setM3Day] = useState(4545.45)
  const tph = m3day / 24
  const kgs = m3day * 1000 / 86400
  const migd = m3day * 220 / 1000000

  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [m³/day]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={m3day} onChange={setM3Day} unit="m³/day" tooltip="Cubic meter per day (liquid water flow)" symbolTooltip={false} />
        <OutputRow symbol="M" value={tph} unit="t/h" tooltip="Metric ton per hour (as m³/h for liquid water)" symbolTooltip={false} />
        <OutputRow symbol="M" value={kgs} unit="kg/s" tooltip="Kilogram per second (as l/s for liquid water)" symbolTooltip={false} />
        <OutputRow symbol="M" value={migd} unit="MIGD" tooltip="Million Imperial Gallon per day (Liquid water flow)" symbolTooltip={false} />
      </div>
    </div>
  )
}

function WaterFlowConverterTPH() {
  const [tph, setTPH] = useState(189.39)
  const kgs = tph * 1000 / 3600
  const migd = tph * 24 * 220 / 1000000
  const m3day = tph * 24

  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [t/h]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={tph} onChange={setTPH} unit="t/h" tooltip="Metric ton per hour (as m³/h for liquid water)" symbolTooltip={false} />
        <OutputRow symbol="M" value={kgs} unit="kg/s" tooltip="Kilogram per second (as l/s for liquid water)" symbolTooltip={false} />
        <OutputRow symbol="M" value={migd} unit="MIGD" tooltip="Million Imperial Gallon per day (Liquid water flow)" symbolTooltip={false} />
        <OutputRow symbol="M" value={m3day} unit="m³/day" tooltip="Cubic meter per day (liquid water flow)" symbolTooltip={false} />
      </div>
    </div>
  )
}

function WaterFlowConverterKGS() {
  const [kgs, setKGS] = useState(52.61)
  const migd = kgs * 86400 / 4545454
  const m3day = kgs * 86400 / 1000
  const tph = kgs * 3600 / 1000

  return (
    <div className="converter-card">
      <SectionHeader title="Water Flow Converter [kg/s]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="M" value={kgs} onChange={setKGS} unit="kg/s" tooltip="Kilogram per second (as l/s for liquid water)" symbolTooltip={false} />
        <OutputRow symbol="M" value={migd} unit="MIGD" tooltip="Million Imperial Gallon per day (Liquid water flow)" symbolTooltip={false} />
        <OutputRow symbol="M" value={m3day} unit="m³/day" tooltip="Cubic meter per day (liquid water flow)" symbolTooltip={false} />
        <OutputRow symbol="M" value={tph} unit="t/h" tooltip="Metric ton per hour (as m³/h for liquid water)" symbolTooltip={false} />
      </div>
    </div>
  )
}

// Pressure Converter
function PressureConverterBar() {
  const [bar, setBar] = useState(1)
  const kpa = bar * 100
  const mpa = bar / 10
  const psi = bar * 14.55

  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [bar]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={bar} onChange={setBar} unit="bar" tooltip="bar" symbolTooltip={false} />
        <OutputRow symbol="P" value={kpa} unit="kPa" tooltip="kiloPascal" symbolTooltip={false} />
        <OutputRow symbol="P" value={mpa} unit="MPa" tooltip="megaPascal" symbolTooltip={false} />
        <OutputRow symbol="P" value={psi} unit="psi" tooltip="Pound per square inch" symbolTooltip={false} />
      </div>
    </div>
  )
}

function PressureConverterKPa() {
  const [kpa, setKPa] = useState(100)
  const mpa = kpa / 1000
  const psi = kpa * 0.1455
  const bar = kpa / 100

  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [kPa]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={kpa} onChange={setKPa} unit="kPa" tooltip="kiloPascal" symbolTooltip={false} />
        <OutputRow symbol="P" value={mpa} unit="MPa" tooltip="megaPascal" symbolTooltip={false} />
        <OutputRow symbol="P" value={psi} unit="psi" tooltip="Pound per square inch" symbolTooltip={false} />
        <OutputRow symbol="P" value={bar} unit="bar" tooltip="bar" symbolTooltip={false} />
      </div>
    </div>
  )
}

function PressureConverterMPa() {
  const [mpa, setMPa] = useState(0.1)
  const psi = mpa * 145.5
  const bar = mpa * 10
  const kpa = mpa * 1000

  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [MPa]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={mpa} onChange={setMPa} unit="MPa" tooltip="megaPascal" symbolTooltip={false} />
        <OutputRow symbol="P" value={psi} unit="psi" tooltip="Pound per square inch" symbolTooltip={false} />
        <OutputRow symbol="P" value={bar} unit="bar" tooltip="bar" symbolTooltip={false} />
        <OutputRow symbol="P" value={kpa} unit="kPa" tooltip="kiloPascal" symbolTooltip={false} />
      </div>
    </div>
  )
}

function PressureConverterPSI() {
  const [psi, setPSI] = useState(14.55)
  const bar = psi / 14.55
  const kpa = psi / 0.1455
  const mpa = psi / 145.5

  return (
    <div className="converter-card">
      <SectionHeader title="Pressure Converter [psi]" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="P" value={psi} onChange={setPSI} unit="psi" tooltip="Pound per square inch" symbolTooltip={false} />
        <OutputRow symbol="P" value={bar} unit="bar" tooltip="bar" symbolTooltip={false} />
        <OutputRow symbol="P" value={kpa} unit="kPa" tooltip="kiloPascal" symbolTooltip={false} />
        <OutputRow symbol="P" value={mpa} unit="MPa" tooltip="megaPascal" symbolTooltip={false} />
      </div>
    </div>
  )
}

// ==================== RO SPECIFIC CALCULATORS ====================

// Electrical Conductivity Converter
function ElectricalConductivityConverter() {
  const [temp, setTemp] = useState(30)
  const [ec, setEC] = useState(6000)
  
  // Complex salinity formula from Excel
  const ecAdj = ec * (1 + 0.022 * (25 - temp))
  const salinity = ecAdj * (
    0.5 + 
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 100) / (ecAdj - 100.0001)) +
    0.1 * (0.5 + 0.5 * Math.abs(ecAdj - 1000) / (ecAdj - 1000.0001)) +
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 40000) / (ecAdj - 40000.0001)) +
    0.05 * (0.5 + 0.5 * Math.abs(ecAdj - 60000) / (ecAdj - 60000.0001))
  )

  return (
    <div className="converter-card">
      <SectionHeader title="Electrical Conductivity Converter" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={temp} onChange={setTemp} unit="°C" tooltip="Celsius" symbolTip="Saline water temperature" />
        <InputRow symbol="EC" value={ec} onChange={setEC} unit="µs/cm" tooltip="microsiemens per centimeter" symbolTip="Electrical conductivity" />
        <OutputRow symbol="S" value={salinity} unit="ppm" tooltip="part per million" symbolTip="Salinity (Total dissolved solids TDS)" />
      </div>
    </div>
  )
}

// Water Salinity Converter (Brine salinity)
function WaterSalinityConverter() {
  const [salPPM, setSalPPM] = useState(35000)
  const salGL = salPPM / 1000
  const salPercent = salPPM / 10000

  return (
    <div className="converter-card">
      <SectionHeader title="Salinity Convertor" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="S" value={salPPM} onChange={setSalPPM} unit="ppm" tooltip="part per million" symbolTip="Salinity (Total dissolved solids TDS)" />
        <OutputRow symbol="S" value={salGL} unit="g/l" tooltip="gram per liter" symbolTip="Salinity" />
        <OutputRow symbol="S" value={salPercent} unit="%" tooltip="percent" symbolTip="Salinity" />
      </div>
    </div>
  )
}

// Osmotic Pressure Calculator
function OsmoticPressureCalculator() {
  const [temp, setTemp] = useState(30)
  const [salinity, setSalinity] = useState(50)
  const osmoticPressure = 0.00255 * (273 + temp) * salinity

  return (
    <div className="converter-card">
      <SectionHeader title="Osmotic Pressure" icon={Gauge} />
      <div className="p-4 space-y-1">
        <InputRow symbol="T" value={temp} onChange={setTemp} unit="°C" tooltip="Celsius" symbolTip="Saline water temperature" />
        <InputRow symbol="S" value={salinity} onChange={setSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Water salinity" />
        <OutputRow symbol="π" value={osmoticPressure} unit="bar" tooltip="bar" symbolTip="Osmotic pressure" />
      </div>
    </div>
  )
}

// Salt Rejection Calculator
function SaltRejectionCalculator() {
  const [feedSalinity, setFeedSalinity] = useState(65)
  const [productSalinity, setProductSalinity] = useState(0.2)
  const saltRejection = 100 * (feedSalinity - productSalinity) / feedSalinity

  return (
    <div className="converter-card">
      <SectionHeader title="Salt Rejection" icon={FlaskConical} />
      <div className="p-4 space-y-1">
        <InputRow symbol="Sf" value={feedSalinity} onChange={setFeedSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Feed water salinity" />
        <InputRow symbol="Sd" value={productSalinity} onChange={setProductSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Product water salinity" />
        <OutputRow symbol="SR" value={saltRejection} unit="%" tooltip="percent" symbolTip="Salt rejection" />
      </div>
    </div>
  )
}

// Water Recovery Calculator
function WaterRecoveryCalculator() {
  const [rawSalinity, setRawSalinity] = useState(40)
  const [brineSalinity, setBrineSalinity] = useState(65)
  const [productSalinity, setProductSalinity] = useState(0.2)
  const waterRecovery = 100 * (brineSalinity - rawSalinity) / (brineSalinity - productSalinity)

  return (
    <div className="converter-card">
      <SectionHeader title="Water Recovery" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="S0" value={rawSalinity} onChange={setRawSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Raw water salinity" />
        <InputRow symbol="Sb" value={brineSalinity} onChange={setBrineSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Brine water salinity" />
        <InputRow symbol="Sd" value={productSalinity} onChange={setProductSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Product water salinity" />
        <OutputRow symbol="WR" value={waterRecovery} unit="%" tooltip="percent" symbolTip="Percent water recovery" />
      </div>
    </div>
  )
}

// Water Recovery Calculator (reverse)
function WaterRecoveryReverseCalculator() {
  const [waterRecovery, setWaterRecovery] = useState(38.58)
  const [rawSalinity, setRawSalinity] = useState(40)
  const [productSalinity, setProductSalinity] = useState(0.2)
  const brineSalinity = (100 * rawSalinity - waterRecovery * productSalinity) / (100 - waterRecovery)

  return (
    <div className="converter-card">
      <SectionHeader title="Brine Salinity" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="WR" value={waterRecovery} onChange={setWaterRecovery} unit="%" tooltip="percent" symbolTip="Percent water recovery" />
        <InputRow symbol="S0" value={rawSalinity} onChange={setRawSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Raw water salinity" />
        <InputRow symbol="Sd" value={productSalinity} onChange={setProductSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Product water salinity" />
        <OutputRow symbol="Sb" value={brineSalinity} unit="g/l" tooltip="gram per liter" symbolTip="Brine water salinity" />
      </div>
    </div>
  )
}

// Water Flux Converter
function WaterFluxConverterGFD() {
  const [gfd, setGFD] = useState(20)
  const lmh = gfd * 3.785 * 10.76 / 24

  return (
    <div className="converter-card">
      <SectionHeader title="Water Flux Converter [gfd]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="J" value={gfd} onChange={setGFD} unit="gfd" tooltip="gallon per square foot per day" symbolTooltip={false} />
        <OutputRow symbol="J" value={lmh} unit="lmh" tooltip="liter per square meter per hour" symbolTooltip={false} />
      </div>
    </div>
  )
}

function WaterFluxConverterLMH() {
  const [lmh, setLMH] = useState(33.94)
  const gfd = lmh * 24 / (3.785 * 10.76)

  return (
    <div className="converter-card">
      <SectionHeader title="Water Flux Converter [lmh]" icon={Droplets} />
      <div className="p-4 space-y-1">
        <InputRow symbol="J" value={lmh} onChange={setLMH} unit="lmh" tooltip="liter per square meter per hour" symbolTooltip={false} />
        <OutputRow symbol="J" value={gfd} unit="gfd" tooltip="gallon per square foot per day" symbolTooltip={false} />
      </div>
    </div>
  )
}

// Water Permeability Converter
function WaterPermeabilityConverterLMH() {
  const [W_lmh, setW_lmh] = useState(0.962)
  const W_ms = W_lmh / (3600 * 1000)

  return (
    <div className="converter-card">
      <SectionHeader title="Water Permeability [l/m².h.bar]" icon={Calculator} />
      <div className="p-4 space-y-1">
        <InputRow symbol="W" value={W_lmh} onChange={setW_lmh} unit="l/m².h.bar" tooltip="liter per square meter per hour per bar" symbolTip="Water permeability coefficient" />
        <OutputRow symbol="W" value={W_ms} unit="m/s.bar" tooltip="meter per second per bar" symbolTip="Water permeability coefficient" />
      </div>
    </div>
  )
}

function WaterPermeabilityConverterMS() {
  const [W_ms, setW_ms] = useState(2.672e-7)
  const W_lmh = W_ms * 3600 * 1000

  return (
    <div className="converter-card">
      <SectionHeader title="Water Permeability [m/s.bar]" icon={Calculator} />
      <div className="p-4 space-y-1">
        <InputRow symbol="W" value={W_ms} onChange={setW_ms} unit="m/s.bar" tooltip="meter per second per bar" symbolTip="Water permeability coefficient" />
        <OutputRow symbol="W" value={W_lmh} unit="l/m².h.bar" tooltip="liter per square meter per hour per bar" symbolTip="Water permeability coefficient" />
      </div>
    </div>
  )
}

// Salt Permeability Converter
function SaltPermeabilityConverterGMH() {
  const [X_gmh, setX_gmh] = useState(0.0731)
  const X_ms = X_gmh / (3600 * 1000)

  return (
    <div className="converter-card">
      <SectionHeader title="Salt Permeability [g/m².h.(g/l)]" icon={Calculator} />
      <div className="p-4 space-y-1">
        <InputRow symbol="X" value={X_gmh} onChange={setX_gmh} unit="g/m².h.(g/l)" tooltip="gram per square meter per hour per (gram per liter)" symbolTip="Salt permeability coefficient" />
        <OutputRow symbol="X" value={X_ms} unit="m/s" tooltip="meter per second" symbolTip="Salt permeability coefficient" />
      </div>
    </div>
  )
}

function SaltPermeabilityConverterMS() {
  const [X_ms, setX_ms] = useState(2.03e-8)
  const X_gmh = X_ms * 3600 * 1000

  return (
    <div className="converter-card">
      <SectionHeader title="Salt Permeability [m/s]" icon={Calculator} />
      <div className="p-4 space-y-1">
        <InputRow symbol="X" value={X_ms} onChange={setX_ms} unit="m/s" tooltip="meter per second" symbolTip="Salt permeability coefficient" />
        <OutputRow symbol="X" value={X_gmh} unit="g/m².h.(g/l)" tooltip="gram per square meter per hour per (gram per liter)" symbolTip="Salt permeability coefficient" />
      </div>
    </div>
  )
}

// ==================== RO ELEMENT PARAMETERS ====================

// RO Element Parameters (Pb is given)
function ROElementParametersPbGiven() {
  const [A, setA] = useState(40.9) // Membrane area (m²)
  const [Pf, setPf] = useState(55) // Feed pressure (bar)
  const [Pb, setPb] = useState(54.192) // Brine pressure (bar)
  const [Md, setMd] = useState(1.2146) // Product flow (t/h)
  const [w, setW] = useState(8) // Number of elements (#)
  const [Sf, setSf] = useState(32) // Feed salinity (g/l)
  const [Tf, setTf] = useState(25) // Feed temperature (°C)
  const [SR, setSR] = useState(99.7) // Salt rejection (%)

  // Calculations from Excel
  const Mf = 100 * Md / w // Feed flow per element (t/h)
  const Sd = Sf * (1 - SR / 100) // Product salinity (g/l)
  const Sb = (Mf * Sf - Md * Sd) / (Mf - Md) // Brine salinity (g/l)
  const Sm = (0.5 * (Sf + Sb) - Sd) * Math.exp(0.7 * (Md / Mf)) // Mean membrane salinity (g/l)
  const piM = 0.00255 * 298 * Sm // Mean osmotic pressure (bar)
  const deltaP = 0.5 * (Pf + Pb) - piM // Net driving pressure (bar)
  const TCF = 0.33 + 0.0247 * Tf + 0.00000336 * Math.pow(Tf, 3) // Temperature correction factor
  const W_calc = Md * 1000 / (A * deltaP * TCF) // Water permeability (l/m².h.bar)
  const X_calc = Md * Sd * 1000 / (A * Sm * TCF) // Salt permeability (g/m².h.(g/l))
  const PCF = (Pf - Pb) / (0.0085 * Math.pow(Mf - 0.5 * Md, 1.7)) // Pressure correction factor

  return (
    <div className="converter-card">
      <SectionHeader title="RO Element Parameters (Pb is given)" icon={Calculator} />
      <div className="p-3 space-y-1">
          <InputRow symbol="A" value={A} onChange={setA} unit="M²" tooltip="square meter" symbolTip="Membrane element active area" />
          <InputRow symbol="Pf" value={Pf} onChange={setPf} unit="bar" tooltip="bar" symbolTip="Feed water pressure" />
          <InputRow symbol="Pb" value={Pb} onChange={setPb} unit="bar" tooltip="bar" symbolTip="Brine water pressure" />
          <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" tooltip="metric ton per hour" symbolTip="Product water flow" />
          <InputRow symbol="WR" value={w} onChange={setW} unit="%" tooltip="percent" symbolTip="Percent water recovery" />
          <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" tooltip="gram per liter" symbolTip="Feed water salinity" />
          <InputRow symbol="Tf" value={Tf} onChange={setTf} unit="°C" tooltip="Celsius" symbolTip="Feed water temperature" />
          <InputRow symbol="SR" value={SR} onChange={setSR} unit="%" tooltip="percent" symbolTip="Salt rejection" />
          <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="Mf" value={Mf} unit="t/h" tooltip="metric ton per hour" symbolTip="Feed flow per element" />
          <OutputRow symbol="Sd" value={Sd} unit="g/l" tooltip="gram per liter" symbolTip="Product water salinity" />
          <OutputRow symbol="Sb" value={Sb} unit="g/l" tooltip="gram per liter" symbolTip="Brine water salinity" />
          <OutputRow symbol="ΔS" value={Sm} unit="g/l" tooltip="gram per liter" symbolTip="Mean membrane wall salinity" />
          <OutputRow symbol="Δπ" value={piM} unit="bar" tooltip="bar" symbolTip="Mean osmotic pressure" />
          <OutputRow symbol="ΔP" value={deltaP} unit="bar" tooltip="bar" symbolTip="Net driving pressure" />
          <OutputRow symbol="TCF" value={TCF} unit="#" tooltip="dimensionless" symbolTip="Temperature correction factor" />
          <OutputRow symbol="W" value={W_calc} unit="l/m².h.bar" tooltip="liter per square meter per hour per bar" symbolTip="Water permeability coefficient" />
          <OutputRow symbol="X" value={X_calc} unit="g/m².h.(g/l)" tooltip="gram per square meter per hour per (gram per liter)" symbolTip="Salt permeability coefficient" />
          <OutputRow symbol="PCF" value={PCF} unit="#" tooltip="dimensionless" symbolTip="Pressure correction factor" />
          </div>
      </div>
    </div>
  )
}

// RO Element Parameters (Pb is correlated)
function ROElementParametersPbCorrelated() {
  const [A, setA] = useState(40.9) // Membrane area (m²)
  const [Pf, setPf] = useState(55) // Feed pressure (bar)
  const [Md, setMd] = useState(1.2146) // Product flow (t/h)
  const [w, setW] = useState(8) // Number of elements (#)
  const [Sf, setSf] = useState(32) // Feed salinity (g/l)
  const [Tf, setTf] = useState(25) // Feed temperature (°C)
  const [SR, setSR] = useState(99.7) // Salt rejection (%)

  // Calculations from Excel
  const Mf = 100 * Md / w // Feed flow per element (t/h)
  const Sd = Sf * (1 - SR / 100) // Product salinity (g/l)
  const Sb = (Mf * Sf - Md * Sd) / (Mf - Md) // Brine salinity (g/l)
  const Sm = (0.5 * (Sf + Sb) - Sd) * Math.exp(0.7 * (Md / Mf)) // Mean membrane salinity (g/l)
  const piM = 0.00255 * 298 * Sm // Mean osmotic pressure (bar)
  
  // Pb is calculated using the correlation
  const Pb = Pf - 0.0085 * Math.pow(Mf - 0.5 * Md, 1.7)
  
  const deltaP = 0.5 * (Pf + Pb) - piM // Net driving pressure (bar)
  const TCF = 0.33 + 0.0247 * Tf + 0.00000336 * Math.pow(Tf, 3) // Temperature correction factor
  const W_calc = Md * 1000 / (A * deltaP * TCF) // Water permeability (l/m².h.bar)
  const X_calc = Md * Sd * 1000 / (A * Sm * TCF) // Salt permeability (g/m².h.(g/l))
  const PCF = (Pf - Pb) / (0.0085 * Math.pow(Mf - 0.5 * Md, 1.7)) // Pressure correction factor (should be ~1)

  return (
    <div className="converter-card">
      <SectionHeader title="RO Element Parameters (Pb is correlated)" icon={Calculator} />
      <div className="p-3 space-y-1">
          <InputRow symbol="A" value={A} onChange={setA} unit="M²" tooltip="square meter" symbolTip="Membrane element active area" />
          <InputRow symbol="Pf" value={Pf} onChange={setPf} unit="bar" tooltip="bar" symbolTip="Feed water pressure" />
          <InputRow symbol="Md" value={Md} onChange={setMd} unit="t/h" tooltip="metric ton per hour" symbolTip="Product water flow" />
          <InputRow symbol="WR" value={w} onChange={setW} unit="%" tooltip="percent" symbolTip="Percent water recovery" />
          <InputRow symbol="Sf" value={Sf} onChange={setSf} unit="g/l" tooltip="gram per liter" symbolTip="Feed water salinity" />
          <InputRow symbol="Tf" value={Tf} onChange={setTf} unit="°C" tooltip="Celsius" symbolTip="Feed water temperature" />
          <InputRow symbol="SR" value={SR} onChange={setSR} unit="%" tooltip="percent" symbolTip="Salt rejection" />
          <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <OutputRow symbol="Mf" value={Mf} unit="t/h" tooltip="metric ton per hour" symbolTip="Feed flow per element" />
          <OutputRow symbol="Sd" value={Sd} unit="g/l" tooltip="gram per liter" symbolTip="Product water salinity" />
          <OutputRow symbol="Sb" value={Sb} unit="g/l" tooltip="gram per liter" symbolTip="Brine water salinity" />
          <OutputRow symbol="ΔS" value={Sm} unit="g/l" tooltip="gram per liter" symbolTip="Mean membrane wall salinity" />
          <OutputRow symbol="Δπ" value={piM} unit="bar" tooltip="bar" symbolTip="Mean osmotic pressure" />
          <OutputRow symbol="Pb" value={Pb} unit="bar" tooltip="bar" symbolTip="Brine water pressure (correlated)" />
          <OutputRow symbol="ΔP" value={deltaP} unit="bar" tooltip="bar" symbolTip="Net driving pressure" />
          <OutputRow symbol="TCF" value={TCF} unit="#" tooltip="dimensionless" symbolTip="Temperature correction factor" />
          <OutputRow symbol="W" value={W_calc} unit="l/m².h.bar" tooltip="liter per square meter per hour per bar" symbolTip="Water permeability coefficient" />
          <OutputRow symbol="X" value={X_calc} unit="g/m².h.(g/l)" tooltip="gram per square meter per hour per (gram per liter)" symbolTip="Salt permeability coefficient" />
          <OutputRow symbol="PCF" value={PCF} unit="#" tooltip="dimensionless" symbolTip="Pressure correction factor" />
          </div>
      </div>
    </div>
  )
}

// ==================== MAIN PAGE ====================

export default function ROCalculator() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Droplets className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">RO Calculator</h1>
              <p className="text-primary-foreground/80 text-base mt-1">
                Reverse Osmosis Desalination Engineering Calculator
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-4 px-3">
        {/* Info banner */}
        <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-border/50 flex items-start gap-2">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-base text-muted-foreground">
            <strong>Tip:</strong> Hover over any symbol or unit to see its full description. 
            Yellow/cream colored fields are inputs, blue-tinted fields show calculated outputs.
          </p>
        </div>

        {/* Unit Converters Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Unit Converters
          </h2>
          
          {/* Temperature */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Temperature</h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <TemperatureConverter />
            <TemperatureConverterK />
            <TemperatureConverterF />
            <TemperatureConverterR />
          </div>

          {/* Volume */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Volume</h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <VolumeConverterM3 />
            <VolumeConverterFt3 />
            <VolumeConverterIG />
            <VolumeConverterGL />
          </div>

          {/* Water Flow */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Water Flow</h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <WaterFlowConverterMIGD />
            <WaterFlowConverterM3Day />
            <WaterFlowConverterTPH />
            <WaterFlowConverterKGS />
          </div>

          {/* Pressure */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Pressure</h3>
          <div className="grid grid-cols-2 gap-4">
            <PressureConverterBar />
            <PressureConverterKPa />
            <PressureConverterMPa />
            <PressureConverterPSI />
          </div>
        </section>

        {/* RO Specific Calculators */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            RO Specific Calculators
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <ElectricalConductivityConverter />
            <WaterSalinityConverter />
            <OsmoticPressureCalculator />
            <SaltRejectionCalculator />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <WaterRecoveryCalculator />
            <WaterRecoveryReverseCalculator />
            <WaterFluxConverterGFD />
            <WaterFluxConverterLMH />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <WaterPermeabilityConverterLMH />
            <WaterPermeabilityConverterMS />
            <SaltPermeabilityConverterGMH />
            <SaltPermeabilityConverterMS />
          </div>
        </section>

        {/* RO Element Parameters */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            RO Element Parameters
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <ROElementParametersPbGiven />
            <ROElementParametersPbCorrelated />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4 text-center text-base text-black">
          <p>RO Calculator &copy; {new Date().getFullYear()} | Balance Desalination Simulator, email: ahmed.qtn@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}
