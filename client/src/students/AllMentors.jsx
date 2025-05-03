import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiX,
  FiGrid,
  FiCalendar,
  FiMessageSquare,
  FiSend,
  FiBriefcase,
  FiHome,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";

import "../styles/AllMentors.css";

const AllMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");

  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/v1/mentors/allMentor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(data);
        setFilteredMentors(data);
        toast.success("Mentors fetched successfully");
      } catch (error) {
        toast.error("Failed to fetch mentors");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    const search = searchTerm.toLowerCase();
    const filtered = mentors.filter((mentor) =>
      [
        mentor.alumni?.name,
        mentor.alumni?.designation,
        mentor.alumni?.currentCompany,
        mentor.alumni?.location,
      ].some((field) => field?.toLowerCase().includes(search))
    );
    setFilteredMentors(filtered);
  }, [searchTerm, mentors]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const formatMessageTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Just now";
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Just now";
    }
  };

  const handleRequestClick = (mentor, slot) => {
    setSelectedMentor(mentor);
    setSelectedSlot(slot);
    setMessage("");
    setShowModal(true);
  };

  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const studentId = JSON.parse(atob(token.split(".")[1]))?.id;

      await axios.post(
        "/api/v1/mentorship/request",
        {
          mentorId: selectedMentor._id,
          studentId,
          slotId: selectedSlot._id,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Request sent successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to send request");
      console.error(error);
    }
  };

  const handleStartChat = async (mentor) => {
    setSelectedMentor(mentor);
    setShowChatModal(true);
    setChatMessage("");

    try {
      const token = localStorage.getItem("token");
      const studentId = JSON.parse(atob(token.split(".")[1]))?.id;
      const mentorId = mentor.alumni?._id;

      const { data } = await axios.get(
        `/api/v1/chat/${mentorId}/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChatHistory(data?.messages || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setChatHistory([]);
      } else {
        toast.error("Failed to load chat");
        console.error(error);
      }
    }
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setChatHistory([]);
    setChatMessage("");
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const studentId = JSON.parse(atob(token.split(".")[1]))?.id;
      const mentorId = selectedMentor.alumni?._id;

      const tempId = Date.now();
      const newMessage = {
        _id: tempId,
        sender: studentId,
        text: chatMessage,
        createdAt: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, newMessage]);
      setChatMessage("");

      const { data } = await axios.post(
        "/api/v1/chat/send",
        {
          mentorId,
          studentId,
          sender: studentId,
          text: chatMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChatHistory((prev) => [
        ...prev.filter((msg) => msg._id !== tempId),
        {
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
        },
      ]);

      toast.success("Message sent!");
    } catch (error) {
      toast.error("Failed to send chat message");
      console.error(error);
    }
  };

  const renderMentorCard = (mentor) => (
    <div className="mentor-card" key={mentor._id}>
      <img
        src={mentor.alumni?.profilePhoto || "https://via.placeholder.com/100"}
        alt="profile"
        className="mentor-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/100";
        }}
      />
      <h3>{mentor.alumni?.name}</h3>
      <p>
        <FiBriefcase /> {mentor.alumni?.designation}
      </p>
      <p>
        <FiHome /> {mentor.alumni?.currentCompany}
      </p>
      <p>
        <FiMapPin /> {mentor.alumni?.location}
      </p>

      <div className="mentor-actions">
        <button className="chat-btn" onClick={() => handleStartChat(mentor)}>
          <FiMessageSquare /> Chat
        </button>
      </div>

      <div className="mentor-slots">
        <h4>
          <FiCalendar /> Available Slots
        </h4>
        <ul>
          {mentor.slots.map((slot) => (
            <li
              key={slot._id}
              className={slot.isBooked ? "booked" : "available"}
            >
              {slot.isBooked ? <FiXCircle /> : <FiCheckCircle />} {slot.date} @{" "}
              {slot.time} —{" "}
              {slot.isBooked ? (
                "Booked"
              ) : (
                <button
                  onClick={() => handleRequestClick(mentor, slot)}
                  className="request-btn"
                >
                  Request Mentorship
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderMentorRow = (mentor) => (
    <tr key={mentor._id}>
      <td>{mentor.alumni?.name}</td>
      <td>{mentor.alumni?.designation}</td>
      <td>{mentor.alumni?.currentCompany}</td>
      <td>{mentor.alumni?.location}</td>
      <td>
        {mentor.slots.map((slot) => (
          <div
            key={slot._id}
            className={`slot-row ${slot.isBooked ? "booked" : "available"}`}
          >
            {slot.date} @ {slot.time} —{" "}
            {slot.isBooked ? (
              <span className="booked-label">Booked</span>
            ) : (
              <button
                className="request-btn"
                onClick={() => handleRequestClick(mentor, slot)}
              >
                Request
              </button>
            )}
          </div>
        ))}
      </td>
      <td>
        <button className="chat-btn" onClick={() => handleStartChat(mentor)}>
          Chat
        </button>
      </td>
    </tr>
  );

  const renderModal = ({
    title,
    content,
    onConfirm,
    onCancel,
    confirmText,
    isChat = false,
  }) => (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={isChat ? { maxWidth: "400px", padding: 0 } : {}}
      >
        {isChat ? (
          <>
            <div className="chat-header">
              <img
                src={
                  selectedMentor?.alumni?.profilePhoto ||
                  "https://via.placeholder.com/40"
                }
                alt={selectedMentor?.alumni?.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
              <div className="chat-header-info">
                <h4>{selectedMentor?.alumni?.name}</h4>
                <p>Mentor</p>
              </div>
              <button className="close-chat-btn" onClick={handleCloseChat}>
                <FiX />
              </button>
            </div>
            <div className="chat-history" ref={chatHistoryRef}>
              {content}
            </div>
            <div className="chat-input-area">
              <textarea
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="chat-input"
                rows="1"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <button className="send-chat-btn" onClick={handleSendChat}>
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>{title}</h3>
            {content}
            <div className="modal-actions">
              <button className="send-btn" onClick={onConfirm}>
                {confirmText}
              </button>
              <button className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="all-mentors-container">
      <div className="mentors-header">
        <div className="search-container">
          <FiSearch />
          <input
            type="text"
            placeholder="Search mentors by name, company, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search mentors"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === "cards" ? "active" : ""}
            onClick={() => setViewMode("cards")}
          >
            <FiGrid /> Card View
          </button>
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            <FiCalendar /> Table View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading mentors...</p>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="no-mentors">
          <FaUserGraduate />
          <p>
            {searchTerm
              ? "No mentors match your search."
              : "No mentors available at the moment."}
          </p>
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="mentors-list">
          {filteredMentors.map(renderMentorCard)}
        </div>
      ) : (
        <div className="mentors-table-wrapper">
          <table className="mentors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Company</th>
                <th>Location</th>
                <th>Slots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{filteredMentors.map(renderMentorRow)}</tbody>
          </table>
        </div>
      )}

      {showModal &&
        renderModal({
          title: `Request Mentorship with ${selectedMentor?.alumni?.name}`,
          content: (
            <>
              <p>
                <strong>Slot:</strong> {selectedSlot?.date} @{" "}
                {selectedSlot?.time}
              </p>
              <textarea
                placeholder="Write a message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="modal-textarea"
              />
            </>
          ),
          onConfirm: handleSendRequest,
          onCancel: () => setShowModal(false),
          confirmText: "Send Request",
        })}

      {showChatModal &&
        renderModal({
          title: `Chat with ${selectedMentor?.alumni?.name}`,
          content: (
            <>
              {chatHistory.length === 0 ? (
                <p className="no-chat">
                  No previous messages. Start the conversation!
                </p>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg._id}
                    className={`chat-msg ${
                      msg.sender ===
                      JSON.parse(
                        atob(localStorage.getItem("token").split(".")[1])
                      )?.id
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {msg.text}
                    <span className="message-time">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </>
          ),
          onConfirm: handleSendChat,
          onCancel: handleCloseChat,
          confirmText: "Send",
          isChat: true,
        })}
    </div>
  );
};

export default AllMentors;
