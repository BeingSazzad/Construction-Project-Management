import { 
  User, Project, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, NotificationItem,
  DailyLogItem, PlanGridPin, FinancingDraw, LienWaiver, OpportunityDeal, ProjectChatMessage,
  ChangeOrder, CalendarEventItem, ProjectUpdate
} from '../types';

export const CURRENT_USERS: Record<string, User> = {
  admin: {
    id: 'usr_admin',
    name: 'Avery Scott',
    email: 'avery.scott@averymarsh.com',
    role: 'admin',
    roleTitle: 'Managing Principal & Founder',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 234-5678',
    assignedProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5']
  },
  pm: {
    id: 'usr_pm',
    name: 'Sarah Johnson',
    email: 'sarah.j@averymarsh.com',
    role: 'pm',
    roleTitle: 'Senior Project Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 345-6789',
    assignedProjects: ['proj-1', 'proj-2', 'proj-3']
  },
  finance: {
    id: 'usr_finance',
    name: 'Michael Chang',
    email: 'm.chang@averymarsh.com',
    role: 'finance',
    roleTitle: 'Director of Project Finance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 456-7890',
    assignedProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5']
  },
  field: {
    id: 'usr_field',
    name: 'John Smith',
    email: 'john.smith@averymarsh.com',
    role: 'field',
    roleTitle: 'Lead Field Superintendent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 567-8901',
    assignedProjects: ['proj-1', 'proj-2']
  }
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Snell Isle Residence',
    code: 'SIR-2025',
    location: '1840 Brightwaters Blvd NE',
    cityState: 'Tampa, FL',
    status: 'On Schedule',
    progress: 62,
    startDate: '2024-10-01',
    targetEndDate: '2025-08-30',
    projectManager: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 4650000,
      committed: 4370000,
      actual: 3250000,
      paid: 2860000,
      remaining: 1400000,
      variance: -280000,
      costToComplete: 1400000
    },
    metrics: {
      totalTasks: 48,
      completedTasks: 30,
      overdueTasks: 1,
      openPunchItems: 4,
      totalMilestones: 5,
      completedMilestones: 3
    },
    stages: [
      { id: 'stg-1', name: 'Design', status: 'Complete' },
      { id: 'stg-2', name: 'Permitting', status: 'Complete' },
      { id: 'stg-3', name: 'Preconstruction', status: 'Complete' },
      { id: 'stg-4', name: 'Construction', status: 'In Progress' },
      { id: 'stg-5', name: 'Closeout', status: 'Upcoming' }
    ],
    weather: {
      temperature: '82°F',
      condition: 'Sunny · Rain Expected Thursday',
      forecastRisk: 'Heavy rain expected Thursday may affect scheduled concrete pour',
      highRiskTasks: ['Concrete Pour', 'Framing Inspection'],
      locationName: 'Tampa, FL'
    },
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    description: 'Luxury coastal modern waterfront residence featuring post-tension concrete foundation, impact glass curtain walls, and high-performance building envelope.',
    clientName: 'Arthur & Evelyn Vance',
    type: 'Custom Home',
    masterCode: '1840',
    dailyLogs: [
      {
        id: 'dl-101',
        projectId: 'proj-1',
        projectName: 'Snell Isle Residence',
        date: 'Today · Sep 5',
        weather: {
          condition: 'Sunny',
          temperature: '82°F / 28°C',
          windSpeed: '6 mph SW',
          precipitation: '0%',
          siteCondition: 'Dry'
        },
        totalHeadcount: 24,
        visitors: 'City of Tampa Building Inspector (Structural framing walkthrough)',
        deliveries: ['84 Lumber Framing Package (2 flatbeds)', '50 bundles EMT conduit'],
        equipment: '50-ton Mobile Crane, Genie GTH-844 Telehandler',
        crews: [
          {
            trade: 'Structural Framing',
            subcontractor: 'Apex Concrete Masters',
            workersCount: 14,
            hoursWorked: 8,
            notes: 'Completed second-floor structural ceiling joists and exterior shear tie-downs'
          },
          {
            trade: 'Electrical & MEP',
            subcontractor: 'Prime Electrical & Mechanical',
            workersCount: 10,
            hoursWorked: 8,
            notes: 'Level 2 rough-in home runs and sub-panel feeders installed'
          }
        ],
        workSummary: 'Completed level 2 structural floor framing, installed hurricane clips and tie-down holdowns on west shear wall. Electrical rough-in conduits ran to main distribution panel. Site safety check passed 100%.',
        materialsReceived: ['84 Lumber Framing Package (2 flatbeds)', '50 bundles EMT conduit', 'Simpson Strong-Tie hardware boxes'],
        safetyIncidents: '0 Incidents. Daily morning safety briefing conducted. Fall protection harnesses inspected.',
        safetyPassed: true,
        author: 'John Smith (Field Superintendent)',
        photos: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'dl-102',
        projectId: 'proj-1',
        projectName: 'Snell Isle Residence',
        date: 'Yesterday · Sep 4',
        weather: {
          condition: 'Sunny',
          temperature: '84°F / 29°C',
          windSpeed: '8 mph W',
          precipitation: '0%',
          siteCondition: 'Dry'
        },
        totalHeadcount: 22,
        visitors: 'Arthur Vance (Client site visit with Architect)',
        deliveries: ['Structural steel flitch plates (1 truck)'],
        equipment: 'Cat 320 Excavator, Forklift #2',
        crews: [
          {
            trade: 'Framing & Steel',
            subcontractor: 'Apex Concrete Masters',
            workersCount: 12,
            hoursWorked: 8,
            notes: 'Set primary structural steel beam over great room opening'
          },
          {
            trade: 'Earthworks & Site',
            subcontractor: 'Earthworks Pro LLC',
            workersCount: 10,
            hoursWorked: 8,
            notes: 'Finalized exterior perimeter grading and storm drainage swale'
          }
        ],
        workSummary: 'Erected great room structural steel beam with mobile crane. Completed exterior rough grading to prevent pooling ahead of Thursday rain advisory.',
        materialsReceived: ['Structural steel flitch plates (1 truck)', '12-inch corrugated drainage pipe (100 ft)'],
        safetyIncidents: '0 Incidents. Crane lift perimeter barricaded during heavy picks.',
        safetyPassed: true,
        author: 'Sarah Johnson (Project Manager)',
        photos: [
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'dl-103',
        projectId: 'proj-1',
        projectName: 'Snell Isle Residence',
        date: 'Sep 3',
        weather: {
          condition: 'Partly Cloudy',
          temperature: '81°F / 27°C',
          windSpeed: '11 mph E',
          precipitation: '10%',
          siteCondition: 'Normal'
        },
        totalHeadcount: 18,
        visitors: 'Universal Engineering Sciences (Concrete break testing tech)',
        deliveries: ['Ready-mix concrete trucks (4 loads)'],
        equipment: 'Putzmeister 38Z Concrete Boom Pump',
        crews: [
          {
            trade: 'Concrete & Foundations',
            subcontractor: 'Concrete Solutions Inc.',
            workersCount: 18,
            hoursWorked: 8,
            notes: 'Poured grade beams and STEM walls on grid A-D'
          }
        ],
        workSummary: 'Poured 42 yards of 4,000 PSI concrete for foundation STEM walls. 7-day cylinder break tests passed at 3,850 PSI (exceeding 3,500 PSI spec). Clean finish troweled.',
        materialsReceived: ['Ready-mix concrete (42 yards)'],
        safetyIncidents: '0 Incidents. Concrete chemical eye wash stations verified.',
        safetyPassed: true,
        author: 'John Smith (Field Superintendent)',
        photos: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=600&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'dl-104',
        projectId: 'proj-1',
        projectName: 'Snell Isle Residence',
        date: 'Sep 2',
        weather: {
          condition: 'Clear',
          temperature: '80°F / 27°C',
          windSpeed: '5 mph NW',
          precipitation: '0%',
          siteCondition: 'Dry'
        },
        totalHeadcount: 16,
        visitors: 'Geotechnical Soil Engineer (Soil bearing verification)',
        deliveries: ['Rebar #5 and #6 bundles (2 trailers)'],
        equipment: 'CAT 308 Mini Excavator, Vibratory Plate Compactor',
        crews: [
          {
            trade: 'Earthwork & Foundations',
            subcontractor: 'Earthworks Pro LLC',
            workersCount: 16,
            hoursWorked: 8,
            notes: 'Excavated grade beam trenches and tied rebar cages'
          }
        ],
        workSummary: 'Geotechnical engineer tested soil bearing compaction at 3,000 PSF (approved). Installed vapor barrier and tied continuous rebar reinforcement.',
        materialsReceived: ['Rebar bundles (8 tons)', '15-mil Stego Wrap Vapor Barrier rolls'],
        safetyIncidents: '0 Incidents. Trench shoring safety inspection signed off.',
        safetyPassed: true,
        author: 'John Smith (Field Superintendent)'
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Downtown Commercial Tower',
    code: 'DCT-2024',
    location: '1200 Michigan Ave',
    cityState: 'Chicago, IL',
    status: 'In Progress',
    progress: 42,
    startDate: '2024-04-15',
    targetEndDate: '2026-03-20',
    projectManager: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 8900000,
      committed: 6400000,
      actual: 5250000,
      paid: 4100000,
      remaining: 3650000,
      variance: 340000, // over budget risk
      costToComplete: 3950000
    },
    metrics: {
      totalTasks: 215,
      completedTasks: 90,
      overdueTasks: 6,
      openPunchItems: 19,
      totalMilestones: 12,
      completedMilestones: 4
    },
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80',
    description: 'High-density mixed retail & 28-floor steel frame commercial tower with integrated subterranean transit concourse.',
    clientName: 'Metropolitan Trust',
    type: 'Commercial',
    masterCode: '5678',
    dailyLogs: [
      {
        id: 'dl-201',
        projectId: 'proj-2',
        projectName: 'Downtown Commercial Tower',
        date: 'Aug 31, 2026',
        weather: {
          condition: 'Sunny',
          temperature: '82°F / 28°C',
          windSpeed: '12 mph N',
          precipitation: '0%',
          siteCondition: 'Dry'
        },
        totalHeadcount: 32,
        visitors: 'OSHA Safety Inspector (Routine audit - Passed)',
        deliveries: ['Curtain wall glass crates (6 units)', 'Drywall gypsum packs'],
        equipment: 'Tower Crane #2, Scissor Lifts (4)',
        crews: [
          {
            trade: 'Glazing & Curtain Wall',
            subcontractor: 'Apex Glazing Systems',
            workersCount: 18,
            hoursWorked: 8,
            notes: 'Installed level 12 exterior curtain wall panels'
          },
          {
            trade: 'HVAC & Mechanical',
            subcontractor: 'AirTech Engineering',
            workersCount: 14,
            hoursWorked: 8,
            notes: 'Ductwork installation on floor 10'
          }
        ],
        workSummary: 'Installed level 12 exterior glass curtain wall units. HVAC mechanical rough-in progressing on schedule on floor 10.',
        materialsReceived: ['Curtain wall glass crates (6 units)', 'Drywall gypsum packs'],
        safetyIncidents: '0 Incidents. OSHA routine audit completed with 100% pass rate.',
        safetyPassed: true,
        author: 'Carlos Ortiz (Superintendent)',
        photos: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    id: 'proj-3',
    name: 'Greenfield Residential Development',
    code: 'GRD-2025',
    location: '8800 Austin Hills Pkwy',
    cityState: 'Austin, TX',
    status: 'Pre-Construction',
    progress: 18,
    startDate: '2024-01-10',
    targetEndDate: '2025-08-15',
    projectManager: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 6200000,
      committed: 5100000,
      actual: 4450000,
      paid: 3900000,
      remaining: 1750000,
      variance: -120000,
      costToComplete: 1620000
    },
    metrics: {
      totalTasks: 160,
      completedTasks: 124,
      overdueTasks: 0,
      openPunchItems: 7,
      totalMilestones: 8,
      completedMilestones: 6
    },
    thumbnail: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
    description: '64-unit luxury townhome enclave with clubhouse, underground utility spine, and sustainable stormwater retention basins.'
  },
  {
    id: 'proj-4',
    name: 'Sunset Villas Luxury Condos',
    code: 'SVC-2025',
    location: '320 Ocean Drive',
    cityState: 'Miami, FL',
    status: 'Warranty',
    progress: 100,
    startDate: '2024-07-01',
    targetEndDate: '2025-12-15',
    projectManager: {
      id: 'usr_pm',
      name: 'David Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 3400000,
      committed: 2600000,
      actual: 1850000,
      paid: 1500000,
      remaining: 1550000,
      variance: -85000,
      costToComplete: 1450000
    },
    metrics: {
      totalTasks: 96,
      completedTasks: 53,
      overdueTasks: 1,
      openPunchItems: 5,
      totalMilestones: 7,
      completedMilestones: 3
    },
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    description: 'Coastal hurricane-rated reinforced concrete luxury condominium structure with rooftop infinity pool.'
  },
  {
    id: 'proj-5',
    name: 'Lakeside Mall Expansion',
    code: 'LME-2025',
    location: '400 Lakeview Blvd',
    cityState: 'Orlando, FL',
    status: 'Planning',
    progress: 10,
    startDate: '2024-11-01',
    targetEndDate: '2026-05-30',
    projectManager: {
      id: 'usr_pm',
      name: 'Elena Rossi',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 1500000,
      committed: 1100000,
      actual: 900000,
      paid: 750000,
      remaining: 600000,
      variance: 45000,
      costToComplete: 620000
    },
    metrics: {
      totalTasks: 65,
      completedTasks: 20,
      overdueTasks: 0,
      openPunchItems: 2,
      totalMilestones: 5,
      completedMilestones: 1
    },
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    description: 'Retail shell renovation, food hall structural steel framing, and updated central mechanical plant.'
  },
  {
    id: 'proj-6',
    name: 'Austin Tech Hub Phase 2',
    code: 'ATH-2025',
    location: '720 Congress Ave',
    cityState: 'Austin, TX',
    status: 'On Hold',
    progress: 35,
    startDate: '2024-03-01',
    targetEndDate: '2026-08-30',
    projectManager: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 5800000,
      committed: 3200000,
      actual: 2100000,
      paid: 1900000,
      remaining: 3700000,
      variance: 0,
      costToComplete: 3700000
    },
    metrics: {
      totalTasks: 110,
      completedTasks: 38,
      overdueTasks: 3,
      openPunchItems: 4,
      totalMilestones: 6,
      completedMilestones: 2
    },
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    description: 'Commercial high-density office development with custom glass atrium facade.'
  },
  {
    id: 'proj-7',
    name: 'Skyline Modern Residence',
    code: 'SMR-2024',
    location: '55 Pine Street',
    cityState: 'Seattle, WA',
    status: 'Completed',
    progress: 100,
    startDate: '2023-06-01',
    targetEndDate: '2024-12-20',
    projectManager: {
      id: 'usr_pm',
      name: 'David Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    budget: {
      total: 2800000,
      committed: 2800000,
      actual: 2750000,
      paid: 2750000,
      remaining: 50000,
      variance: -50000,
      costToComplete: 0
    },
    metrics: {
      totalTasks: 145,
      completedTasks: 145,
      overdueTasks: 0,
      openPunchItems: 0,
      totalMilestones: 8,
      completedMilestones: 8
    },
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    description: 'Custom luxury architectural residence with integrated smart home automation and solar canopy.'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'tsk-1',
    projectId: 'proj-1',
    projectName: 'Snell Isle Residence',
    title: 'Framing Inspection',
    description: 'City structural inspector on-site for framing rough-in inspection for Building A main residence envelope.',
    assignee: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Superintendent'
    },
    startDate: '2025-05-16',
    dueDate: '2025-05-16',
    priority: 'High',
    status: 'In Progress',
    milestone: 'Framing Inspection',
    costCode: '06-1000 Rough Carpentry',
    subtasks: [
      { id: 'st-1', title: 'Verify hurricane strap nailing schedule', completed: true },
      { id: 'st-2', title: 'Sign off municipal inspection card', completed: false }
    ],
    attachmentsCount: 2,
    notesCount: 3,
    location: '10:00 AM · Building A'
  },
  {
    id: 'tsk-2',
    projectId: 'proj-1',
    projectName: 'Snell Isle Residence',
    title: 'MEP Rough-In',
    description: 'Coordinate mechanical, electrical, and plumbing rough-in penetration lines across first floor ceiling plenum.',
    assignee: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Superintendent'
    },
    startDate: '2025-05-16',
    dueDate: '2025-05-18',
    priority: 'Medium',
    status: 'In Progress',
    milestone: 'MEP Rough-in',
    costCode: '15-4000 Mechanical & Plumbing',
    subtasks: [
      { id: 'st-21', title: 'Route PVC drain waste vents', completed: true },
      { id: 'st-22', title: 'Pull home-run Romex wiring', completed: false }
    ],
    attachmentsCount: 1,
    notesCount: 2,
    location: '1:30 PM · Building A'
  },
  {
    id: 'tsk-weather',
    projectId: 'proj-1',
    projectName: 'Snell Isle Residence',
    title: 'Concrete Pour - Level 2 Deck',
    description: 'Batch plant mix pour for Level 2 post-tension deck. Weather radar indicates heavy rain Thursday—requires monitoring or rescheduling.',
    assignee: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Project Manager'
    },
    startDate: '2025-05-22',
    dueDate: '2025-05-22',
    priority: 'Critical',
    status: 'Not Started',
    milestone: 'Structural Slab',
    costCode: '03-3000 Cast-in-Place Concrete',
    subtasks: [
      { id: 'st-w1', title: 'Confirm weather protection tarps on site', completed: false },
      { id: 'st-w2', title: 'Coordinate schedule with Apex Ready-Mix', completed: false }
    ],
    attachmentsCount: 3,
    notesCount: 4,
    location: 'Level 2 Elevated Deck'
  },
  {
    id: 'tsk-3',
    projectId: 'proj-2',
    projectName: 'Downtown Commercial Tower',
    title: 'MEP Rough-in - Level 5 Zone B',
    description: 'Install main overhead HVAC ductwork, chilled water distribution risers, and primary cable trays.',
    assignee: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Project Manager'
    },
    startDate: '2025-05-16',
    dueDate: '2025-05-22',
    priority: 'High',
    status: 'In Progress',
    milestone: 'MEP Rough-in',
    costCode: '15-4000 Mechanical & HVAC',
    subtasks: [
      { id: 'st-31', title: 'Hang 24" spiral supply duct branches', completed: true },
      { id: 'st-32', title: 'Pressure test domestic water risers', completed: false },
      { id: 'st-33', title: 'Install VAV boxes V-501 to V-512', completed: false }
    ],
    attachmentsCount: 4,
    notesCount: 7,
    location: 'Level 5 - Quadrant B'
  },
  {
    id: 'tsk-4',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    title: 'Site Safety Walk & OSHA Audit',
    description: 'Weekly comprehensive safety walk: inspect perimeter guardrails, crane lift radiuses, fire extinguishers, and PPE adherence.',
    assignee: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Superintendent'
    },
    startDate: '2025-05-20',
    dueDate: '2025-05-20',
    priority: 'High',
    status: 'Not Started',
    milestone: 'Site Logistics & Safety',
    costCode: '01-3100 Project Safety',
    subtasks: [
      { id: 'st-41', title: 'Inspect harness tie-off points Level 10-12', completed: false },
      { id: 'st-42', title: 'Verify GFCI breakers on temporary power spiders', completed: false },
      { id: 'st-43', title: 'Log toolbox talk attendance sheet', completed: false }
    ],
    attachmentsCount: 1,
    notesCount: 1,
    location: 'Full Jobsite'
  },
  {
    id: 'tsk-5',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    title: 'Formwork Stripping & Reshoring L11',
    description: 'Remove beam side forms and install heavy-duty hydraulic reshores under bay 3 per engineer specs.',
    assignee: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Superintendent'
    },
    startDate: '2025-05-22',
    dueDate: '2025-05-24',
    priority: 'Medium',
    status: 'Not Started',
    milestone: 'Structural Framing',
    costCode: '03-1000 Concrete Formwork',
    subtasks: [
      { id: 'st-51', title: 'Confirm 7-day break cylinder strength > 3500 PSI', completed: true },
      { id: 'st-52', title: 'Strip drop heads and secondary stringers', completed: false }
    ],
    attachmentsCount: 2,
    notesCount: 0,
    location: 'Level 11 Deck'
  },
  {
    id: 'tsk-6',
    projectId: 'proj-2',
    projectName: 'Downtown Commercial Tower',
    title: 'Curtain Wall Glazing Anchor Inspection',
    description: 'Ultrasonic weld test on perimeter embeds for exterior curtain wall panels.',
    assignee: {
      id: 'usr_pm',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Project Manager'
    },
    startDate: '2025-05-15',
    dueDate: '2025-05-18',
    priority: 'Critical',
    status: 'Blocked',
    milestone: 'Exterior Facade',
    costCode: '08-4400 Curtain Wall & Glazing',
    subtasks: [
      { id: 'st-61', title: '3rd party testing agency calibration', completed: true },
      { id: 'st-62', title: 'Resolve torque discrepancy on bracket B-12', completed: false }
    ],
    attachmentsCount: 5,
    notesCount: 9,
    location: 'Level 14 - East Elevation'
  }
];

