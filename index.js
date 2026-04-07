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

async function main() {
  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();
    const command = input.split(" ")[0];

    switch (command) {
      case "task-cli":
        const action = input.split(" ")[1];

        if (action == "add") {
          console.log("Adding a task")
        }

        if (action == "update") {
          console.log("Updating a task...");
        }

        if (action == "delete") {
          console.log("Deleting a task...");
        }

        if (action == "list") {
          const status = input.split(" ")[2];

          if (!status) {
            console.log("Listing all tasks");
          } else {
            if (Object.values(TaskStatus).includes(status)) {
              console.log("Status filtered: ", status);
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
