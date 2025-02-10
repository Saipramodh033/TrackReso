import React, { useState, useEffect } from "react";
import axios from "axios";
import Topic from "./Topic";
import "../styles/TopicManager.css";

const TopicManager = () => {
    const [topics, setTopics] = useState([]);
    const [newTopicName, setNewTopicName] = useState("");

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = () => {
        axios.get("http://127.0.0.1:8000/api/topics/")
            .then(response => setTopics(response.data))
            .catch(error => console.error("Error fetching topics:", error));
    };

    const addTopic = () => {
        if (newTopicName.trim()) {
            axios.post("http://127.0.0.1:8000/api/topics/", { name: newTopicName })
                .then(() => {
                    setNewTopicName("");
                    fetchTopics(); // Fetch the updated list of topics
                })
                .catch(error => console.error("Error adding topic:", error));
        }
    };

    const deleteTopic = (index) => {
        const confirmed = window.confirm("Are you sure you want to delete this topic?");
        if (confirmed) {
            const topicId = topics[index].id;
            axios.delete(`http://127.0.0.1:8000/api/topics/${topicId}/`)
                .then(() => {
                    const updatedTopics = topics.filter((_, i) => i !== index);
                    setTopics(updatedTopics);
                })
                .catch(error => console.error("Error deleting topic:", error));
        }
    };

    const toggleCollapse = (index) => {
        const updatedTopics = [...topics];
        updatedTopics[index].collapsed = !updatedTopics[index].collapsed;
        setTopics(updatedTopics);
    };

    return (
        <div className="topic-manager">
            <div className="add-topic-container">
                <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Enter topic name"
                    className="add-topic-input"
                />
                <button className="add-topic" onClick={addTopic}>Add Topic</button>
            </div>
            <div id="topicsList">
                {topics.map((topic, index) => (
                    <Topic
                        key={index}
                        index={index}
                        topic={topic}
                        deleteTopic={deleteTopic}
                        toggleCollapse={toggleCollapse}
                        setTopics={setTopics}
                        topics={topics}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopicManager;