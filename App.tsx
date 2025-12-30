
import React, { useState, useEffect } from 'react';
import { HexagramView } from './components/HexagramView';
import { HEXAGRAMS, getHexByLines } from './constants';
import { LineType, HexagramData, DivinationResult } from './types';
import { getGeminiInterpretation, getDailyInsight } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'divine'>('learn');
  const [question, setQuestion] = useState('');
  const [divining, setDivining] = useState(false);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('加载中...');
  const [selectedHex, setSelectedHex] = useState<HexagramData>(HEXAGRAMS[0]);
  const [isAnimatingResult, setIsAnimatingResult] = useState(false);

  useEffect(() => {
    getDailyInsight().then(setDailyQuote);
  }, []);

  const performDivination = async () => {
    if (!question.trim()) {
      alert("请输入您想要问的问题。");
      return;
    }
    
    setDivining(true);
    setResult(null);
    setInterpretation('');
    setIsAnimatingResult(false);

    // Simulate tradition and processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newLines: LineType[] = [];
    const changing: number[] = [];
    
    for (let i = 0; i < 6; i++) {
      const roll = Math.floor(Math.random() * 4) + 6;
      if (roll === 7 || roll === 9) newLines.push(LineType.YANG);
      else newLines.push(LineType.YIN);
      
      if (roll === 6 || roll === 9) changing.push(i + 1);
    }

    const mainHex = getHexByLines(newLines)!;
    let changedHex: HexagramData | undefined;
    
    if (changing.length > 0) {
      const changedLines = newLines.map((l, idx) => 
        changing.includes(idx + 1) ? (l === LineType.YANG ? LineType.YIN : LineType.YANG) : l
      );
      changedHex = getHexByLines(changedLines);
    }

    const divResult = { originalHex: mainHex, changingLines: changing, changedHex };
    
    setDivining(false);
    setResult(divResult);
    setIsAnimatingResult(true);

    // AI Interpretation
    setLoadingAI(true);
    const interpret = await getGeminiInterpretation(question, divResult);
    setInterpretation(interpret);
    setLoadingAI(false);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">易经智慧</h1>
        <p className="text-stone-500 italic">"天行健，君子以自强不息；地势坤，君子以厚德载物。"</p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-2">今日易理</h2>
        <p className="text-stone-700 leading-relaxed font-serif">{dailyQuote}</p>
      </div>

      <div className="flex space-x-2 mb-8 bg-stone-200/50 p-1 rounded-xl">
        {[
          { id: 'learn', label: '卦象学习' },
          { id: 'divine', label: '问卜推演' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              activeTab === tab.id ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1">
        {activeTab === 'learn' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3 space-y-2 h-[600px] overflow-y-auto scroll-hide pr-2">
              {HEXAGRAMS.map(hex => (
                <button
                  key={hex.number}
                  onClick={() => setSelectedHex(hex)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                    selectedHex.number === hex.number 
                    ? 'border-stone-800 bg-stone-800 text-white' 
                    : 'border-transparent bg-white hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs opacity-60 w-6">#{hex.number}</span>
                    <span className="font-bold">{hex.name}</span>
                  </div>
                  <span className="text-lg opacity-80">{hex.symbol}</span>
                </button>
              ))}
            </div>
            
            <div className="md:col-span-9 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <HexagramView lines={selectedHex.lines} size="lg" />
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-4xl font-bold">{selectedHex.name}卦</h3>
                    <span className="text-stone-400 text-xl font-serif italic">{selectedHex.pinyin}</span>
                  </div>
                  <p className="text-stone-400 mb-6">{selectedHex.symbol} 六十四卦之第 {selectedHex.number} 卦</p>
                  
                  <div className="space-y-4">
                    <div className="bg-stone-50 p-4 rounded-xl">
                      <h4 className="font-bold text-stone-900 mb-1">【卦辞】</h4>
                      <p className="font-serif leading-relaxed text-lg">{selectedHex.judgment}</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl">
                      <h4 className="font-bold text-stone-900 mb-1">【象曰】</h4>
                      <p className="font-serif leading-relaxed">{selectedHex.image}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-stone-800 rounded-full"></span>
                  爻辞解析
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedHex.lineTexts.map((text, idx) => {
                    const reversedIdx = 5 - idx; // Display from Top to Bottom
                    const currentText = selectedHex.lineTexts[reversedIdx];
                    const isYang = selectedHex.lines[reversedIdx] === LineType.YANG;
                    
                    return (
                      <div key={reversedIdx} className="group flex gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${isYang ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
                          {reversedIdx + 1}
                        </div>
                        <div>
                          <p className="font-serif text-lg text-stone-800 leading-relaxed">{currentText}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-stone-500 uppercase tracking-widest">诚心所愿</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="在此输入您的疑惑。例如：关于目前事业变动的建议..."
                className="w-full p-6 rounded-3xl border border-stone-200 focus:ring-4 focus:ring-stone-100 focus:border-stone-800 outline-none h-40 resize-none transition-all text-xl font-serif bg-stone-50/50"
              />
              <button
                onClick={performDivination}
                disabled={divining || loadingAI}
                className={`w-full py-5 rounded-3xl font-bold text-xl text-white transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 ${
                  divining || loadingAI ? 'bg-stone-400' : 'bg-stone-900 hover:bg-stone-800 shadow-xl'
                }`}
              >
                {divining ? (
                  <><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> 正在通过大衍之数起卦...</>
                ) : loadingAI ? (
                  <><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> AI 正在参悟天机...</>
                ) : '诚心起卦'}
              </button>
            </div>

            {result && (
              <div className="space-y-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-stone-50 rounded-3xl border border-stone-200">
                  <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm relative overflow-hidden group">
                    <span className="text-xs text-stone-400 mb-4 uppercase tracking-[0.2em] font-bold">主卦：{result.originalHex.name}</span>
                    <HexagramView 
                      lines={result.originalHex.lines} 
                      changingLines={result.changingLines} 
                      size="md" 
                      isAnimating={isAnimatingResult}
                    />
                    <div className="mt-6 text-center">
                      <p className="text-2xl font-bold mb-1">{result.originalHex.name}卦</p>
                      <p className="text-stone-500 font-serif italic text-sm">{result.originalHex.judgment}</p>
                    </div>
                  </div>
                  
                  {result.changedHex && (
                    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border-l-4 border-l-red-100 transition-all duration-1000">
                      <span className="text-xs text-stone-400 mb-4 uppercase tracking-[0.2em] font-bold text-red-700">变卦：{result.changedHex.name}</span>
                      <HexagramView 
                        lines={result.changedHex.lines} 
                        size="md" 
                      />
                      <div className="mt-6 text-center">
                        <p className="text-2xl font-bold mb-1 text-red-900">{result.changedHex.name}卦</p>
                        <p className="text-stone-500 font-serif italic text-sm">{result.changedHex.judgment}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <span className="text-9xl font-bold font-serif">{result.originalHex.symbol}</span>
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="bg-stone-900 text-white p-2 rounded-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M12 21v-1m3.293-7.707l.707.707M12 12a3 3 0 110-6 3 3 0 010 6z" />
                      </svg>
                    </div>
                    智悟解析
                  </h4>

                  {loadingAI ? (
                    <div className="space-y-6">
                      <div className="h-6 bg-stone-100 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-stone-100 rounded-full w-full animate-pulse"></div>
                      <div className="h-4 bg-stone-100 rounded-full w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-stone-100 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="prose prose-stone max-w-none text-stone-800">
                      <div className="mb-6 p-4 border-l-4 border-stone-300 bg-stone-50 italic font-serif">
                        {result.changingLines.length > 0 ? (
                          result.changingLines.map(lineNum => (
                            <div key={lineNum} className="mb-2">
                              <span className="font-bold">爻辞：</span>
                              {result.originalHex.lineTexts[lineNum - 1]}
                            </div>
                          ))
                        ) : (
                          "此卦无变爻，请参详卦辞。"
                        )}
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed font-serif text-xl">
                        {interpretation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-stone-200 text-center text-stone-400">
        <div className="flex justify-center gap-4 mb-4">
          <span className="w-8 h-[1px] bg-stone-200 self-center"></span>
          <span className="font-serif">I CHING WISDOM</span>
          <span className="w-8 h-[1px] bg-stone-200 self-center"></span>
        </div>
        <p className="text-sm">由高级人工智能驱动的国学学习助手</p>
      </footer>
    </div>
  );
};

export default App;
