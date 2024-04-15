import { saveToLocalStorage } from "./localStorage";

class Task {
  constructor(task, description, dueDate, priority, listName = 'All') {
    this.task = task
    this.description = description
    this.dueDate = dueDate;
    this.priority = priority
    this.listName = listName
    this.completed = false
    this.id = Math.random();
  }

  editTask(newTask, newDescription, newDueDate, newPriority, newListName) {
    this.task = newTask !== undefined ? newTask : this.task;
    this.description = newDescription !== undefined ? newDescription : this.description;
    this.dueDate = newDueDate !== undefined ? newDueDate : this.dueDate;
    this.priority = newPriority !== undefined ? newPriority : this.priority;
    this.listName = newListName !== undefined ? newListName : this.listName;
  }

  getId() {
    console.log(this.id)
  }

  setListName(name) {
    this.listName = name
  }

}

export default Task