export const MOCK_GANTT: GanttItem[] = [
  { id: 'g-1', name: 'Site Preparation & Excavation', category: 'Site Work', startDate: '2025-05-01', endDate: '2025-05-10', progress: 100, status: 'completed', assignee: 'Earthworks Pro' },
  { id: 'g-2', name: 'Foundation & Deep Piling', category: 'Substructure', startDate: '2025-05-08', endDate: '2025-05-18', progress: 100, status: 'completed', assignee: 'Concrete Solutions Inc.' },
  { id: 'g-3', name: 'Structural Concrete Framing L10-L14', category: 'Structure', startDate: '2025-05-16', endDate: '2025-06-05', progress: 65, status: 'in-progress', assignee: 'Concrete Solutions Inc.' },
  { id: 'g-4', name: 'MEP Rough-in Distribution', category: 'Mechanical', startDate: '2025-05-22', endDate: '2025-06-20', progress: 30, status: 'in-progress', assignee: 'Prime Electrical & HVAC' },
  { id: 'g-5', name: 'Curtain Wall Facade Installation', category: 'Exterior', startDate: '2025-05-28', endDate: '2025-07-15', progress: 0, status: 'upcoming', assignee: 'Apex Glass' },
  { id: 'g-6', name: 'Interior Drywall & Partitioning', category: 'Finishes', startDate: '2025-06-10', endDate: '2025-07-30', progress: 0, status: 'upcoming', assignee: 'Craft Drywall LLC' },
  { id: 'g-7', name: 'Commissioning & Inspections', category: 'Closeout', startDate: '2025-08-01', endDate: '2025-08-25', progress: 0, status: 'upcoming', assignee: 'All Trades' }
];

