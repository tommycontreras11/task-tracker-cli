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

async function main() {
    let taskData = "", tasks = []
    try {
      taskData = await fs.readFile("tasks.json", "utf-8");
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile("tasks.json", JSON.stringify([]), "utf8");  
      }
    }

  if (taskData) {
    tasks = JSON.parse(taskData)
  }

  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();
    const command = input.split(" ")[0];

    switch (command) {
      case "task-cli":
        const action = input.split(" ")[1];

        if (action == "add") {
          const description = input.split(" ").slice(2).join(" ").replace(/"/g, "");

          if (!description) {
            console.log("Task description cannot be empty.");
            return;
          }

          const task = { ...Task, title: description, description: description };

          console.log("Adding a task: ", task)

          tasks.push(task)

          await fs.writeFile("tasks.json", JSON.stringify(tasks), "utf8")
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
            fs.readFile("tasks.json", "utf8", (err, data) => {
              if (err) {
                console.error("Error reading file:", err);
                return;
              }
              console.log("File content:", data);
            });
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
