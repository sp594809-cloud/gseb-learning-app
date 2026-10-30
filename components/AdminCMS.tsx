'use client';

import React, { useState, useMemo } from 'react';
import { SolutionItem, VerificationStatus, Language, ImportReport } from '@/types/solution';
import {
  getAllSolutions,
  getAllChapters,
  getSolutionsByStatus,
} from '@/lib/content';
import {
  importGrokInventoryJson,
  importGrokInventoryCsv,
  importChatGPTVerifiedSolutionsJson,
  mergeGrokAndChatGPTSolutions,
} from '@/lib/importer';
import { validateKatexFormula } from '@/lib/schema';
import { MathRenderer, MixedText } from './MathRenderer';
import {
  ShieldCheck,
  Upload,
  FileCheck,
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Database,
  Download,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface AdminCMSProps {
  lang: Language;
  onClose: () => void;
  onPreviewSolution: (sol: SolutionItem) => void;
}

export function AdminCMS({ lang, onClose, onPreviewSolution }: AdminCMSProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'import' | 'audit' | 'preview'>('inventory');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Import tab state
  const [importMode, setImportMode] = useState<'grok_json' | 'grok_csv' | 'chatgpt_json'>('chatgpt_json');
  const [importText, setImportText] = useState('');
  const [lastReport, setLastReport] = useState<ImportReport | null>(null);

  // Formula preview tab state
  const [previewFormula, setPreviewFormula] = useState('\\int x \\sin(x) \\, dx = -x \\cos(x) + \\sin(x) + C');
  const [formulaCheck, setFormulaCheck] = useState<{ valid: boolean; error?: string }>({ valid: true });

  // Verification modal state
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifierName, setVerifierName] = useState('GSEB Maths Expert');
  const [verifierNotes, setVerifierNotes] = useState('');

  const solutions = getAllSolutions();
  const chapters = getAllChapters();

  // Filtered solutions for inventory tab
  const filteredSolutions = useMemo(() => {
    return solutions.filter((s) => {
      if (statusFilter !== 'all' && s.verificationStatus !== statusFilter) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.chapterNumber.includes(q) ||
        s.topic.en.toLowerCase().includes(q) ||
        s.topic.gu.toLowerCase().includes(q) ||
        s.originalQuestion.gu.toLowerCase().includes(q)
      );
    });
  }, [solutions, statusFilter, searchTerm]);

  // Inventory stats
  const stats = useMemo(() => {
    const counts: Record<VerificationStatus, number> = {
      missing: 0,
      draft: 0,
      needs_review: 0,
      verified: 0,
      published: 0,
    };
    for (const s of solutions) {
      if (counts[s.verificationStatus] !== undefined) {
        counts[s.verificationStatus]++;
      }
    }
    return counts;
  }, [solutions]);

  // Handle Import
  const handleExecuteImport = () => {
    if (!importText.trim()) return;

    if (importMode === 'grok_json') {
      const { report } = importGrokInventoryJson(importText);
      setLastReport(report);
    } else if (importMode === 'grok_csv') {
      const { report } = importGrokInventoryCsv(importText);
      setLastReport(report);
    } else if (importMode === 'chatgpt_json') {
      const { report } = importChatGPTVerifiedSolutionsJson(importText, solutions);
      setLastReport(report);
    }
  };

  const handleTestFormula = (formula: string) => {
    setPreviewFormula(formula);
    const res = validateKatexFormula(formula);
    setFormulaCheck(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* CMS Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {lang === 'gu' ? 'કન્ટેન્ટ મેનેજમેન્ટ સિસ્ટમ (CMS)' : 'Content Management System'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'gu'
                  ? 'ગ્રોક ક્વેશ્ચન ઇન્વેન્ટરી અને ચેટજીપીટી સોલ્યુશન્સ વેરિફિકેશન'
                  : 'Grok question inventories & ChatGPT verified solution lifecycle'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            {lang === 'gu' ? 'બંધ કરો ✕' : 'Close ✕'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex gap-2 text-xs font-semibold bg-slate-900/50">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'gu' ? 'પ્રશ્ન ઇન્વેન્ટરી' : 'Question Inventory'} ({solutions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'import'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'gu' ? 'ઇમ્પોર્ટ ડેટા (Grok/ChatGPT)' : 'Import Data'}</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{lang === 'gu' ? 'લાઇવ ફોર્મ્યુલા પ્રિવ્યુ' : 'Formula Preview'}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: INVENTORY & LIFECYCLE */}
          {activeTab === 'inventory' && (
            <div>
              {/* Lifecycle Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
                <button
                  onClick={() => setStatusFilter(statusFilter === 'published' ? 'all' : 'published')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    statusFilter === 'published' ? 'bg-indigo-950/60 border-indigo-500' : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Published</div>
                  <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">{stats.published}</div>
                </button>

                <button
                  onClick={() => setStatusFilter(statusFilter === 'verified' ? 'all' : 'verified')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    statusFilter === 'verified' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Verified</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{stats.verified}</div>
                </button>

                <button
                  onClick={() => setStatusFilter(statusFilter === 'needs_review' ? 'all' : 'needs_review')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    statusFilter === 'needs_review' ? 'bg-blue-950/60 border-blue-500' : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Needs Review</div>
                  <div className="text-xl font-bold text-blue-400 font-mono mt-0.5">{stats.needs_review}</div>
                </button>

                <button
                  onClick={() => setStatusFilter(statusFilter === 'draft' ? 'all' : 'draft')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    statusFilter === 'draft' ? 'bg-amber-950/60 border-amber-500' : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Draft</div>
                  <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{stats.draft}</div>
                </button>

                <button
                  onClick={() => setStatusFilter(statusFilter === 'missing' ? 'all' : 'missing')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    statusFilter === 'missing' ? 'bg-rose-950/60 border-rose-500' : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Missing Sol.</div>
                  <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">{stats.missing}</div>
                </button>
              </div>

              {/* Search in Inventory */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'gu' ? 'પ્રશ્ન ID, પ્રકરણ, અથવા લખાણ શોધો...' : 'Search question ID, chapter, topic...'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Solutions Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Chapter / Ex</th>
                      <th className="p-3">Topic / Question</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                    {filteredSolutions.map((sol) => (
                      <tr key={sol.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono text-indigo-300 font-bold">{sol.id}</td>
                        <td className="p-3 font-mono">
                          Ch {sol.chapterNumber} • {sol.exerciseNumber} Q{sol.questionNumber}
                        </td>
                        <td className="p-3 max-w-xs truncate">
                          <span className="font-semibold text-white block truncate">{sol.topic[lang]}</span>
                          <span className="text-slate-400 block truncate text-[11px]">{sol.originalQuestion.gu}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sol.verificationStatus === 'verified'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : sol.verificationStatus === 'needs_review'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : sol.verificationStatus === 'missing'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {sol.verificationStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onPreviewSolution(sol)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                          >
                            Preview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT GROK & CHATGPT DATA */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setImportMode('chatgpt_json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    importMode === 'chatgpt_json' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ChatGPT Verified Solutions (JSON)
                </button>
                <button
                  onClick={() => setImportMode('grok_json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    importMode === 'grok_json' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Grok Question Inventory (JSON)
                </button>
                <button
                  onClick={() => setImportMode('grok_csv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    importMode === 'grok_csv' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Grok Question Inventory (CSV)
                </button>
              </div>

              <textarea
                rows={10}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={
                  importMode === 'grok_csv'
                    ? 'id,chapter,exercise,question,question_gu,page\nch01-ex1.1-q01,1,1.1,1,"ગણ A પર...",15'
                    : '[\n  {\n    "id": "ch01-ex1.1-q01",\n    ...\n  }\n]'
                }
                className="w-full bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 rounded-xl p-4 focus:outline-hidden focus:border-indigo-500"
              />

              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400">
                  {lang === 'gu'
                    ? 'ડેટા અમાન્ય અથવા ડુપ્લિકેટ હોય તો વિગતવાર રિપોર્ટ મળશે (કોઈપણ ડેટા ગુપચુપ નષ્ટ થશે નહિ).'
                    : 'Formal validation runs on every item; duplicates and invalid formulas are diagnosed without silent discard.'}
                </div>
                <button
                  onClick={handleExecuteImport}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
                >
                  {lang === 'gu' ? 'ઇમ્પોર્ટ શરૂ કરો' : 'Execute Import & Validate'}
                </button>
              </div>

              {/* Import Report Diagnostics */}
              {lastReport && (
                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs space-y-2 mt-4">
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>Import Audit Report:</span>
                    <span className="font-mono text-slate-400 text-[10px]">{lastReport.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-center">
                    <div className="bg-slate-900/60 p-2 rounded">
                      <div className="text-slate-400 text-[10px]">Total Parsed</div>
                      <div className="font-bold text-white text-sm">{lastReport.totalParsed}</div>
                    </div>
                    <div className="bg-emerald-950/40 border border-emerald-800/50 p-2 rounded">
                      <div className="text-emerald-400 text-[10px]">Imported</div>
                      <div className="font-bold text-emerald-300 text-sm">{lastReport.importedCount}</div>
                    </div>
                    <div className="bg-blue-950/40 border border-blue-800/50 p-2 rounded">
                      <div className="text-blue-400 text-[10px]">Updated</div>
                      <div className="font-bold text-blue-300 text-sm">{lastReport.updatedCount}</div>
                    </div>
                    <div className="bg-rose-950/40 border border-rose-800/50 p-2 rounded">
                      <div className="text-rose-400 text-[10px]">Errors</div>
                      <div className="font-bold text-rose-300 text-sm">{lastReport.errors.length}</div>
                    </div>
                  </div>

                  {lastReport.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800 rounded-xl space-y-1">
                      <div className="font-bold text-rose-300">Errors Identified:</div>
                      {lastReport.errors.map((e, idx) => (
                        <div key={idx} className="text-rose-200 text-[11px]">
                          • [Item {e.itemIndex + 1}] {e.id ? `ID: ${e.id} ` : ''} {e.field ? `(${e.field}): ` : ''} {e.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {lastReport.warnings.length > 0 && (
                    <div className="mt-2 p-3 bg-amber-950/40 border border-amber-800 rounded-xl space-y-1">
                      <div className="font-bold text-amber-300">Warnings:</div>
                      {lastReport.warnings.map((w, idx) => (
                        <div key={idx} className="text-amber-200 text-[11px]">
                          • [Item {w.itemIndex + 1}] {w.id ? `ID: ${w.id} ` : ''} {w.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FORMULA & NOTEBOOK PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  LaTeX Formula Tester:
                </label>
                <input
                  type="text"
                  value={previewFormula}
                  onChange={(e) => handleTestFormula(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-sm text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {formulaCheck.valid ? (
                <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl">
                  <div className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
                    Rendered Mathematical Output:
                  </div>
                  <div className="bg-white text-slate-900 p-4 rounded-xl overflow-x-auto shadow-inner">
                    <MathRenderer math={previewFormula} block={true} />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs">
                  <div className="font-bold mb-1">KaTeX Parse Error:</div>
                  <div className="font-mono">{formulaCheck.error}</div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
