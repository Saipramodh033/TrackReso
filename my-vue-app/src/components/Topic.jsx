import React, { useState } from 'react';
import Card from './Card';
import '../styles/Topic.css';

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
        <div className="topic-card">
            <div className="topic-header">
                <h2 className="topic-title">{topic.name}</h2>
                <div className="topic-buttons">
                    <button onClick={() => toggleCollapse(topic.id)} className="btn-toggle">
                        {topic.collapsed ? 'Expand' : 'Collapse'}
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
                                deleteTopic(topic.id);
                            }
                        }}
                        className="btn-delete"
                    >
                        Delete
                    </button>
                </div>

            </div>

            {!topic.collapsed && (
                <>
                    <div className="cards-list">
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
                        <button className="btn-add-card" onClick={() => setAddingNew(true)}>
                            + Add New Card
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Topic;
