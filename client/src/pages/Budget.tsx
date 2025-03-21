import React, { useEffect, useState } from 'react';
import { getBudget } from '../api/axios';

const Budget: React.FC = () => {
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    getBudget()
      .then(res => {
        console.log(res);
        
        setBudget(res.data.budget);
        console.log("123");
        
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Budget</h2>
      <p>Remaining Budget: Rs. {budget}</p>
    </div>
  );
};

export default Budget;
