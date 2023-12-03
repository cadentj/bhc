import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";

const MARGIN = 150;

const Dendrogram = forwardRef(({ width, height, data, initialSection, color }, ref) => {
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const nodesRef = useRef(null);
  const edgesRef = useRef(null);
  const [revealedSections, setRevealedSections] = useState(new Set());

  useEffect(() => {
    const hierarchy = d3.hierarchy(data).sum((d) => d.value);
    const radius = Math.min(width, height) / 2 - MARGIN;

    const dendrogramGenerator = d3.cluster().size([360, radius]);
    const dendrogram = dendrogramGenerator(hierarchy);

    const nameToNodeMap = {};
    dendrogram.descendants().forEach((node) => {
      nameToNodeMap[node.data.name] = node;
    });


    const positionRadius = {
      1: radius * 0.50, // Close
      2: radius * 0.55, // Middle
      3: radius * 0.65// Far
    };
    const nodes = dendrogram.descendants().map((node) => {

      const isBossNode = node.depth === 0;
      const turnLabelUpsideDown = node.x > 180 || isBossNode;

      // Existing code...
      const angle = node.x - 90;
      const angleRadians = angle * (Math.PI / 180);

      // Calculate the angle adjustment factor
      let angleAdjustmentFactor = Math.cos(angleRadians);

      // Define the ranges for each quadrant
      const isTop = (angleRadians >= Math.PI / 3) && (angleRadians <= 2 * Math.PI / 3);
      const isBottom = (angleRadians >= 4 * Math.PI / 3) && (angleRadians <= 5 * Math.PI / 3);
      const isLeftOrRightSide = !isTop && !isBottom;

      // Adjust the radius accordingly
      const baseEndRadius = positionRadius[node.data.value] || radius;
      let adjustedEndRadius = baseEndRadius * (1 + angleAdjustmentFactor * 0.5);

      // Further adjustments for left/right and top/bottom positions
      if (isLeftOrRightSide) {
        adjustedEndRadius *= 0.5; // Reduce radius for left and right sides
      } else if (isTop || isBottom) {
        adjustedEndRadius *= 1.7; // Increase radius for top and bottom
      }

      // Calculate x and y, flipping the sign for right and bottom
      const x = adjustedEndRadius * Math.cos(angleRadians);
      const y = adjustedEndRadius * Math.sin(angleRadians);




      // Rest of the existing code...


      // Rest of the existing code...



      return (
        <g
          key={node.id}
          transform={isBossNode ? `translate(${0}, ${0})` : `translate(${x}, ${y})`}
          data-node={JSON.stringify(node.data)} // Store the entire data object
        >
          {/* <circle
            cx={0}
            cy={0}
            r={isBossNode ? 30 : 5}
            stroke="transparent"
            fill={isBossNode ? "white" : "#69b3a2"}
            style={{
              opacity: (isBossNode || node.data.section === initialSection) ? 1 : 0
            }}
          /> */}
          {isBossNode && <circle
            cx={0}
            cy={0}
            r={30}
            stroke="transparent"
            fill={"white"}
            style={{
              opacity: (isBossNode || node.data.section === initialSection) ? 1 : 0
            }}
          />}
          {/* Always render the label, but differentiate the boss node */}
          <text
            x={isBossNode ? 16 : (turnLabelUpsideDown ? -10 : 10)}
            y={isBossNode ? 15 : 0}
            fontSize={isBossNode ? "20px" : "12px"} // Bigger font size for boss node
            textAnchor={turnLabelUpsideDown ? "end" : "start"}
            alignmentBaseline="middle"
            fill={isBossNode ? color : color}
            style={{ opacity: (isBossNode || node.data.section === initialSection) ? 1 : 0, fontWeight: isBossNode ? "bold" : "normal" }}
          >
            {node.data.name}
          </text>
        </g>
      );
    });



    const calculateBendPoints = (dendrogram, positionRadius, radius) => {
      return dendrogram
        .descendants()
        .filter(node => node.depth > 0)
        .map(node => {
          const parentNode = node.parent;
          // const baseEndRadius = positionRadius[node.data.value] || radius;

          // Existing code...
          const angle = node.x - 90;
          const angleRadians = angle * (Math.PI / 180);

          // Calculate the angle adjustment factor
          let angleAdjustmentFactor = Math.cos(angleRadians);

          // Define the ranges for each quadrant
          const isTop = (angleRadians >= Math.PI / 3) && (angleRadians <= 2 * Math.PI / 3);
          const isBottom = (angleRadians >= 4 * Math.PI / 3) && (angleRadians <= 5 * Math.PI / 3);
          const isLeftOrRightSide = !isTop && !isBottom;

          // Adjust the radius accordingly
          const baseEndRadius = positionRadius[node.data.value] || radius;
          let adjustedEndRadius = baseEndRadius * (1 + angleAdjustmentFactor * 0.5);

          // Further adjustments for left/right and top/bottom positions
          if (isLeftOrRightSide) {
            adjustedEndRadius *= 0.5; // Reduce radius for left and right sides
          } else if (isTop || isBottom) {
            adjustedEndRadius *= 1.7; // Increase radius for top and bottom
          }
          
          const startX = parentNode.y * Math.cos((parentNode.x - 90) * (Math.PI / 180));
          const startY = parentNode.y * Math.sin((parentNode.x - 90) * (Math.PI / 180));


          // Calculate x and y, flipping the sign for right and bottom
          const endX = adjustedEndRadius * Math.cos(angleRadians);
          const endY = adjustedEndRadius * Math.sin(angleRadians);

          // // Calculate midpoint
          // const midX = (startX + endX) / 2;
          // const midY = (startY + endY) / 2;


      

          var min = 20;
          var max = 50;
          var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
          
          const midX = (startX + adjustedEndRadius * Math.cos(angleRadians)) / 2 + randomNumber;
          const midY = (startY + adjustedEndRadius * Math.sin(angleRadians)) / 2 + randomNumber;



          return { startX, startY, midX, midY, endX, endY, parentNode, node };
        });
    };



    const bendPoints = calculateBendPoints(dendrogram, positionRadius, radius);

    const linksGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBundle.beta(0.9)); // Adjust the curvature

    const edges = bendPoints.map((bp, i) => {
      // const pathData = [
      //   { x: bp.startX, y: bp.startY },
      //   { x: bp.midX, y: bp.midY },
      //   { x: bp.endX, y: bp.endY }
      // ];
      const pathData = [
        { x: bp.startX, y: bp.startY },
        { x: bp.midX, y: bp.midY },
        { x: bp.endX, y: bp.endY }
      ];

      const isEdgeRevealed = revealedSections.has(bp.node.data.section) || revealedSections.has(bp.parentNode.data.section);

      return (
        <path
          key={i}
          fill="none"
          stroke="#D3D3D3"
          d={linksGenerator(pathData)}
          style={{
            opacity: isEdgeRevealed ? 1 : 0
          }}
        />
      );
    });

    setAllNodes(nodes);  // Correctly set the nodes
    setAllEdges(edges);
  }, [data, width, height, revealedSections]);

  useEffect(() => {
    if (initialSection) {
      revealNodes(initialSection);
    }
  }, [initialSection]); // Depend on initialSection to reveal nodes on component mount

  const revealNodes = (sectionName) => {
    // Update revealed sections
    setRevealedSections(prev => new Set([...prev, sectionName]));

    // Select and style nodes of previously revealed sections
    d3.select(nodesRef.current).selectAll("g")
      .filter(function () {
        const nodeData = JSON.parse(this.getAttribute('data-node'));
        return revealedSections.has(nodeData.section) && nodeData.section !== sectionName;
      })
      .each(function () {
        // Transition for text
        d3.select(this).select("text")
          .transition()
          .style("fill", "grey")
          .style("font-size", "12px");

        // Transition for circle (if you have specific styles for circles)
        // d3.select(this).select("circle")
        //   .transition()
        //   .style("fill", "grey") // Replace with your desired style
        //   .attr("r", "5"); // Replace with your desired radius
      });


    // Reveal nodes of the current section
    const nodeSelection = d3.select(nodesRef.current).selectAll("g")
      .filter(function () {
        const nodeData = JSON.parse(this.getAttribute('data-node'));
        return nodeData.section === sectionName;
      });

    // nodeSelection.select("circle").transition().style("opacity", 1).style("fill", color).attr("r", 10);
    nodeSelection.select("text").transition().style("opacity", 1).style("fill", color).style("font-size", "16px"); // Ensure labels are visible
  };



  useImperativeHandle(ref, () => ({
    revealNodes,
  }));

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2 + MARGIN / 2}, ${height / 2 + MARGIN / 2})`}>
          <g ref={edgesRef}>{allEdges}</g>
          <g ref={nodesRef}>{allNodes}</g>
        </g>
      </svg>
    </div>
  );
});

export default Dendrogram;