export const MOCK_BUDGET_CATEGORIES: TradeCategory[] = [
  {
    id: 'cat-01',
    name: '01 – Site Preparation',
    icon: 'Boxes',
    estimatedCost: 450000,
    committedCost: 430000,
    actualCost: 320000,
    costCodes: [
      {
        code: '01-1000',
        name: 'Excavation & Site Earthwork',
        estimatedCost: 250000,
        committedCost: 240000,
        actualCost: 180000,
        variance: -10000,
        items: [
          { id: 'ci-1', code: '01-1001', name: 'Cat 336 Excavator & Dozer Rental', type: 'Equipment', unit: 'DAYS', quantity: 24, unitPrice: 4583, estimatedCost: 130000, committedCost: 125000, actualCost: 110000, paidCost: 100000, remaining: 15000, variance: -5000 },
          { id: 'ci-2', code: '01-1002', name: 'Earthwork Operators & Labor Crew', type: 'Labor', unit: 'HRS', quantity: 1200, unitPrice: 65, estimatedCost: 80000, committedCost: 75000, actualCost: 70000, paidCost: 65000, remaining: 5000, variance: -5000 }
        ]
      },
      {
        code: '01-2000',
        name: 'Utilities Clearing & Demolition',
        estimatedCost: 200000,
        committedCost: 190000,
        actualCost: 140000,
        variance: -10000,
        items: [
          { id: 'ci-3', code: '01-2001', name: 'Culvert & Site Drainage Materials', type: 'Materials', unit: 'LF', quantity: 1600, unitPrice: 50, estimatedCost: 90000, committedCost: 85000, actualCost: 80000, paidCost: 75000, remaining: 5000, variance: -5000 },
          { id: 'ci-4', code: '01-2002', name: 'Underground Trenching Subcontract', type: 'Subcontractor', unit: 'LUMP', quantity: 1, unitPrice: 60000, estimatedCost: 70000, committedCost: 65000, actualCost: 60000, paidCost: 55000, remaining: 5000, variance: -5000 }
        ]
      }
    ]
  },
  {
    id: 'cat-02',
    name: '02 – Foundation & Structure',
    icon: 'Hammer',
    estimatedCost: 1450000,
    committedCost: 1380000,
    actualCost: 1120000,
    costCodes: [
      {
        code: '02-1000',
        name: 'Concrete Formwork & Shoring',
        estimatedCost: 420000,
        committedCost: 405000,
        actualCost: 360000,
        variance: -15000,
        items: [
          { id: 'ci-5', code: '02-1001', name: 'Column & Wall Formwork Rental', type: 'Equipment', unit: 'SQFT', quantity: 45000, unitPrice: 4.5, estimatedCost: 202500, committedCost: 200000, actualCost: 185000, paidCost: 160000, remaining: 17500, variance: -2500 },
          { id: 'ci-6', code: '02-1002', name: 'Formwork Carpentry Labor', type: 'Labor', unit: 'HRS', quantity: 3200, unitPrice: 65, estimatedCost: 208000, committedCost: 205000, actualCost: 175000, paidCost: 155000, remaining: 33000, variance: -3000 }
        ]
      },
      {
        code: '02-2000',
        name: 'Concrete Reinforcing (Rebar & PT)',
        estimatedCost: 380000,
        committedCost: 375000,
        actualCost: 320000,
        variance: -5000,
        items: [
          { id: 'ci-7', code: '02-2001', name: 'Grade 60 Epoxy Rebar Supply', type: 'Materials', unit: 'TON', quantity: 240, unitPrice: 1100, estimatedCost: 264000, committedCost: 260000, actualCost: 240000, paidCost: 220000, remaining: 24000, variance: -4000 },
          { id: 'ci-8', code: '02-2002', name: 'Ironworker Rebar Tying Labor', type: 'Labor', unit: 'HRS', quantity: 1150, unitPrice: 70, estimatedCost: 116000, committedCost: 115000, actualCost: 80000, paidCost: 70000, remaining: 36000, variance: -1000 }
        ]
      },
      {
        code: '02-3000',
        name: 'Cast-in-Place Ready Mix',
        estimatedCost: 650000,
        committedCost: 600000,
        actualCost: 440000,
        variance: -50000,
        items: [
          { id: 'ci-9', code: '02-3001', name: '5000 PSI High-Early Ready Mix', type: 'Materials', unit: 'CY', quantity: 3600, unitPrice: 150, estimatedCost: 540000, committedCost: 500000, actualCost: 380000, paidCost: 340000, remaining: 160000, variance: -40000 },
          { id: 'ci-10', code: '02-3002', name: 'Boom Pump Truck 42m Rental', type: 'Equipment', unit: 'DAYS', quantity: 32, unitPrice: 2800, estimatedCost: 89600, committedCost: 85000, actualCost: 60000, paidCost: 50000, remaining: 29600, variance: -4600 }
        ]
      }
    ]
  },
  {
    id: 'cat-03',
    name: '03 – MEP (Mechanical, Electrical, Plumbing)',
    icon: 'Flame',
    estimatedCost: 900000,
    committedCost: 850000,
    actualCost: 640000,
    costCodes: [
      {
        code: '03-1000',
        name: 'Plumbing & Hydronic Distribution',
        estimatedCost: 400000,
        committedCost: 380000,
        actualCost: 290000,
        variance: -20000,
        items: [
          { id: 'ci-11', code: '03-1001', name: 'Copper & PEX Piping Supply', type: 'Materials', unit: 'LF', quantity: 4500, unitPrice: 38, estimatedCost: 190000, committedCost: 180000, actualCost: 170000, paidCost: 150000, remaining: 10000, variance: -10000 },
          { id: 'ci-12', code: '03-1002', name: 'Master Licensed Plumber Labor', type: 'Labor', unit: 'HRS', quantity: 1500, unitPrice: 80, estimatedCost: 130000, committedCost: 125000, actualCost: 120000, paidCost: 110000, remaining: 5000, variance: -5000 }
        ]
      },
      {
        code: '03-2000',
        name: 'Electrical Distribution & Low Voltage',
        estimatedCost: 500000,
        committedCost: 470000,
        actualCost: 350000,
        variance: -30000,
        items: [
          { id: 'ci-13', code: '03-2001', name: '3000A Switchgear & Transformers', type: 'Equipment', unit: 'EA', quantity: 2, unitPrice: 90000, estimatedCost: 200000, committedCost: 190000, actualCost: 180000, paidCost: 160000, remaining: 10000, variance: -10000 },
          { id: 'ci-14', code: '03-2002', name: 'Rough-in Conduit & Wire Installation', type: 'Subcontractor', unit: 'LUMP', quantity: 1, unitPrice: 170000, estimatedCost: 190000, committedCost: 180000, actualCost: 170000, paidCost: 150000, remaining: 10000, variance: -10000 }
        ]
      }
    ]
  },
  {
    id: 'cat-04',
    name: '04 – Finishes',
    icon: 'Layers',
    estimatedCost: 650000,
    committedCost: 600000,
    actualCost: 420000,
    costCodes: [
      {
        code: '04-1000',
        name: 'Drywall & Light Gauge Framing',
        estimatedCost: 350000,
        committedCost: 320000,
        actualCost: 230000,
        variance: -20000,
        items: [
          { id: 'ci-15', code: '04-1001', name: '5/8 Type X Drywall & Metal Studs', type: 'Materials', unit: 'BD', quantity: 3200, unitPrice: 44, estimatedCost: 150000, committedCost: 145000, actualCost: 140000, paidCost: 120000, remaining: 5000, variance: -5000 },
          { id: 'ci-16', code: '04-1002', name: 'Drywall Tapers & Finishers Labor', type: 'Labor', unit: 'HRS', quantity: 1400, unitPrice: 65, estimatedCost: 100000, committedCost: 95000, actualCost: 90000, paidCost: 80000, remaining: 5000, variance: -5000 }
        ]
      },
      {
        code: '04-2000',
        name: 'Paint & Architectural Coatings',
        estimatedCost: 300000,
        committedCost: 280000,
        actualCost: 190000,
        variance: -20000,
        items: [
          { id: 'ci-17', code: '04-2001', name: 'Low-VOC Commercial Primer & Paint', type: 'Materials', unit: 'GAL', quantity: 850, unitPrice: 130, estimatedCost: 120000, committedCost: 115000, actualCost: 110000, paidCost: 95000, remaining: 5000, variance: -5000 },
          { id: 'ci-18', code: '04-2002', name: 'Exterior Stucco Finish Subcontract', type: 'Subcontractor', unit: 'LUMP', quantity: 1, unitPrice: 80000, estimatedCost: 90000, committedCost: 85000, actualCost: 80000, paidCost: 70000, remaining: 5000, variance: -5000 }
        ]
      }
    ]
  },
  {
    id: 'cat-05',
    name: '05 – Other Costs',
    icon: 'Boxes',
    estimatedCost: 250000,
    committedCost: 230000,
    actualCost: 120000,
    costCodes: [
      {
        code: '05-1000',
        name: 'Site Logistics & Safety Equipment',
        estimatedCost: 250000,
        committedCost: 230000,
        actualCost: 120000,
        variance: -10000,
        items: [
          { id: 'ci-19', code: '05-1001', name: 'Perimeter Fencing & Scaffolding', type: 'Equipment', unit: 'MO', quantity: 6, unitPrice: 9167, estimatedCost: 70000, committedCost: 60000, actualCost: 55000, paidCost: 50000, remaining: 5000, variance: -5000 },
          { id: 'ci-20', code: '05-1002', name: 'Waste Management & Disposal Hauling', type: 'Subcontractor', unit: 'LUMP', quantity: 1, unitPrice: 65000, estimatedCost: 80000, committedCost: 70000, actualCost: 65000, paidCost: 60000, remaining: 5000, variance: -5000 }
        ]
      }
    ]
  },
  {
    id: 'cat-06',
    name: '06 – Contingency & Structural Frame',
    icon: 'Zap',
    estimatedCost: 950000,
    committedCost: 880000,
    actualCost: 630000,
    costCodes: [
      {
        code: '06-1000',
        name: 'Structural Beams & Contingency',
        estimatedCost: 950000,
        committedCost: 880000,
        actualCost: 630000,
        variance: -50000,
        items: [
          { id: 'ci-21', code: '06-1001', name: 'Wide Flange Structural Steel Supply', type: 'Materials', unit: 'TON', quantity: 180, unitPrice: 2500, estimatedCost: 500000, committedCost: 480000, actualCost: 450000, paidCost: 400000, remaining: 30000, variance: -30000 },
          { id: 'ci-22', code: '06-1002', name: 'Structural Framing Certified Riggers', type: 'Labor', unit: 'HRS', quantity: 2400, unitPrice: 75, estimatedCost: 200000, committedCost: 190000, actualCost: 180000, paidCost: 160000, remaining: 10000, variance: -10000 }
        ]
      }
    ]
  }
];

