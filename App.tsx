
import React, { useState, useEffect, useCallback } from 'react';
import { LucideClock, LucideCalendar, LucideCode, LucideExternalLink, LucideBell, LucideZap, LucideCheckCircle, LucideInfo, LucideBrainCircuit, LucideLayout, LucideList, LucideTarget } from 'lucide-react';
import { HOT_100, DIFFICULTY_COLORS } from './constants';
import { DailyState, Problem, NotificationConfig } from './types';
import Editor from './components/Editor';
import { getCodeReview, getProblemHints, getSimilarProblems } from './services/geminiService';

// 标签翻译映射
const TAG_MAP: Record<string, string> = {
  "Array": "数组",
  "Hash Table": "哈希表",
  "Linked List": "链表",
  "Math": "数学",
  "Recursion": "递归",
  "String": "字符串",
  "Sliding Window": "滑动窗口",
  "Binary Search": "二分查找",
  "Divide and Conquer": "分治",
  "Dynamic Programming": "动态规划",
  "Two Pointers": "双指针",
  "Greedy": "贪心",
  "Sorting": "排序",
  "Stack": "栈",
  "Tree": "树",
  "Depth-First Search": "深度优先搜索",
  "Breadth-First Search": "广度优先搜索",
  "Binary Tree": "二叉树",
  "Memoization": "记忆化"
};

