import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from './usersSlice';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './AddUserForm.css';

export const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize navigate

  const canSave = Boolean(name) && Boolean(email) && Boolean(password);

  const onSaveUserClicked = async () => {
    if (canSave) {
      await dispatch(addUser({ name, email, password, role }));
      setName('');
      setEmail('');
      setPassword('');
      setRole('customer');
    }
  };

  // Handle Cancel action - navigate to home page
  const onCancelClicked = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('customer');
    navigate('/');  // Navigate to home page
  };

  return (
    <div className="registration-form-container">
      <h1>Registration Form</h1> {/* This is the title of your form */}
      <form>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <div className="form-actions">
          <button type="button" onClick={onSaveUserClicked} disabled={!canSave}>
            Save
          </button>
          <button type="button" onClick={onCancelClicked} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};