export const MOCK_PUNCH_ITEMS: PunchItem[] = [
  {
    id: 'pnch-1',
    projectId: 'proj-1',
    title: 'Crack in concrete column',
    location: 'Level 3 - Grid A-4',
    description: 'Hairline vertical shrinkage crack (approx 0.8mm) observed on southwest face of column C-32 after stripping forms. Requires epoxy injection evaluation.',
    assignedTo: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      trade: 'Concrete Solutions Inc.'
    },
    priority: 'High',
    dueDate: '2025-05-26',
    status: 'Open',
    photos: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    createdDate: '2025-05-18'
  },
  {
    id: 'pnch-2',
    projectId: 'proj-1',
    title: 'Door frame not aligned with drywall',
    location: 'Level 2 - Room 201',
    description: 'Hollow metal door frame is out of plumb by 3/8 inch on latch jamb. Prevents fire-rated door closer from latching securely.',
    assignedTo: {
      id: 'usr_field',
      name: 'Mike Davis',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      trade: 'Craft Drywall LLC'
    },
    priority: 'Medium',
    dueDate: '2025-05-21',
    status: 'In Progress',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
    ],
    createdDate: '2025-05-15'
  },
  {
    id: 'pnch-3',
    projectId: 'proj-1',
    title: 'Paint touch up required on soffit',
    location: 'Level 1 - Corridor East',
    description: 'Scuffs and roller streaks on eggshell latex finish around recessed LED troffers.',
    assignedTo: {
      id: 'usr_field',
      name: 'Emily Brown',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      trade: 'Apex Finishes'
    },
    priority: 'Low',
    dueDate: '2025-05-28',
    status: 'Resolved',
    photos: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80'
    ],
    resolutionEvidence: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Repainted entire soffit bay with 2 coats Sherwin Williams ProMar 200.',
    createdDate: '2025-05-12'
  },
  {
    id: 'pnch-4',
    projectId: 'proj-1',
    title: 'Electrical outlet box missing ground screw',
    location: 'Level 4 - Office 401',
    description: 'Junction box J-412 lacks dedicated green bonding pigtail to metal frame.',
    assignedTo: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      trade: 'Prime Electrical'
    },
    priority: 'High',
    dueDate: '2025-05-19',
    status: 'Verified',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    ],
    resolutionEvidence: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Installed #10 green ground screw and verified continuity with multimeter (0.02 ohms).',
    createdDate: '2025-05-10'
  },
  {
    id: 'pnch-5',
    projectId: 'proj-1',
    title: 'HVAC flex duct kinked in ceiling plenum',
    location: 'Level 2 - Corridor North',
    description: 'Flexible duct connection to VAV box VAV-204 is severely kinked reducing airflow to Zone 4. Needs proper hanger support.',
    assignedTo: {
      id: 'usr_field',
      name: 'Dan Gallagher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      trade: 'Climate HVAC Mechanical'
    },
    priority: 'High',
    dueDate: '2025-05-27',
    status: 'Open',
    photos: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80'
    ],
    createdDate: '2025-05-20'
  },
  {
    id: 'pnch-6',
    projectId: 'proj-1',
    title: 'Water penetration at west elevation window sill',
    location: 'Level 3 - Executive Office 304',
    description: 'Water seepage detected around lower aluminum mullion joint during rain test. Exterior perimeter sealant bead needs re-application.',
    assignedTo: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      trade: 'Apex Glazing & Waterproofing'
    },
    priority: 'High',
    dueDate: '2025-05-24',
    status: 'Open',
    photos: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    createdDate: '2025-05-19'
  },
  {
    id: 'pnch-7',
    projectId: 'proj-1',
    title: 'Unsealed firestop penetration at mechanical shaft',
    location: 'Level 5 - Shaft B',
    description: '2-inch copper pipe penetration through 2-hour fire-rated floor slab lacks STI SpecSeal intumescent sealant collar.',
    assignedTo: {
      id: 'usr_field',
      name: 'Mike Davis',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      trade: 'ProShield Firestopping'
    },
    priority: 'High',
    dueDate: '2025-05-29',
    status: 'In Progress',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    ],
    createdDate: '2025-05-17'
  },
  {
    id: 'pnch-8',
    projectId: 'proj-1',
    title: 'Missing handrail wall bracket at stairwell 2',
    location: 'Stairwell 2 - Landing L3',
    description: 'Wall-mounted stainless steel handrail is missing center support bracket. Handrail flexes under load.',
    assignedTo: {
      id: 'usr_field',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      trade: 'Steel Masters LLC'
    },
    priority: 'Medium',
    dueDate: '2025-05-30',
    status: 'Open',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
    ],
    createdDate: '2025-05-16'
  },
  {
    id: 'pnch-9',
    projectId: 'proj-1',
    title: 'Damaged ceiling tile at elevator lobby',
    location: 'Level 1 - Main Lobby',
    description: '2x2 Tegular acoustical ceiling tile chipped at corner during lighting fixture installation.',
    assignedTo: {
      id: 'usr_field',
      name: 'Emily Brown',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      trade: 'Apex Finishes'
    },
    priority: 'Low',
    dueDate: '2025-05-22',
    status: 'Resolved',
    photos: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80'
    ],
    resolutionEvidence: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Replaced ceiling tile with new Armstrong Ultima tile.',
    createdDate: '2025-05-12'
  },
  {
    id: 'pnch-10',
    projectId: 'proj-1',
    title: 'Plumbing cleanout plug missing cap',
    location: 'Level B1 - Parking Garage Bay 4',
    description: '4-inch sanitary cleanout riser missing threaded brass countersunk plug in traffic area.',
    assignedTo: {
      id: 'usr_field',
      name: 'Marco Rossi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      trade: 'Prime Plumbing'
    },
    priority: 'Medium',
    dueDate: '2025-05-25',
    status: 'Verified',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    ],
    resolutionEvidence: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Installed 4-inch heavy-duty brass cleanout plug and flush floor plate.',
    createdDate: '2025-05-11'
  }
];

