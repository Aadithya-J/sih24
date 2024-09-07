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
    position: { x: centerX, y: 0 },
    style: { 
      background: '#4136d6', 
      color: 'black', 
      border: '2px solid black',
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
    // Add random or staggered x-position to create flow
    const randomOffsetX = sectionIndex % 2 === 0 ? -150 : 150;

    // Main section node
    const mainNodeId = `main-${sectionIndex}`;
    newNodes.push({
      id: mainNodeId,
      position: { x: centerX + randomOffsetX, y: (sectionIndex + 1) * sectionSpacing },
      data: { label: section.name },
      style: { 
        background: '#d6d700', 
        color: 'black', 
        border: '2px solid black',
        padding: '15px',
        fontSize: '24px',
        borderRadius: '5px',
        width: 300,
        textAlign: 'center',
      },
    });

    // Connect main sections with curved edges
    newEdges.push({
      id: `edge-root-${mainNodeId}`,
      source: sectionIndex === 0 ? 'root' : `main-${sectionIndex - 1}`,
      target: mainNodeId,
      type: 'smoothstep', // Use curved edges
      animated: true,
      style: { stroke: '#333', strokeWidth: 2 }, // Increase width
      markerEnd: { type: MarkerType.ArrowClosed, color: '#333' },
    });

    // Subsection nodes
    section.subsections.forEach((subsection, subIndex) => {
      const subNodeId = `sub-${sectionIndex}-${subIndex}`;
      
      // Alternate left (-) and right (+) for subsection positions
      const distanceFromCenter = subsectionSpacing + 100; 
      const x = centerX + (subIndex % 2 === 0 ? -1 : 1) * distanceFromCenter + (subIndex % 2 === 0 ? 0 : 100);

      // Vary the y position to spread out the subsections
      const pairIndex = Math.floor(subIndex / 2);
      const y = pairIndex * subsectionSpacing + (sectionIndex + 1) * sectionSpacing;

      newNodes.push({
        id: subNodeId,
        position: { x, y },
        data: { label: subsection.name },
        style: { 
          background: '#f3c950', 
          color: 'black', 
          border: '2px solid black',
          padding: '10px',
          fontSize: '24px', 
          borderRadius: '5px',
          width: 200, 
          textAlign: 'center',
        },
      });

      // Add curved edges for subsections
      newEdges.push({
        id: `edge-${sectionIndex}-${subIndex}`,
        source: mainNodeId,
        target: subNodeId,
        type: 'smoothstep', // Use curved edges here too
        animated: true,
        style: { stroke: '#888', strokeWidth: 2 }, // Increase width
        markerEnd: { type: MarkerType.ArrowClosed, color: '#888' },
      });
    });            
  });

  setNodes(newNodes);
  setEdges(newEdges);
}, [setNodes, setEdges]);
