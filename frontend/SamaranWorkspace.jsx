import { useState, useEffect } from 'react';

export default function SamaranWorkspace() {
  const [code, setCode] = useState("// Start typing. No branches, just time.");
  const [tag, setTag] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isViewingPast, setIsViewingPast] = useState(false);

  // Replace with your actual Hugging Face Space API URL
  const API_URL = "https://your-huggingface-space-url.hf.space"; 

  const fetchTimeline = async () => {
    try {
      const res = await fetch(`${API_URL}/timeline`);
      const data = await res.json();
      setTimeline(data.lattice);
    } catch (e) {
      console.error("Failed to fetch timeline", e);
    }
  };

  const handleSync = async () => {
    if (!code.trim()) return;
    await fetch(`${API_URL}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, tag })
    });
    setTag(""); 
    setIsViewingPast(false); // Reset to current state logic
    fetchTimeline();
  };

  useEffect(() => { fetchTimeline(); }, []);

  // --- The Stoplight Glow Logic ---
  const latestState = timeline.length > 0 ? timeline[timeline.length - 1] : null;
  let currentMode = 'green'; // Default to Synced/Safe
  
  if (isViewingPast) {
    currentMode = 'red'; // Danger/Past: Looking at history
  } else if (latestState && code !== latestState.code) {
    currentMode = 'yellow'; // Caution/Action: Unsynced edits
  }

  // Dynamic Tailwind classes for the LED wire effect
  const glowTheme = {
    green: "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]",
    yellow: "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]",
    red: "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]",
  };

  // Handle typing: instantly drops you out of "Viewing Past" mode and into "Yellow" edit mode
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (isViewingPast) setIsViewingPast(false);
  };

  // Handle rewinding time
  const handleRewind = (state) => {
    setCode(state.code);
    const isLatest = latestState && state.id === latestState.id;
    setIsViewingPast(!isLatest);
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white font-sans p-6 overflow-hidden">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="font-bold text-xl tracking-widest text-neutral-400">
          ⏳ SAMARAN <span className="text-xs uppercase text-neutral-600 ml-2">Kernel Interface</span>
        </h1>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm border border-neutral-700 bg-neutral-900 px-4 py-2 hover:bg-neutral-800 transition">
          {showHistory ? "CLOSE LEDGER" : "VIEW LEDGER"}
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Editor Area (The Glowing Window) */}
        <div className={`flex-1 flex flex-col p-6 bg-neutral-900 border-2 rounded-lg transition-all duration-300 ${glowTheme[currentMode]}`}>
          
          {/* Status Indicator Text */}
          <div className="text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            Status: 
            {currentMode === 'green' && <span className="text-green-500 font-bold">LATTICE SYNCED</span>}
            {currentMode === 'yellow' && <span className="text-yellow-400 font-bold">UNSYNCED EDITS</span>}
            {currentMode === 'red' && <span className="text-red-500 font-bold">VIEWING PAST STATE</span>}
          </div>

          <textarea
            value={code}
            onChange={handleCodeChange}
            className="flex-1 bg-transparent resize-none outline-none text-lg text-neutral-300 leading-relaxed"
            style={{ fontFamily: '"Courier New", Courier, monospace' }}
            spellCheck="false"
          />
          
          {/* Action Bar */}
          <div className="mt-4 flex gap-4">
            <input 
              type="text" 
              placeholder="Tag this sync..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 px-4 py-3 outline-none text-sm font-mono focus:border-yellow-500 transition"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            />
            <button 
              onClick={handleSync}
              className="bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-neutral-300 transition">
              Sync
            </button>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2 pl-1">Immutable Ledger</h2>
            {[...timeline].reverse().map((state) => {
              const isCurrentView = code === state.code && isViewingPast;
              return (
                <div 
                  key={state.id} 
                  onClick={() => handleRewind(state)}
                  className={`bg-neutral-900 p-4 border-l-4 cursor-pointer transition ${
                    isCurrentView ? "border-red-500 bg-neutral-800" : "border-neutral-700 hover:border-yellow-500"
                  }`}>
                  <div className="text-xs text-neutral-400 font-mono mb-1">{state.time}</div>
                  <div className="font-bold text-sm tracking-wide">{state.tag}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
