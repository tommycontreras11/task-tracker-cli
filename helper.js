import fs from "node:fs/promises";
import { TaskStatus, TaskStatusToUpdate } from "./constants.js";

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
    .replace(/"/g, "")
    .trim();

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

const createBaseTask = () => ({
    status: TaskStatus.TODO,
    createdAt: new Date(),
    updatedAt: new Date(),
});

let tasks = await createAndReturnTasksFileIfNotExists();

export const handleAdd = async (input) => {
  const description = getTaskDescriptionFromInput(input, 2);
  if (description === undefined) return;

  const taskId = tasks.length + 1;

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

export const handleUpdate = async (input) => {
  const task = getTaskIndexById(tasks, input);
  const index = task?.index;

  if (index === undefined) return;

  const description = getTaskDescriptionFromInput(input, 3);
  if (description === undefined) return;

  await updateTask(tasks, index, { description });
  console.log(`Task ${task.id} updated`);
};

export const handleDelete = async (input) => {
  const task = getTaskIndexById(tasks, input);
  const taskId = task?.id;

  if (taskId === undefined) return;
  tasks = tasks.filter((t) => t.id !== taskId);

  await saveTaskToFile(tasks);
  console.log(`Task ${task.id} deleted`);
};

export const handleStatusUpdate = async (input, action) => {
  if (Object.values(TaskStatusToUpdate).includes(action)) {
    const task = getTaskIndexById(tasks, input);
    const index = task?.index;

    if (index === undefined) return;

    const status =
      action === TaskStatusToUpdate.IN_PROGRESS
        ? TaskStatus.IN_PROGRESS
        : action === TaskStatusToUpdate.DONE
          ? TaskStatus.DONE
          : null;

    await updateTask(tasks, index, { status });
  }
};

export const handleList = async (input) => {
  const status = input.split(" ")[2];

  if (!status) {
    console.log(tasks);
  } else {
    if (Object.values(TaskStatus).includes(status)) {
      const filteredTasks = tasks.filter((t) => t.status === status);
      console.log(filteredTasks);
    } else {
      console.log("Invalid status");
    }
  }
};
