// Offer cards interactivity and animations
document.addEventListener('DOMContentLoaded', () => {
    const offerCards = document.querySelectorAll('.offer-card');
    const offerButtons = document.querySelectorAll('.offer-button');

    // Add click animation to buttons
    offerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const card = this.closest('.offer-card');
            const tier = card.getAttribute('data-tier');
            const offerTitle = card.querySelector('.offer-title').textContent;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Log the offer claim (in real app, this would trigger actual purchase flow)
            console.log(`Claimed offer: ${offerTitle} (${tier} tier)`);
            
            // Show confirmation animation
            showConfirmation(this);
        });
    });

    // Parallax effect on card hover
    offerCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Countdown timer animation
    animateTimers();
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .offer-button {
        position: relative;
        overflow: hidden;
    }
    
    @keyframes success-pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .success-animation {
        animation: success-pulse 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

// Show confirmation when offer is claimed
function showConfirmation(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Claimed!';
    button.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    button.classList.add('success-animation');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #8B5CF6, #EC4899)';
        button.classList.remove('success-animation');
    }, 2000);
}

// Animate countdown timers
function animateTimers() {
    const timers = document.querySelectorAll('.offer-timer span');
    
    timers.forEach(timer => {
        const originalText = timer.textContent;
        let hasAnimated = false;
        
        setInterval(() => {
            if (!hasAnimated) {
                timer.style.transition = 'all 0.3s ease';
                timer.style.color = '#EC4899';
                timer.style.fontWeight = '700';
                
                setTimeout(() => {
                    timer.style.color = '';
                    timer.style.fontWeight = '500';
                }, 300);
                
                hasAnimated = true;
            }
        }, 3000);
    });
}

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe all offer cards
document.querySelectorAll('.offer-card').forEach(card => {
    observer.observe(card);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused.classList.contains('offer-button')) {
            focused.click();
        }
    }
});

// Add focus styles for accessibility
document.querySelectorAll('.offer-button').forEach(button => {
    button.setAttribute('tabindex', '0');
    button.addEventListener('focus', () => {
        button.style.outline = '2px solid #8B5CF6';
        button.style.outlineOffset = '2px';
    });
    button.addEventListener('blur', () => {
        button.style.outline = 'none';
    });
});
