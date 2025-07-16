import {  useState } from "react";
import CustomDiagram from "./CustomDiagram";
import TaskMatrix from "./TaskMatrix";
import { computeDates } from "../utils/computeDates";

function addDebutEtFin(originalTasks) {
  const tasks = originalTasks.map((task) => ({
    ...task,
    anterieurs: [...task.anterieurs],
  }));
  const debut = { id: "DEB", nom: "Début", duree: 0, anterieurs: [] };
  const fin = { id: "FIN", nom: "Fin", duree: 0, anterieurs: [] };

  tasks.forEach((task) => {
    if (task.anterieurs.length === 0) task.anterieurs.push("DEB");
  });

  const temp = computeDates([debut, ...tasks]);
  const finaux = temp.filter((t) => t.successeurs.length === 0);
  fin.anterieurs = finaux.map((t) => t.id);

  return [debut, ...tasks, fin];
}

function assignLevelsAndPositions(tasks) {
  const map = Object.fromEntries(tasks.map((t) => [t.id, t]));
  const getLevel = (task, memo = {}) => {
    if (memo[task.id] !== undefined) return memo[task.id];
    if (!task.anterieurs.length) return (memo[task.id] = 0);
    return (memo[task.id] =
      1 + Math.max(...task.anterieurs.map((id) => getLevel(map[id], memo))));
  };

  const levels = {};
  tasks.forEach((t) => (levels[t.id] = getLevel(t)));

  const grouped = {};
  tasks.forEach((t) => {
    const lvl = levels[t.id];
    grouped[lvl] = grouped[lvl] || [];
    grouped[lvl].push(t.id);
  });

  const pos = {};
  const xSpace = 150,
    ySpace = 150;
  Object.entries(grouped).forEach(([level, ids]) => {
    ids.forEach((id, i) => {
      pos[id] = { x: level * xSpace, y: i * ySpace };
    });
  });
  return pos;
}

export default function GrapheMPM({
  initialTasks,
  isExample = false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const [positions, setPositions] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [revealedTot, setRevealedTot] = useState([]);
  const [revealedTard, setRevealedTard] = useState([]);
  const [revealedMarge, setRevealedMarge] = useState([]);
  const [revealedCritical, setRevealedCritical] = useState([]);

  const fullTasks = addDebutEtFin([...initialTasks]);
  const updatedTasks = computeDates([...fullTasks]);
  const autoPositions = assignLevelsAndPositions(updatedTasks);

  const handleMove = (id, pos) =>
    setPositions((prev) => ({ ...prev, [id]: pos }));

  const handleNextStep = () => {
    if (step === 3) {
      const next = [...revealedTot];
      const node = updatedTasks.find(
        (t) => !next.includes(t.id) && t.dateTot !== undefined
      );
      if (node) return setRevealedTot([...next, node.id]);
    } else if (step === 4) {
      const next = [...revealedTard];
      const node = [...updatedTasks]
        .reverse()
        .find((t) => !next.includes(t.id) && t.dateTard !== undefined);
      if (node) return setRevealedTard([...next, node.id]);
    } else if (step === 5) {
      const next = [...revealedMarge];
      const node = [...updatedTasks]
        .reverse()
        .find((t) => !next.includes(t.id) && t.marge !== undefined);
      if (node) return setRevealedMarge([...next, node.id]);
    } else if (step === 6) {
      const next = [...revealedCritical];
      const node = updatedTasks.find(
        (t) => !next.includes(t.id) && t.marge === 0
      );
      if (node) return setRevealedCritical([...next, node.id]);
    }

    if (step < 6) {
      setStep((s) => s + 1);
    }
  };

  const showArcs = !stepMode || step >= 2;
  const highlightCritical = !stepMode || step >= 6;

  return (
    <div className="mt-10">
      {!executed && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowOptions(true)}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Exécuter
          </button>
        </div>
      )}

      {showOptions && (
        <div className="text-center mt-4">
          <p>Choisissez le mode d'exécution :</p>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setExecuted(true);
                setLoading(false);
                setShowOptions(false);
              }, 1000);
            }}
            className="px-4 py-2 m-2 bg-blue-600 text-white rounded"
          >
            Afficher directement
          </button>
          <button
            onClick={() => {
              setStepMode(true);
              setExecuted(true);
              setShowOptions(false);
              setStep(1);
              setRevealedTot([]);
              setRevealedTard([]);
              setRevealedMarge([]);
              setRevealedCritical([]);
            }}
            className="px-4 py-2 m-2 bg-yellow-500 text-white rounded"
          >
            Affichage étape par étape
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center mt-4 italic text-gray-500">
          Calcul en cours...
        </div>
      )}

      <TaskMatrix
        tasks={initialTasks}
        hideSuccesseurs={!executed}
        onEdit={onEdit}
        onDelete={onDelete}
        useExample={isExample}
      />

      {executed && (
        <>
          {stepMode && step < 6 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-2 italic">
                {step === 1 && "Étape 1 : Affichage des successeurs"}
                {step === 2 && "Étape 2 : Construction du graphe"}
                {step === 3 && "Étape 3 : Dates au plus tôt (DEB → FIN)"}
                {step === 4 && "Étape 4 : Dates au plus tard (FIN → DEB)"}
                {step === 5 && "Étape 5 : Affichage des marges (FIN → DEB)"}
                {step === 6 && "Étape 6 : Chemin critique"}
              </p>
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Suivant
              </button>
            </div>
          )}

          {showArcs && (
            <svg style={{ position: "absolute", width: "100%", height: "100%" }}>
              {updatedTasks.map((task) =>
                task.successeurs?.map((succId) => {
                  const from = positions[task.id] || autoPositions[task.id];
                  const to = positions[succId] || autoPositions[succId];
                  if (!from || !to) return null;
                  const isCritical =
                    highlightCritical &&
                    task.marge === 0 &&
                    updatedTasks.find((t) => t.id === succId)?.marge === 0;
                  return (
                    <g key={`${task.id}->${succId}`}>
                      <line
                        x1={from.x + 50}
                        y1={from.y + 70}
                        x2={to.x + 50}
                        y2={to.y + 70}
                        stroke={isCritical ? "red" : "black"}
                        strokeWidth={isCritical ? 2 : 1}
                        markerEnd="url(#arrow)"
                      />
                      <text
                        x={(from.x + to.x) / 2 + 50}
                        y={(from.y + to.y) / 2 + 65}
                        fill={isCritical ? "red" : "black"}
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {task.duree}
                      </text>
                    </g>
                  );
                })
              )}
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="5"
                  refY="5"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="black" />
                </marker>
              </defs>
            </svg>
          )}

          <div style={{ position: "relative" }}>
            {updatedTasks.map((task) => (
              <CustomDiagram
                key={task.id}
                id={task.id}
                tot={
                  stepMode
                    ? revealedTot.includes(task.id)
                      ? task.dateTot
                      : null
                    : task.dateTot
                }
                tard={
                  stepMode
                    ? revealedTard.includes(task.id)
                      ? task.dateTard
                      : null
                    : task.dateTard
                }
                marge={
                  stepMode
                    ? revealedMarge.includes(task.id)
                      ? task.marge
                      : null
                    : task.marge
                }
                onMove={handleMove}
                initialPosition={positions[task.id] || autoPositions[task.id]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
