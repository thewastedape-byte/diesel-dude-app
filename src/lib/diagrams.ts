export interface DieselDiagram {
  id: string
  title: string
  description: string
  path: string
  keywords: string[]
  category: string
}

export const DIAGRAMS: DieselDiagram[] = [
  {
    id: 'diesel-fuel-system',
    title: 'Common Rail Fuel System',
    description: 'High pressure fuel path from tank to injectors. CP3/CP4 pump, rail pressure specs, filter location.',
    path: '/diagrams/diesel-fuel-system.svg',
    keywords: ['fuel', 'injection', 'injector', 'rail', 'pressure', 'cp3', 'cp4', 'lift pump', 'filter', 'fuel system'],
    category: 'Fuel',
  },
  {
    id: 'def-scr-system',
    title: 'DEF / SCR Aftertreatment System',
    description: 'Complete aftertreatment: DOC → DPF → DEF injection → SCR catalyst. Regen temps, NOx reduction.',
    path: '/diagrams/def-scr-system.svg',
    keywords: ['def', 'scr', 'dpf', 'regen', 'regeneration', 'nox', 'emissions', 'aftertreatment', 'urea', 'catalyst', 'particulate', 'soot'],
    category: 'Emissions',
  },
  {
    id: 'diesel-cooling-system',
    title: 'Diesel Engine Cooling System',
    description: 'Coolant flow: radiator → water pump → engine block → thermostat. EGR cooler and oil cooler shown.',
    path: '/diagrams/diesel-cooling-system.svg',
    keywords: ['cooling', 'coolant', 'overheating', 'thermostat', 'water pump', 'radiator', 'temperature', 'egr cooler', 'oil cooler'],
    category: 'Cooling',
  },
  {
    id: 'hydraulic-system',
    title: 'Heavy Equipment Hydraulic System',
    description: 'Complete hydraulic circuit: reservoir, pump, filter, control valve bank, cylinders, relief valve, oil cooler. Common fault diagnosis.',
    path: '/diagrams/hydraulic-system.svg',
    keywords: ['hydraulic', 'hydraulics', 'cylinder', 'boom', 'stick', 'bucket', 'pump', 'pressure', 'control valve', 'relief', 'slow', 'weak', 'drift'],
    category: 'Hydraulics',
  },
  {
    id: 'turbo-system',
    title: 'Turbocharger System (VGT)',
    description: 'Complete turbo system: turbine, compressor, intercooler, VGT actuator, ECM control. Includes fault codes P0045, P0299, P0234.',
    path: '/diagrams/turbo-system.svg',
    keywords: ['turbo', 'turbocharger', 'vgt', 'boost', 'intercooler', 'actuator', 'underboost', 'overboost', 'compressor', 'turbine'],
    category: 'Induction',
  },
]

export function findDiagram(text: string): DieselDiagram | null {
  const lower = text.toLowerCase()
  let best: DieselDiagram | null = null
  let bestScore = 0
  for (const d of DIAGRAMS) {
    const score = d.keywords.filter(k => lower.includes(k)).length
    if (score > bestScore) { bestScore = score; best = d }
  }
  return bestScore >= 1 ? best : null
}
