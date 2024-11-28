import React, { useState, useEffect } from 'react';
import { ToDoForm } from './ToDoForm';
import { v4 as uuidv4 } from 'uuid';
import { ToDo } from './ToDo';
import { EditDoForm } from './EditToDoForm';
import { doSignOut } from './firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, deleteDoc , onSnapshot} from "firebase/firestore";
import { db } from "./firebase/firebase"; 
uuidv4();

export const ToDoWrapper = () => {
  const [todoArray, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos);
      } catch (error) {
        console.error("Failed to parse todos from local storage:", error);
        return [];
      }
    }
    return [];
  });

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todosFromFirestore = snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(), 
      }));
      setTodos(todosFromFirestore);
    });
  
    return () => unsubscribe(); 
  }, []);
  useEffect(() => {
    console.log("Saving todos to local storage:", todoArray);
    localStorage.setItem('todos', JSON.stringify(todoArray));
  }, [todoArray]);

  const addTodo = async(todoName) => {
    const newTodo = {
      id: uuidv4(),
      task: todoName,
      completed: false,
      isEditing: false,
    };
    try {
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      console.log("Document written with ID: ", docRef.id);
  
      // Update state with the new todo
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const toggleComplete = async(id) => {
    try {
      const todoDoc = doc(db, "todos", id);
      const updatedTodo = todoArray.find((todo) => todo.id === id);
      await updateDoc(todoDoc, { completed: !updatedTodo.completed });
  
      // Update state locally
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setTodos((prevTodos) =>
      prevTodos.map((todoObject) =>
        todoObject.id === id
          ? { ...todoObject, completed: !todoObject.completed }
          : todoObject
      )
    );
  };

  const deleteTodo = async(id) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await deleteDoc(todoDoc);
  
      // Update state locally
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
    setTodos((prevTodos) => prevTodos.filter((todoObject) => todoObject.id !== id));
  };

  const editTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todoObject) =>
        todoObject.id === id
          ? { ...todoObject, isEditing: !todoObject.isEditing }
          : todoObject
      )
    );
  };

  const editTask = (todoName, id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todoObject) =>
        todoObject.id === id
          ? { ...todoObject, task: todoName, isEditing: !todoObject.isEditing }
          : todoObject
      )
    );
  };

  return (
    <div className="TodoWrapper">
      <button
        onClick={() => {
          doSignOut().then(() => {
            navigate('/login');
          });
        }}
      >
        Logout
      </button>
      <h1>Get Things Done!</h1>
      <ToDoForm addTodo={addTodo} />
      {todoArray.map((todoObject) =>
        todoObject.isEditing ? (
          <EditDoForm editTodo={editTask} task={todoObject} key={todoObject.id} />
        ) : (
          <ToDo
            task={todoObject}
            key={todoObject.id}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        )
      )}
    </div>
  );
};
