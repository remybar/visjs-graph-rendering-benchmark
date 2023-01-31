import { useState, useRef } from "react";
import { VisJsGraphPanel, D3GraphPanel, ControlPanel } from "./components";

const DEFAULT_NUMBER_OF_NODES = 10;
const DEFAULT_NUMBER_OF_LINKS = 8;
const DEFAULT_LIB = "visjs";

function App() {
  const optionsRef = useRef(null);
  const [settings, setSettings] = useState({
    numOfNodes: DEFAULT_NUMBER_OF_NODES,
    numOfLinks: DEFAULT_NUMBER_OF_LINKS,
    lib: DEFAULT_LIB,
  });
  const [drawStartTime, setDrawStartTime] = useState(0);
  const [stabStartTime, setStabStartTime] = useState(0);
  const [drawEndTime, setDrawEndTime] = useState(0);
  const [stabEndTime, setStabEndTime] = useState(0);

  const onSettingsChanged = (values) => {
    setSettings(values);
  };

  return (
    <div className="flex flex-row">
      <div className="basis-3/4">
        {settings.lib === "visjs" ? (
          <VisJsGraphPanel
            settings={settings}
            optionsRef={optionsRef}
            onStartDrawing={(value) => setDrawStartTime(value)}
            onEndDrawing={(value) => setDrawEndTime(value)}
            onStartStab={(value) => setStabStartTime(value)}
            onEndStab={(value) => setStabEndTime(value)}
          />
        ) : (
          <D3GraphPanel
            settings={settings}
            onStartDrawing={(value) => setDrawStartTime(value)}
            onEndDrawing={(value) => setDrawEndTime(value)}
            onStartStab={(value) => setStabStartTime(value)}
            onEndStab={(value) => setStabEndTime(value)}
          />
        )}
      </div>
      <div className="basis-1/4">
        <ControlPanel
          settings={settings}
          optionsRef={optionsRef}
          onSettingsChanged={onSettingsChanged}
          drawTime={drawEndTime - drawStartTime}
          stabTime={stabEndTime - stabStartTime}
        />
      </div>
    </div>
  );
}

export default App;
