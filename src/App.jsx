import { Target } from "lucide-react";
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";

import "./App.css";

function App() {

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("productivity_theme") ||
      "dark";

    document.documentElement.setAttribute(
      "data-theme",
      savedTheme
    );
  }, []);
  return (
    <BrowserRouter>

      <div className="app">

        <aside className="sidebar">

          <div className="logo">
            <Target size={26} />
            <span>Productivity</span>
          </div>

          <nav>

            <NavLink
              to="/"
              end
            >
              🏠 Dashboard
            </NavLink>

            <NavLink to="/tasks">
              ✓ Tasks
            </NavLink>

            <NavLink to="/analytics">
              📊 Analytics
            </NavLink>

          </nav>

        </aside>

        <main className="main">

          <header className="header">

            <div></div>

            <div className="profile">

              <div className="avatar">
                📝
              </div>

              <span>Dhanush</span>
            </div>

          </header>

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;