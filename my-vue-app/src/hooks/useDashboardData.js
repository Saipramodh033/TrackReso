import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useErrorHandler } from '../utils/errorHandling';

export const useDashboardData = (user) => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [peers, setPeers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sharedTopics, setSharedTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleError = useErrorHandler(() => {
    console.log('Unauthorized - redirecting to login');
    localStorage.clear();
    navigate('/login');
  });

  const fetchAllData = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token available for API calls');
        navigate('/login');
        return;
      }

      console.log('Fetching all data with caching...');
      setIsLoading(true);
      
      const result = await apiService.fetchDashboardData();
      
      console.log('Data fetched successfully:', result);
      
      setTopics(result.topics);
      setPeers(result.peers);
      setPendingRequests(result.requests);
      setSharedTopics(result.shared);
      
      // Log any errors from individual requests
      if (result.errors.length > 0) {
        console.warn('Some API requests failed:', result.errors);
      }
      
      if (result.topics.length > 0 && !selectedTopic) {
        setSelectedTopic(result.topics[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      handleError(error, {
        customMessage: 'Failed to load data. Please refresh the page.',
        onRateLimit: () => {
          alert('Too many requests. Please wait a moment before refreshing.');
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const refreshData = () => {
    fetchAllData();
  };

  return {
    topics,
    setTopics,
    peers,
    setPeers,
    pendingRequests,
    setPendingRequests,
    sharedTopics,
    setSharedTopics,
    selectedTopic,
    setSelectedTopic,
    isLoading,
    refreshData
  };
};