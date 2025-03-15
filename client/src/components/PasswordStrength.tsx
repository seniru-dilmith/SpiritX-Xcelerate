import React from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = () => {
    let hasLength = password.length >= 8;
    let hasUpper = /[A-Z]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasNumber = /[0-9]/.test(password);
    let hasSpecial = /[\W_]/.test(password);
  
    let strength = 0;
  
    if (hasLength) strength += 1;
  
    // Ensure at least one of each category before increasing strength beyond 2
    if (hasUpper && hasLower && hasNumber && hasSpecial) {
      if (hasUpper) strength += 1;
      if (hasLower) strength += 1;
      if (hasNumber) strength += 1;
      if (hasSpecial) strength += 1;
    }
  
    return strength;
  };

  const strength = getStrength();
  const strengthLabel =
    ["Too Short", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength] ||
    "Very Strong";

  // Tailwind classes
  const strengthColors = [
    "text-gray-400",
    "text-red-500",
    "text-orange-400",
    "text-yellow-400",
    "text-green-400",
    "text-green-600",
  ];
  const barColors = [
    "bg-gray-300",
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600",
  ];

  return (
    <div className="mt-3">
      <p className={`mb-1 text-sm font-medium ${strengthColors[strength]}`}>
        Password Strength: <strong>{strengthLabel}</strong>
      </p>

      {/* Animated Strength Bar */}
      <div className="w-full h-2 bg-gray-300 rounded overflow-hidden">
        <motion.div
          className={`h-2 ${barColors[strength]} rounded transition-all`}
          initial={{ width: "0%" }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default PasswordStrength;
