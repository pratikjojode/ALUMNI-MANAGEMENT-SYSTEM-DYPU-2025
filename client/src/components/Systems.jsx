import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Systems.css"; // Optional: add styling if you have it

const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSystems = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/v1/systems");
      if (res.data.success) {
        setSystems(res.data.data || []);
      } else {
        toast.error("Failed to load systems.");
      }
    } catch (error) {
      console.error("Error fetching systems:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  return (
    <div className="systems-container">
      <h2>Available Systems</h2>
      {loading ? (
        <p>Loading systems...</p>
      ) : systems.length === 0 ? (
        <p>No systems found.</p>
      ) : (
        <div className="systems-list">
          {systems.map((system) => (
            <div key={system._id} className="system-card">
              <h3>{system.name}</h3>
              <p>
                <strong>Description:</strong> {system.description || "N/A"}
              </p>
              <p>
                <strong>Technologies:</strong>{" "}
                {(system.technologies || []).join(", ")}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(system.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Systems;