export const MOCK_SUBCONTRACTORS: Subcontractor[] = [
  {
    id: 'sub-1',
    companyName: 'Concrete Solutions Inc.',
    trade: 'Division 03 - Concrete & Post-Tensioning',
    contactName: 'Marco Rossi',
    phone: '+1 (555) 443-2211',
    email: 'marco@concretesolutions.com',
    status: 'Assigned',
    activeProjects: ['proj-1', 'proj-2'],
    workersOnSite: 28,
    complianceRating: 98,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'sub-2',
    companyName: 'Steel Masters LLC',
    trade: 'Division 05 - Structural Steel Fabrication',
    contactName: 'Dan Gallagher',
    phone: '+1 (555) 887-3344',
    email: 'dan@steelmasters.com',
    status: 'Assigned',
    activeProjects: ['proj-1'],
    workersOnSite: 14,
    complianceRating: 94,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'sub-3',
    companyName: 'Prime Electrical Contractors',
    trade: 'Division 16 - Commercial Electrical',
    contactName: 'Helena Wright',
    phone: '+1 (555) 992-1100',
    email: 'hwright@primeelec.com',
    status: 'Active',
    activeProjects: ['proj-1', 'proj-2', 'proj-3'],
    workersOnSite: 22,
    complianceRating: 100,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'sub-4',
    companyName: 'HVAC Leaders Group',
    trade: 'Division 15 - Mechanical & Hydronics',
    contactName: 'Carlos Mendez',
    phone: '+1 (555) 774-8833',
    email: 'carlos@hvacleaders.com',
    status: 'Active',
    activeProjects: ['proj-1', 'proj-3'],
    workersOnSite: 16,
    complianceRating: 92,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const MOCK_PHOTOS: SitePhoto[] = [
  {
    id: 'ph-1',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    caption: 'Tower crane setting Level 12 deck perimeter safety screens and rebar bundles',
    category: 'Progress',
    uploadedBy: 'John Smith',
    timestamp: 'Today, 8:45 AM',
    location: 'Level 12 Deck - North Elevation',
    tags: ['Concrete', 'Crane Lift', 'Decking']
  },
  {
    id: 'ph-2',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    caption: 'Structural steel core erection with bolted moment connections',
    category: 'Site Photos',
    uploadedBy: 'Sarah Johnson',
    timestamp: 'Yesterday, 3:15 PM',
    location: 'Central Core - Level 10-12',
    tags: ['Steel Framing', 'Core', 'QA/QC']
  },
  {
    id: 'ph-3',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    caption: 'Rebar placement inspection for shear wall foundation anchor',
    category: 'Inspections',
    uploadedBy: 'John Smith',
    timestamp: 'May 18, 2025',
    location: 'South Shear Wall',
    tags: ['Rebar', 'Inspection', 'Structural']
  },
  {
    id: 'ph-4',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    caption: 'Main electrical distribution panel installation in basement mechanical room',
    category: 'Progress',
    uploadedBy: 'Helena Wright',
    timestamp: 'May 17, 2025',
    location: 'Basement Room B-04',
    tags: ['Electrical', 'Gear', 'Rough-in']
  },
  {
    id: 'ph-5',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    url: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=800&auto=format&fit=crop&q=80',
    caption: 'Overhead structural framing and HVAC duct layout Level 4',
    category: 'Site Photos',
    uploadedBy: 'Carlos Mendez',
    timestamp: 'May 16, 2025',
    location: 'Level 4 Corridor',
    tags: ['Framing', 'HVAC']
  },
  {
    id: 'ph-6',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    caption: 'Safety rail and harness inspection check on perimeter scaffold',
    category: 'Safety',
    uploadedBy: 'David Miller',
    timestamp: 'May 15, 2025',
    location: 'Perimeter Scaffold',
    tags: ['Safety', 'Scaffold']
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    title: 'Architectural Plan - Rev 03',
    category: 'Plans',
    fileSize: '24.5 MB',
    fileType: 'PDF',
    version: 'v3.2',
    uploadedBy: 'Gensler Design Partners',
    uploadDate: 'May 15, 2025',
    url: '#'
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    title: 'Structural Drawing - L12 Deck & Slabs',
    category: 'Drawings',
    fileSize: '18.7 MB',
    fileType: 'PDF',
    version: 'v2.1',
    uploadedBy: 'Thornton Tomasetti Eng',
    uploadDate: 'May 17, 2025',
    url: '#'
  },
  {
    id: 'doc-3',
    projectId: 'proj-1',
    title: 'MEP Layout - Level 5 Riser Diagram',
    category: 'Drawings',
    fileSize: '14.2 MB',
    fileType: 'PDF',
    version: 'v1.4',
    uploadedBy: 'Arup MEP Consulting',
    uploadDate: 'May 14, 2025',
    url: '#'
  },
  {
    id: 'doc-4',
    projectId: 'proj-1',
    title: 'Submittal - Concrete Mix 5000 PSI High Early',
    category: 'PDFs',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    version: 'Approved',
    uploadedBy: 'Concrete Solutions Inc.',
    uploadDate: 'May 12, 2025',
    url: '#'
  },
  {
    id: 'doc-5',
    projectId: 'proj-1',
    title: 'Site Safety Logistics & Crane Radius Plan',
    category: 'Site Logistics',
    fileSize: '8.3 MB',
    fileType: 'PDF',
    version: 'v2.0',
    uploadedBy: 'Sarah Johnson',
    uploadDate: 'May 10, 2025',
    url: '#'
  },
  {
    id: 'doc-6',
    projectId: 'proj-1',
    title: 'Prime Contractor Agreement & GMP Exhibit',
    category: 'Contracts',
    fileSize: '3.6 MB',
    fileType: 'PDF',
    version: 'Final Signed',
    uploadedBy: 'Alex Chen',
    uploadDate: 'May 02, 2025',
    url: '#'
  }
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    title: 'Project Progress Executive Report',
    type: 'Progress',
    period: 'May 2025',
    author: 'Sarah Johnson',
    date: 'May 20, 2025',
    summary: 'Level 12 framing is 65% complete. Concrete pour on schedule for May 20. Overall timeline tracking 2 days ahead of critical path.',
    fileSize: '2.4 MB'
  },
  {
    id: 'rep-2',
    title: 'Superintendent Daily Field Log #142',
    type: 'Daily',
    period: 'May 19, 2025',
    author: 'John Smith',
    date: 'May 19, 2025',
    summary: 'Weather: Clear 72°F. 68 workers on site across 4 subcontractors. 2 concrete pumps staged. Zero safety incidents logged.',
    fileSize: '1.1 MB'
  },
  {
    id: 'rep-3',
    title: 'Budget Variance & Cost-to-Complete Analysis',
    type: 'Budget',
    period: 'Q2 2025',
    author: 'Michael Chang',
    date: 'May 15, 2025',
    summary: 'Total project is $230,000 under budget (favorable variance 4.9%). Concrete procurement savings offset slight MEP labor overtime.',
    fileSize: '3.8 MB'
  },
  {
    id: 'rep-4',
    title: 'OSHA Comprehensive Safety Audit Report',
    type: 'Safety',
    period: 'May 2025',
    author: 'Safety Compliance Officer',
    date: 'May 10, 2025',
    summary: '100% compliance on harness anchorages and temporary electrical distribution. Recommended adding additional eye-wash stations near mortar batching.',
    fileSize: '1.9 MB'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'task',
    title: 'Concrete Pour Approved',
    message: 'City inspector signed off on rebar clearance for Level 12 deck pour.',
    timeAgo: '10 min ago',
    read: false,
    projectId: 'proj-1',
    targetView: 'tasks'
  },
  {
    id: 'notif-2',
    type: 'ai',
    title: 'Latti AI Risk Alert',
    message: 'Downtown Commercial Tower structural schedule variance flagged.',
    timeAgo: '1 hr ago',
    read: false,
    projectId: 'proj-2',
    targetView: 'tasks'
  },
  {
    id: 'notif-3',
    type: 'budget',
    title: 'Budget Threshold Passed',
    message: 'Structural steel trade exceeded contingency reserve by $45,000.',
    timeAgo: '2 hrs ago',
    read: false,
    projectId: 'proj-1',
    targetView: 'budget'
  },
  {
    id: 'notif-4',
    type: 'photo',
    title: 'Site Photo Uploaded',
    message: 'Lead Superintendent uploaded 4 inspection photos for east foundation wall.',
    timeAgo: '3 hrs ago',
    read: true,
    projectId: 'proj-1',
    targetView: 'daily-logs'
  },
  {
    id: 'notif-5',
    type: 'punch',
    title: 'Punch Item Resolved',
    message: 'Level 4 Office 401 dry-wall patch completed and verified by site foreman.',
    timeAgo: '5 hrs ago',
    read: true,
    projectId: 'proj-1',
    targetView: 'punch'
  }
];

export const MOCK_DAILY_LOGS: DailyLogItem[] = [
  {
    id: 'log-1',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    date: '2025-05-20',
    weather: {
      condition: 'Sunny',
      temperature: '74°F / 23°C',
      windSpeed: '6 mph WSW',
      precipitation: '0%',
      siteCondition: 'Dry'
    },
    totalHeadcount: 24,
    crews: [
      {
        trade: 'Concrete & Masonry',
        subcontractor: 'Apex Concrete & Foundations',
        workersCount: 8,
        hoursWorked: 8,
        notes: 'Prepped and poured shear wall section SW-4. Rebar layout verified.'
      },
      {
        trade: 'Electrical',
        subcontractor: 'Prime Electrical Solutions',
        workersCount: 6,
        hoursWorked: 7.5,
        notes: 'Rough-in conduits on Level 8 east wing corridor.'
      },
      {
        trade: 'Mechanical / HVAC',
        subcontractor: 'Vortex Mechanical HVAC',
        workersCount: 6,
        hoursWorked: 8,
        notes: 'Chilled water riser piping installation in primary service shaft.'
      },
      {
        trade: 'Site Supervision & Safety',
        subcontractor: 'Lattice Field Team',
        workersCount: 4,
        hoursWorked: 8.5,
        notes: 'Morning toolbox safety talk conducted. PPE audits 100% compliant.'
      }
    ],
    workSummary: 'Productive day on site. Concrete shear wall pour completed on schedule. Electrical rough-in advancing through Level 8 ahead of drywall staging.',
    materialsReceived: [
      '3 truckloads ready-mix 5000 PSI concrete (Apex)',
      '1,200 ft 3/4" EMT conduit + junction fittings (Prime Electrical)',
      '8 sections 6" schedule 40 chilled water pipe'
    ],
    safetyIncidents: 'Zero incidents or near-misses. Morning safety meeting focused on fall arrest systems.',
    safetyPassed: true,
    author: 'John Smith (Lead Superintendent)',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'log-2',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    date: '2025-05-19',
    weather: {
      condition: 'Partly Cloudy',
      temperature: '68°F / 20°C',
      windSpeed: '11 mph NW',
      precipitation: '10%',
      siteCondition: 'Normal'
    },
    totalHeadcount: 22,
    crews: [
      {
        trade: 'Structural Framing',
        subcontractor: 'Titan Steel Erectors',
        workersCount: 7,
        hoursWorked: 8,
        notes: 'Torqued high-strength bolts on Level 12 deck perimeter framing.'
      },
      {
        trade: 'Plumbing',
        subcontractor: 'AquaFlow Commercial Plumbing',
        workersCount: 5,
        hoursWorked: 8,
        notes: 'Cast iron drain waste vent rough-in on Level 7 restrooms.'
      },
      {
        trade: 'Electrical',
        subcontractor: 'Prime Electrical Solutions',
        workersCount: 6,
        hoursWorked: 8,
        notes: 'Pulled home-run feeder cables from basement sub-station.'
      },
      {
        trade: 'Site Supervision',
        subcontractor: 'Lattice Field Team',
        workersCount: 4,
        hoursWorked: 8,
        notes: 'Delivery coordination and crane pick perimeter barricading.'
      }
    ],
    workSummary: 'Steel bolting inspection completed by third-party engineering firm. City plumbing inspector performed rough inspection on Level 6 (passed with zero citations).',
    materialsReceived: [
      '2 reels 500kcmil copper feeder cable',
      '50 bundles 3" cast iron no-hub pipe'
    ],
    safetyIncidents: 'No safety incidents recorded.',
    safetyPassed: true,
    author: 'John Smith (Lead Superintendent)'
  }
];

export const MOCK_PLAN_PINS: PlanGridPin[] = [
  {
    id: 'pin-1',
    projectId: 'proj-1',
    title: 'Drywall crack near doorframe',
    xPercent: 34,
    yPercent: 42,
    type: 'punch',
    status: 'open',
    assigneeName: 'Marcus Miller (Titan Drywall)',
    roomOrArea: 'Level 8 - Suite 802 Main Entry',
    description: '1/8" hairline crack in taped joint above header beam. Needs tape re-bedding and skim coat.',
    createdDate: '2025-05-19'
  },
  {
    id: 'pin-2',
    projectId: 'proj-1',
    title: 'Rough-in Conduit Inspection Point',
    xPercent: 62,
    yPercent: 28,
    type: 'inspection',
    status: 'in-progress',
    assigneeName: 'Prime Electrical Solutions',
    roomOrArea: 'Level 8 - Server / Telecom Room',
    description: 'Fire barrier penetration sleeve seal and grounding bus bar verification.',
    createdDate: '2025-05-18'
  },
  {
    id: 'pin-3',
    projectId: 'proj-1',
    title: 'HVAC Damper Actuator Mounted',
    xPercent: 78,
    yPercent: 65,
    type: 'photo',
    status: 'resolved',
    assigneeName: 'Vortex Mechanical HVAC',
    roomOrArea: 'Level 8 - East Mechanical Chase',
    description: 'Installed Honeywell modulating volume damper actuator. Photo verification logged.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    createdDate: '2025-05-17'
  },
  {
    id: 'pin-4',
    projectId: 'proj-1',
    title: 'Sprinkler Head Clearance Alert',
    xPercent: 21,
    yPercent: 75,
    type: 'punch',
    status: 'open',
    assigneeName: 'AquaFlow Commercial Plumbing',
    roomOrArea: 'Level 8 - North Restroom Core',
    description: 'Pendant sprinkler head is 2 inches too close to supply air diffuser blade.',
    createdDate: '2025-05-20'
  }
];

export const MOCK_FINANCING_DRAWS: FinancingDraw[] = [
  {
    id: 'draw-1',
    projectId: 'proj-1',
    drawNumber: 4,
    milestoneTitle: 'Level 8-10 Rough-in & Curtain Wall Phase 1',
    requestedAmount: 580000,
    approvedAmount: 580000,
    fundedAmount: 580000,
    status: 'Approved & Funded',
    requestDate: '2025-04-28',
    fundingDate: '2025-05-04',
    lenderName: 'JPMorgan Chase Commercial Real Estate',
    inspectorName: 'David Vance, PE (Bank Independent Inspector)',
    inspectionPassed: true
  },
  {
    id: 'draw-2',
    projectId: 'proj-1',
    drawNumber: 5,
    milestoneTitle: 'Level 11-12 Structural Deck & Mechanical Risers',
    requestedAmount: 640000,
    approvedAmount: 640000,
    fundedAmount: 0,
    status: 'In Lender Review',
    requestDate: '2025-05-18',
    lenderName: 'JPMorgan Chase Commercial Real Estate',
    inspectorName: 'David Vance, PE',
    inspectionPassed: true
  },
  {
    id: 'draw-3',
    projectId: 'proj-1',
    drawNumber: 6,
    milestoneTitle: 'Interior Drywall Framing & Elevator Core Staging',
    requestedAmount: 490000,
    approvedAmount: 0,
    fundedAmount: 0,
    status: 'Inspection Scheduled',
    requestDate: '2025-05-25',
    lenderName: 'JPMorgan Chase Commercial Real Estate'
  }
];

export const MOCK_LIEN_WAIVERS: LienWaiver[] = [
  {
    id: 'lien-1',
    projectId: 'proj-1',
    subcontractorName: 'Apex Concrete & Foundations',
    trade: 'Concrete & Foundation',
    amount: 145000,
    type: 'Progress Unconditional',
    status: 'Signed & Active',
    invoiceRef: 'INV-ACF-2025-08',
    dateSubmitted: '2025-05-10'
  },
  {
    id: 'lien-2',
    projectId: 'proj-1',
    subcontractorName: 'Titan Steel Erectors',
    trade: 'Structural Steel Framing',
    amount: 210000,
    type: 'Progress Conditional',
    status: 'Signed & Active',
    invoiceRef: 'INV-TSE-094',
    dateSubmitted: '2025-05-14'
  },
  {
    id: 'lien-3',
    projectId: 'proj-1',
    subcontractorName: 'Prime Electrical Solutions',
    trade: 'Electrical & Telecom',
    amount: 88500,
    type: 'Progress Conditional',
    status: 'Pending Signature',
    invoiceRef: 'INV-PES-4412',
    dateSubmitted: '2025-05-18'
  },
  {
    id: 'lien-4',
    projectId: 'proj-1',
    subcontractorName: 'Vortex Mechanical HVAC',
    trade: 'HVAC & Mechanical',
    amount: 112000,
    type: 'Progress Conditional',
    status: 'Action Required',
    invoiceRef: 'INV-VM-1082',
    dateSubmitted: '2025-05-19'
  }
];

export const MOCK_OPPORTUNITY_DEALS: OpportunityDeal[] = [
  {
    id: 'opp-1',
    clientName: 'Harborview Holdings LLC',
    projectTitle: 'Beacon Point Luxury Residences (Phase II)',
    projectType: 'Multi-Family',
    estimatedValue: 8400000,
    stage: 'Contract Negotiation',
    winProbability: 90,
    expectedStartDate: '2025-08-15',
    location: 'Boston Waterfront, MA'
  },
  {
    id: 'opp-2',
    clientName: 'Nextera Bioscience Campus',
    projectTitle: 'Cleanroom R&D Expansion Lab',
    projectType: 'Commercial',
    estimatedValue: 6200000,
    stage: 'Bid Submitted',
    winProbability: 75,
    expectedStartDate: '2025-09-01',
    location: 'Cambridge, MA'
  },
  {
    id: 'opp-3',
    clientName: 'Skyline Medical Group',
    projectTitle: 'Outpatient Surgical Center Fit-out',
    projectType: 'Commercial',
    estimatedValue: 3900000,
    stage: 'Estimating',
    winProbability: 60,
    expectedStartDate: '2025-10-15',
    location: 'Providence, RI'
  },
  {
    id: 'opp-4',
    clientName: 'Sterling Estate Developers',
    projectTitle: 'The Grove Custom Modern Villa',
    projectType: 'Custom Residential',
    estimatedValue: 2400000,
    stage: 'Lead',
    winProbability: 40,
    expectedStartDate: '2025-11-01',
    location: 'Greenwich, CT'
  }
];

export const MOCK_PROJECT_CHATS: ProjectChatMessage[] = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    channelId: 'general',
    senderId: 'usr_field',
    senderName: 'John Smith',
    senderRole: 'Field Superintendent',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    text: 'Good morning team. Ready-mix trucks for Level 12 deck are staging at Gate 2. Traffic control in place.',
    timestamp: '7:45 AM'
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    channelId: 'general',
    senderId: 'usr_pm',
    senderName: 'Sarah Johnson',
    senderRole: 'Project Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    text: 'Thanks John! City inspector Dave confirmed he will arrive by 11:30 AM for the mid-pour cylinder test pull.',
    timestamp: '8:12 AM'
  },
  {
    id: 'msg-3',
    projectId: 'proj-1',
    channelId: 'general',
    senderId: 'sub_prime',
    senderName: 'Carlos Rivera (Prime Electrical)',
    senderRole: 'Electrical Subcontractor',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'Underground telecom conduit pull completed. We are moving our 4-man crew up to Level 8 as planned.',
    timestamp: '9:30 AM'
  }
];

