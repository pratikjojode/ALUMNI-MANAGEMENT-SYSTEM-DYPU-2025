import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/MentorshipRequests.css";
import toast from "react-hot-toast";

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTableView, setIsTableView] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState({
    requestId: null,
    action: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const alumniId = decoded.id;
      if (!alumniId) {
        setError("Invalid token: alumniId not found");
        setLoading(false);
        return;
      }

      axios
        .get(`/api/v1/mentorship/requests/${alumniId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRequests(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching requests", error);
          setError("Error fetching mentorship requests.");
          setLoading(false);
        });
    } catch (e) {
      console.error("Error decoding token:", e);
      setError("Error decoding token.");
      setLoading(false);
    }
  }, []);

  const handleAction = (requestId, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in localStorage");
      return;
    }

    setProcessingAction({ requestId, action });

    const status = action === "accept" ? "accepted" : "rejected";
    axios
      .put(
        `/api/v1/mentorship/requests/${requestId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId
              ? { ...req, status: response.data.request.status }
              : req
          )
        );
        toast.success(`Request ${status} successfully`);
      })
      .catch((error) => {
        toast.error(`Error ${action}ing request`);
        console.error(`Error ${action}ing request`, error);
      })
      .finally(() => {
        setProcessingAction({ requestId: null, action: null });
      });
  };

  const toggleView = () => {
    setIsTableView(!isTableView);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const isProcessing = (requestId, action) => {
    return (
      processingAction.requestId === requestId &&
      processingAction.action === action
    );
  };

  if (loading) {
    return <p className="uiq-loading">Loading...</p>;
  }

  if (error) {
    return <p className="uiq-error">{error}</p>;
  }

  return (
    <div className="uiq-container">
      <div className="uiq-header">
        <h2 className="uiq-heading">Mentorship Requests</h2>
        <button className="uiq-toggle-view-button" onClick={toggleView}>
          Switch to {isTableView ? "Card View" : "Table View"}
        </button>
      </div>

      {requests.length > 0 ? (
        isTableView ? (
          <table className="uiq-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Status</th>
                <th>Mentor</th>
                <th>Assigned Slot</th>
                <th>Actions</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.student.name}</td>
                  <td>{request.student.email}</td>
                  <td className={`uiq-status uiq-status-${request.status}`}>
                    {request.status}
                  </td>
                  <td>{request.mentor.alumni}</td>
                  <td>
                    {request.slotId
                      ? `${request.slotId.date} - ${request.slotId.time} (${
                          request.slotId.isBooked ? "Booked" : "Available"
                        })`
                      : "No Slot"}
                  </td>
                  <td className="uiq-table-actions">
                    {request.status === "pending" && (
                      <div>
                        <button
                          className="uiq-button uiq-button-accept"
                          onClick={() => handleAction(request._id, "accept")}
                          disabled={isProcessing(request._id, "accept")}
                        >
                          {isProcessing(request._id, "accept")
                            ? "Accepting..."
                            : "Accept"}
                        </button>
                        <button
                          className="uiq-button uiq-button-reject"
                          onClick={() => handleAction(request._id, "reject")}
                          disabled={isProcessing(request._id, "reject")}
                        >
                          {isProcessing(request._id, "reject")
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </div>
                    )}
                    {request.status === "accepted" && (
                      <button
                        className="uiq-button uiq-button-reject"
                        onClick={() => handleAction(request._id, "reject")}
                        disabled={isProcessing(request._id, "reject")}
                      >
                        {isProcessing(request._id, "reject")
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    )}
                    {request.status === "rejected" && (
                      <button
                        className="uiq-button uiq-button-accept"
                        onClick={() => handleAction(request._id, "accept")}
                        disabled={isProcessing(request._id, "accept")}
                      >
                        {isProcessing(request._id, "accept")
                          ? "Accepting..."
                          : "Accept"}
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="uiq-button uiq-button-details"
                      onClick={() => openModal(request)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ul className="uiq-list">
            {requests.map((request) => (
              <li key={request._id} className="uiq-list-item">
                <p>
                  <strong>Student:</strong>{" "}
                  <span className="uiq-student-name">
                    {request.student.name}
                  </span>
                </p>
                <p>
                  <strong>Student Email:</strong>{" "}
                  <span className="uiq-student-email">
                    {request.student.email}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`uiq-status uiq-status-${request.status}`}>
                    {request.status}
                  </span>
                </p>
                <div className="uiq-actions">
                  {request.status === "pending" && (
                    <div>
                      <button
                        className="uiq-button uiq-button-accept"
                        onClick={() => handleAction(request._id, "accept")}
                        disabled={isProcessing(request._id, "accept")}
                      >
                        {isProcessing(request._id, "accept")
                          ? "Accepting..."
                          : "Accept"}
                      </button>
                      <button
                        className="uiq-button uiq-button-reject"
                        onClick={() => handleAction(request._id, "reject")}
                        disabled={isProcessing(request._id, "reject")}
                      >
                        {isProcessing(request._id, "reject")
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  )}
                  {request.status === "accepted" && (
                    <button
                      className="uiq-button uiq-button-reject"
                      onClick={() => handleAction(request._id, "reject")}
                      disabled={isProcessing(request._id, "reject")}
                    >
                      {isProcessing(request._id, "reject")
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  )}
                  {request.status === "rejected" && (
                    <button
                      className="uiq-button uiq-button-accept"
                      onClick={() => handleAction(request._id, "accept")}
                      disabled={isProcessing(request._id, "accept")}
                    >
                      {isProcessing(request._id, "accept")
                        ? "Accepting..."
                        : "Accept"}
                    </button>
                  )}
                  <button
                    className="uiq-button uiq-button-details"
                    onClick={() => openModal(request)}
                  >
                    Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="uiq-no-requests">No requests found.</p>
      )}

      {isModalOpen && selectedRequest && (
        <div className="uiq-modal-overlay">
          <div className="uiq-modal">
            <h3 className="uiq-modal-heading">Request Details</h3>
            <p>
              <strong>Student:</strong>{" "}
              <span className="uiq-modal-student-name">
                {selectedRequest.student.name}
              </span>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <span className="uiq-modal-student-email">
                {selectedRequest.student.email}
              </span>
            </p>
            <p>
              <strong>Message:</strong>{" "}
              <span className="uiq-modal-message">
                {selectedRequest.message}
              </span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`uiq-status uiq-status-${selectedRequest.status}`}
              >
                {selectedRequest.status}
              </span>
            </p>
            <div className="uiq-modal-mentor-info">
              <strong>Mentor Information:</strong>
              <p>
                <strong>Alumni:</strong>{" "}
                <span className="uiq-modal-alumni-name">
                  {selectedRequest.mentor.alumni}
                </span>
              </p>
              <p>
                <strong>Bio:</strong>{" "}
                <span className="uiq-modal-bio">
                  {selectedRequest.mentor.bio}
                </span>
              </p>
              <p>
                <strong>Expertise:</strong>{" "}
                <span className="uiq-modal-expertise">
                  {selectedRequest.mentor.expertise.join(", ")}
                </span>
              </p>
              <div className="uiq-modal-slots">
                <strong>Available Slots:</strong>
                {selectedRequest.mentor.slots.length > 0 ? (
                  <ul className="uiq-modal-slot-list">
                    {selectedRequest.mentor.slots.map((slot) => (
                      <li key={slot._id} className="uiq-modal-slot-item">
                        <span>Date: {slot.date}</span>
                        <br />
                        <span>Time: {slot.time}</span>
                        <br />
                        <span>
                          Booked:{" "}
                          <span
                            className={`uiq-booked uiq-booked-${slot.isBooked}`}
                          >
                            {slot.isBooked ? "Yes" : "No"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="uiq-modal-no-slots">No slots available.</p>
                )}
              </div>
            </div>
            <div className="uiq-modal-assigned-slot">
              <strong>Slot Assigned:</strong>{" "}
              {selectedRequest.slotId ? (
                <div className="uiq-modal-assigned-slot-details">
                  <span>Date: {selectedRequest.slotId.date}</span>
                  <br />
                  <span>Time: {selectedRequest.slotId.time}</span>
                  <br />
                  <span>
                    Booked:{" "}
                    <span
                      className={`uiq-booked uiq-booked-${selectedRequest.slotId.isBooked}`}
                    >
                      {selectedRequest.slotId.isBooked ? "Yes" : "No"}
                    </span>
                  </span>
                </div>
              ) : (
                <span className="uiq-modal-no-assigned-slot">
                  No slot assigned
                </span>
              )}
            </div>
            <div className="uiq-modal-actions">
              {selectedRequest.status === "pending" && (
                <div>
                  <button
                    className="uiq-button uiq-button-accept"
                    onClick={() => handleAction(selectedRequest._id, "accept")}
                    disabled={isProcessing(selectedRequest._id, "accept")}
                  >
                    {isProcessing(selectedRequest._id, "accept")
                      ? "Accepting..."
                      : "Accept"}
                  </button>
                  <button
                    className="uiq-button uiq-button-reject"
                    onClick={() => handleAction(selectedRequest._id, "reject")}
                    disabled={isProcessing(selectedRequest._id, "reject")}
                  >
                    {isProcessing(selectedRequest._id, "reject")
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              )}
              {selectedRequest.status === "accepted" && (
                <button
                  className="uiq-button uiq-button-reject"
                  onClick={() => handleAction(selectedRequest._id, "reject")}
                  disabled={isProcessing(selectedRequest._id, "reject")}
                >
                  {isProcessing(selectedRequest._id, "reject")
                    ? "Rejecting..."
                    : "Reject"}
                </button>
              )}
              {selectedRequest.status === "rejected" && (
                <button
                  className="uiq-button uiq-button-accept"
                  onClick={() => handleAction(selectedRequest._id, "accept")}
                  disabled={isProcessing(selectedRequest._id, "accept")}
                >
                  {isProcessing(selectedRequest._id, "accept")
                    ? "Accepting..."
                    : "Accept"}
                </button>
              )}
              <button className="uiq-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipRequests;
