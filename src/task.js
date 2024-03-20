import lists from './index'

class CreateNewTask {
  constructor(task, description, dueDate, priority, listName = 'All') {
    this.task = task
    this.description = description
    this.dueDate = dueDate
    this.priority = priority
    this.listName = listName
    this.completed = false
  }

  setListName(name) {
    this.listName = name
  }

}

export default CreateNewTask