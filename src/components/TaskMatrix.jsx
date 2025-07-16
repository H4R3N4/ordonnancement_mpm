function TaskMatrix({
  tasks,
  hideSuccesseurs = false,
  onDelete,
  onEdit,
}) {
  const getSuccesseurs = (taskId) =>
    tasks
      .filter((task) => task.anterieurs.includes(taskId))
      .map((task) => task.nom);

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full bg-white border border-gray-200 rounded shadow text-sm text-center">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 border">Tâche</th>
            {tasks.map((task) => (
              <th key={task.id} className="py-3 px-4 border">
                {task.nom}
                <div className="flex justify-center gap-1 mt-1">
                  <button
                    onClick={() => onEdit(task)}
                    className="px-2 py-1 bg-yellow-400 text-xs text-white rounded"
                  >
                    ✏
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-2 py-1 bg-red-500 text-xs text-white rounded"
                  >
                    🗑
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50">
            <th className="py-2 px-4 border bg-blue-100 text-blue-800">
              Durée
            </th>
            {tasks.map((task) => (
              <td key={task.id} className="py-2 px-4 border">
                {task.duree}
              </td>
            ))}
          </tr>
          <tr>
            <th className="py-2 px-4 border bg-blue-100 text-blue-800">
              Tâche(s) antérieure(s)
            </th>
            {tasks.map((task) => (
              <td key={task.id} className="py-2 px-4 border">
                {task.anterieurs.length > 0 ? task.anterieurs.join(", ") : "—"}
              </td>
            ))}
          </tr>
          {!hideSuccesseurs && (
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border bg-blue-100 text-blue-800">
                Tâche(s) successeur(s)
              </th>
              {tasks.map((task) => {
                const successeurs = getSuccesseurs(task.id);
                return (
                  <td key={task.id} className="py-2 px-4 border">
                    {successeurs.length > 0 ? successeurs.join(", ") : "—"}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskMatrix;
