import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import api from './api';
import '../styles/SidebarLayout.css';

const Card = ({ card, deleteCard, topicId, topics, setTopics, isNew = false, onAdded, isReadOnly = false }) => {
    const { showSuccess, showError } = useToast();
    const [editing, setEditing] = useState(isNew && !isReadOnly);

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
        console.log('handleSave called, isNew:', isNew, 'formData:', formData);
        // Basic validation
        if (!formData.name.trim()) {
            showError('Card name is required.');
            return;
        }

        if (formData.name.trim().length > 255) {
            showError('Card name must be less than 255 characters.');
            return;
        }

        try {
            if (isNew) {
                const payload = {
                    ...formData,
                    name: formData.name.trim(),
                    progress: Number(formData.progress),
                    topic: topicId,
                };
                console.log('Creating new card with payload:', payload);
                const response = await api.post('cards/', payload);
                console.log('Card creation response:', response.data);

                const newCard = response.data;

                const updatedTopics = topics.map((topic) =>
                    topic.id === topicId
                        ? { ...topic, cards: [...topic.cards, newCard] }
                        : topic
                );
                setTopics(updatedTopics);

                setEditing(false);
                if (onAdded) onAdded();
                showSuccess('Card created successfully!');

            } else {
                const payload = {
                    ...formData,
                    name: formData.name.trim(),
                    progress: Number(formData.progress),
                    topic: topicId,
                };
                console.log('Updating card with payload:', payload);
                const response = await api.put(`cards/${card.id}/`, payload);
                console.log('Card update response:', response.data);

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
                showSuccess('Card updated successfully!');
            }
        } catch (error) {
            console.error('Error saving card:', error);
            if (error.response?.status === 401) {
                showError('Session expired. Please login again.');
                // Redirect to login or refresh token
            } else if (error.response?.status === 400) {
                const errorMsg = error.response.data?.detail || error.response.data?.name?.[0] || 'Invalid data. Please check your inputs.';
                showError(errorMsg);
            } else {
                showError('Failed to save card. Please try again.');
            }
        }
    };

    const toggleStar = async () => {
        if (isReadOnly) return; // Prevent starring in read-only mode
        
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
            showSuccess(response.data.starred ? 'Card starred!' : 'Card unstarred!');
        } catch (error) {
            console.error('Error toggling star:', error);
            if (error.response?.status === 401) {
                showError('Session expired. Please login again.');
            } else {
                showError('Could not update starred status.');
            }
        }
    };

    if (isNew && !editing) {
        return (
            <div className="crystal-main-add-card" onClick={() => setEditing(true)}>
                <div className="crystal-add-card-icon">+</div>
                <div>Add New Card</div>
            </div>
        );
    }

    return (
        <div className={`crystal-card-content ${isReadOnly ? 'crystal-card-readonly' : ''}`}>
            {editing && !isReadOnly ? (
                <div className="crystal-form">
                    <h3 className="crystal-card-title">{isNew ? 'Add New Card' : 'Edit Card'}</h3>

                    <div className="crystal-form-group">
                        <label className="crystal-form-label">Card Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Card Name"
                            className="crystal-form-input"
                            required
                            maxLength="255"
                        />
                    </div>

                    <div className="crystal-form-group">
                        <label className="crystal-form-label">Resource</label>
                        <textarea
                            name="resource"
                            value={formData.resource}
                            onChange={handleChange}
                            placeholder="Resource"
                            className="crystal-form-textarea"
                        />
                    </div>

                    <div className="crystal-form-group">
                        <label className="crystal-form-label">Note</label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Note"
                            className="crystal-form-textarea"
                        />
                    </div>

                    <div className="crystal-form-group">
                        <label className="crystal-form-label">Progress: {formData.progress}%</label>
                        <input
                            type="range"
                            name="progress"
                            value={formData.progress}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="1"
                            className="crystal-range-input"
                        />
                    </div>

                    <div className="crystal-form-actions">
                        <button onClick={() => {
                            console.log('Save button clicked in Card component!');
                            handleSave();
                        }} className="crystal-card-button crystal-save-button">
                            💾 Save
                        </button>
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
                            className="crystal-card-button crystal-cancel-button"
                        >
                            ✖ Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="crystal-card-header">
                        <h3 className="crystal-card-title">{card.name}</h3>
                        {!isReadOnly && (
                            <button className="crystal-star-button" onClick={toggleStar}>
                                {card.starred ? '⭐' : '☆'}
                            </button>
                        )}
                    </div>
                    
                    <div className="crystal-card-field">
                        <span className="crystal-field-label">Resource</span>
                        <div className="crystal-field-value">{card.resource || 'No resource specified'}</div>
                    </div>
                    
                    <div className="crystal-card-field">
                        <span className="crystal-field-label">Note</span>
                        <div className="crystal-field-value">{card.note || 'No note added'}</div>
                    </div>

                    <div className="crystal-progress-container">
                        <span className="crystal-field-label">Progress</span>
                        <div className="crystal-progress-bar">
                            <div
                                className="crystal-progress-fill"
                                style={{ width: `${card.progress}%` }}
                            />
                        </div>
                        <div className="crystal-progress-text">{card.progress}%</div>
                    </div>

                    {!isReadOnly && (
                        <div className="crystal-card-actions">
                            <button className="crystal-card-button crystal-edit-button" onClick={() => setEditing(true)}>
                                ✏ Edit
                            </button>
                            <button
                                className="crystal-card-button crystal-delete-card-button"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this card?')) {
                                        deleteCard(card.id);
                                    }
                                }}
                            >
                                🗑 Delete
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Card;
