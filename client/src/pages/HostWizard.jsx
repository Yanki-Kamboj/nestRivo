import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1 from '../components/wizard/Step1';
import Step2 from '../components/wizard/Step2';
import Step3 from '../components/wizard/Step3';
import Step4 from '../components/wizard/Step4';
import Step5 from '../components/wizard/Step5';
import Step6 from '../components/wizard/Step6';
import Step7 from '../components/wizard/Step7';
import Step8 from '../components/wizard/Step8';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const steps = [
  { component: Step1, label: 'Type' },
  { component: Step2, label: 'Location' },
  { component: Step3, label: 'Details' },
  { component: Step4, label: 'Amenities' },
  { component: Step5, label: 'Images' },
  { component: Step6, label: 'Pricing' },
  { component: Step7, label: 'Policies' },
  { component: Step8, label: 'Publish' },
];

export default function HostWizard() {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const Next = (stepData) => {
    const newData = { ...data, ...stepData };
    setData(newData);
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      // final submit
      api
        .post('/properties', newData)
        .then(() => {
          toast.success('Property created');
          navigate('/host/properties');
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Failed to create');
        });
    }
  };

  const Prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const StepComponent = steps[current].component;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Add New Property – Step {current + 1} of {steps.length}</h2>
      <StepComponent onNext={Next} onBack={Prev} defaultValues={data} />
    </div>
  );
}
