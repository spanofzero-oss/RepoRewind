import { useState, useEffect } from 'react';

export default function SamaranWorkspace() {
  const [code, setCode] = useState("// Start typing. No branches, just time.");
  const [tag, setTag] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Replace with your actual Hugging Face Space API URL
  const API_URL = "https://your-huggingface-space-url.hf.space";

  const fetchTimeline = async () => {
    const res = await fetch(`${API_URL}/timeline`);
    const data = await res.json();
    setTimeline(data.lattice);
  };

  const handleSync = async () => {
    if (!code.trim()) return;
    await fetch(`${API_URL}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, tag })
    });
    setTag(""); // Clear the input like a sent message
    fetchTimeline();
  };

  useEffect(() => { fetchTimeline(); }, []);

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white font-sans">

      {/* Top Header */}
      <div className="flex justify-between items-center p-4 border-b border-neutral-800">
        <h1 className="font-bold text-lg text-neutral-300">⏳ Samaran</h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm bg-neutral-800 px-3 py-1 rounded hover:bg-neutral-700">
          {showHistory ? "Close History" : "View Timeline"}
        </button>
      </div>

      {/* Main Workspace Split */}
      <div className="flex flex-1 overflow-hidden">

        {/* Editor Area */}
        <div className="flex-1 flex flex-col p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent resize-none outline-none font-mono text-sm text-green-400"
            spellCheck="false"
          />

          {/* Action Bar (The "Text Message" Sync area) */}
          <div className="mt-4 flex bg-neutral-900 rounded-full p-2 border border-neutral-800">
            <input
              type="text"
              placeholder="Tag this moment... (e.g. 'fixed login')"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 bg-transparent px-4 outline-none text-sm"
            />
            <button
              onClick={handleSync}
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-neutral-200 transition">
              Sync
            </button>
          </div>
        </div>

        {/* History Sidebar (Slides in) */}
        {showHistory && (
          <div className="w-80 border-l border-neutral-800 bg-neutral-900 overflow-y-auto p-4 flex flex-col gap-3">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Immutable Ledger</h2>
            {[...timeline].reverse().map((state) => (
              <div
                key={state.id}
                onClick={() => setCode(state.code)}
                className="bg-neutral-800 p-3 rounded-lg cursor-pointer hover:border-green-500 border border-transparent transition">
                <div className="text-xs text-neutral-400">{state.time}</div>
                <div className="font-bold text-sm mt-1">{state.tag}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}