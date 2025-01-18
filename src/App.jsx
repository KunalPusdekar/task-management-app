import React, { useState, useEffect } from "react";
import "./App.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [currentEdit, setCurrentEdit] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      status: "To-Do",
    };

    setTasks([...tasks, newTask]);
    setNewTitle("");
    setNewDescription("");
    setNewPriority("");
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleMoveTask = (id, direction) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        if (direction === "forward") {
          if (task.status === "To-Do") task.status = "In Progress";
          else if (task.status === "In Progress") task.status = "Completed";
        } else if (direction === "backward") {
          if (task.status === "Completed") task.status = "In Progress";
          else if (task.status === "In Progress") task.status = "To-Do";
        }
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleEditTask = (task) => {
    setCurrentEdit(task);
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map((task) => (task.id === currentEdit.id ? currentEdit : task)));
    setCurrentEdit(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "white";
    }
  };

  const renderTasksByStatus = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div
          key={task.id}
          className="task-card"
          style={{ borderLeft: `5px solid ${getPriorityColor(task.priority)}` }}
        >
          <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <small>Priority: {task.priority}</small>
          </div>
          <div className="task-actions">
            {status !== "To-Do" && status !== "Completed" && (
              <BsArrowLeft
                className="action-icon"
                onClick={() => handleMoveTask(task.id, "backward")}
                title="Move Backward"
              />
            )}
            {status !== "Completed" && (
              <BsArrowRight
                className="action-icon"
                onClick={() => handleMoveTask(task.id, "forward")}
                title="Move Forward"
              />
            )}
            {status !== "Completed" ? (
              <AiOutlineEdit
                className="action-icon"
                onClick={() => handleEditTask(task)}
                title="Edit Task"
              />
            ) : (
              <TiTick
                alt="Completed"
                className="action-icon"
                style={{ width: "30px", height: "30px",color:"green"}}
              />
            )}
            <AiOutlineDelete
              className="action-icon"
              onClick={() => handleDeleteTask(task.id)}
              title="Delete Task"
            />
          </div>
        </div>
      ));
  };

  return (
    <div className="App">
      <header>
        <h1>Task Management App</h1>
      </header>

      <div className="task-input">
        <input
          type="text"
          placeholder="Task Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        ></textarea>
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="" disabled>
            Select Priority
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {currentEdit && (
        <div className="edit-modal">
          <h3>Edit Task</h3>
          <input
            type="text"
            value={currentEdit.title}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, title: e.target.value })
            }
          />
          <textarea
            value={currentEdit.description}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, description: e.target.value })
            }
          ></textarea>
          <select
            value={currentEdit.priority}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, priority: e.target.value })
            }
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button onClick={handleUpdateTask}>Save</button>
          <button onClick={() => setCurrentEdit(null)}>Cancel</button>
        </div>
      )}

      <div className="task-lanes">
        <div className="lane">
          <h2>To-Do</h2>
          {renderTasksByStatus("To-Do")}
        </div>
        <div className="lane">
          <h2>In Progress</h2>
          {renderTasksByStatus("In Progress")}
        </div>
        <div className="lane">
          <h2>Completed</h2>
          {renderTasksByStatus("Completed")}
        </div>
      </div>
    </div>
  );
}

export default App;
