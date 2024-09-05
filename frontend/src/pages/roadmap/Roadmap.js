import React, { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

async function getRoadmap(title){
    const response = await fetch('http://localhost:4000/roadmap/'+title);
    const data = await response.json();
    console.log("received data");
    return data;
}

function RoadmapContent() {
  const [title, setTitle] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState(null);
  const { fitView } = useReactFlow();

  const createRoadmapGraph = useCallback((roadmapData) => {
    const newNodes = [];
    const newEdges = [];

    const containerWidth = 800;
    const rootNodeWidth = 440;
    const centerX = (containerWidth - rootNodeWidth) / 2;

    // Add the root node (title)
    newNodes.push({ 
      id: 'root', 
      data: { label: roadmapData.title },
      position: { x: centerX-70, y: 0 },
      style: { 
        background: '#4CAF50', 
        color: 'white', 
        border: '1px solid #45a049',
        padding: '15px',
        fontSize: '30px',
        borderRadius: '5px',
        width: rootNodeWidth,
        textAlign: 'center',
      },
    });

    const sectionSpacing = 350;
    const subsectionSpacing = 180;

    roadmapData.sections.forEach((section, sectionIndex) => {
      // Main section node
      const mainNodeId = `main-${sectionIndex}`;
      newNodes.push({
        id: mainNodeId,
        position: { x: centerX, y: (sectionIndex + 1) * sectionSpacing },
        data: { label: section.name },
        style: { 
          background: '#6ede87', 
          color: '#333', 
          border: '1px solid #222',
          padding: '15px',
          fontSize: '24px',
          borderRadius: '5px',
          width: 300,
          textAlign: 'center',
        },
      });

      // Connect main sections
      newEdges.push({
        id: `edge-root-${mainNodeId}`,
        source: sectionIndex === 0 ? 'root' : `main-${sectionIndex - 1}`,
        target: mainNodeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#333' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#333' },
      });

      // Subsection nodes
      section.subsections.forEach((subsection, subIndex) => {
        const subNodeId = `sub-${sectionIndex}-${subIndex}`;
      
        // Calculate x position: same distance from center for left (-) and right (+)
        const distanceFromCenter = subsectionSpacing + 100; // Define the distance to be the same for both sides
        const x = centerX + (subIndex % 2 === 0 ? -1 : 1) * distanceFromCenter + (subIndex % 2 === 0 ? 0 : 100);// Ensure symmetry between left and right
        
        // Calculate y position: same for pairs (even/odd subIndex)
        const pairIndex = Math.floor(subIndex / 2);  // Every two nodes share the same y position
        const y = pairIndex * subsectionSpacing + (sectionIndex + 1) * sectionSpacing; 

        newNodes.push({
          id: subNodeId,
          position: { x, y },
          data: { label: subsection.name },
          style: { 
            background: '#ff9a8b', 
            color: '#333', 
            border: '1px solid #222',
            padding: '10px',
            fontSize: '24px', 
            borderRadius: '5px',
            width: 200, 
            textAlign: 'center',
          },
        });
      
        newEdges.push({
          id: `edge-${sectionIndex}-${subIndex}`,
          source: mainNodeId,
          target: subNodeId,
          type: 'straight',
          animated: true,
          style: { stroke: '#888' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#888' },
        });
      });            
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, includeHiddenNodes: false });
      }, 0);
    }
  }, [nodes, fitView]);

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: '#ecf0f1', borderBottom: '1px solid #bdc3c7' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter roadmap title"
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #3498db',
            marginRight: '10px',
            width: '300px',
          }}
        />
        <button 
          onClick={async () => {
            if (title.trim()) {
              try {
                const roadmapData = await getRoadmap(title);
                console.log('Received roadmap data:', roadmapData);
                createRoadmapGraph(roadmapData);
                setError(null);
              } catch (err) {
                console.error('Error fetching roadmap:', err);
                setError("Failed to fetch roadmap data. Please try again.");
              }
            } else {
              setError("Please enter a title");
            }
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Generate Roadmap
        </button>
      </div>
      {error && <div style={{ padding: '10px', color: 'white', background: '#e74c3c' }}>{error}</div>}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
          attributionPosition="bottom-left"
          minZoom={0.2}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll={true}
          panOnScrollSpeed={0.5}
          zoomOnScroll={false}
        >
          <Background color="#bdc3c7" gap={16} size={1} />
          <Controls style={{ bottom: 'auto', top: 20, right: 20 }} /> 
        </ReactFlow>
      </div>
    </div>
  );
}

function Roadmap() {
  return (
    <ReactFlowProvider>
      <RoadmapContent />
    </ReactFlowProvider>
  );
}

export default Roadmap;