import fs from 'node:fs/promises';

export const getTaskIdFromInput = (input) => {
  const taskId = parseInt(input.split(" ")[2]);

  if (!taskId) {
    console.log("Task ID cannot be empty.");
    return;
  }

  return taskId;
};

export const getTaskDescriptionFromInput = (input, position) => {
  const description = input
    .split(" ")
    .slice(position)
    .join(" ")
    .replace(/"/g, "");

  if (!description) {
    console.log("Task description cannot be empty.");
    return;
  }

  return description;
};

export const getTaskIndexById = (tasks, input) => {
  const taskId = getTaskIdFromInput(input);
  if (taskId === undefined) return;

  const findIndex = tasks.findIndex((t) => t.id === taskId);
  if (findIndex === -1) {
    console.log("Task not found");
    return;
  }

  return { index: findIndex, id: taskId };
};

export const saveTaskToFile = async (tasks) =>
  await fs.writeFile("tasks.json", JSON.stringify(tasks), "utf8");

export const updateTask = async (
  tasks,
  index,
  task = { description: "", status: TaskStatus.TODO },
) => {
  task.description && (tasks[index].description = task.description);
  task.status && (tasks[index].status = task.status);
  tasks[index].updatedAt = new Date();

  saveTaskToFile(tasks);
};

export const createAndReturnTasksFileIfNotExists = async () => {
  let taskData = "",
    tasks = [];
  try {
    taskData = await fs.readFile("tasks.json", "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      saveTaskToFile([]);
    }
  }

  if (taskData) {
    tasks = JSON.parse(taskData);
  }

  return tasks;
};