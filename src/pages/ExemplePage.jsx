import { useState } from "react";
import GrapheMPM from "../components/GrapheMPM";
import FormAjoutTache from "../components/FormAjoutTache";

const initialExempleTasks = [
  { id: "A", nom: "A", duree: 8, anterieurs: [] },
  { id: "B", nom: "B", duree: 12, anterieurs: ["A"] },
  { id: "C", nom: "C", duree: 4, anterieurs: ["B"] },
  { id: "D", nom: "D", duree: 8, anterieurs: ["B"] },
  { id: "E", nom: "E", duree: 4, anterieurs: ["B"] },
  { id: "F", nom: "F", duree: 8, anterieurs: ["B"] },
  { id: "G", nom: "G", duree: 24, anterieurs: ["C", "D"] },
  { id: "H", nom: "H", duree: 20, anterieurs: ["E", "F", "G"] },
  { id: "I", nom: "I", duree: 12, anterieurs: ["C", "D"] },
  { id: "J", nom: "J", duree: 16, anterieurs: ["E", "F", "G"] },
  { id: "K", nom: "K", duree: 32, anterieurs: ["I", "J", "H"] },
  { id: "L", nom: "L", duree: 36, anterieurs: ["I", "J", "H"] },
];

export default function ExemplePage() {
  const [tasks, setTasks] = useState(initialExempleTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  const editTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setSelectedTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) =>
      prev
        .filter((task) => task.id !== taskId)
        .map((task) => ({
          ...task,
          anterieurs: task.anterieurs.filter((a) => a !== taskId),
        }))
    );
  };

  return (
    <>
      <FormAjoutTache
        addTask={(task) => setTasks((prev) => [...prev, task])}
        existingIds={tasks.map((t) => t.id)}
        allTasks={tasks}
        selectedTask={selectedTask}
        editTask={editTask}
        setSelectedTask={setSelectedTask}
      />
      <GrapheMPM
        initialTasks={tasks}
        isExample={true}
        onEdit={setSelectedTask}
        onDelete={deleteTask}
      />
    </>
  );
}
