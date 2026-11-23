import React from 'react';

export default function Step8({ onNext, onBack }) {
  const handleSubmit = e => {
    e.preventDefault();
    // final step – just call onNext (which will submit the data)
    onNext({});
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Step 8 – Placeholder (Publish)</h2>
      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Finish</button>
    </form>
  );
}
