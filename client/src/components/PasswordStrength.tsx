import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Too Short';

  return (
    <div className="mt-1">
      <p>Password Strength: <strong>{strengthLabel}</strong></p>
    </div>
  );
};

export default PasswordStrength;
