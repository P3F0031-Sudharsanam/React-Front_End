import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardPage from "./Dashboard/dashboard";
import LoginForm from "./Authentication/loginForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    if (username === "sudharsanam@p3fusion.com" && password === "admin") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;
