import React from "react";
import Card from "./Card";
import "../styles/Topic.css";

const Topic = ({ index, topic, deleteTopic, toggleCollapse, setTopics, topics }) => {
    const addCard = () => {
        const updatedTopics = [...topics];
        updatedTopics[index].cards.push({ name: "New Card", resource: "", note: "", progress: 0, starred: false, collapsed: true });
        setTopics(updatedTopics);
    };

    const deleteCard = (cardIndex) => {
        const confirmed = window.confirm("Are you sure you want to delete this card?");
        if (confirmed) {
            const updatedTopics = [...topics];
            updatedTopics[index].cards.splice(cardIndex, 1);
            setTopics(updatedTopics);
        }
    };

    return (
        <div className={`topic ${topic.collapsed ? "collapsed" : ""}`}>
            <div className="topic-header" onClick={() => toggleCollapse(index)}>
                <h2>{topic.name} ({topic.cards.length} cards)</h2>
                <span className={`caret ${topic.collapsed ? "" : "down"}`}>▼</span>
                <button className="add-card" onClick={(e) => { e.stopPropagation(); addCard(); }}>Add Card</button>
                <button className="delete-topic" onClick={(e) => { e.stopPropagation(); deleteTopic(index); }}>Delete Topic</button>
            </div>

            {!topic.collapsed && (
                <div className="cards-list">
                    {topic.cards.map((card, cardIndex) => (
                        <Card
                            key={cardIndex}
                            topicIndex={index}
                            cardIndex={cardIndex}
                            card={card}
                            setTopics={setTopics}
                            topics={topics}
                            deleteCard={deleteCard}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Topic;