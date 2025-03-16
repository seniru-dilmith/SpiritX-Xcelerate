import React, { useState } from 'react';
import { signup } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PasswordStrength from '../components/PasswordStrength';
import TitleBar from '../components/TitleBar';
import Footer from '../components/Footer';

const signupSchema = z.object({
  username: z.string().min(5, 'Username must be at least 5 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[\W_]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: ''});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    try {
      signupSchema.parse(formData);
      setLoading(true);
      await signup(formData);
      alert('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      if (err.errors) {
        const newErrors: any = {};
        err.errors.forEach((error: any) => {
          newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
      } else {
        setServerError(err.response?.data?.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cover bg-center bg-[url('/welcome-bg.jpg')] min-h-screen">
      <TitleBar title="SecureConnect-Spirit11" subtitle="Signup Page"/>
      <div className="max-w-md mx-auto mt-10 p-4 border bg-white/70 rounded-4xl">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        {serverError && <div className="mb-2 text-red-500 ">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
            <PasswordStrength password={formData.password} />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
      <Footer  position="fixed"/>
    </div>
  );
};

export default Signup;
