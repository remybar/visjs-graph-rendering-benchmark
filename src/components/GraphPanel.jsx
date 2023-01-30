import { useEffect, useRef } from "react";
import { Network } from "vis-network";

export const GraphPanel = ({
  settings,
  optionsRef,
  onStartDrawing,
  onEndDrawing,
  onStartStab,
  onEndStab,
}) => {
  const graphRef = useRef(null);

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
    return ids.map((x) => ({ id: x, name: `Node ${x + 1}` }));
  };

  /**
   * Generate the list of links
   */
  const generateLinks = () => {
    const ids = _range(0, settings.numOfNodes).slice(0, settings.numOfLinks);

    return ids.map((x) => {
      const to = random(settings.numOfNodes);
      return {
        from: x,
        to: to === x ? random(settings.numOfNodes) : to,
      };
    });
  };

  /**
   * build the graph
   */
  const buildGraph = () => {
    const start = performance.now();
    const nodes = generateNodes();
    const edges = generateLinks();

    const physics = {
      repulsion: {
        centralGravity: 0.2,
        springLength: 200,
        springConstant: 0.05,
        nodeDistance: 100,
        damping: 0.09,
      },
      solver: "forceAtlas2Based",

      stabilization: {
        iterations: 100,
        updateInterval: 500000,
      },
    };
    const options = {
      edges: {
        smooth: {
          type: "continuous",
        },
      },
      nodes: {
        shapeProperties: {
          interpolation: false,
        },
      },
      layout: {
        randomSeed: 0,
        improvedLayout: settings.numOfNodes <= 100,
      },
      configure: { enabled: true, container: optionsRef.current },
      physics,
    };

    console.log("graph generation:", performance.now() - start);

    const network = new Network(
      graphRef.current,
      {
        nodes: nodes,
        edges: edges,
      },
      options
    );

    network.on("beforeDrawing", () => {
      onStartDrawing(performance.now());
    });
    network.on("afterDrawing", () => {
      onEndDrawing(performance.now());
    });

    network.on("startStabilizing", () => {
      onStartStab(performance.now());
    });
    network.on("stabilized", () => {
      onEndStab(performance.now());
    });
  };

  useEffect(buildGraph, [graphRef, settings]);

  return <div ref={graphRef} className="h-screen w-full"></div>;
};
