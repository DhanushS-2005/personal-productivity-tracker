import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Edit3,
  ListTodo,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import TaskModal from "../components/TaskModal";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../api/taskApi";

function Tasks() {

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const response = await getTasks();

      setTasks(response.data);

    } catch (error) {

      console.error(
        "Failed to load tasks:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const today = new Date();

  const todayKey =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const toggleTaskStatus = async (id) => {

    try {

      const response =
        await toggleTask(id);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? response.data
            : task
        )
      );

    } catch (error) {

      console.error(
        "Failed to update task:",
        error
      );

    }
  };

  const handleDeleteTask = async (id) => {

    try {

      await deleteTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete task:",
        error
      );

    }

  };

  const openAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  };

  const filteredTasks = tasks
    .filter((task) => {

      if (filter === "today") {
        return task.taskDate === todayKey;
      }

      if (filter === "upcoming") {
        return task.taskDate > todayKey;
      }

      if (filter === "completed") {
        return task.completed;
      }

      if (filter === "pending") {
        return !task.completed;
      }

      return true;
    })
    .filter((task) => {
      const searchText = search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      // Normal text search
      const titleMatch =
        task.title
          ?.toLowerCase()
          .includes(searchText);

      const descriptionMatch =
        task.description
          ?.toLowerCase()
          .includes(searchText);

      // Date search
      let dateMatch = false;

      if (task.taskDate) {
        const [year, month, day] =
          task.taskDate.split("-");

        const formattedDate =
          `${day}/${month}/${year}`;

        // Exact date formats
        if (searchText.includes("/")) {
          dateMatch =
            formattedDate.includes(searchText);
        }

        // Search only day
        else if (/^\d{1,2}$/.test(searchText)) {
          dateMatch =
            day === searchText.padStart(2, "0");
        }
      }

      return (
        titleMatch ||
        descriptionMatch ||
        dateMatch
      );
    });

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="tasks-page">

      {/* PAGE HEADER */}

      <div className="tasks-page-header">

        <div>
          <h1>Tasks</h1>

          <p>
            Manage your daily tasks and stay productive.
          </p>
        </div>

        <button
          className="add-task-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Task
        </button>

      </div>

      {/* STATS */}

      <div className="task-summary">

        <div className="task-summary-card">
          <span>Total</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="task-summary-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="task-summary-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>

      </div>

      {/* SEARCH + FILTER */}

      <div className="task-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by task, description or date..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="filter-buttons">

          <button
            className={filter === "all" ? "filter-active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "today" ? "filter-active" : ""}
            onClick={() => setFilter("today")}
          >
            Today
          </button>

          <button
            className={filter === "upcoming" ? "filter-active" : ""}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>

          <button
            className={filter === "pending" ? "filter-active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

          <button
            className={filter === "completed" ? "filter-active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

        </div>

      </div>

      {/* TASK LIST */}

      <div className="tasks-container">

        {filteredTasks.length === 0 ? (

          <div className="tasks-empty">

            <ListTodo size={50} />

            <h3>No tasks found</h3>

            <p>
              Add a task to start your day.
            </p>

          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              className="task-page-item"
              key={task.id}
            >

              <button
                className="task-check"
                onClick={() =>
                  toggleTaskStatus(task.id)
                }
              >

                {task.completed ? (
                  <CheckCircle2
                    className="completed-icon"
                    size={24}
                  />
                ) : (
                  <Circle size={24} />
                )}

              </button>

              <div className="task-page-info">

                <h3
                  className={
                    task.completed
                      ? "completed"
                      : ""
                  }
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p>
                    {task.description}
                  </p>
                )}

                {task.taskDate && (
                  <span className="task-page-date">
                    📅 {formatDate(task.taskDate)}
                  </span>
                )}

              </div>

              <div className="task-actions">

                <button
                  onClick={() =>
                    openEditModal(task)
                  }
                  title="Edit task"
                >
                  <Edit3 size={17} />
                </button>

                <button
                  onClick={() =>
                    handleDeleteTask(task.id)
                  }
                  title="Delete task"
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* SHARED TASK MODAL */}

      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
        onSave={async (task) => {

          try {

            if (editingTask) {

              const response =
                await updateTask(
                  task.id,
                  {
                    title: task.title,
                    description: task.description,
                    taskDate: task.date,
                  }
                );

              setTasks((currentTasks) =>
                currentTasks.map((item) =>
                  item.id === task.id
                    ? response.data
                    : item
                )
              );

            } else {

              const response =
                await createTask({
                  title: task.title,
                  description: task.description,
                  taskDate: task.date,
                });

              setTasks((currentTasks) => [
                ...currentTasks,
                response.data,
              ]);

            }

            setShowModal(false);
            setEditingTask(null);

          } catch (error) {

            console.error(
              "Failed to save task:",
              error
            );

          }

        }}
      />

    </div>
  );
}

export default Tasks;