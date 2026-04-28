import React, { useState } from 'react';
import { useStore } from '../store/responseStore';
import { AIResponse } from '../types';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import ResponseEditor from './ResponseEditor';

export default function ResponseList() {
  const { responses, deleteResponse } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredResponses = responses.filter(r => 
    r.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setIsAdding(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this response?')) {
      deleteResponse(id);
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsAdding(true);
  };

  const closeEditor = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const showEditor = isAdding || editingId;

  return (
    <div className="flex flex-col gap-4 lg:gap-6 h-full min-h-0 relative">
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden min-h-0">
        <div className={`${showEditor ? 'lg:flex-[3] hidden lg:flex' : 'w-full flex'} bg-white border border-slate-200 rounded-xl flex-col h-full overflow-hidden transition-all duration-300`}>
          <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center bg-white shrink-0">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search intents..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-1.5 border border-slate-200 rounded-sm text-sm sm:text-xs focus:outline-none focus:border-primary bg-slate-50 transition-colors"
              />
            </div>
            <button 
              onClick={handleAddNew}
              className="px-4 py-2 bg-primary text-white text-xs sm:text-[10px] font-bold rounded-sm tracking-widest uppercase hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              + NEW RESPONSE
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="px-3 py-3 w-[300px]">Trigger</th>
                  <th className="px-3 py-3 w-[550px]">Preview</th>
                  <th className="px-3 py-3 w-[200px]">Target App</th>
                  <th className="px-3 py-3 w-[80px]">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500">
                      No responses found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((res) => {
                    const isActive = editingId === res.id;
                    const targetAppStr = (!res.targetApp || res.targetApp.length === 0 || res.targetApp.includes('All')) 
                      ? 'All' 
                      : res.targetApp.join(', ');
                    return (
                      <tr 
                        key={res.id} 
                        onClick={() => { setEditingId(res.id); setIsAdding(false); }}
                        className={`hover:bg-slate-50 cursor-pointer ${
                          isActive ? 'bg-primary-transparent hover:bg-slate-100 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
                        }`}
                      >
                        <td className="px-3 py-4">
                          <div className="font-bold text-xs text-slate-900">{res.intent}</div>
                          <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[300px]">
                            {res.keywords.join(', ')}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs text-slate-500 truncate max-w-[550px]">
                          {res.response}
                        </td>
                        <td className="px-3 py-4 text-xs text-slate-600 truncate max-w-[200px]" title={targetAppStr}>
                          {targetAppStr}
                        </td>
                        <td className="px-3 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            res.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 
                            res.status === 'draft' ? 'bg-slate-100 text-slate-600' : 
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={(e) => handleEdit(res.id, e)}
                              className="p-1.5 text-slate-400 hover:text-primary rounded-sm transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(res.id, e)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-sm transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showEditor && (
          <div className="flex-[2] h-full overflow-hidden shrink-0 w-full lg:w-auto min-w-0 lg:min-w-[300px] flex flex-col z-10 lg:z-auto absolute inset-0 lg:relative bg-slate-50 lg:bg-transparent">
            <ResponseEditor 
              responseId={editingId} 
              onClose={closeEditor} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
