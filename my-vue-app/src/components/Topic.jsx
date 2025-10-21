import React, { useState } from 'react';
import Card from './Card';
import '../styles/CrystalTheme.css';

const Topic = ({ topic, deleteTopic, toggleCollapse, setTopics, topics }) => {
    const [addingNew, setAddingNew] = useState(false);

    const deleteCard = (cardId) => {
        // Ideally call API to delete, then update state
        const updatedTopics = topics.map((t) =>
            t.id === topic.id
                ? { ...t, cards: t.cards.filter((card) => card.id !== cardId) }
                : t
        );
        setTopics(updatedTopics);
    };

    return (
        <div className="crystal-topic-card">
            <div className="crystal-topic-header">
                <h2 className="crystal-topic-name">{topic.name}</h2>
                <div className="crystal-topic-actions">
                    <button onClick={() => toggleCollapse(topic.id)} className="crystal-action-button crystal-toggle-button">
                        {topic.collapsed ? 'Expand' : 'Collapse'}
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
                                deleteTopic(topic.id);
                            }
                        }}
                        className="crystal-action-button crystal-delete-button"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {!topic.collapsed && (
                <div className="crystal-topic-content">
                    <div className="crystal-cards-grid">
                        {topic.cards?.map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                deleteCard={deleteCard}
                                topicId={topic.id}
                                topics={topics}
                                setTopics={setTopics}
                            />
                        ))}

                        {/* New card form via Card component */}
                        {addingNew && (
                            <Card
                                key="new-card"
                                card={{}} // empty card for new
                                deleteCard={deleteCard}
                                topicId={topic.id}
                                topics={topics}
                                setTopics={setTopics}
                                isNew={true}
                                onAdded={() => setAddingNew(false)}
                            />
                        )}
                    </div>

                    {!addingNew && (
                        <button className="crystal-add-card-button" onClick={() => setAddingNew(true)}>
                            <span>+</span>
                            <span>Add New Card</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Topic;
