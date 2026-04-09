import fs from "node:fs/promises";
import { TaskStatus, TaskStatusToUpdate } from "./constants.js";

export const saveTaskToFile = async (tasks) =>
  await fs.writeFile("tasks.json", JSON.stringify(tasks), "utf8");

export const createAndReturnTasksFileIfNotExists = async () => {
  let taskData = "",
  tasks = [];
  try {
    taskData = await fs.readFile("tasks.json", "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      await saveTaskToFile([]);
    }
  }

  if (taskData) {
    tasks = JSON.parse(taskData);
  }

  return tasks;
};

// Helper function to parse input while respecting quoted strings
// Example: task-cli update 3 "New description with spaces"
// Output: ["task-cli", "update", "3", "New description with spaces"]
export const parseInput = (input) => {
  const regex = /[^\s"]+|"([^"]*)"/g;
  const args = [];

  let match;
  while ((match = regex.exec(input))) {
    args.push(match[1]?.trim() ?? match[0]?.trim());
  }

  return args;
};

export const getTaskIdFromInput = (parts) => {
  const taskId = parseInt(parts[2]);

  if (isNaN(taskId)) {
    console.log("Task ID is not valid.");
    return;
  }

  return taskId;
};

export const getTaskDescriptionFromInput = (parts, position) => {
  const description = parts[position]

  if (!description) {
    console.log("Task description cannot be empty.");
    return;
  }

  return description;
};

export const getTaskIndexById = (tasks, parts) => {
  const taskId = getTaskIdFromInput(parts);
  if (taskId === undefined) return;

  const findIndex = tasks.findIndex((t) => t.id === taskId);
  if (findIndex === -1) {
    console.log("Task not found");
    return;
  }

  return { index: findIndex, id: taskId };
};

export const updateTask = async (
  tasks,
  index,
  task = { description: "", status: TaskStatus.TODO },
) => {
  task.description && (tasks[index].description = task.description);
  task.status && (tasks[index].status = task.status);
  tasks[index].updatedAt = new Date();

  await saveTaskToFile(tasks);
};

const createBaseTask = () => ({
    status: TaskStatus.TODO,
    createdAt: new Date(),
    updatedAt: new Date(),
});

export const handleAdd = async (tasks, parts) => {
  const description = getTaskDescriptionFromInput(parts, 2);
  if (description === undefined) return;

  const taskId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

  const task = {
    id: taskId,
    title: `Task #${taskId}`,
    description,
    ...createBaseTask(),
  };

  tasks.push(task);

  await saveTaskToFile(tasks);
  console.log(`Task ${taskId} created`);
};

export const handleUpdate = async (tasks, parts) => {
  const task = getTaskIndexById(tasks, parts);
  const index = task?.index;

  if (index === undefined) return;

  const description = getTaskDescriptionFromInput(parts, 3);
  if (description === undefined) return;

  await updateTask(tasks, index, { description });
  console.log(`Task ${task.id} updated`);
};

export const handleDelete = async (tasks, parts) => {
  const task = getTaskIndexById(tasks, parts);
  const taskId = task?.id;

  if (taskId === undefined) return;
  tasks = tasks.filter((t) => t.id !== taskId);

  await saveTaskToFile(tasks);
  console.log(`Task ${task.id} deleted`);
};

export const handleStatusUpdate = async (tasks, parts, action) => {
  if (Object.values(TaskStatusToUpdate).includes(action)) {
    const task = getTaskIndexById(tasks, parts);
    const index = task?.index;

    if (index === undefined) return;

    const status =
      action === TaskStatusToUpdate.IN_PROGRESS
        ? TaskStatus.IN_PROGRESS
        : action === TaskStatusToUpdate.DONE
          ? TaskStatus.DONE
          : null;

    await updateTask(tasks, index, { status });
    console.log(`Task ${task.id} marked as ${status}`);
  }
};

export const handleList = async (tasks, parts) => {
  const status = parts[2];

  if (!status) {
    console.table(tasks);
  } else {
    if (Object.values(TaskStatus).includes(status)) {
      const filteredTasks = tasks.filter((t) => t.status === status);
      console.log(filteredTasks);
    } else {
      console.log("Invalid status");
    }
  }
};
