import React, { useState } from 'react';
import { Project, PunchItem, Priority } from '../../types';
import { Button } from '../common/Button';
import { X, AlertCircle, MapPin, Camera, User as UserIcon } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreatePunchModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onCreate: (item: Partial<PunchItem>) => void;
}

export const CreatePunchModal: React.FC<CreatePunchModalProps> = ({
  isOpen,
  project,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Level 3 - Grid C-2');
  const [description, setDescription] = useState('');
  const [trade, setTrade] = useState('Concrete Solutions Inc.');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('2025-05-25');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title,
      location,
      description,
      priority,
      status: 'Open',
      dueDate,
      createdDate: 'May 20, 2025',
      projectId: project?.id || 'proj-1',
      assignedTo: {
        id: 'sub-1',
        name: trade,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trade
      },
      photos: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
      ]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[390px] bg-[#0E1524] border-cyan-500/40 p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A44] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Log Punch List Issue</h3>
              <p className="text-[10px] text-slate-400">{project?.name || 'Active Project'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-300 mb-1 block">Issue Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Honeycombing in concrete beam face"
              className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">Precise Grid Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">Defect Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe corrective remediation required..."
              className="w-full bg-[#111827] border border-[#23334F] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Responsible Trade</label>
              <CustomSelect
                value={trade}
                onChange={setTrade}
                options={[
                  { value: 'Concrete Solutions Inc.', label: 'Concrete Solutions' },
                  { value: 'Steel Masters LLC', label: 'Steel Masters' },
                  { value: 'Prime Electrical', label: 'Prime Electrical' },
                  { value: 'HVAC Leaders Group', label: 'HVAC Leaders' },
                  { value: 'Craft Drywall LLC', label: 'Craft Drywall' }
                ]}
                size="md"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Priority</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Log & Dispatch to Trade
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
