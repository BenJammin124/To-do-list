

class ToDo {
  constructor() {
    this.projects = [];

  }

  getProjectTitle() {
    return this.projects.title;
  }

  addProject(project) {
    this.projects.push(project)
  }

  allTasks() {
    this.projects.forEach(project => {
      project.tasks.forEach(task => {
        console.log(task)
      })
    })
  }
}


export default ToDo