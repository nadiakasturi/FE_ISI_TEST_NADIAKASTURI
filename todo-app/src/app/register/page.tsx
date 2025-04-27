"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Team',
    teamId: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { role, teamId, ...rest } = formData;

    const teamIdInt = role === 'Team' ? parseInt(teamId) : null;

    const requestData = {
      ...rest,
      role,
      teamId: teamIdInt,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || 'An error occurred during registration.');
        return;
      }

      router.push('/login');  
    } catch {
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4 flex flex-col items-center">
          <label className="text-center mb-2 text-lg">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="Team">Team</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        {formData.role === 'Team' && (
          <div className="mb-4">
            <input
              type="text"
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              placeholder="Team ID"
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Register
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account ?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login 
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
