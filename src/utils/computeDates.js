export function computeDates(tasks) {
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, { ...t }]));

  // Calcul dateTot
  function calcDateTot(task) {
    if (task.anterieurs.length === 0) return 0;
    return Math.max(
      ...task.anterieurs.map(id => calcDateTot(taskMap[id]) + taskMap[id].duree)
    );
  }

  for (const task of tasks) {
    taskMap[task.id].dateTot = calcDateTot(taskMap[task.id]);
  }

  // Ajouter les successeurs à chaque tâche dans taskMap
  for (const task of tasks) {
    const id = task.id;
    taskMap[id].successeurs = tasks
      .filter(t => t.anterieurs.includes(id))
      .map(t => t.id);
  }

  const maxTot = Math.max(...Object.values(taskMap).map(t => t.dateTot + t.duree));

  function calcDateTard(task) {
    if (!task.successeurs || task.successeurs.length === 0) {
      return maxTot - task.duree;
    }
    return Math.min(
      ...task.successeurs.map(id => calcDateTard(taskMap[id]) - task.duree)
    );
  }

  for (const task of tasks) {
    const t = taskMap[task.id];
    t.dateTard = calcDateTard(t);
    t.marge = t.dateTard - t.dateTot;
    t.estCritique = t.marge === 0;
  }

  // Transférer les valeurs calculées dans les tâches originales
  tasks.forEach(t => {
    t.dateTot = taskMap[t.id].dateTot;
    t.dateTard = taskMap[t.id].dateTard;
    t.marge = taskMap[t.id].marge;
    t.estCritique = taskMap[t.id].estCritique;
    t.successeurs = taskMap[t.id].successeurs;
  });

  return tasks;
}
