import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useErrorHandler } from '../utils/errorHandling';

const PeersView = ({ 
  peers, 
  setPeers, 
  pendingRequests, 
  setPendingRequests, 
  user, 
  onUnauthorized 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleError = useErrorHandler(onUnauthorized);

  // Helper function to get the peer's name (the other user in the relationship)
  const getPeerName = (peer) => {
    if (!peer || !user) return 'Unknown User';
    
    // If current user is the requester, show addressee's name
    if (peer.requester?.id === user.id) {
      return peer.addressee?.username || 'Unknown User';
    }
    // If current user is the addressee, show requester's name
    else if (peer.addressee?.id === user.id) {
      return peer.requester?.username || 'Unknown User';
    }
    // Fallback: show the name that's not the current user
    else {
      return peer.requester?.username === user.username 
        ? peer.addressee?.username || 'Unknown User'
        : peer.requester?.username || 'Unknown User';
    }
  };

  const sendPeerRequest = async (userId) => {
    try {
      await apiService.sendPeerRequest({ user_id: userId });
      setSearchResults(searchResults.filter(user => user.id !== userId));
      setSearchQuery('');
      alert('Peer request sent!');
    } catch (error) {
      console.error('Error sending peer request:', error);
      handleError(error, { customMessage: 'Failed to send peer request. Please try again.' });
    }
  };

  const searchUsers = async () => {
    if (searchQuery.trim().length < 2) return;
    
    try {
      const results = await apiService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      // Don't show error for throttled search requests
      handleError(error, { silent: true });
    }
  };

  const acceptPeerRequest = async (requestId) => {
    try {
      await apiService.acceptPeerRequest(requestId);
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      
      // Refresh peers data (cached, so it won't cause excessive requests)
      const updatedPeers = await apiService.getPeers();
      setPeers(updatedPeers);
      
      alert('Peer request accepted!');
    } catch (error) {
      console.error('Error accepting peer request:', error);
      handleError(error, { customMessage: 'Failed to accept peer request. Please try again.' });
    }
  };

  const rejectPeerRequest = async (requestId) => {
    try {
      await apiService.rejectPeerRequest(requestId);
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      alert('Peer request rejected.');
    } catch (error) {
      console.error('Error rejecting peer request:', error);
      handleError(error, { customMessage: 'Failed to reject peer request. Please try again.' });
    }
  };

  const removePeer = async (peerId) => {
    if (window.confirm('Are you sure you want to remove this peer? This will also remove any shared topics.')) {
      try {
        await apiService.removePeer(peerId);
        setPeers(peers.filter(peer => peer.id !== peerId));
        alert('Peer removed successfully. All shared topics have been revoked.');
      } catch (error) {
        console.error('Error removing peer:', error);
        handleError(error, { customMessage: 'Failed to remove peer. Please try again.' });
      }
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="peers-view">
      <div className="peers-section">
        <h3>Find New Peers</h3>
        <div className="search-section">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username..."
            className="search-input"
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div key={user.id} className="search-result">
                  <span>{user.username}</span>
                  <button
                    className="add-peer-btn"
                    onClick={() => sendPeerRequest(user.id)}
                  >
                    Add Peer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="peers-section">
          <h3>Pending Requests ({pendingRequests.length})</h3>
          <div className="requests-grid">
            {pendingRequests.map(request => (
              <div key={request.id} className="request-card">
                <span>{request.requester?.username || 'Unknown User'}</span>
                <div className="request-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => acceptPeerRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => rejectPeerRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="peers-section">
        <h3>Your Peers ({peers.length})</h3>
        <div className="peers-grid">
          {peers.map(peer => (
            <div key={peer.id} className="peer-card">
              <span>{getPeerName(peer)}</span>
              <button 
                className="remove-peer-btn"
                onClick={() => removePeer(peer.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeersView;