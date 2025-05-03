import { useNavigate } from "react-router-dom";
import "../styles/NotFoundPage.css"; // We'll create this CSS file
import Navbar from "./Navbar";
import logo from "../assets/dypulogo.jpg";
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="not-found-container">
        <div className="not-found-content">
          <img src={logo} alt="Logo" className="not-found-logo" />
          <div className="error-code">404</div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-message">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="action-buttons">
            <button onClick={() => navigate(-1)} className="btn back-btn">
              Go Back
            </button>
            <button onClick={() => navigate("/")} className="btn home-btn">
              Return Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
