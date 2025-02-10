import React from "react";
import "../styles/Card.css";
import axios from "axios";

const Card = ({ topicIndex, cardIndex, card, setTopics, topics, deleteCard }) => {
    const toggleCollapse = () => {
        const updatedTopics = [...topics];
        updatedTopics[topicIndex].cards[cardIndex].collapsed = !card.collapsed;
        setTopics(updatedTopics);
    };



    const updateCard = (field, value) => {
        const updatedTopics = [...topics];
        updatedTopics[topicIndex].cards[cardIndex][field] = value;
        setTopics(updatedTopics);
    
        // Debugging: Check if `id` exists
        const cardId = updatedTopics[topicIndex].cards[cardIndex].id;
        console.log("Updating Card - ID:", cardId, "Field:", field, "Value:", value);
    
        if (!cardId) {
            console.error("Error: Card ID is undefined. Cannot update.");
            return;
        }
    
        // Send update request to API
        axios.patch(`http://127.0.0.1:8000/api/cards/${cardId}/`, { [field]: value })
            .then(response => console.log("Card updated successfully:", response.data))
            .catch(error => console.error("Error updating card:", error));
    };
    


    return (
        <div className={`card ${card.collapsed ? "" : "expanded"}`}>
            <div className="card-header">
                <input type="text" value={card.name} onChange={(e) => updateCard("name", e.target.value)} />
                <span className={`caret ${card.collapsed ? "" : "down"}`} onClick={toggleCollapse}>▼</span>
                <button className={`star-button ${card.starred ? "starred" : ""}`} onClick={() => updateCard("starred", !card.starred)}>★</button>
                <button className="delete-card" onClick={() => deleteCard(cardIndex)}>Delete Card</button>
            </div>

            {!card.collapsed && (
                <div className="card-content">
                    <input type="text" placeholder="Resource (text, link, or image URL)" value={card.resource} onChange={(e) => updateCard("resource", e.target.value)} />
                    <textarea placeholder="Short note..." value={card.note} onChange={(e) => updateCard("note", e.target.value)} />
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${card.progress}%` }}></div>
                    </div>
                    <input type="range" min="0" max="100" value={card.progress} onChange={(e) => updateCard("progress", e.target.value)} />
                </div>
            )}
        </div>
    );
};

export default Card;