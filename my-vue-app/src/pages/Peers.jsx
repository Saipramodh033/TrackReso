import React, { useState, useEffect } from 'react';
import api from '../components/api';
import '../styles/Peers.css';

const Peers = () => {
  const [peers, setPeers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchPeers();
    fetchPendingRequests();
  }, []);

  const fetchPeers = async () => {
    try {
      const response = await api.get('/peers/');
      setPeers(response.data);
    } catch (error) {
      console.error('Error fetching peers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/peers/requests/');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const searchUsers = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await api.post('/peers/search/', { query: searchQuery });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendPeerRequest = async (userId) => {
    try {
      await api.post('/peers/request/', { user_id: userId });
      setSearchResults(searchResults.filter(user => user.id !== userId));
      alert('Peer request sent successfully!');
    } catch (error) {
      console.error('Error sending peer request:', error);
      alert('Error sending peer request');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/peers/${requestId}/accept/`);
      fetchPeers();
      fetchPendingRequests();
      alert('Peer request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error accepting request');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await api.post(`/peers/${requestId}/reject/`);
      fetchPendingRequests();
      alert('Peer request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request');
    }
  };

  const removePeer = async (peerId) => {
    if (window.confirm('Are you sure you want to remove this peer?')) {
      try {
        await api.delete(`/peers/${peerId}/`);
        fetchPeers();
        alert('Peer removed successfully');
      } catch (error) {
        console.error('Error removing peer:', error);
        alert('Error removing peer');
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="crystal-page-container">
        <div className="crystal-loading">Loading peers...</div>
      </div>
    );
  }

  return (
    <div className="crystal-page-container">
      <div className="crystal-peers-container">
        <h1 className="crystal-page-title">Manage Peers</h1>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="crystal-section">
            <h2 className="crystal-section-title">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="crystal-requests-grid">
              {pendingRequests.map((request) => (
                <div key={request.id} className="crystal-request-card">
                  <div className="crystal-request-info">
                    <span className="crystal-username">
                      {request.requester.username}
                    </span>
                    <span className="crystal-request-date">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="crystal-request-actions">
                    <button
                      className="crystal-btn crystal-btn-accept"
                      onClick={() => acceptRequest(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="crystal-btn crystal-btn-reject"
                      onClick={() => rejectRequest(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Users Section */}
        <div className="crystal-section">
          <h2 className="crystal-section-title">Add New Peer</h2>
          <div className="crystal-search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by username..."
              className="crystal-search-input"
            />
            {searchLoading && (
              <div className="crystal-search-loading">Searching...</div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="crystal-search-results">
              {searchResults.map((user) => (
                <div key={user.id} className="crystal-search-result">
                  <span className="crystal-username">{user.username}</span>
                  <button
                    className="crystal-btn crystal-btn-add"
                    onClick={() => sendPeerRequest(user.id)}
                  >
                    Add Peer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Peers Section */}
        <div className="crystal-section">
          <h2 className="crystal-section-title">
            Your Peers ({peers.length})
          </h2>
          {peers.length === 0 ? (
            <div className="crystal-empty-state">
              <div className="crystal-empty-icon">👥</div>
              <h3 className="crystal-empty-title">No peers yet</h3>
              <p className="crystal-empty-message">
                Search for users above to add them as peers and start sharing topics!
              </p>
            </div>
          ) : (
            <div className="crystal-peers-grid">
              {peers.map((peerRelation) => {
                const peer = peerRelation.requester.id === parseInt(localStorage.getItem('user_id')) 
                  ? peerRelation.addressee 
                  : peerRelation.requester;
                
                return (
                  <div key={peerRelation.id} className="crystal-peer-card">
                    <div className="crystal-peer-info">
                      <span className="crystal-username">{peer.username}</span>
                      <span className="crystal-peer-since">
                        Peers since {new Date(peerRelation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="crystal-peer-actions">
                      <button
                        className="crystal-btn crystal-btn-remove"
                        onClick={() => removePeer(peerRelation.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Peers;