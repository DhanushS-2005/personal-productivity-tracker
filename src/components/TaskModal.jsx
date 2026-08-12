import { useEffect, useState } from "react";
import { X } from "lucide-react";

function TaskModal({
    isOpen,
    onClose,
    onSave,
    editingTask = null,
}) {

    const getToday = () => {
        const today = new Date();

        return (
            today.getFullYear() +
            "-" +
            String(today.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(today.getDate()).padStart(2, "0")
        );
    };

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: getToday(),
    });

    useEffect(() => {

        if (editingTask) {

            setForm({
                title: editingTask.title || "",
                description: editingTask.description || "",
                date: editingTask.taskDate || getToday(),
            });

        } else {

            setForm({
                title: "",
                description: "",
                date: getToday(),
            });

        }

    }, [editingTask, isOpen]);


    if (!isOpen) {
        return null;
    }


    const handleSave = (e) => {

        e.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        onSave({
            ...form,

            id: editingTask
                ? editingTask.id
                : Date.now(),

            completed: editingTask
                ? editingTask.completed
                : false,
        });
    };


    return (
        <div className="modal-overlay">

            <form
                className="modal"
                onSubmit={handleSave}
            >

                <div className="modal-header">

                    <h2>
                        {editingTask
                            ? "Edit Task"
                            : "Add New Task"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>


                <div className="form-group">

                    <label>Task Name</label>

                    <input
                        type="text"
                        placeholder="Enter task name"
                        value={form.title}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                title: e.target.value,
                            })
                        }
                        autoFocus
                    />

                </div>


                <div className="form-group">

                    <label>Description</label>

                    <textarea
                        placeholder="Enter task description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                    />

                </div>


                <div className="form-group">

                    <label>Date</label>

                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                date: e.target.value,
                            })
                        }
                    />

                </div>


                <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="save-button"
                    >
                        {editingTask
                            ? "Save Changes"
                            : "Add Task"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default TaskModal;