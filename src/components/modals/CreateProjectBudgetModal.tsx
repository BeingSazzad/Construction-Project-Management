import React, { useMemo, useState } from 'react';
import { X, DollarSign, ArrowLeft, Check, LayoutGrid, Layers, Plus } from 'lucide-react';
import { CostType, Project } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import {
  BUDGET_PRESET_CATEGORIES,
  COST_TYPES,
  CreatedBudgetPayload,
  PresetLineItem,
  allPresetItemIds,
  buildCategoriesFromSelection,
  countBudgetItems,
  flattenPresetLineItems,
  sumBudgetTotal,
} from '../../utils/budgetPresets';

interface CreateProjectBudgetModalProps {
  isOpen?: boolean;
  isFullScreenPage?: boolean;
  lockedProjectId?: string;
  onClose: () => void;
  projects: Project[];
  onCreateBudget: (budgetData: CreatedBudgetPayload) => void;
}

type Step = 'choose' | 'form';
type Method = 'blank' | 'preset';

const PRESET_ITEMS = flattenPresetLineItems();
const ALL_PRESET_IDS = allPresetItemIds();

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
  onClose,
  projects,
  onCreateBudget
}) => {
  const lockedProject = projects.find((p) => p.id === lockedProjectId);
  const [step, setStep] = useState<Step>('choose');
  const [method, setMethod] = useState<Method | null>(null);

  const [budgetName, setBudgetName] = useState(lockedProject?.name || '');
  const [budgetNumber, setBudgetNumber] = useState(`BUD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [projectType, setProjectType] = useState('Commercial Construction');
  const [preparedBy, setPreparedBy] = useState('Avery Scott');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(lockedProjectId || projects[0]?.id || 'proj-1');
  const [selectedIds, setSelectedIds] = useState<string[]>(ALL_PRESET_IDS);
  const [customItems, setCustomItems] = useState<PresetLineItem[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
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
  const isValid = budgetName.trim().length > 0 && method !== null && (method === 'blank' || itemsCount > 0);

  if (!isOpen && !isFullScreenPage) return null;

  const handleChoose = (next: Method) => {
    setMethod(next);
    if (next === 'preset') {
      setSelectedIds(ALL_PRESET_IDS);
    } else {
      setSelectedIds([]);
    }
    setStep('form');
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

  const handleAddCustom = () => {
    const name = customName.trim();
    if (!name || customQty <= 0) return;
    const category = BUDGET_PRESET_CATEGORIES.find((c) => c.id === customCategoryId);
    const estimatedCost = customQty * customRate;
    setCustomItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        code: `CUS-${String(prev.length + 1).padStart(3, '0')}`,
        name,
        type: customType,
        unit: customUnit,
        quantity: customQty,
        unitPrice: customRate,
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
      },
    ]);
    setCustomName('');
    setCustomQty(1);
    setCustomRate(0);
    setShowCustomForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !method) return;

    onCreateBudget({
      budgetName: budgetName.trim(),
      budgetNumber,
      projectType,
      preparedBy,
      description,
      projectId: lockedProjectId || selectedProjectId,
      method,
      categories,
      itemsCount,
      totalBudget,
    });
  };

  const inputClass =
    'w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF] transition-colors font-medium';

  const handleHeaderBack = () => {
    if (step === 'form') {
      setStep('choose');
      return;
    }
    onClose();
  };

  const chooseContent = (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-[#0F172A] tracking-tight">How do you want to start?</h2>
        <p className="text-xs text-[#64748B] mt-1">Line items for this project.</p>
      </div>

      <button
        type="button"
        onClick={() => handleChoose('blank')}
        className="w-full text-left p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#1677FF] hover:bg-[#F5F9FF] transition-all cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#0F172A]">Start blank</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Add custom line items.</p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => handleChoose('preset')}
        className="w-full text-left p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#1677FF] hover:bg-[#F5F9FF] transition-all cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#0F172A]">Use presets</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Pick from the job-cost catalog.</p>
          </div>
        </div>
      </button>
    </div>
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
            <input
              type="number"
              min={0}
              value={customQty}
              onChange={(e) => setCustomQty(Number(e.target.value))}
              className={inputClass}
              placeholder="Qty"
            />
            <input
              type="number"
              min={0}
              value={customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              className={inputClass}
              placeholder="Unit cost"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setShowCustomForm(false)} className="btn-modal-cancel">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={!customName.trim()}
              className={`btn-modal-submit ${!customName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Add item
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCustomForm(true)}
          className="h-11 rounded-xl border border-dashed border-[#CBD5E1] text-[#1677FF] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F5F9FF] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Custom item
        </button>
      )}
    </div>
  );

  const presetPicker = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#0F172A]">Preset items</label>
        <span className="text-[11px] font-medium text-[#64748B]">
          {itemsCount} items · {formatMoney(totalBudget)}
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
          {method === 'preset' ? 'Use presets' : 'Start blank'}
        </span>
        <button
          type="button"
          onClick={() => setStep('choose')}
          className="text-[11px] font-semibold text-[#1677FF] cursor-pointer"
        >
          Change
        </button>
      </div>

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Budget Number</label>
          <input
            type="text"
            value={budgetNumber}
            onChange={(e) => setBudgetNumber(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project Type</label>
          <CustomSelect
            value={projectType}
            onChange={setProjectType}
            options={['Commercial Construction', 'Custom Residential', 'Multi-Family Rehab', 'Tenant Improvement']}
            size="md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project</label>
          {lockedProject ? (
            <div className={`${inputClass} flex items-center text-[#0F172A]`}>
              {lockedProject.name}
            </div>
          ) : (
            <CustomSelect
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              options={projects.map(p => ({ value: p.id, label: `${p.name} (${p.cityState})` }))}
              size="md"
            />
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Prepared By</label>
          <input
            type="text"
            placeholder="Avery Scott"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {method === 'preset' ? presetPicker : customEditor}

      <div>
        <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Notes</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional scope notes"
          rows={2}
          className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3 text-[#0F172A] text-xs outline-none focus:border-[#1677FF] resize-none font-medium leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] gap-3">
        <button
          type="button"
          onClick={handleHeaderBack}
          className="btn-modal-cancel flex-1"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={!isValid}
          className={`btn-modal-submit flex-1 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Save items</span>
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
                Add line items
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
                {step === 'choose' ? 'Blank or presets' : method === 'preset' ? 'Select catalog items' : 'Add custom items'}
              </p>
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
                Add line items
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
                {step === 'choose' ? 'Blank or presets' : method === 'preset' ? 'Select catalog items' : 'Add custom items'}
              </p>
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
