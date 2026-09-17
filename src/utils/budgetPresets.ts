import { MOCK_BUDGET_CATEGORIES } from '../data/mockData';
import { CostItem, CostType, Project, TradeCategory } from '../types';

export type BudgetCreateMethod = 'blank' | 'preset';

export interface PresetLineItem extends CostItem {
  categoryId: string;
  categoryName: string;
  groupCode: string;
  groupName: string;
}

export interface CreatedBudgetPayload {
  budgetName: string;
  budgetNumber: string;
  projectType: string;
  preparedBy: string;
  description: string;
  projectId: string;
  method: BudgetCreateMethod;
  categories: TradeCategory[];
  itemsCount: number;
  totalBudget: number;
}

export interface CreatedBudgetRecord {
  id: string;
  name: string;
  subtitle: string;
  projectId?: string;
  type: 'Project linked' | 'Standalone budget';
  totalBudget: number;
  itemsCount: number;
  status: 'DRAFT';
  categories: TradeCategory[];
  budgetNumber: string;
  projectType: string;
  preparedBy: string;
  method: BudgetCreateMethod;
}

export interface BudgetBreakdownItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
  total: number;
  code?: string;
}

export interface BudgetBreakdownSection {
  id: string;
  name: string;
  category: string;
  items: BudgetBreakdownItem[];
}

export const BUDGET_PRESET_CATEGORIES: TradeCategory[] = MOCK_BUDGET_CATEGORIES;

export const COST_TYPES: CostType[] = ['Labor', 'Materials', 'Equipment', 'Subcontractor', 'Vendor'];

export function flattenPresetLineItems(
  categories: TradeCategory[] = BUDGET_PRESET_CATEGORIES
): PresetLineItem[] {
  return categories.flatMap((cat) =>
    cat.costCodes.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        categoryId: cat.id,
        categoryName: cat.name,
        groupCode: group.code,
        groupName: group.name,
      }))
    )
  );
}

export function allPresetItemIds(
  categories: TradeCategory[] = BUDGET_PRESET_CATEGORIES
): string[] {
  return flattenPresetLineItems(categories).map((item) => item.id);
}

export type BudgetPackId = 'residential' | 'commercial' | 'remodel';

export interface BudgetJobPack {
  id: BudgetPackId;
  name: string;
  blurb: string;
  itemIds: string[];
}

export const BUDGET_JOB_PACKS: BudgetJobPack[] = [
  {
    id: 'residential',
    name: 'Residential',
    blurb: 'Site, concrete, MEP, finishes',
    itemIds: ['ci-1', 'ci-2', 'ci-3', 'ci-4', 'ci-5', 'ci-6', 'ci-7', 'ci-8', 'ci-9', 'ci-11', 'ci-12', 'ci-14', 'ci-15', 'ci-16', 'ci-17', 'ci-18', 'ci-19', 'ci-20'],
  },
  {
    id: 'commercial',
    name: 'Commercial',
    blurb: 'Full job-cost catalog',
    itemIds: allPresetItemIds(),
  },
  {
    id: 'remodel',
    name: 'Remodel',
    blurb: 'MEP, finishes, logistics',
    itemIds: ['ci-11', 'ci-12', 'ci-14', 'ci-15', 'ci-16', 'ci-17', 'ci-18', 'ci-19', 'ci-20'],
  },
];

function zeroedItem(item: CostItem, id: string): CostItem {
  return {
    ...item,
    id,
    committedCost: 0,
    actualCost: 0,
    paidCost: 0,
    remaining: item.estimatedCost,
    variance: 0,
  };
}

function recountCategory(cat: TradeCategory): TradeCategory {
  const costCodes = cat.costCodes.map((group) => {
    const estimatedCost = group.items.reduce((sum, it) => sum + it.estimatedCost, 0);
    return {
      ...group,
      estimatedCost,
      actualCost: 0,
      committedCost: 0,
      variance: 0,
    };
  });
  return {
    ...cat,
    costCodes,
    estimatedCost: costCodes.reduce((sum, g) => sum + g.estimatedCost, 0),
    actualCost: 0,
    committedCost: 0,
  };
}

