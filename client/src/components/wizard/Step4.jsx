import React from 'react';

export default function Step4({ onNext, onBack }) {
  const handleSubmit = e => {
    e.preventDefault();
    onNext({});
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Step 4 – Placeholder</h2>
      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}