const App: React.FC = () => {
  const [daily, setDaily] = useState<DailyState | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [hints, setHints] = useState<string>('');
  const [similarProbs, setSimilarProbs] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationConfig>({
    enabled: false,
    time: '09:00'
  });

  const getDailyProblem = useCallback(() => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % HOT_100.length;
    const problem = HOT_100[index];

    const saved = localStorage.getItem(`leetcode_daily_${dateString}`);
    if (saved) {
      setDaily(JSON.parse(saved));
    } else {
      const newState: DailyState = {
        date: dateString,
        problem: problem,
        status: 'todo',
        code: `/**\n * 题目: ${problem.title}\n * 日期: ${dateString}\n * 提示: 完成后记得点击“AI 辅助评估”获取改进建议。\n */\n\nfunction solution() {\n  // 在这里开始编写你的思路...\n}`
      };
      setDaily(newState);
      localStorage.setItem(`leetcode_daily_${dateString}`, JSON.stringify(newState));
    }
  }, []);

  useEffect(() => {
    getDailyProblem();
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setNotification(prev => ({ ...prev, enabled: true }));
    }
  }, [getDailyProblem]);

  const handleCodeChange = (newCode: string) => {
    if (!daily) return;
    const updated = { ...daily, code: newCode };
    setDaily(updated);
    localStorage.setItem(`leetcode_daily_${daily.date}`, JSON.stringify(updated));
  };

  const handleReview = async () => {
    if (!daily || isLoading) return;
    setIsLoading(true);
    setAiResponse('');
    const review = await getCodeReview(daily.problem.title, daily.code);
    setAiResponse(review || 'AI 评审失败，请检查网络后再试。');
    setIsLoading(false);
  };

  const handleHints = async () => {
    if (!daily || isLoading) return;
    setIsLoading(true);
    const h = await getProblemHints(daily.problem.title);
    setHints(h || '无法获取解题提示。');
    setIsLoading(false);
  };

  const handleSimilarProblems = async () => {
    if (!daily || isLoading) return;
    setIsLoading(true);
    const res = await getSimilarProblems(daily.problem.title, daily.problem.tags);
    setSimilarProbs(res || '未找到相关题目。');
    setIsLoading(false);
  };

  const handleMarkComplete = () => {
    if (!daily) return;
    const updated: DailyState = { ...daily, status: 'completed' };
    setDaily(updated);
    localStorage.setItem(`leetcode_daily_${daily.date}`, JSON.stringify(updated));
    alert('恭喜你！完成了今日挑战。继续保持！🎉');
  };

  const toggleNotification = async () => {
    if (!notification.enabled) {
      if (typeof Notification !== 'undefined') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotification(prev => ({ ...prev, enabled: true }));
          new Notification('每日刷题提醒', { body: '提醒已开启！每天早上 9 点我会准时提醒你进行算法挑战。' });
        }
      }
    } else {
      setNotification(prev => ({ ...prev, enabled: false }));
    }
  };

  if (!daily) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">正在准备今日挑战题目...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
              <LucideTarget className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              LeetCode <span className="text-orange-500">每日挑战</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleNotification}
               title="开启提醒"
               className={`p-2.5 rounded-full transition-all ${notification.enabled ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
             >
               <LucideBell className="w-5 h-5" />
             </button>
             <div className="hidden md:flex flex-col items-end border-l border-slate-200 pl-4 ml-2">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">TODAY</span>
               <span className="text-sm text-slate-700 font-bold">
                 {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
               </span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左侧：题目详情与 AI 辅助 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black border uppercase tracking-wider ${DIFFICULTY_COLORS[daily.problem.difficulty]}`}>
                  {daily.problem.difficulty === 'Easy' ? '简单' : daily.problem.difficulty === 'Medium' ? '中等' : '困难'}
                </span>
                <span className="text-slate-400 text-xs font-bold font-mono">ID: #{daily.problem.frontendId}</span>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                {daily.problem.title}
              </h2>
              
              <div className="flex flex-wrap gap-1.5 mb-8">
                {daily.problem.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md border border-slate-200">
                    {TAG_MAP[tag] || tag}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <a 
                  href={`https://leetcode.cn/problems/${daily.problem.titleSlug}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-4 bg-slate-900 hover:bg-slate-800 transition-all rounded-2xl text-white font-bold text-sm shadow-xl shadow-slate-200"
                >
                  <LucideExternalLink className="w-4 h-4" /> 
                  进入 LeetCode 官网练习
                </a>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleHints}
                    disabled={isLoading}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all rounded-2xl text-slate-700 font-bold text-xs disabled:opacity-50 group shadow-sm"
                  >
                    <LucideZap className="w-4 h-4 text-orange-500 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                    解题思路
                  </button>
                  <button 
                    onClick={handleSimilarProblems}
                    disabled={isLoading}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all rounded-2xl text-slate-700 font-bold text-xs disabled:opacity-50 group shadow-sm"
                  >
                    <LucideList className="w-4 h-4 text-blue-500 transition-transform group-hover:scale-125" />
                    类似题目
                  </button>
                </div>
              </div>

              {/* 思路提示展示 */}
              {hints && (
                <div className="mt-8 p-5 bg-orange-50/50 border border-orange-100 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-orange-700 font-black mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <LucideInfo className="w-3.5 h-3.5" /> 核心思路提示
                  </h3>
                  <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                    {hints}
                  </div>
                </div>
              )}

              {/* 类似题目展示 */}
              {similarProbs && (
                <div className="mt-6 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-blue-700 font-black mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <LucideList className="w-3.5 h-3.5" /> 相关题目推荐
                  </h3>
                  <div className="text-slate-600 text-sm prose prose-blue max-w-none prose-sm">
                    <div className="whitespace-pre-wrap leading-relaxed">{similarProbs}</div>
                  </div>
                </div>
              )}
            </div>

            {/* AI 评审卡片 */}
            {aiResponse && (
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-6 shadow-sm animate-in slide-in-from-bottom-6 duration-500">
                <h3 className="text-indigo-800 font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <LucideBrainCircuit className="w-5 h-5" /> AI 代码深度点评
                </h3>
                <div className="text-slate-700 text-sm prose prose-slate max-w-none prose-sm leading-relaxed">
                  <div className="whitespace-pre-wrap">{aiResponse}</div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：编辑器 */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm ring-1 ring-slate-900/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <LucideLayout className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-sm tracking-tight">代码草稿区</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drafting Space</p>
                  </div>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button 
                    onClick={handleReview}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'AI 正在分析...' : 'AI 辅助评估'}
                  </button>
                  <button 
                    onClick={handleMarkComplete}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${daily.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                  >
                    <LucideCheckCircle className={`w-4 h-4 ${daily.status === 'completed' ? 'text-emerald-500' : 'text-slate-300'}`} />
                    {daily.status === 'completed' ? '今日已达成' : '标记完成'}
                  </button>
                </div>
              </div>
              
              <Editor value={daily.code} onChange={handleCodeChange} />
              
              <div className="mt-5 flex items-start gap-3 text-[11px] text-slate-400 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                <LucideInfo className="w-4 h-4 text-blue-500 shrink-0" />
                <span>重要：此编辑器仅用于本地整理思路，无法运行代码。完成后请复制到 LeetCode 官网对应题目页进行最终提交与测试。</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 底部状态条 */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-fit px-4">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-full py-3 px-8 shadow-2xl flex items-center gap-8 text-[11px] text-slate-600 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-2.5">
            <LucideClock className="w-4 h-4 text-orange-500" />
            <span className="font-bold">提醒设定: <span className="text-slate-900">{notification.time}</span></span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2.5">
            <LucideCalendar className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-900 underline decoration-blue-200 decoration-2 underline-offset-4">连续练习: 12 天</span>
          </div>
          {daily.status === 'completed' && (
            <>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-black animate-bounce-short">
                <LucideCheckCircle className="w-4 h-4" />
                <span>任务达成</span>
              </div>
            </>
          )}
        </div>
      </footer>
      
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
