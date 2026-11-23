import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, MapPin, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

export default function HostPropertyForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const imagePreviews = selectedImages.map(file => URL.createObjectURL(file));
    setPreviews(imagePreviews);
    return () => imagePreviews.forEach(URL.revokeObjectURL);
  }, [selectedImages]);

  const selectImages = event => {
    const incoming = Array.from(event.target.files || []);
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const valid = incoming.filter(file => allowedTypes.has(file.type) && file.size <= 5 * 1024 * 1024);
    if (valid.length !== incoming.length) {
      toast.error('Choose JPG, PNG, or WebP photos that are 5 MB or smaller.');
    }
    const remaining = Math.max(0, 5 - selectedImages.length);
    if (valid.length > remaining) toast.error('A listing can include up to 5 photos.');
    setSelectedImages(current => [...current, ...valid.slice(0, remaining)]);
    event.target.value = '';
  };

  const submit = async event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const listing = new FormData();
    ['title', 'description', 'location', 'price', 'maxGuests', 'amenities'].forEach(field => {
      listing.append(field, String(formData.get(field) || ''));
    });
    selectedImages.forEach(file => listing.append('images', file));

    setIsSubmitting(true);
    try {
      await api.post('/properties', listing);
      toast.success('Your listing is live');
      navigate('/host/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit this listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="onboarding-page">
      <header className="dashboard-header">
        <Link className="auth-brand auth-brand-dark" to="/">
          <span className="brand-mark"><MapPin size={18} strokeWidth={2.5} /></span>
          <span>NEST<span className="brand-accent">RIVO</span></span>
        </Link>
        <Link className="onboarding-back" to="/host/dashboard"><ArrowLeft size={15} /> Host dashboard</Link>
      </header>
      <section className="onboarding-content">
        <p className="eyebrow login-eyebrow">YOUR SPACE, YOUR STORY</p>
        <h1>List a home</h1>
        <p className="dashboard-intro">Your home will be visible to guests as soon as you publish it.</p>
        <form className="onboarding-form" onSubmit={submit}>
          <div className="field-group"><label htmlFor="property-title">Listing title</label><input id="property-title" name="title" minLength="3" maxLength="120" required /></div>
          <div className="field-group"><label htmlFor="property-location">Location</label><input id="property-location" name="location" minLength="2" maxLength="200" required /></div>
          <div className="field-group"><label htmlFor="property-description">Description</label><textarea id="property-description" name="description" rows="4" minLength="10" maxLength="5000" required /></div>
          <div className="onboarding-fields-row">
            <div className="field-group"><label htmlFor="property-price">Price per night ($)</label><input id="property-price" name="price" type="number" min="1" step="1" required /></div>
            <div className="field-group"><label htmlFor="property-guests">Maximum guests</label><input id="property-guests" name="maxGuests" type="number" min="1" max="50" defaultValue="2" required /></div>
          </div>
          <div className="field-group photo-upload-field">
            <label htmlFor="property-images">Photos of your place <span>(choose from your device)</span></label>
            <div className="photo-upload-control">
              <ImagePlus size={19} />
              <span>Choose up to 5 photos</span>
              <small>JPG, PNG, or WebP · 5 MB max each</small>
              <input
                id="property-images"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={selectImages}
              />
            </div>
            {previews.length > 0 && (
              <div className="photo-preview-grid">
                {previews.map((preview, index) => (
                  <div className="photo-preview" key={`${selectedImages[index].name}-${selectedImages[index].lastModified}`}>
                    <img src={preview} alt={`Selected photo ${index + 1}`} />
                    <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setSelectedImages(current => current.filter((_, itemIndex) => itemIndex !== index))}><X size={14} /></button>
                    <span>{selectedImages[index].name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="field-group"><label htmlFor="property-amenities">Amenities <span>(comma separated)</span></label><input id="property-amenities" name="amenities" placeholder="Wifi, Kitchen, Parking" /></div>
          <button className="sign-in-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit listing'}</button>
        </form>
      </section>
    </main>
  );
}
