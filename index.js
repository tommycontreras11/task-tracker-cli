import {
  handleAdd,
  handleUpdate,
  handleDelete,
  handleStatusUpdate,
  handleList,
} from "./helper.js";
import { TaskStatusToUpdate } from "./constants.js";

async function main() {
  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();
    const command = input.split(" ")[0];

    switch (command) {
      case "task-cli":
        const action = input.split(" ")[1];

        const handlers = {
          add: handleAdd,
          update: handleUpdate,
          delete: handleDelete,
          list: handleList,
          [TaskStatusToUpdate.IN_PROGRESS]: (input) =>
            handleStatusUpdate(input, TaskStatusToUpdate.IN_PROGRESS),
          [TaskStatusToUpdate.DONE]: (input) =>
            handleStatusUpdate(input, TaskStatusToUpdate.DONE),
        };

        await handlers[action]?.(input);
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
