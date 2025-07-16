import Select from "react-select";
import { useState, useEffect } from "react";

function FormAjoutTache({
  addTask,
  editTask,
  existingIds = [],
  allTasks = [],
  selectedTask,
  setSelectedTask,
}) {
  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [duree, setDuree] = useState("");
  const [anterieurs, setAnterieurs] = useState([]);

  useEffect(() => {
    if (selectedTask) {
      setId(selectedTask.id);
      setNom(selectedTask.nom);
      setDuree(selectedTask.duree);
      setAnterieurs(
        selectedTask.anterieurs.map((id) => ({
          value: id,
          label: `${id} (${id})`,
        }))
      );
    } else {
      setId("");
      setNom("");
      setDuree("");
      setAnterieurs([]);
    }
  }, [selectedTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !nom || !duree) return;

    const task = {
      id,
      nom,
      duree: parseInt(duree),
      anterieurs: anterieurs.map((opt) => opt.value),
    };

    if (selectedTask) {
      editTask(task);
    } else {
      addTask(task);
    }

    // Reset
    setId("");
    setNom("");
    setDuree("");
    setAnterieurs([]);
    setSelectedTask(null);
  };

  const options = allTasks
    .filter((t) => t.id !== id)
    .map((task) => ({
      value: task.id,
      label: `${task.nom} (${task.id})`,
    }));

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-lg font-semibold mb-6 text-center text-blue-700">
          {selectedTask ? "Modifier une tâche" : "Ajouter une tâche"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* ID */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">ID</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value.toUpperCase())}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={2}
              disabled={!!selectedTask}
            />
            {!selectedTask && existingIds.includes(id) && (
              <p className="text-red-500 text-xs mt-1">ID déjà utilisé.</p>
            )}
          </div>

          {/* Nom */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Nom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Durée */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Durée</label>
            <input
              type="number"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={1}
            />
          </div>

          {/* Antérieurs */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Antérieurs</label>
            <Select
              isMulti
              value={anterieurs}
              onChange={setAnterieurs}
              options={options}
              isDisabled={options.length === 0}
              className="text-sm react-select-container"
              classNamePrefix="react-select"
              placeholder="Sélectionner..."
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '38px',
                  borderColor: '#d1d5db', // gray-300
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#60a5fa' }, // blue-400
                }),
              }}
            />
          </div>
        </div>



        {/* Boutons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="submit"
            disabled={!id || (!selectedTask && existingIds.includes(id))}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {selectedTask ? "Modifier" : "Ajouter"}
          </button>

          {selectedTask && (
            <button
              type="button"
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormAjoutTache;
