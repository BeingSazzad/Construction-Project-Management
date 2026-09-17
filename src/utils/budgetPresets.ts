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

export function countBudgetItems(categories: TradeCategory[]): number {
  return categories.reduce(
    (sum, cat) => sum + cat.costCodes.reduce((inner, group) => inner + group.items.length, 0),
    0
  );
}

export function sumBudgetTotal(categories: TradeCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
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
