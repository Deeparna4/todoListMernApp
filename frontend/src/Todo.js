
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
      .then((res) => {
        if (res.ok) {
          // Re-fetch todos to get the newly added item with a valid _id
          return getItems(); // Re-fetch all items
        } else {
          setError("Unable to create Todo item");
        }
      })
      .then(() => {
        setTitle("");
        setDescription("");
        setMessage("Item added successfully");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
   
    
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setEditTitle("");
            setEditDescription("");
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1);
          } else {
            setError("Unable to update Todo item");
          }
        })
        .catch(() => {
          setError("Unable to update Todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#e6f2ff", minHeight: "100vh" }} // Darker blue background
    >
      <div className="row p-3 bg-primary text-light rounded">
        <h1 className="text-center">MERN Stack ToDo List</h1>
      </div>
      <div className="row mt-4">
        <h3 className="text-primary">Add a New Task</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="col-md-6">
          <div className="form-group d-flex gap-2">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
              type="text"
            />
            <input
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="form-control"
              type="text"
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
      <div className="row mt-4">
        <h3 className="text-primary">Your Tasks</h3>
        <div className="col-md-12">
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item bg-light d-flex justify-content-between align-items-center my-2 p-3 shadow-sm"
              >
                <div className="d-flex flex-column">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold text-primary">{item.title}</span>
                      <span >{item.description}</span>
                    </>
                  ) : (
                    <>
                      <div className="form-group d-flex gap-2">
                        <input
                          placeholder="Title"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={editTitle}
                          className="form-control"
                          type="text"
                        />
                        <input
                          placeholder="Description"
                          onChange={(e) => setEditDescription(e.target.value)}
                          value={editDescription}
                          className="form-control"
                          type="text"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item)}
                      >
                       
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                     
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={handleUpdate}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={handleEditCancel}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}