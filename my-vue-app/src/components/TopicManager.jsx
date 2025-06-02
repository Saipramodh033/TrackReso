import React, { useState, useEffect } from 'react';
import api from './api';
import Topic from './Topic';
import {jwtDecode }from 'jwt-decode';
import '../styles/TopicManager.css'

const TopicManager = () => {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.get('topics/');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const addTopic = async () => {
    if (newTopicName.trim()) {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No auth token found');

        const decoded = jwtDecode(token);
        const currentUserId = decoded.user_id || decoded.id || decoded.sub;

        const payload = {
          name: newTopicName,
          user: currentUserId,
        };

        const response = await api.post('topics/', payload);
        setTopics([...topics, { ...response.data, cards: [] }]);
        setNewTopicName('');
      } catch (error) {
        console.error('Error adding topic:', error);
      }
    }
  };

  const deleteTopic = async (id) => {
    try {
      await api.delete(`topics/${id}/`);
      setTopics(topics.filter((topic) => topic.id !== id));
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const toggleCollapse = (id) => {
    setTopics(
      topics.map((topic) =>
        topic.id === id ? { ...topic, collapsed: !topic.collapsed } : topic
      )
    );
  };

  return (
    <div className="topic-manager-container">
      <h1 className="topic-manager-title">Your Topics</h1>
      <div className="topic-manager-add">
        <input
          type="text"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          placeholder="Enter topic name"
          className="topic-manager-input"
        />
        <button
          onClick={addTopic}
          disabled={!newTopicName.trim()}
          className="topic-manager-add-button"
        >
          Add Topic
        </button>
      </div>
      <div className="topic-list">
        {topics.map((topic) => (
          <Topic
            key={topic.id}
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