export function buildCategoriesFromSelection(
  selectedIds: string[],
  customItems: PresetLineItem[] = [],
  catalog: TradeCategory[] = BUDGET_PRESET_CATEGORIES
): TradeCategory[] {
  const selected = new Set(selectedIds);
  const byId = new Map<string, TradeCategory>();

  catalog.forEach((cat) => {
    const costCodes = cat.costCodes
      .map((group) => {
        const items = group.items
          .filter((item) => selected.has(item.id))
          .map((item) => zeroedItem(item, `new-${item.id}`));
        if (items.length === 0) return null;
        return { ...group, items };
      })
      .filter((group): group is NonNullable<typeof group> => group !== null);

    if (costCodes.length === 0) return;
    byId.set(cat.id, recountCategory({ ...cat, costCodes }));
  });

  customItems.forEach((item, index) => {
    const catalogCat = catalog.find((c) => c.id === item.categoryId);
    let cat = byId.get(item.categoryId);
    if (!cat) {
      cat = {
        id: item.categoryId,
        name: item.categoryName || catalogCat?.name || 'Custom',
        icon: catalogCat?.icon || 'Layers',
        estimatedCost: 0,
        actualCost: 0,
        committedCost: 0,
        costCodes: [],
      };
    }

    const customCode = `${item.categoryId}-CUS`;
    const nextItem = zeroedItem(item, item.id || `custom-${index}`);
    const existingGroup = cat.costCodes.find((g) => g.code === customCode);
    const costCodes = existingGroup
      ? cat.costCodes.map((g) =>
          g.code === customCode ? { ...g, items: [...g.items, nextItem] } : g
        )
      : [
          ...cat.costCodes,
          {
            code: customCode,
            name: 'Custom items',
            estimatedCost: 0,
            actualCost: 0,
            committedCost: 0,
            variance: 0,
            items: [nextItem],
          },
        ];

    byId.set(item.categoryId, recountCategory({ ...cat, costCodes }));
  });

  return catalog
    .map((cat) => byId.get(cat.id))
    .filter((cat): cat is TradeCategory => Boolean(cat))
    .concat([...byId.values()].filter((cat) => !catalog.some((c) => c.id === cat.id)));
}

export function recountLedgerCategory(cat: TradeCategory): TradeCategory {
  const costCodes = cat.costCodes.map((group) => {
    const estimatedCost = group.items.reduce((sum, it) => sum + it.estimatedCost, 0);
    const actualCost = group.items.reduce((sum, it) => sum + it.actualCost, 0);
    const committedCost = group.items.reduce((sum, it) => sum + it.committedCost, 0);
    return {
      ...group,
      estimatedCost,
      actualCost,
      committedCost,
      variance: estimatedCost - actualCost,
    };
  });
  return {
    ...cat,
    costCodes,
    estimatedCost: costCodes.reduce((sum, g) => sum + g.estimatedCost, 0),
    actualCost: costCodes.reduce((sum, g) => sum + g.actualCost, 0),
    committedCost: costCodes.reduce((sum, g) => sum + g.committedCost, 0),
  };
}

/** Edit a single line item budget amount (after preset or custom create). */
export function updateItemEstimateInLedger(
  categories: TradeCategory[],
  itemId: string,
  estimatedCost: number
): TradeCategory[] {
  const next = Math.max(0, estimatedCost);
  return categories.map((cat) => {
    let hit = false;
    const costCodes = cat.costCodes.map((group) => {
      const items = group.items.map((item) => {
        if (item.id !== itemId) return item;
        hit = true;
        const qty = item.quantity > 0 ? item.quantity : 1;
        return {
          ...item,
          estimatedCost: next,
          unitPrice: next / qty,
          remaining: Math.max(0, next - item.actualCost),
          variance: next - item.actualCost,
        };
      });
      return { ...group, items };
    });
    return hit ? recountLedgerCategory({ ...cat, costCodes }) : cat;
  });
}

/** Remove a line item; drop empty groups/categories and recount totals. */
export function removeItemFromLedger(
  categories: TradeCategory[],
  itemId: string
): TradeCategory[] {
  return categories
    .map((cat) => {
      let hit = false;
      const costCodes = cat.costCodes
        .map((group) => {
          const items = group.items.filter((item) => {
            if (item.id !== itemId) return true;
            hit = true;
            return false;
          });
          return { ...group, items };
        })
        .filter((group) => group.items.length > 0);
      if (!hit) return cat;
      if (costCodes.length === 0) return null;
      return recountLedgerCategory({ ...cat, costCodes });
    })
    .filter((cat): cat is TradeCategory => cat !== null);
}

export function applyExpenseToLedger(
  categories: TradeCategory[],
  categoryKey: string,
  amount: number
): TradeCategory[] {
  return categories.map((cat) => {
    if (cat.id !== categoryKey && cat.name !== categoryKey) return cat;
    if (!cat.costCodes.length) {
      return { ...cat, actualCost: cat.actualCost + amount };
    }
    let applied = false;
    const costCodes = cat.costCodes.map((group) => {
      if (applied || !group.items.length) return group;
      applied = true;
      const items = group.items.map((item, index) => {
        if (index > 0) return item;
        const actualCost = item.actualCost + amount;
        const paidCost = item.paidCost + amount;
        return {
          ...item,
          actualCost,
          paidCost,
          remaining: Math.max(0, item.estimatedCost - actualCost),
          variance: item.estimatedCost - actualCost,
        };
      });
      return { ...group, items };
    });
    return recountLedgerCategory({ ...cat, costCodes });
  });
}

