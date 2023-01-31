import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export const ControlPanel = ({
  settings,
  onSettingsChanged,
  optionsRef,
  drawTime,
  stabTime,
}) => {
  const [selectedLib, setSelectedLib] = useState("visjs");
  const [numOfNodes, setNumOfNodes] = useState(settings.numOfNodes);
  const [numOfLinks, setNumOfLinks] = useState(settings.numOfLinks);
  const [collapsed, setCollapsed] = useState(false);

  const onNumOfNodesChanged = (e) => {
    setNumOfNodes(e.target.value);
  };

  const onNumOfLinksChanged = (e) => {
    setNumOfLinks(e.target.value);
  };

  const onValidate = () => {
    onSettingsChanged({
      numOfNodes: parseInt(numOfNodes),
      numOfLinks: parseInt(numOfLinks),
      lib: selectedLib,
    });
  };

  const toogle = () => setCollapsed(!collapsed);

  return (
    <div className="h-screen w-full flex flex-col p-2 bg-gray-100">
      <h2 className="font-bold text-lg mb-2 bg-gray-600 px-2 text-white">
        Controls
      </h2>
      <div className="flex flex-col my-2">
        <label className="font-semibold text-sm py-1">Library</label>
        <div
          className="flex flex-row justify-evenly"
          onChange={(e) => setSelectedLib(e.target.value)}>
          <div className="flex flex-row px-4 space-x-4">
            <input
              type="radio"
              id="visjs"
              name="visjs"
              value="visjs"
              checked={selectedLib === "visjs"}
            />
            <label>visjs</label>
          </div>
          <div className="flex flex-row px-4 space-x-4">
            <input
              type="radio"
              id="d3"
              name="d3"
              value="d3"
              checked={selectedLib === "d3"}
            />
            <label>d3</label>
          </div>
        </div>
      </div>
      <div className="flex flex-col my-2">
        <label className="font-semibold text-sm py-1">Number of nodes</label>
        <input
          type="number"
          className="border border-slate-200 p-1"
          value={numOfNodes}
          min="1"
          max="100000"
          onChange={onNumOfNodesChanged}
        />
      </div>
      <div className="flex flex-col my-2">
        <label className="font-semibold text-sm py-1">Number of links</label>
        <input
          type="number"
          className="border border-slate-200 p-1"
          value={numOfLinks}
          min="0"
          max="100000"
          onChange={onNumOfLinksChanged}
        />
      </div>
      <button
        type="button"
        onClick={onValidate}
        className="p-2 bg-green-500 my-2 hover:bg-green-700 active:bg-blue-500 text-white font-bold rounded">
        Validate
      </button>
      <div className="flex flex-col my-2 mt-8 flex-wrap">
        <h2 className="bg-gray-600 px-2 text-white font-bold text-lg mb-2 ">
          Traces
        </h2>
        <div className="flex flex-col p-2">
          <div className="flex flex-row justify-between">
            <label>Drawing time:</label>
            <code>{drawTime >= 0 ? `${drawTime} ms` : "..."}</code>
          </div>
          <div className="flex flex-row justify-between">
            <label> Stabilizing time:</label>{" "}
            <code>{stabTime >= 0 ? `${stabTime} ms` : "..."}</code>
          </div>
        </div>
      </div>
      <div className="flex flex-col my-2 mt-8 flex-wrap">
        <div className="flex flex-row justify-between bg-gray-600 px-2 text-white font-bold text-lg mb-2 ">
          <h2>Lib Options</h2>
          {collapsed ? (
            <ChevronDownIcon className="w-4" onClick={toogle} />
          ) : (
            <ChevronUpIcon className="w-4" onClick={toogle} />
          )}
        </div>
        <div className={`${!collapsed && "hidden"}`} ref={optionsRef}></div>
      </div>
    </div>
  );
};