export const MOCK_CHANGE_ORDERS: ChangeOrder[] = [
  {
    id: 'co-1',
    projectId: 'proj-1',
    title: 'Upgrade Lobby Finishes to Premium Marble',
    description: 'Upgrade the flooring and wall finishes in the main lobby area from standard porcelain tiles to premium Carrera marble panels.',
    amount: 45000,
    timeImpact: 3,
    category: 'Finishes',
    requestedBy: 'Anderson Family Trust',
    status: 'Approved',
    createdDate: '2025-05-10'
  },
  {
    id: 'co-2',
    projectId: 'proj-1',
    title: 'HVAC Roof Platform Structural Reinforcement',
    description: 'Reinforce the structural support steel columns on the Level 14 roof deck to support the heavier dry cooler chilling units.',
    amount: 12500,
    timeImpact: 0,
    category: 'Structural',
    requestedBy: 'Lattice Engineering',
    status: 'Pending',
    createdDate: '2025-05-18'
  },
  {
    id: 'co-3',
    projectId: 'proj-2',
    title: 'Curtain Wall Acoustic Glazing Upgrade',
    description: 'Upgrade street-facing glazing on floors 2-6 to STC 42 acoustic laminated glass panels.',
    amount: 68000,
    timeImpact: 5,
    category: 'Glazing',
    requestedBy: 'Chicago Urban Dev',
    status: 'Approved',
    createdDate: '2025-06-02'
  },
  {
    id: 'co-4',
    projectId: 'proj-2',
    title: 'Emergency Generator Fuel Line Reroute',
    description: 'Reroute auxiliary diesel fuel lines to comply with revised city fire marshal setback codes.',
    amount: 18400,
    timeImpact: 0,
    category: 'MEP',
    requestedBy: 'AirTech Engineering',
    status: 'Pending',
    createdDate: '2025-06-15'
  },
  {
    id: 'co-5',
    projectId: 'proj-3',
    title: 'Clubhouse Foundation Soil Remediation',
    description: 'Import structural engineered fill and soil lime stabilization for the clubhouse pad.',
    amount: 32000,
    timeImpact: 2,
    category: 'Civil',
    requestedBy: 'Austin Land Holdings',
    status: 'Approved',
    createdDate: '2025-04-20'
  },
  {
    id: 'co-6',
    projectId: 'proj-4',
    title: 'Rooftop Infinity Pool Structural Waterproofing',
    description: 'Apply dual-membrane crystalline waterproofing system beneath the pool basin deck.',
    amount: 54000,
    timeImpact: 4,
    category: 'Finishes',
    requestedBy: 'Ocean Drive Partners',
    status: 'Approved',
    createdDate: '2025-03-12'
  },
  {
    id: 'co-7',
    projectId: 'proj-5',
    title: 'North Atrium Skylight Glazing Upgrade',
    description: 'Upgrade central mall atrium overhead skylights to high-efficiency Low-E laminated glass.',
    amount: 38000,
    timeImpact: 3,
    category: 'Finishes',
    requestedBy: 'Sazzad (GC Principal)',
    status: 'Approved',
    createdDate: '2025-05-14'
  },
  {
    id: 'co-8',
    projectId: 'proj-5',
    title: 'Food Hall Grease Trap & Plumbing Rerouting',
    description: 'Install high-capacity commercial grease interceptor and underground sanitary sewer line reroute.',
    amount: 16500,
    timeImpact: 0,
    category: 'Plumbing',
    requestedBy: 'City Environmental Services',
    status: 'Pending',
    createdDate: '2025-05-22'
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: 'evt-1',
    title: 'Rough',
    date: '2026-08-24',
    type: 'Inspection',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    priority: 'High',
    time: '10:00 AM',
    notes: 'City framing and MEP rough-in inspection'
  },
  {
    id: 'evt-2',
    title: 'Sold - Natus dolorem lorem',
    date: '2026-08-28',
    type: 'Milestone',
    projectId: 'proj-2',
    projectName: 'Natus dolorem lorem',
    priority: 'Urgent',
    time: '02:00 PM',
    notes: 'Client contract finalized and funded'
  },
  {
    id: 'evt-3',
    title: 'Sold - Sample 2',
    date: '2026-08-28',
    type: 'Milestone',
    projectId: 'proj-3',
    projectName: 'Sample 2 Residence',
    priority: 'High',
    time: '04:30 PM',
    notes: 'Permits cleared and initial deposit in escrow'
  },
  {
    id: 'evt-4',
    title: 'Foundation Pour Milestone',
    date: '2026-08-12',
    type: 'Milestone',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    priority: 'Urgent',
    time: '07:00 AM'
  },
  {
    id: 'evt-5',
    title: 'Plumbing Rough-in',
    date: '2026-08-18',
    type: 'Inspection',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    priority: 'High',
    time: '01:30 PM'
  },
  {
    id: 'evt-6',
    title: 'Cabinetry Delivery',
    date: '2026-08-21',
    type: 'Delivery',
    projectId: 'proj-2',
    projectName: 'Highland Luxury Villa',
    priority: 'Medium',
    time: '09:00 AM'
  },
  {
    id: 'evt-7',
    title: 'Owner Walkthrough Meeting',
    date: '2026-08-26',
    type: 'Meeting',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    priority: 'Medium',
    time: '11:00 AM'
  },
  {
    id: 'evt-8',
    title: 'Framing Start Date',
    date: '2026-08-05',
    type: 'Start Date',
    projectId: 'proj-3',
    projectName: 'Metro Logistics Warehouse',
    priority: 'High',
    time: '08:00 AM'
  }
];

