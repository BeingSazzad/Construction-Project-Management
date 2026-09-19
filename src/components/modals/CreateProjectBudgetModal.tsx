import React, { useMemo, useState } from 'react';
import { X, DollarSign, ArrowLeft, Check, Plus } from 'lucide-react';
import { CostType, Project } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import { AddMethodChooser } from '../common/AddMethodChooser';
import {
  BUDGET_PRESET_CATEGORIES,
  BUDGET_JOB_PACKS,
  COST_TYPES,
  CreatedBudgetPayload,
  PresetLineItem,
  BudgetPackId,
  buildCategoriesFromSelection,
  countBudgetItems,
  flattenPresetLineItems,
  sumBudgetTotal,
} from '../../utils/budgetPresets';

interface CreateProjectBudgetModalProps {
  isOpen?: boolean;
  isFullScreenPage?: boolean;
  lockedProjectId?: string;
  initialPack?: BudgetPackId;
  /** Skip chooser and open directly on preset or blank form */
  initialMethod?: 'blank' | 'preset';
  onClose: () => void;
  projects: Project[];
  currentUser?: { name?: string; roleTitle?: string };
  onCreateBudget: (budgetData: CreatedBudgetPayload) => void;
}

type Step = 'choose' | 'form';
type Method = 'blank' | 'preset';

const PRESET_ITEMS = flattenPresetLineItems();

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

