import React, { useState, useEffect } from 'react';
import api from './api';
import '../styles/Card.css';

const Card = ({ card, deleteCard, topicId, topics, setTopics, isNew = false, onAdded }) => {
    const [editing, setEditing] = useState(isNew);

    const [formData, setFormData] = useState({
        name: card?.name || '',
        resource: card?.resource || '',
        note: card?.note || '',
        progress: card?.progress || 0,
        starred: card?.starred || false,
        collapsed: card?.collapsed || false,
    });

    useEffect(() => {
        setFormData({
            name: card?.name || '',
            resource: card?.resource || '',
            note: card?.note || '',
            progress: card?.progress || 0,
            starred: card?.starred || false,
            collapsed: card?.collapsed || false,
        });
    }, [card]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = async () => {
        try {
            if (isNew) {
                const response = await api.post('cards/', {
                    ...formData,
                    progress: Number(formData.progress),
                    topic: topicId,
                });

                const newCard = response.data;

                const updatedTopics = topics.map((topic) =>
                    topic.id === topicId
                        ? { ...topic, cards: [...topic.cards, newCard] }
                        : topic
                );
                setTopics(updatedTopics);

                setEditing(false);
                if (onAdded) onAdded();

            } else {
                const response = await api.put(`cards/${card.id}/`, {
                    ...formData,
                    progress: Number(formData.progress),
                    topic: topicId,
                });

                const updatedCard = response.data;

                const updatedTopics = topics.map((topic) =>
                    topic.id === topicId
                        ? {
                            ...topic,
                            cards: topic.cards.map((c) =>
                                c.id === card.id ? updatedCard : c
                            ),
                        }
                        : topic
                );
                setTopics(updatedTopics);
                setEditing(false);
            }
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Failed to save card. Please try again.');
        }
    };

    const toggleStar = async () => {
        try {
            const updatedCard = {
                ...card,
                starred: !card.starred,
            };
            const response = await api.put(`cards/${card.id}/`, updatedCard);

            const updatedTopics = topics.map((topic) =>
                topic.id === topicId
                    ? {
                        ...topic,
                        cards: topic.cards.map((c) =>
                            c.id === card.id ? response.data : c
                        ),
                    }
                    : topic
            );
            setTopics(updatedTopics);
        } catch (error) {
            console.error('Error toggling star:', error);
            alert('Could not update starred status.');
        }
    };

    if (isNew && !editing) {
        return (
            <button className="add-new-card-btn" onClick={() => setEditing(true)}>
                + Add New Card
            </button>
        );
    }

    return (
        <div className="card-container">
            {editing ? (
                <div className="card-edit-form">
                    <h3 className="card-subheading">{isNew ? 'Add New Card' : 'Edit Card'}</h3>

                    <label className="card-label">Card Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Card Name"
                    />

                    <label className="card-label">Resource</label>
                    <textarea
                        name="resource"
                        value={formData.resource}
                        onChange={handleChange}
                        placeholder="Resource"
                    />

                    <label className="card-label">Note</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Note"
                    />

                    <label className="card-label">Progress: {formData.progress}%</label>
                    <input
                        type="range"
                        name="progress"
                        value={formData.progress}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="1"
                        className="progress-slider"
                    />

                    <div className="card-actions">
                        <button onClick={handleSave}>💾 Save</button>
                        <button
                            onClick={() => {
                                if (isNew && onAdded) {
                                    onAdded();
                                } else {
                                    setEditing(false);
                                    setFormData({
                                        name: card?.name || '',
                                        resource: card?.resource || '',
                                        note: card?.note || '',
                                        progress: card?.progress || 0,
                                        starred: card?.starred || false,
                                        collapsed: card?.collapsed || false,
                                    });
                                }
                            }}
                        >
                            ✖ Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card-view">
                    <h3 className="card-subheading">Card Details</h3>
                    <p><strong>Name:</strong> {card.name}</p>
                    <p><strong>Resource:</strong> {card.resource}</p>
                    <p><strong>Note:</strong> {card.note}</p>

                    <div className="progress-display">
                        <strong>Progress:</strong>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${card.progress}%` }}
                            >
                                <span className="progress-label">{card.progress}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="card-actions">
                        <button className="edit-btn" onClick={() => setEditing(true)}>✏ Edit</button>
                        <button className="star-btn" onClick={toggleStar}>
                            {card.starred ? '⭐' : '☆'}
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this card?')) {
                                    deleteCard(card.id);
                                }
                            }}
                        >
                            🗑 Delete
                        </button>
                    </div>
                </div>

            )}
        </div>
    );
};

export default Card;
