import React, { useState } from 'react';

const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    company: '',
    position: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to send message via WhatsApp Business API
  const sendWhatsAppMessage = async (phoneNumber, message) => {
    // In a real implementation, you would use:
    // 1. WhatsApp Business API (requires backend integration)
    // 2. A third-party service like Twilio for WhatsApp
    
    // This is a mock implementation that simulates the API call
    try {
      // Replace this with actual API call in production
      const response = await mockWhatsAppAPI(phoneNumber, message);
      
      if (response.success) {
        console.log('WhatsApp message sent successfully');
        return true;
      } else {
        console.error('Failed to send WhatsApp message');
        return false;
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  };

  // Mock function to simulate WhatsApp API call
  const mockWhatsAppAPI = (phoneNumber, message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate API response
        console.log(`Sending to: ${phoneNumber}`);
        console.log(`Message: ${message}`);
        resolve({ success: true, messageId: Math.random().toString(36).substr(2, 9) });
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create personalized welcome message
      const message = `Welcome ${formData.firstName} ${formData.lastName}! Thank you for joining our platform. We're excited to have you on board as a ${formData.position} at ${formData.company}.`;
      
      // Format phone number (remove any non-digit characters except +)
      const phoneNumber = formData.mobile.replace(/[^\d+]/g, '');
      
      // Send message via WhatsApp
      const messageSent = await sendWhatsAppMessage(phoneNumber, message);
      
      if (messageSent) {
        setIsSubmitted(true);
      } else {
        alert('Failed to send WhatsApp message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      company: '',
      position: ''
    });
    setIsSubmitted(false);
  };

  // Real implementation example (commented out as it requires backend)
  /*
  const realWhatsAppAPICall = async (phoneNumber, message) => {
    // You would typically make this call from your backend
    const response = await fetch('https://your-backend.com/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        // Other required parameters for your WhatsApp API provider
      }),
    });
    
    return await response.json();
  };
  */

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Aboard!</h1>
          <p style={styles.subtitle}>Complete your onboarding process</p>
        </div>

        {!isSubmitted ? (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="firstName" style={styles.label}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="lastName" style={styles.label}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="mobile" style={styles.label}>Mobile Number (WhatsApp)</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+1234567890"
                required
                style={styles.input}
              />
              <small style={styles.smallText}>Include country code (e.g., +1 for US)</small>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="company" style={styles.label}>Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="position" style={styles.label}>Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <button 
              type="submit" 
              style={isLoading ? {...styles.submitBtn, ...styles.submitBtnDisabled} : styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Sending Message...' : 'Complete Onboarding'}
            </button>
          </form>
        ) : (
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>Onboarding Complete!</h2>
            <p style={styles.successText}>
              A welcome message has been sent via WhatsApp to {formData.mobile}. 
              We're excited to have you on board, {formData.firstName}!
            </p>
            <button style={styles.resetBtn} onClick={resetForm}>
              Start New Onboarding
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    color: 'white',
    padding: '30px 25px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '16px',
    opacity: '0.9',
  },
  form: {
    padding: '30px 25px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
    flex: '1',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  smallText: {
    display: 'block',
    marginTop: '5px',
    color: '#718096',
    fontSize: '12px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  submitBtnDisabled: {
    background: '#a0aec0',
    cursor: 'not-allowed',
  },
  successMessage: {
    padding: '40px 25px',
    textAlign: 'center',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    margin: '0 auto 20px',
  },
  successTitle: {
    fontSize: '24px',
    color: '#2d3748',
    marginBottom: '15px',
  },
  successText: {
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  resetBtn: {
    padding: '12px 25px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  },
};

export default OnboardingForm;