import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';  // Import the custom hook to access the context

const EditProfile = () => {
  const { firstName, lastName, setIsLoggedIn } = useUser();  // Get context values and the setIsLoggedIn function
  const [newFirstName, setNewFirstName] = useState(firstName || '');  // Set default to current first name or empty string
  const [newLastName, setNewLastName] = useState(lastName || '');  // Set default to current last name or empty string

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update context and localStorage with the new values
    setIsLoggedIn(true, newFirstName, newLastName);  // Call the context's setter to update values in context and localStorage

    // Optionally, you can show a success message, or reset the form fields
    alert('Profile updated successfully!');
  };

  return (
    <div className="container">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}  // Update state as the user types
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}  // Update state as the user types
          />
        </div>
        <button type="submit" className="btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;

