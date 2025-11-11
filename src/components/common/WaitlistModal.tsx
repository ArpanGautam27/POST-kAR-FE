import { useState } from 'react';
import { config } from '../../config/environment';
import './WaitlistModal.css';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const newErrors = { name: '', email: '', phone: '' };

    // Validate all fields
    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number.';
      }
    }

    setErrors(newErrors);

    // If there are any errors, don't proceed
    if (newErrors.name || newErrors.email || newErrors.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use production API URL for waitlist (always use post-kar.com for waitlist)
      const apiUrl = config.isProduction 
        ? 'https://post-kar.com/api/waitlist/join'
        : `${config.apiBaseUrl}/api/waitlist/join`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Auto-close modal after 10 seconds
        setTimeout(() => {
          handleClose();
        }, 10000);
      } else if (response.status === 409) {
        // Handle duplicate phone number or email
        const errorData = await response.json();
        const errorMessage = errorData.message || '';
        
        if (errorMessage.toLowerCase().includes('phone')) {
          setErrors(prev => ({ ...prev, phone: 'This phone number is already registered.' }));
        } else if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: 'This email address is already registered.' }));
        } else {
          setErrors(prev => ({ ...prev, email: 'This information is already registered.' }));
        }
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPhone('');
    setName('');
    setSubmitted(false);
    setErrors({ name: '', email: '', phone: '' });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="waitlist-modal-overlay" onClick={handleClose}>
      <div className="waitlist-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="waitlist-modal-close" onClick={handleClose}>×</button>
        
        {submitted ? (
          <>
            <h2 className="waitlist-modal-title">Muchas Gracias Aficion Siuuu!!!</h2>
            <div className="waitlist-success-message">
              <p>✓ Thank you for joining!</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                We'll contact you soon with exclusive updates.
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="waitlist-modal-title">Join Our Waitlist</h2>
            <p className="waitlist-modal-desc">Fill in your details to get early access</p>

            <div className="waitlist-modal-form">
              <div className="waitlist-form-group">
                <label htmlFor="waitlist-name">Full Name</label>
                <input
                  id="waitlist-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`waitlist-form-input ${errors.name ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="waitlist-error-message">{errors.name}</span>}
              </div>

              <div className="waitlist-form-group">
                <label htmlFor="waitlist-email">Email Address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`waitlist-form-input ${errors.email ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="waitlist-error-message">{errors.email}</span>}
              </div>

              <div className="waitlist-form-group">
                <label htmlFor="waitlist-phone">Phone Number</label>
                <input
                  id="waitlist-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`waitlist-form-input ${errors.phone ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.phone && <span className="waitlist-error-message">{errors.phone}</span>}
              </div>

              <button 
                onClick={handleSubmit} 
                className="waitlist-modal-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
