from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for validation
class Node(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class Edge(BaseModel):
    id: str
    source: str
    target: str

class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Determines if the given pipeline graph is a Directed Acyclic Graph (DAG)
    using Depth First Search (DFS).
    
    Args:
        nodes: A list of Node objects representing vertices in the graph.
        edges: A list of Edge objects representing directed connections.
        
    Returns:
        bool: True if the graph contains no cycles and is a valid DAG, False otherwise.
    """
    # 1. Initialize adjacency lists for all defined nodes
    adj = {node.id: [] for node in nodes}
    
    # 2. Add directed edges to the adjacency list
    for edge in edges:
        adj[edge.source].append(edge.target)
            
    # 3. Recursion stack visited state:
    # 0 = unvisited, 1 = visiting, 2 = visited
    state = {node.id: 0 for node in nodes}
    
    def dfs_has_cycle(u: str) -> bool:
        state[u] = 1  # mark as visiting
        for v in adj[u]:
            if state[v] == 1:
                return True  # found a backward edge, cycle exists!
            if state[v] == 0:
                if dfs_has_cycle(v):
                    return True
        state[u] = 2  # mark as completely processed
        return False

    # 4. Check all components of the graph
    for node in nodes:
        if state[node.id] == 0:
            if dfs_has_cycle(node.id):
                return False  # Not a DAG
                
    return True  # Valid DAG

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    # Validate that all edges reference valid node IDs
    node_ids = {node.id for node in payload.nodes}
    for edge in payload.edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid edge '{edge.id}': References unknown node(s) (source: '{edge.source}', target: '{edge.target}')"
            )

    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_directed_acyclic = is_dag(payload.nodes, payload.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_directed_acyclic
    }