export function mergeProjectLedger(
  existing: TradeCategory[],
  incoming: TradeCategory[]
): TradeCategory[] {
  if (!existing.length) return incoming;
  const byId = new Map(existing.map((cat) => [cat.id, cat]));
  incoming.forEach((cat) => {
    const prev = byId.get(cat.id);
    if (!prev) {
      byId.set(cat.id, cat);
      return;
    }
    const groupMap = new Map(prev.costCodes.map((group) => [group.code, group]));
    cat.costCodes.forEach((group) => {
      const prevGroup = groupMap.get(group.code);
      if (!prevGroup) {
        groupMap.set(group.code, group);
        return;
      }
      const have = new Set(prevGroup.items.map((item) => item.id));
      groupMap.set(group.code, {
        ...prevGroup,
        items: [...prevGroup.items, ...group.items.filter((item) => !have.has(item.id))],
      });
    });
    byId.set(cat.id, recountLedgerCategory({ ...prev, costCodes: [...groupMap.values()] }));
  });
  const order = [
    ...existing.map((cat) => cat.id),
    ...incoming.map((cat) => cat.id).filter((id) => !existing.some((cat) => cat.id === id)),
  ];
  return order.map((id) => byId.get(id)).filter((cat): cat is TradeCategory => Boolean(cat));
}

export function countBudgetItems(categories: TradeCategory[]): number {
  return categories.reduce(
    (sum, cat) => sum + cat.costCodes.reduce((inner, group) => inner + group.items.length, 0),
    0
  );
}

export function sumBudgetTotal(categories: TradeCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
}

export function cloneLedger(categories: TradeCategory[]): TradeCategory[] {
  return JSON.parse(JSON.stringify(categories)) as TradeCategory[];
}

/** Roll ledger category totals into project.budget (line items = only budget source). */
export function withSyncedBudget(project: Project, categories: TradeCategory[]): Project {
  const total = categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
  const committed = categories.reduce((sum, cat) => sum + cat.committedCost, 0);
  const actual = categories.reduce((sum, cat) => sum + cat.actualCost, 0);
  const paid = categories.reduce(
    (sum, cat) =>
      sum +
      cat.costCodes.reduce(
        (gSum, group) => gSum + group.items.reduce((iSum, item) => iSum + item.paidCost, 0),
        0
      ),
    0
  );
  return {
    ...project,
    budget: {
      ...project.budget,
      total,
      committed,
      actual,
      paid,
      remaining: Math.max(0, total - actual),
      variance: total - actual,
      costToComplete: Math.max(0, total - actual),
    },
  };
}

export function categoriesToBreakdownSections(
  categories: TradeCategory[]
): BudgetBreakdownSection[] {
  return categories.map((cat, idx) => ({
    id: cat.id,
    name: `${idx + 1}. ${cat.name}`,
    category: cat.name,
    items: cat.costCodes.flatMap((group) =>
      group.items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.quantity,
        unit: item.unit,
        unitCost: item.unitPrice,
        total: item.estimatedCost,
        code: item.code,
      }))
    ),
  }));
}

export function payloadToCreatedBudget(data: CreatedBudgetPayload): CreatedBudgetRecord {
  return {
    id: `b-${data.projectId}`,
    name: data.budgetName,
    subtitle: `${data.method === 'preset' ? 'Preset items' : 'Custom items'} · ${data.budgetNumber}`,
    projectId: data.projectId,
    type: 'Project linked',
    totalBudget: data.totalBudget,
    itemsCount: data.itemsCount,
    status: 'DRAFT',
    categories: data.categories,
    budgetNumber: data.budgetNumber,
    projectType: data.projectType,
    preparedBy: data.preparedBy,
    method: data.method,
  };
}

export function projectToLedgerRecord(
  project: Project,
  categories: TradeCategory[]
): CreatedBudgetRecord {
  return {
    id: `b-${project.id}`,
    name: project.name,
    subtitle: project.location,
    projectId: project.id,
    type: 'Project linked',
    totalBudget: project.budget?.total || 0,
    itemsCount: countBudgetItems(categories),
    status: 'DRAFT',
    categories,
    budgetNumber: project.code,
    projectType: project.type || 'Commercial Construction',
    preparedBy: project.projectManager?.name || '',
    method: categories.length ? 'preset' : 'blank',
  };
}
