# VectorShift Technical Assessment - Action Plan

This plan outlines the step-by-step tasks to complete the VectorShift Technical Assessment.

---

## Roadmap

### 📦 Part 1: Node Abstraction & Expansion
- [ ] Create `BaseNode` abstraction in `frontend/src/nodes/BaseNode.js` to unify visual wrapper, titles, headers, delete buttons, and handles.
- [ ] Refactor existing nodes (`inputNode.js`, `llmNode.js`, `outputNode.js`, `textNode.js`) to use `BaseNode`.
- [ ] Implement **5 new custom nodes**:
  1. `TimerNode`: Configures triggers/delays.
  2. `AuthNode`: Handles authentication tokens.
  3. `RequestNode`: Fires HTTP queries.
  4. `DatabaseNode`: Configures DB connections.
  5. `TextTemplateNode`: Standard template builder.
- [ ] Register new nodes in `frontend/src/ui.js` and add them to `frontend/src/toolbar.js` draggable list.

### 🎨 Part 2: Premium Styling & Visual Polish
- [ ] Import "Outfit" or "Inter" typography from Google Fonts.
- [ ] Inject dark-mode styling variables (obsidian backgrounds, glassmorphism card panels, glowing states) into `frontend/src/index.css`.
- [ ] Style the toolbar, toolbar nodes, ReactFlow controls, connection lines, and canvas.
- [ ] Design high-fidelity, glowing handles and node hover states.

### 📝 Part 3: Text Node Auto-Resize & Variable Parsing
- [ ] Swap Text Node input with a `<textarea>` in `textNode.js`.
- [ ] Implement auto-resizing height & width based on text scroll height.
- [ ] Code a regex variable parser to match double curly brackets: `{{ variableName }}`.
- [ ] Dynamically generate and vertically space custom handles on the left side corresponding to the variables.

### 🔌 Part 4: Backend Integration & DAG Check
- [ ] Set up `CORSMiddleware` in `backend/main.py`.
- [ ] Convert `pipelines/parse` endpoint to a standard Pydantic JSON `POST` handler.
- [ ] Implement DFS/topological sort cycle checking to validate if the graph is a DAG.
- [ ] Update `frontend/src/submit.js` to send current nodes & edges to the backend.
- [ ] Replace standard browser alert with a customized, gorgeous modal overlay to present results.

---

## How to Run the Servers

### 🐍 Backend (FastAPI)
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

### ⚛️ Frontend (React)
```bash
cd frontend
npm start
```
