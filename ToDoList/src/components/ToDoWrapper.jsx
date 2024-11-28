import React, { useState, useEffect } from 'react';
import { ToDoForm } from './ToDoForm';
import { v4 as uuidv4 } from 'uuid';
import { ToDo } from './ToDo';
import { EditToDoForm } from './EditToDoForm';
import { doSignOut } from './firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, deleteDoc ,getDoc, onSnapshot} from "firebase/firestore";
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
  const [isEditing, setIsEditing] = useState(false)

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

  const addTodo = async (todoName) => {
    const newTodo = {
      task: todoName,
      completed: false,
      isEditing: false,
    };
    console.log(todoArray)
    try {
     
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      console.log("Document written with ID: ", docRef.id);
      
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const toggleComplete = async(id) => {
    try {
      const todoDoc = doc(db, "todos", id);
      const updatedTodo = todoArray.find((todo) => todo.id === id);
      await updateDoc(todoDoc, { completed: !updatedTodo.completed });
  
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
      
      const docSnap = await getDoc(todoDoc);
      if (docSnap.exists()) {
        await deleteDoc(todoDoc);
        console.log("Todo deleted from Firestore");
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        console.log("Todo not found in Firestore");
      }
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  

  const editTodo = async(id) => {
    try {
      setIsEditing(true)
      const todoToEdit = todoArray.find((todoObject) => todoObject.id === id);
      if (!todoToEdit) return;
  
      const todoDoc = doc(db, "todos", id);
      await updateDoc(todoDoc, { isEditing: !todoToEdit.isEditing });
  
      setTodos((prevTodos) =>
        prevTodos.map((todoObject) =>
          todoObject.id === id
            ? { ...todoObject, isEditing: !todoObject.isEditing }
            : todoObject
        )
      );
    } catch (e) {
      console.error("Error updating document:", e);
    }
  };

  const editTask = async(todoName, id) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await updateDoc(todoDoc, { task: todoName, isEditing: false }); 
  
      setTodos((prevTodos) =>
        prevTodos.map((todoObject) =>
          todoObject.id === id
            ? { ...todoObject, task: todoName, isEditing: false }
            : todoObject
        )
      );
      setIsEditing(false)
    } catch (e) {
      console.error("Error updating document:", e);
    }
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
        isEditing ? (
          <EditToDoForm editTodo={editTask} task={todoObject} key={todoObject.id} />
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
