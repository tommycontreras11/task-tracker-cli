const fs = require('node:fs').promises;

const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

const Task = {
  status: TaskStatus.TODO,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const getTaskIdFromInput = (input) => { 
    const taskId = parseInt(input.split(" ")[2]); 

    if (!taskId) {
      console.log("Task ID cannot be empty.");
      return;
    }

    return taskId
}

const getTaskDescriptionFromInput = (input, position) => { 
    const description = input.split(" ").slice(position).join(" ").replace(/"/g, "");

    if (!description) {
      console.log("Task description cannot be empty.");
      return;
    }

    return description
}

const getTaskIndexById = (tasks, input) => {
    const taskId = getTaskIdFromInput(input)

    const findIndex = tasks.findIndex((t) => t.id === taskId)
    if(findIndex === -1) {
      console.log("Task not found")
      return
    }

    return { index: findIndex, id: taskId }
}

const saveTaskToFile = async (tasks) => await fs.writeFile("tasks.json", JSON.stringify(tasks), "utf8")

const updateTask = async (tasks, index, task = { description: "", status: TaskStatus.TODO }) => {
    task.description && (tasks[index].description = task.description)
    task.status && (tasks[index].status = task.status)
    tasks[index].updatedAt = new Date()

    saveTaskToFile(tasks)
}

const createAndReturnTasksFileIfNotExists = async () => { 
  let taskData = "", tasks = []
    try {
      taskData = await fs.readFile("tasks.json", "utf-8");
    } catch (err) {
      if (err.code === "ENOENT") {
        saveTaskToFile([])
      }
    }

  if (taskData) {
    tasks = JSON.parse(taskData)
  }

  return tasks;
}

async function main() {
  let tasks = await createAndReturnTasksFileIfNotExists()

  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();
    const command = input.split(" ")[0];

    switch (command) {
      case "task-cli":
        const action = input.split(" ")[1];

        if (action == "add") {
          const description = getTaskDescriptionFromInput(input, 2)
          if (description === undefined) return

          const taskId = tasks.length + 1

          const task = { id: taskId, title: `Task #${taskId}`, description, ...Task };

          tasks.push(task)

          saveTaskToFile(tasks)
        }

        if (action == "update") {
          const task = getTaskIndexById(tasks, input)          

          const index = task?.index
          if(index === undefined) return

          const description = getTaskDescriptionFromInput(input, 3)
          if (description === undefined) return

          await updateTask(tasks, index, { description })
        }

        if (action == "mark-in-progress" || action == "mark-done") {
          const task = getTaskIndexById(tasks, input)
          const index = task?.index

          if(index === undefined) return

          const status = action === "mark-in-progress" ? TaskStatus.IN_PROGRESS : action == "mark-done" ? TaskStatus.DONE : null

          await updateTask(tasks, index, { status })
        }

        if (action == "delete") {
          const task = getTaskIndexById(tasks, input)
          const taskId = task?.id

          if (taskId === undefined) return
          
          tasks = tasks.filter((t) => t.id !== taskId)

          saveTaskToFile(tasks)
        }

        if (action == "list") {
          const status = input.split(" ")[2];

          if (!status) {
            console.log(tasks)
          } else {
            if (Object.values(TaskStatus).includes(status)) {
              const filteredTasks = tasks.filter((t) => t.status === status)
              console.log(filteredTasks)
            } else {
              console.log("Invalid status");
            }
          }
        }
        break;
      case "exit":
        console.log("Exiting...");
        process.exit();
      default:
        console.log("Unknown command");
    }
  });
}

main();
