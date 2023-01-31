import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { forceSimulation } from "d3-force";
import * as d3 from "d3";

const NODE_BG_COLOR = "#9dc9fe";
const NODE_BORDER_COLOR = "#2186ee";

export const D3GraphPanel = ({
  settings,
  onStartDrawing,
  onEndDrawing,
  onStartStab,
  onEndStab,
}) => {
  const graphRef = useRef(null);
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  /**
   * Utility function to generate a range of numbers
   * @param {*} start first number
   * @param {*} stop last number
   * @param {*} step step between numbers
   */
  const _range = (start, stop, step = 1) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );

  /**
   * Generate a random value from 0 to max.
   */
  const random = (max) => Math.floor(Math.random() * max);

  /**
   * Generate the list of nodes
   */
  const generateNodes = () => {
    const ids = _range(0, settings.numOfNodes);
    return ids.map((x) => ({ id: x, r: 5, label: `Node ${x + 1}` }));
  };

  /**
   * Generate the list of links
   */
  const generateLinks = () => {
    const ids = _range(0, settings.numOfNodes).slice(0, settings.numOfLinks);

    return ids.map((x) => {
      const to = random(settings.numOfNodes);
      return {
        source: x,
        target: to === x ? random(settings.numOfNodes) : to,
      };
    });
  };

  /**
   *
   */
  const getSize = () => {
    if (width !== graphRef.current.clientWidth) {
      setWidth(graphRef.current.clientWidth);
    }
    if (height !== graphRef.current.clientHeight) {
      setHeight(graphRef.current.clientHeight);
    }
  };

  /**
   * build the graph
   */
  const buildGraph = () => {
    if (width && height) {
      const nodeData = generateNodes();
      const linkData = generateLinks();
      const zoom = d3.zoom().on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setK(k);
        setX(x);
        setY(y);
      });
      const container = d3.select(graphRef.current);
      container.call(zoom);

      const graph = container.select("g");
      graph.selectAll("*").remove();

      // add links to the graph
      const links = graph
        .selectAll("line")
        .data(linkData)
        .enter()
        .append("line")
        .attr("stroke", NODE_BORDER_COLOR);

      // add nodes to the graph
      const nodes = graph
        .selectAll("circle")
        .data(nodeData)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("fill", NODE_BG_COLOR)
        .attr("stroke", NODE_BORDER_COLOR)
        .attr("stroke-width", 1);

      // initialize simulation
      const simulation = d3
        .forceSimulation()
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("collision", d3.forceCollide(5))
        .force("link", d3.forceLink().distance(0).strength(1));

      const drag = (simulation) => {
        const dragstarted = (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        };

        const dragged = (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        };

        const dragended = (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        };

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      };
      nodes.call(drag(simulation));

      const updateGraph = () => {
        links
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      };

      simulation.nodes([...nodeData]).on("tick", updateGraph);
      simulation.force("link", d3.forceLink([...linkData]));

      return () => simulation.stop();
    }
  };

  useEffect(buildGraph, [graphRef, width, settings]);
  useLayoutEffect(getSize, []);

  return (
    <svg ref={graphRef} className="h-screen w-full">
      <g transform={`translate(${x},${y})scale(${k})`}></g>
    </svg>
  );
};
