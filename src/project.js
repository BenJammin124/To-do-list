class NewProject {
  constructor(title) {
    this.title = title
    this.projectList = []
  }

  getTitle() {
    return this.title
  }

  getProjectList() {
    return this.projectList;
  }

  addTask(task) {
    this.projectList.push(task)
  }

  deleteTask(task) {
    this.projectList.splice(index, 1)
  }

  taskCompleted(index) {
    this.projectList[index].completed = !this.list[index].completed
  }

  // render() {

  // }
}

export default NewProject