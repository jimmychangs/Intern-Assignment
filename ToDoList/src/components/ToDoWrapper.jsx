import React, {useState} from 'react'
import { ToDoForm } from './ToDoForm'
import { v4 as uuidv4 } from 'uuid';
import { ToDo } from './ToDo';
import { EditDoForm } from './EditToDoForm';
uuidv4();

export const ToDoWrapper = () => {
    const [todoArray, setTodos] = useState([])
    
    const addTodo = todoName => {
        setTodos([...todoArray, {id: uuidv4(), task: todoName, completed: false, isEditing: false}])
        console.log(todoArray)
    }

    const toggleComplete = id => {
      setTodos(todoArray.map(todoObject => todoObject.id === id ? {
        ...todoObject, completed: !todoObject.completed} : todoObject
      ))
    }

    const deleteTodo = id => {
      setTodos(todoArray.filter(todoObject => todoObject.id !== id))
      console.log(id)
    }

    const editTodo = id => {
      setTodos(todoArray.map(todoObject => todoObject.id === id ? {
        ...todoObject, isEditing: !todoObject.isEditing} : todoObject
      ))
    }

    const editTask = (todoName, id) => {
      setTodos(todoArray.map(todoObject => todoObject.id === id ? {
        ...todoObject, task: todoName, isEditing: !todoObject.isEditing} : todoObject
      ))
    }
  return (
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
        <ToDoForm addTodo={addTodo}/>
        {todoArray.map((todoObject, index) => (
          todoObject.isEditing ? (
            <EditDoForm editTodo={editTask} task={todoObject} />
          ) : (
          <ToDo task={todoObject} key={index} 
          toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
        )
        ))}
  
    </div>
  )
}
