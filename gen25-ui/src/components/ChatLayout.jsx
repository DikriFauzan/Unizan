import RAGHitsPanel from './rag/RAGHitsPanel';
import React from 'react';

export default function ChatLayout({ children }) {
  const [provider, setProvider] = React.useState("Aries Superkey");

  return (
    <div className="chat-layout">
      <div className="top-bar">
        <span>Provider: <b>{provider}</b></span>
      </div>
      <div className="chat-container">
        {children}
      </div>
    </div>
  );
}
/* RAG panel toggle script (in component body) */
useEffect(() => {
  const btn = document.getElementById('feac-toggle-rag');
  if (!btn) return;
  const panel = document.createElement('div');
  panel.id = 'feac-rag-panel';
  panel.style.position = 'fixed';
  panel.style.right = '20px';
  panel.style.bottom = '80px';
  panel.style.zIndex = 9999;
  panel.style.display = 'none';
  document.body.appendChild(panel);

  btn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') {
      // render React component into panel (simple)
      import('./rag/RAGHitsPanel').then(mod => {
        const R = mod.default;
        const root = document.createElement('div');
        panel.innerHTML = '';
        panel.appendChild(root);
        // naive render using ReactDOM (assumes available)
        if (window.ReactDOM && window.React) {
          window.ReactDOM.render(window.React.createElement(R, { initialHits: window.__FEAC_LAST_RAG_HITS__||[] , onInsertContext: (c)=>{ window.__FEAC_LAST_RAG_HITS__ = c; } }), root);
        } else {
          root.innerText = 'RAG panel requires React/ReactDOM';
        }
      });
    }
  });

  return () => {
    btn.removeEventListener('click', ()=>{});
    const p = document.getElementById('feac-rag-panel');
    if (p) document.body.removeChild(p);
  };
}, []);