export const CreateProjectBudgetModal: React.FC<CreateProjectBudgetModalProps> = ({
  isOpen = true,
  isFullScreenPage = false,
  lockedProjectId,
  initialPack,
  initialMethod,
  onClose,
  projects,
  currentUser,
  onCreateBudget
}) => {
  const lockedProject = projects.find((p) => p.id === lockedProjectId);
  const startMethod: Method | null = initialMethod || (initialPack ? 'preset' : null);
  const [step, setStep] = useState<Step>(startMethod ? 'form' : 'choose');
  const [method, setMethod] = useState<Method | null>(startMethod);
  const [activePack, setActivePack] = useState<BudgetPackId>(initialPack || 'commercial');

  const [budgetName, setBudgetName] = useState(lockedProject?.name || '');
  const [budgetNumber, setBudgetNumber] = useState(`BUD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [projectType, setProjectType] = useState('Commercial Construction');
  const [preparedBy, setPreparedBy] = useState(currentUser?.name || 'Avery Scott');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(lockedProjectId || projects[0]?.id || 'proj-1');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (initialPack ? BUDGET_JOB_PACKS.find((p) => p.id === initialPack) : BUDGET_JOB_PACKS.find((p) => p.id === 'commercial'))?.itemIds || []
  );
  const [customItems, setCustomItems] = useState<PresetLineItem[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(startMethod === 'blank');
  const [customName, setCustomName] = useState('');
  const [customCategoryId, setCustomCategoryId] = useState(BUDGET_PRESET_CATEGORIES[0]?.id || 'cat-01');
  const [customType, setCustomType] = useState<CostType>('Materials');
  const [customUnit, setCustomUnit] = useState('EA');
  const [customQty, setCustomQty] = useState(1);
  const [customRate, setCustomRate] = useState(0);

  const categories = useMemo(
    () => buildCategoriesFromSelection(method === 'preset' ? selectedIds : [], customItems),
    [method, selectedIds, customItems]
  );
  const itemsCount = countBudgetItems(categories);
  const totalBudget = sumBudgetTotal(categories);

  if (!isOpen && !isFullScreenPage) return null;

  const handleChoose = (next: Method) => {
    setMethod(next);
    if (next === 'preset') {
      const pack = BUDGET_JOB_PACKS.find((p) => p.id === activePack) || BUDGET_JOB_PACKS[1];
      setSelectedIds(pack.itemIds);
      setShowCustomForm(false);
    } else {
      setSelectedIds([]);
      setShowCustomForm(true);
    }
    setStep('form');
  };

  const applyPack = (packId: BudgetPackId) => {
    const pack = BUDGET_JOB_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    setActivePack(packId);
    setSelectedIds(pack.itemIds);
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleCategory = (categoryId: string) => {
    const ids = PRESET_ITEMS.filter((item) => item.categoryId === categoryId).map((item) => item.id);
    const allOn = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) => {
      if (allOn) return prev.filter((id) => !ids.includes(id));
      return Array.from(new Set([...prev, ...ids]));
    });
  };

  const buildCustomDraft = (): PresetLineItem | null => {
    const name = customName.trim();
    if (!name || customQty <= 0) return null;
    const category = BUDGET_PRESET_CATEGORIES.find((c) => c.id === customCategoryId);
    const qty = Number(customQty) || 0;
    const rate = Number(customRate) || 0;
    const estimatedCost = Math.round(qty * rate * 100) / 100;
    const stamp = Date.now();
    return {
      id: `custom-${stamp}`,
      code: `CUS-${stamp.toString(36).toUpperCase().slice(-6)}`,
      name,
      type: customType,
      unit: customUnit,
      quantity: qty,
      unitPrice: rate,
      estimatedCost,
      committedCost: 0,
      actualCost: 0,
      paidCost: 0,
      remaining: estimatedCost,
      variance: 0,
      categoryId: customCategoryId,
      categoryName: category?.name || 'Custom',
      groupCode: 'CUSTOM',
      groupName: 'Custom items',
    };
  };

  const handleAddCustom = () => {
    const draft = buildCustomDraft();
    if (!draft) return;
    setCustomItems((prev) => [...prev, draft]);
    setCustomName('');
    setCustomQty(1);
    setCustomRate(0);
    setShowCustomForm(false);
  };

  const draftReady = Boolean(showCustomForm && customName.trim() && customQty > 0);
  const canSave =
    method !== null &&
    (Boolean(lockedProject) || budgetName.trim().length > 0) &&
    (method === 'blank'
      ? customItems.length > 0 || draftReady
      : selectedIds.length > 0 || customItems.length > 0 || draftReady);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || !method) return;

    const draft = buildCustomDraft();
    const items = draft ? [...customItems, draft] : customItems;
    const nextCategories = buildCategoriesFromSelection(
      method === 'preset' ? selectedIds : [],
      items
    );
    const nextCount = countBudgetItems(nextCategories);
    const nextTotal = sumBudgetTotal(nextCategories);
    if (nextCount === 0) return;

    onCreateBudget({
      budgetName: budgetName.trim() || lockedProject?.name || 'Project budget',
      budgetNumber,
      projectType,
      preparedBy,
      description,
      projectId: lockedProjectId || selectedProjectId,
      method,
      categories: nextCategories,
      itemsCount: nextCount,
      totalBudget: nextTotal,
    });
  };

  const inputClass =
    'w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF] transition-colors font-medium';

  const handleHeaderBack = () => {
    if (step === 'form' && !initialMethod) {
      setStep('choose');
      return;
    }
    onClose();
  };

  const chooseContent = (
    <AddMethodChooser
      onCustom={() => handleChoose('blank')}
      onImport={() => handleChoose('preset')}
    />
  );

  const customEditor = (
    <div className="flex flex-col gap-2">
      {customItems.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {customItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 py-2 border-b border-[#F1F5F9]">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] truncate">{item.name}</p>
                <p className="text-[10px] text-[#64748B]">{item.code} · {item.categoryName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-[#0F172A]">{formatMoney(item.estimatedCost)}</span>
                <button
                  type="button"
                  onClick={() => setCustomItems((prev) => prev.filter((row) => row.id !== item.id))}
                  className="text-[10px] font-semibold text-[#64748B] hover:text-[#E5484D] cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCustomForm ? (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#0F172A]">New item</p>
            <button
              type="button"
              onClick={() => {
                setCustomName('');
                setCustomQty(1);
                setCustomRate(0);
                setShowCustomForm(false);
              }}
              className="w-7 h-7 rounded-full text-[#64748B] hover:bg-[#E2E8F0] flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Item name"
            className={inputClass}
          />
          <CustomSelect
            value={customCategoryId}
            onChange={setCustomCategoryId}
            options={BUDGET_PRESET_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            size="md"
          />
          <div className="grid grid-cols-2 gap-2">
            <CustomSelect
              value={customType}
              onChange={(v) => setCustomType(v as CostType)}
              options={COST_TYPES}
              size="md"
            />
            <CustomSelect
              value={customUnit}
              onChange={setCustomUnit}
              options={['EA', 'LS', 'HRS', 'DAYS', 'LF', 'CY', 'TON', 'SF']}
              size="md"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-[#64748B] block mb-1">Qty</label>
              <input
                type="number"
                min={1}
                value={customQty}
                onChange={(e) => setCustomQty(Number(e.target.value))}
                className={inputClass}
                placeholder="Qty"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#64748B] block mb-1">Unit cost ($)</label>
              <input
                type="number"
                min={0}
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-[#64748B] font-medium">Line total</span>
            <span className="text-sm font-bold text-[#0F172A]">
              {formatMoney(Math.max(0, (Number(customQty) || 0) * (Number(customRate) || 0)))}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customName.trim() || customQty <= 0}
            className={`w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] transition-colors ${
              !customName.trim() || customQty <= 0
                ? 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed'
                : 'bg-[#EAF3FF] hover:bg-[#D6E9FF] text-[#1677FF] border border-[#1677FF]/20'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add item
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCustomForm(true)}
          className="h-11 rounded-xl border border-dashed border-[#CBD5E1] text-[#1677FF] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F5F9FF] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {customItems.length > 0 ? 'Add another item' : 'Add item'}
        </button>
      )}
    </div>
  );

  const presetPicker = (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-1.5">
        {BUDGET_JOB_PACKS.map((pack) => {
          const on = activePack === pack.id;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => applyPack(pack.id)}
              className={`px-2 py-2 rounded-xl border text-center cursor-pointer ${
                on
                  ? 'border-[#1677FF] bg-[#EAF3FF]'
                  : 'border-[#E2E8F0] bg-white hover:border-[#1677FF]/50'
              }`}
            >
              <span className={`text-[11px] font-semibold block ${on ? 'text-[#1677FF]' : 'text-[#0F172A]'}`}>
                {pack.name}
              </span>
              <span className="text-[10px] text-[#64748B] block mt-0.5">{pack.itemIds.length} items</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#0F172A]">Items</label>
        <span className="text-[11px] font-medium text-[#64748B]">
          {itemsCount} · {formatMoney(totalBudget)}
        </span>
      </div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-white max-h-[280px] overflow-y-auto">
        {BUDGET_PRESET_CATEGORIES.map((cat) => {
          const items = PRESET_ITEMS.filter((item) => item.categoryId === cat.id);
          const selectedCount = items.filter((item) => selectedIds.includes(item.id)).length;
          const allOn = selectedCount === items.length && items.length > 0;

          return (
            <div key={cat.id} className="border-b border-[#F1F5F9] last:border-b-0">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left hover:bg-[#F8FAFC] cursor-pointer"
              >
                <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  allOn ? 'bg-[#1677FF] border-[#1677FF]' : selectedCount > 0 ? 'bg-[#EAF3FF] border-[#1677FF]' : 'bg-white border-[#CBD5E1]'
                }`}>
                  {(allOn || selectedCount > 0) && <Check className={`w-3 h-3 stroke-[3] ${allOn ? 'text-white' : 'text-[#1677FF]'}`} />}
                </span>
                <span className="text-xs font-semibold text-[#0F172A] flex-1 truncate">{cat.name}</span>
                <span className="text-[10px] text-[#64748B] font-medium">{selectedCount}/{items.length}</span>
              </button>
              {items.map((item) => {
                const on = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full pl-10 pr-3 py-2 flex items-start gap-2.5 text-left hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      on ? 'bg-[#1677FF] border-[#1677FF]' : 'bg-white border-[#CBD5E1]'
                    }`}>
                      {on && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-[#0F172A] block leading-snug">{item.name}</span>
                      <span className="text-[10px] text-[#64748B]">{item.code} · {item.type} · {item.unit}</span>
                    </span>
                    <span className="text-xs font-semibold text-[#0F172A] shrink-0">{formatMoney(item.estimatedCost)}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      {customEditor}
    </div>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
          method === 'preset'
            ? 'text-[#1677FF] bg-[#EAF3FF] border border-[#1677FF]/20'
            : 'text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0]'
        }`}>
          {method === 'preset' ? 'Import' : 'Custom'}
        </span>
        {!initialMethod && (
        <button
          type="button"
          onClick={() => setStep('choose')}
          className="text-[11px] font-semibold text-[#1677FF] cursor-pointer"
        >
          Change
        </button>
        )}
      </div>

      {lockedProject ? (
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Project</p>
          <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{lockedProject.name}</p>
        </div>
      ) : (
        <>
          <div>
            <label className="text-xs font-semibold text-[#0F172A] mb-1 block">
              Budget Name <span className="text-[#E5484D]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              placeholder="e.g. Austin Commercial Center Master Budget"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project</label>
            <CustomSelect
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              options={projects.map(p => ({ value: p.id, label: `${p.name} (${p.cityState})` }))}
              size="md"
            />
          </div>
        </>
      )}

      {method === 'preset' ? presetPicker : customEditor}

      <div className="pt-4 border-t border-[#E2E8F0]">
        <button
          type="submit"
          disabled={!canSave}
          className={`w-full btn-modal-submit ${!canSave ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Save budget</span>
        </button>
      </div>
    </form>
  );

  const body = step === 'choose' ? chooseContent : formContent;

  if (isFullScreenPage) {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#0F172A] animate-fade-in bg-[#F7F9FC]">
        <div className="flex items-center justify-between">
          <button
            onClick={handleHeaderBack}
            className="flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'form' ? 'Back' : 'Back to Budgets'}</span>
          </button>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex flex-col text-[#0F172A]">
          <div className="pb-3 border-b border-[#E2E8F0] mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0F172A] tracking-tight">
                {step === 'choose' ? 'Add budget' : 'Add line items'}
              </h2>
            </div>
          </div>

          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] mx-auto bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-2xl flex flex-col text-[#0F172A] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                {step === 'choose' ? 'Add budget' : 'Add line items'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {body}
      </div>
    </div>
  );
};
