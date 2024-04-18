class Project {
  constructor(title) {
    this.title = title
    this.tasks = []
    this.id = Math.random();
  }

  getTitle() {
    return this.title
  }

  setTitle(title) {
    this.title = title;
  }

  sortByDate() {
    this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
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