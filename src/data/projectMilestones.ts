export interface ProjectMilestoneDef {
  id: string;
  code: string;
  name: string;
  category: string;
  subcontractor: string;
  dates: string;
  duration: string;
  budgetAllocation: number;
  inspectionRequired: boolean;
}

export const DEFAULT_PROJECT_MILESTONES: ProjectMilestoneDef[] = [
  {
    id: 'ms-01',
    code: 'MS-01',
    name: 'Site Preparation & Excavation',
    category: 'Site Work',
    subcontractor: 'Earthworks Pro LLC',
    dates: 'Jan 10 – Feb 15, 2025',
    duration: '36 days',
    budgetAllocation: 450000,
    inspectionRequired: true
  },
  {
    id: 'ms-02',
    code: 'MS-02',
    name: 'Foundation & Deep Pier Drilling',
    category: 'Foundation',
    subcontractor: 'Concrete Solutions Inc.',
    dates: 'Feb 16 – Apr 10, 2025',
    duration: '53 days',
    budgetAllocation: 620000,
    inspectionRequired: true
  },
  {
    id: 'ms-03',
    code: 'MS-03',
    name: 'Structural Framing & Concrete Slabs',
    category: 'Framing & Structure',
    subcontractor: 'Apex Concrete Masters',
    dates: 'Apr 11 – Jul 20, 2025',
    duration: '100 days',
    budgetAllocation: 850000,
    inspectionRequired: true
  },
  {
    id: 'ms-04',
    code: 'MS-04',
    name: 'MEP Utility Rough-in (Mech, Elec, Plumb)',
    category: 'MEP Rough-in',
    subcontractor: 'Prime Electrical & Mechanical',
    dates: 'Jun 01 – Sep 15, 2025',
    duration: '106 days',
    budgetAllocation: 920000,
    inspectionRequired: true
  },
  {
    id: 'ms-05',
    code: 'MS-05',
    name: 'Curtain Wall Facade & Building Envelope',
    category: 'Envelope & Roofing',
    subcontractor: 'Apex Glass Architectural',
    dates: 'Aug 10 – Nov 05, 2025',
    duration: '87 days',
    budgetAllocation: 540000,
    inspectionRequired: true
  },
  {
    id: 'ms-06',
    code: 'MS-06',
    name: 'Insulation, Drywall & Interior Finishes',
    category: 'Interior Finishes',
    subcontractor: 'Craft Drywall LLC',
    dates: 'Oct 01 – Jan 20, 2026',
    duration: '111 days',
    budgetAllocation: 480000,
    inspectionRequired: true
  },
  {
    id: 'ms-07',
    code: 'MS-07',
    name: 'Testing, Commissioning & Final Punch',
    category: 'Closeout',
    subcontractor: 'Integrated Systems LLC',
    dates: 'Jan 15 – Mar 15, 2026',
    duration: '59 days',
    budgetAllocation: 320000,
    inspectionRequired: true
  }
];

export const getMilestonesForProject = (projectId: string): ProjectMilestoneDef[] => {
  return DEFAULT_PROJECT_MILESTONES.map(m => ({
    ...m,
    id: `${projectId}-${m.id}`
  }));
};
