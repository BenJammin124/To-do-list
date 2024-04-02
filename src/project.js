import CreateNewTask from './task'

class Project {
  constructor(title) {
    this.title = title
    this.tasks = []
    this.id = Math.random();
    // this.id = crypto.randomUUID();
  }

  getTitle() {
    return this.title
  }

  getProjectList() {
    return this.tasks;
  }

  addTask(task) {
    this.tasks.push(task)
  }

  getId() {
    console.log(this.id)
  }

  deleteTask(index) {
    this.tasks.splice(index, 1)
  }

  taskCompleted(index) {
    this.tasks[index].completed = !this.tasks[index].completed
  }


}

export default Project