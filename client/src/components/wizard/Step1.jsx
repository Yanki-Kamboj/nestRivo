import React from 'react';

export default function Step1({ onNext, defaultValues }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({}); // send empty data for placeholder
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Step 1 – Placeholder</h2>
      <button type="submit">Next</button>
    </form>
  );
}