export const MOCK_PROJECT_UPDATES: ProjectUpdate[] = [
  {
    id: 'upd-1',
    projectId: 'proj-1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Project Manager'
    },
    title: 'Framing Stage Signoff & City Inspection Prep',
    description: 'First floor structural wood framing and steel flitch beams completed. Pre-inspection walkthrough done. Building permit card posted on site.',
    timestamp: 'Today · 9:15 AM',
    type: 'progress',
    decisionNeeded: false,
    attachments: [
      { name: 'Framing-Inspection-Checklist.pdf', type: 'document' },
      { name: 'East-Elevation-Framed.jpg', type: 'photo' }
    ]
  },
  {
    id: 'upd-2',
    projectId: 'proj-1',
    author: {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Superintendent'
    },
    title: 'Exterior Stucco Finish & Cladding Color Confirmation',
    description: 'Sample boards installed on south wall. Need client/architect final signoff between Sherwin-Williams Alabaster vs Pure White before batch order.',
    timestamp: 'Yesterday · 3:45 PM',
    type: 'decision_needed',
    decisionNeeded: true,
    decisionText: 'Approve final exterior stucco tint sample (SW 7008 vs SW 7005)',
    decisionStatus: 'Pending',
    attachments: [
      { name: 'Stucco-Color-Mockup.jpg', type: 'photo' }
    ]
  },
  {
    id: 'upd-3',
    projectId: 'proj-1',
    author: {
      name: 'Michael Chang',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Finance Director'
    },
    title: 'Approved Change Order #04 (Kitchen Island Stone Upgrade)',
    description: 'Client approved $12,400 change order for Calacatta Gold waterfall island slab. Subcontractor purchase order issued.',
    timestamp: 'Sep 3, 2026',
    type: 'milestone',
    decisionNeeded: false
  },
  {
    id: 'upd-4',
    projectId: 'proj-1',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Field Lead'
    },
    title: 'Stem Wall Pour Complete & Thursday Weather Advisory',
    description: 'Foundation stem walls poured and finished. Putzmeister boom pump de-rigged. In light of Thursday heavy rain risk, patio slab pour shifted to Friday morning.',
    timestamp: 'Sep 2, 2026',
    type: 'progress',
    decisionNeeded: false,
    attachments: [
      { name: 'Stem-Wall-Pour-Inspection.jpg', type: 'photo' }
    ]
  }
];


