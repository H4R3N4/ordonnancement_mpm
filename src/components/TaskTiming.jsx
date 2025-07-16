import React, { useMemo } from "react";

// Algorithmes de calcul
function computeDates(tasks) {
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, { ...t }]));

  // Calculer dateTot (au plus tôt)
  function calcDateTot(task) {
    if (task.anterieurs.length === 0) {
      return 0;
    }
    return Math.max(
      ...task.anterieurs.map(id => calcDateTot(taskMap[id]) + taskMap[id].duree)
    );
  }

  // Ajouter dateTot à chaque tâche
  tasks.forEach(task => {
    task.dateTot = calcDateTot(task);
  });

  // Calculer les successeurs
  tasks.forEach(task => {
    task.successeurs = tasks
      .filter(t => t.anterieurs.includes(task.id))
      .map(t => t.id);
  });

  // Calculer dateTard (au plus tard)
  const maxTot = Math.max(...tasks.map(t => t.dateTot + t.duree));

  function calcDateTard(task) {
    if (task.successeurs.length === 0) {
      return maxTot - task.duree;
    }
    return Math.min(
      ...task.successeurs.map(id => calcDateTard(taskMap[id]) - task.duree)
    );
  }

  tasks.forEach(task => {
    task.dateTard = calcDateTard(task);
    task.estCritique = task.dateTot === task.dateTard;
  });

  return tasks;
}

export default function TaskTiming({ tasks }) {
  const calculatedTasks = useMemo(() => computeDates([...tasks]), [tasks]);

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Tâche</th>
          <th>Date au plus tôt</th>
          <th>Date au plus tard</th>
          <th>Critique ?</th>
        </tr>
      </thead>
      <tbody>
        {calculatedTasks.map(task => (
          <tr key={task.id}>
            <td>{task.nom}</td>
            <td>{task.dateTot}</td>
            <td>{task.dateTard}</td>
            <td>{task.estCritique ? '1' : '0'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
