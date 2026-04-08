import { createAndReturnTasksFileIfNotExists, getTaskDescriptionFromInput, getTaskIndexById, saveTaskToFile, updateTask } from "./helper.js";
import { TaskStatus } from "./constants.js";

const Task = {
  status: TaskStatus.TODO,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
