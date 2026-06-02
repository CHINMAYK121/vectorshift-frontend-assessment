import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { Zap } from 'lucide-react';

function App() {
  return (
    <div className="app">
      {/* ── Header ──────────────────────────── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">
            <Zap size={15} strokeWidth={2.5} />
          </div>
          <span className="app-header__title">VectorShift</span>
          <span className="app-header__sep">/</span>
          <span className="app-header__subtitle">Pipeline Builder</span>
        </div>
        <div className="app-header__actions">
          <SubmitButton />
        </div>
      </header>

      {/* ── Node Palette ────────────────────── */}
      <PipelineToolbar />

      {/* ── Canvas ──────────────────────────── */}
      <main className="app-canvas">
        <PipelineUI />
      </main>
    </div>
  );
}

export default App;
