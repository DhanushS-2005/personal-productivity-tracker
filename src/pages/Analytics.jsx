import {
    CheckCircle2,
    Clock3,
    Flame,
    ListTodo,
    Target,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getAnalytics } from "../api/analyticsApi";

function Analytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const chartRef = useRef(null);

    useEffect(() => {
        loadAnalytics();
    }, []);


    const loadAnalytics = async () => {
        try {
            setLoading(true);

            const response = await getAnalytics();

            setAnalytics(response.data);

        } catch (error) {

            console.error(
                "Failed to load analytics:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    const dailyAnalytics =
        analytics?.dailyAnalytics || [];

    const topTasks =
        analytics?.topTasks || [];

    const totalTasks =
        analytics?.totalTasks || 0;

    const completedTasks =
        analytics?.completedTasks || 0;

    const pendingTasks =
        analytics?.pendingTasks || 0;

    const currentStreak =
        analytics?.currentStreak || 0;

    const bestStreak =
        analytics?.bestStreak || 0;

    const overallProductivity =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );

    const today = new Date();

    const todayKey =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

    useEffect(() => {
        if (!dailyAnalytics.length) return;

        const todayIndex = dailyAnalytics.findIndex(
            (day) => day.date === todayKey
        );

        if (todayIndex === -1) return;

        const chart = chartRef.current;

        if (!chart) return;

        const todayElement =
            chart.children[todayIndex];

        if (!todayElement) return;

        todayElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [dailyAnalytics, todayKey]);

    const todayData =
        dailyAnalytics.find(
            (day) => day.date === todayKey
        );

    const todayCompleted =
        todayData?.completed || 0;

    const todayTotal =
        todayData?.total || 0;

    const todayProductivity =
        todayData?.productivity || 0;

    return (
        <div className="analytics-page">

            {/* HEADER */}

            <div className="analytics-header">

                <div>
                    <h1>Analytics</h1>

                    <p>
                        Track your productivity and task
                        performance.
                    </p>
                </div>

            </div>

            {/* MAIN STATS */}

            <div className="analytics-stats">

                <div className="analytics-card">

                    <div className="analytics-icon">
                        <Target size={22} />
                    </div>

                    <div>
                        <span>Overall Productivity</span>
                        <strong>
                            {overallProductivity}%
                        </strong>
                    </div>

                </div>

                <div className="analytics-card">

                    <div className="analytics-icon">
                        <ListTodo size={22} />
                    </div>

                    <div>
                        <span>Total Tasks</span>
                        <strong>{totalTasks}</strong>
                    </div>

                </div>

                <div className="analytics-card">

                    <div className="analytics-icon">
                        <CheckCircle2 size={22} />
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>{completedTasks}</strong>
                    </div>

                </div>

                <div className="analytics-card">

                    <div className="analytics-icon">
                        <Clock3 size={22} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>{pendingTasks}</strong>
                    </div>

                </div>

            </div>

            {/* TODAY */}

            <div className="analytics-grid">

                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Today's Progress</h2>
                            <p>
                                {todayCompleted} of{" "}
                                {todayTotal} tasks completed
                            </p>
                        </div>

                        <strong>
                            {todayProductivity}%
                        </strong>

                    </div>

                    <div className="analytics-progress">

                        <div
                            className="analytics-progress-fill"
                            style={{
                                width: `${todayProductivity}%`,
                            }}
                        />

                    </div>

                </div>

                {/* STREAK */}

                <div className="analytics-panel streak-panel">

                    <div className="streak-icon">
                        <Flame size={28} />
                    </div>

                    <div>
                        <h2>Current Streak</h2>

                        <strong>
                            {currentStreak}{" "}
                            {currentStreak === 1
                                ? "Day"
                                : "Days"}
                        </strong>

                        <p>
                            Complete 50% or more of your daily tasks
                            to maintain your streak.
                        </p>
                    </div>

                </div>

                <div className="analytics-panel streak-motivation-panel">

                    <div className="streak-motivation-content">

                        <div className="streak-motivation-icon">
                            🔥
                        </div>

                        <div className="streak-stats">

                            <div className="streak-divider"></div>

                            <div className="streak-stat">
                                <span>Best Streak</span>
                                <strong>
                                    {bestStreak}{" "}
                                    {bestStreak === 1
                                        ? "Day"
                                        : "Days"}
                                </strong>
                            </div>

                        </div>

                        <div className="streak-motivation">

                            <h2>
                                தெய்வத்தான் ஆகா தெனினும்
                            </h2>

                            <p>
                                முயற்சிதன் மெய்வருத்தக் கூலி தரும்
                            </p>

                        </div>

                    </div>

                </div>

                <div className="analytics-panel productivity-breakdown">

                    <div className="panel-header">
                        <div>
                            <h2>Task Performance</h2>
                            <p>Overall task completion</p>
                        </div>

                        <strong>
                            {overallProductivity}%
                        </strong>
                    </div>

                    <div className="performance-row">

                        <div>
                            <span className="performance-label">
                                Completed
                            </span>

                            <strong className="performance-value">
                                {completedTasks}
                            </strong>
                        </div>

                        <div>
                            <span className="performance-label">
                                Pending
                            </span>

                            <strong className="performance-value">
                                {pendingTasks}
                            </strong>
                        </div>

                        <div>
                            <span className="performance-label">
                                Total
                            </span>

                            <strong className="performance-value">
                                {totalTasks}
                            </strong>
                        </div>

                    </div>

                    <div className="analytics-progress">

                        <div
                            className="analytics-progress-fill"
                            style={{
                                width: `${overallProductivity}%`,
                            }}
                        />

                    </div>

                </div>

            </div>

            {/* 7 DAY PRODUCTIVITY */}

            <div className="analytics-panel weekly-panel">

                <div className="panel-header">

                    <div>
                        <h2>Last 31 Days</h2>
                        <p>
                            Your daily productivity for the last 31 days
                        </p>
                    </div>

                </div>

                <div
                    className="weekly-chart"
                    ref={chartRef}
                >

                    {dailyAnalytics.map((day) => (

                        <div
                            className="chart-day"
                            key={day.date}
                        >

                            <div className="chart-bar-container">

                                <div
                                    className="chart-bar"
                                    style={{
                                        height: `${Math.max(
                                            day.productivity,
                                            4
                                        )}%`,
                                    }}
                                />

                            </div>

                            <strong>
                                {day.productivity}%
                            </strong>

                            <span>
                                {new Date(
                                    day.date + "T00:00:00"
                                ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                })}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

            <div className="analytics-panel top-tasks-panel">

                <div className="panel-header">
                    <div>
                        <h2>Top 10 Tasks</h2>
                        <p>Most frequently completed tasks</p>
                    </div>
                </div>

                {topTasks.length === 0 ? (

                    <div className="top-tasks-empty">
                        <ListTodo size={40} />
                        <p>No completed tasks yet.</p>
                    </div>

                ) : (

                    <div className="top-tasks-chart">

                        {topTasks.map((task, index) => (

                            <div
                                className="top-task-row"
                                key={task.title}
                            >

                                <div className="top-task-rank">
                                    #{index + 1}
                                </div>

                                <div className="top-task-name">
                                    <span>{task.title}</span>

                                    <div className="top-task-bar">
                                        <div
                                            className="top-task-bar-fill"
                                            style={{
                                                width: `${(
                                                    (task.completedCount /
                                                        topTasks[0].completedCount) *
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <strong>
                                    {task.completedCount}
                                </strong>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Analytics;