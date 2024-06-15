import { Link, Outlet } from "react-router-dom";
import "../css/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="nav-container">
      <ul className="nav justify-content-between">
        <li className="nav-item">
          <Link to="/" className="dashboard nav-link active" aria-current="page">Dashboard</Link>
        </li>
        <li className="nav-item">
          <input type="text" placeholder="Search" className="inputNav" />
        </li>
        <li className="nav-item nav-buttons">
          <button className="login btn">Login</button>
          <button className="signup btn">Sign Up</button>
        </li>
      </ul>
      <hr />
      <Outlet />
    </div>
  );
};

export default Dashboard;
