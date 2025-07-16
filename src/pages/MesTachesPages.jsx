    import { useState } from "react";
import FormAjoutTache from "../components/FormAjoutTache";
import GrapheMPM from "../components/GrapheMPM";

export default function MesTachesPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTask = (task) => setTasks((prev) => [...prev, task]);

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
    <div>
      <FormAjoutTache
        addTask={addTask}
        existingIds={tasks.map((t) => t.id)}
        allTasks={tasks}
        selectedTask={selectedTask}
        editTask={editTask}
        setSelectedTask={setSelectedTask}
      />
      {tasks.length > 0 && (
        <GrapheMPM
          initialTasks={tasks}
          isExample={false}
          onEdit={setSelectedTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
