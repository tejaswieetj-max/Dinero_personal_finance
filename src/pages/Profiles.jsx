import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DEFAULT_PROFILES = [
  { name: "Zeph", avatar: "assets/avatars/avatar1.png" },
  { name: "Tejas", avatar: "assets/avatars/avatar2.png" },
  { name: "Andrea", avatar: "assets/avatars/avatar3.png" },
  { name: "Mrini", avatar: "assets/avatars/avatar4.png" },
  { name: "Thanu", avatar: "assets/avatars/avatar5.png" },
  { name: "Tani", avatar: "assets/avatars/avatar1.png" },
  { name: "Div", avatar: "assets/avatars/avatar2.png" },
  { name: "Sam", avatar: "assets/avatars/avatar3.png" },
  { name: "Daniel", avatar: "assets/avatars/avatar4.png" },
  { name: "Zahra", avatar: "assets/avatars/avatar5.png" },
  { name: "Aditi", avatar: "assets/avatars/avatar1.png" },
];

const Profiles = () => {
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
  const [isManaging, setIsManaging] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const selectProfile = (profile) => {
    setUser(profile);
    navigate('/auth-method');
  };

  const addProfile = () => {
    const name = prompt("Enter a name for the new profile:");
    if (!name) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const avatarIndex = (profiles.length % 5) + 1;
    const avatar = `assets/avatars/avatar${avatarIndex}.png`;

    setProfiles([...profiles, { name: trimmed, avatar }]);
  };

  const deleteProfile = (index) => {
    const newProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(newProfiles);
  };

  return (
    <div className="profiles-bg">
      <button className="theme-toggle">ð</button>
      <h1 className="profiles-title">Choose Account</h1>
      <div className="profiles-grid">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="profile-card"
            onClick={() => !isManaging && selectProfile(profile)}
            style={{ cursor: isManaging ? 'default' : 'pointer' }}
          >
            <div className="profile-avatar">
              <img src={profile.avatar} alt={profile.name} />
            </div>
            <p>{profile.name}</p>
            {isManaging && (
              <button
                className="profile-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProfile(index);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div className="profile-card add" onClick={addProfile}>
          <div className="profile-avatar add-avatar">+</div>
          <p>Add Profile</p>
        </div>
      </div>
      <button 
        className="manage-btn" 
        onClick={() => setIsManaging(!isManaging)}
      >
        {isManaging ? "DONE" : "MANAGE ACCOUNTS"}
      </button>
    </div>
  );
};

export default Profiles;
