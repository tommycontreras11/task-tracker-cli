import {
  handleAdd,
  handleUpdate,
  handleDelete,
  handleStatusUpdate,
  handleList,
  createAndReturnTasksFileIfNotExists,
  parseInput
} from "./helper.js";
import { TaskStatusToUpdate } from "./constants.js";

async function main() {
  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();
    const parts = parseInput(input);

    const command = parts[0];

    switch (command) {
      case "task-cli":
        const action = parts[1];

        if(action == undefined) {
          console.log("Please specify an action.");
          return;
        }

        let tasks = await createAndReturnTasksFileIfNotExists();

        const handlers = {
          add: handleAdd,
          update: handleUpdate,
          delete: handleDelete,
          list: handleList,
          [TaskStatusToUpdate.IN_PROGRESS]: (tasks, parts) =>
            handleStatusUpdate(tasks, parts, TaskStatusToUpdate.IN_PROGRESS),
          [TaskStatusToUpdate.DONE]: (tasks, parts) =>
            handleStatusUpdate(tasks, parts, TaskStatusToUpdate.DONE),
        };

        await handlers[action]?.(tasks, parts);
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
