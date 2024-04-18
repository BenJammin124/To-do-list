export function deleteToDo(todo) {
  console.log('Deleting todo list', todo)
  delete localStorage.todo;
}

export function loadToDo() {
  console.log('Loading todo list')
  if (localStorage.todo !== undefined) {
    return JSON.parse(localStorage.todo)
  }
  return null
}

export function saveToDo(todo) {
  console.log('Saving todo list', todo)
  if (todo !== undefined) {
    return localStorage.todo = JSON.stringify(todo)
  }
} 