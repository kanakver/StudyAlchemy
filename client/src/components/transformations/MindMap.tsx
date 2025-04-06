import { useEffect, useState } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MiniMap,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MindMap as MindMapType, MindMapNode, MindMapEdge } from "@shared/schema";

interface MindMapProps {
  mindMap: MindMapType;
  options: Record<string, any>;
  onRegenerate: () => void;
}

// Custom node component
const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-4 py-2 rounded-md shadow-md text-center ${
      data.isRoot 
        ? 'bg-primary text-white' 
        : data.level === 1 
          ? 'bg-primary/20 border border-primary/30' 
          : 'bg-white border border-gray-200'
    }`}>
      <div className="text-sm font-medium">{data.label}</div>
    </div>
  );
};

export default function MindMap({ mindMap, options, onRegenerate }: MindMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layout, setLayout] = useState(options.layout || 'horizontal');

  // Set up node types
  const nodeTypes = {
    custom: CustomNode,
  };

  // Process the mind map data into ReactFlow format
  useEffect(() => {
    if (!mindMap || !mindMap.nodes || !mindMap.edges) {
      return;
    }

    // Find the root node (node with no parent)
    const rootNode = mindMap.nodes.find(node => !node.parentId);
    
    // Process nodes
    const flowNodes = mindMap.nodes.map((node: MindMapNode) => {
      // Determine node level (root, first level, second level)
      const isRoot = !node.parentId;
      const level = isRoot ? 0 : 
        mindMap.nodes.find(n => n.id === node.parentId)?.parentId ? 2 : 1;

      return {
        id: node.id,
        type: 'custom',
        position: node.position || { x: 0, y: 0 },
        data: { 
          label: node.text,
          isRoot,
          level 
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    // Process edges
    const flowEdges = mindMap.edges.map((edge: MindMapEdge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: false,
      style: { stroke: '#d1d5db' },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [mindMap, setNodes, setEdges]);

  if (!mindMap || !mindMap.nodes || !mindMap.edges) {
    return <div className="text-center p-4">No mind map generated</div>;
  }

  return (
    <div className="mind-map-container">
      <div className="reactflow-wrapper h-[500px] border border-gray-200 rounded-lg overflow-hidden mb-6">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
