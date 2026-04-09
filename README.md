# 📝 Task CLI

**Project URL:** https://github.com/tommycontreras11/task-tracker-cli

A simple command-line interface (CLI) application to manage your tasks. You can add, update, delete, list, and change the status of tasks, all stored locally in a `tasks.json` file.

---

## 🚀 Features

* Add new tasks
* Update task descriptions
* Delete tasks
* Mark tasks as:

  * `todo`
  * `in-progress`
  * `done`
* List all tasks or filter by status
* Persistent storage using a JSON file

---

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

2. Make sure you are using Node.js (v18+ recommended).

---

## ▶️ Usage

Run your CLI app (depending on how you execute it):

```bash
node index.js
```

Then type commands in the terminal.

---

## 🧠 Command Structure

All commands start with:

```bash
task-cli <action> [arguments]
```

---

## ✨ Commands

### ➕ Add a task

```bash
task-cli add "Task description"
```

Example:

```bash
task-cli add "Learn Node.js CLI"
```

---

### ✏️ Update a task

```bash
task-cli update <taskId> "New description"
```

Example:

```bash
task-cli update 1 "Learn advanced Node.js"
```

---

### ❌ Delete a task

```bash
task-cli delete <taskId>
```

Example:

```bash
task-cli delete 1
```

---

### 🔄 Mark task as in progress

```bash
task-cli mark-in-progress <taskId>
```

Example:

```bash
task-cli mark-in-progress 2
```

---

### ✅ Mark task as done

```bash
task-cli mark-done <taskId>
```

Example:

```bash
task-cli mark-done 2
```

---

### 📋 List all tasks

```bash
task-cli list
```

---

### 🔍 List tasks by status

```bash
task-cli list <status>
```

Valid statuses:

* `todo`
* `in-progress`
* `done`

Example:

```bash
task-cli list done
```

---

## 📁 Data Storage

Tasks are stored in a file called:

```bash
tasks.json
```

Each task has the structure:

```json
{
  "id": 1,
  "description": "Sample task",
  "status": "todo",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## ⚠️ Notes

* Task IDs are auto-incremented.
* Descriptions must be wrapped in quotes if they contain spaces.
* If `tasks.json` does not exist, it will be created automatically.

---

## 🛑 Exit CLI

To exit the program:

```bash
exit
```

---

## 💡 Future Improvements (Ideas)

* Add due dates
* Add task priorities
* Interactive mode (prompt-based)
* Search tasks
* Colorized output

---

## 🧑‍💻 Author

Tommy Grullon Contreras

---

## 📄 License

MIT
