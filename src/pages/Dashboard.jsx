import { useEffect, useState } from "react";

import {
    CheckCircle2,
    Circle,
    Flame,
    ListTodo,
    Plus,
    Target,
    Trash2,
} from "lucide-react";

import TaskModal from "../components/TaskModal";

import { getDashboard } from "../api/dashboardApi";

import {
    createTask,
    toggleTask,
    deleteTask,
} from "../api/taskApi";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    // Load dashboard data
    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {

            setLoading(true);

            const response = await getDashboard();

            setDashboard(response.data);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    // Greeting
    const currentHour = new Date().getHours();

    let greeting;

    if (currentHour < 12) {
        greeting = "Good Morning";
    } else if (currentHour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    // Current date
    const formattedDate = new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    // Dashboard data from backend
    const todayTasks =
        dashboard?.todayTasks || [];

    const completedTasks =
        dashboard?.completedToday || 0;

    const totalTasks =
        dashboard?.totalToday || 0;

    const productivity =
        dashboard?.productivity || 0;

    const currentStreak =
        dashboard?.currentStreak || 0;

    // Toggle task
    const handleToggleTask = async (id) => {

        try {

            await toggleTask(id);

            await loadDashboard();

        } catch (error) {

            console.error(
                "Failed to toggle task:",
                error
            );

        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {

        try {

            await deleteTask(id);

            await loadDashboard();

        } catch (error) {

            console.error(
                "Failed to delete task:",
                error
            );

        }
    };

    // Loading state
    if (loading && !dashboard) {

        return (
            <div className="dashboard">

                <div className="empty-state">

                    <p>Loading dashboard...</p>

                </div>

            </div>
        );
    }

    return (

        <div className="dashboard">

            {/* Welcome */}

            <div className="welcome">

                <h1>
                    {greeting}, Dhanush 👋
                </h1>

                <p>
                    {formattedDate}
                </p>

            </div>


            {/* Stats */}

            <div className="stats">

                {/* Productivity */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <Target size={24} />

                    </div>

                    <div>

                        <h2>
                            {productivity}%
                        </h2>

                        <p>
                            Productivity
                        </p>

                    </div>

                </div>


                {/* Tasks */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <ListTodo size={24} />

                    </div>

                    <div>

                        <h2>
                            {completedTasks}/{totalTasks}
                        </h2>

                        <p>
                            Tasks
                        </p>

                    </div>

                </div>


                {/* Streak */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <Flame size={24} />

                    </div>

                    <div>

                        <h2>
                            {currentStreak}
                        </h2>

                        <p>
                            Day Streak
                        </p>

                    </div>

                </div>

            </div>


            {/* Content */}

            <div className="content-grid">


                {/* TODAY'S TASKS */}

                <div className="card">

                    <div className="card-header">

                        <h2>
                            Today's Tasks
                        </h2>

                        <button
                            onClick={() =>
                                setShowModal(true)
                            }
                            className="add-task-button"
                        >

                            <Plus size={16} />

                            Add Task

                        </button>

                    </div>


                    <div className="task-list">

                        {todayTasks.length === 0 ? (

                            <div className="empty-state">

                                <ListTodo size={40} />

                                <p>
                                    No tasks yet
                                </p>

                                <span>
                                    Add your first task for today.
                                </span>

                            </div>

                        ) : (

                            todayTasks.map((task) => (

                                <div
                                    className="task"
                                    key={task.id}
                                >

                                    {/* Complete */}

                                    <button
                                        className="task-check"
                                        onClick={() =>
                                            handleToggleTask(
                                                task.id
                                            )
                                        }
                                    >

                                        {task.completed ? (

                                            <CheckCircle2
                                                className="completed-icon"
                                                size={22}
                                            />

                                        ) : (

                                            <Circle
                                                size={22}
                                            />

                                        )}

                                    </button>


                                    {/* Task information */}

                                    <div className="task-info">

                                        <span
                                            className={
                                                task.completed
                                                    ? "completed"
                                                    : ""
                                            }
                                        >
                                            {task.title}
                                        </span>


                                        {task.description && (

                                            <p className="task-description">

                                                {task.description}

                                            </p>

                                        )}

                                    </div>


                                    {/* Delete */}

                                    <button
                                        className="delete-task"
                                        onClick={() =>
                                            handleDeleteTask(
                                                task.id
                                            )
                                        }
                                    >

                                        <Trash2 size={17} />

                                    </button>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>


            {/* ADD TASK MODAL */}

            <TaskModal

                isOpen={showModal}

                onClose={() => {
                    setShowModal(false);
                }}

                onSave={async (task) => {

                    try {

                        await createTask({

                            title: task.title,

                            description:
                                task.description,

                            taskDate:
                                task.date,

                        });

                        setShowModal(false);

                        await loadDashboard();

                    } catch (error) {

                        console.error(
                            "Failed to create task:",
                            error
                        );

                    }

                }}

            />

        </div>
    );
}

export default Dashboard;