(function() {
  'use strict';

  // Default configuration - Brand colors from denizleventtulay.de
  const defaultConfig = {
    primaryColor: '652126', // burgundy
    bgColor: 'EFEDE5', // cream
    buttonText: 'Termin buchen',
    buttonStyle: 'default', // 'default', 'outline', 'minimal'
    modalWidth: '900px',
    modalHeight: '700px',
  };

  // Get script tag and read data attributes
  const scriptTag = document.currentScript;
  const baseUrl = scriptTag?.getAttribute('data-base-url') || window.location.origin;

  const config = {
    ...defaultConfig,
    primaryColor: scriptTag?.getAttribute('data-primary-color') || defaultConfig.primaryColor,
    bgColor: scriptTag?.getAttribute('data-bg-color') || defaultConfig.bgColor,
    buttonText: scriptTag?.getAttribute('data-button-text') || defaultConfig.buttonText,
    buttonStyle: scriptTag?.getAttribute('data-button-style') || defaultConfig.buttonStyle,
    modalWidth: scriptTag?.getAttribute('data-modal-width') || defaultConfig.modalWidth,
    modalHeight: scriptTag?.getAttribute('data-modal-height') || defaultConfig.modalHeight,
  };

  // Styles
  const styles = `
    .tekom-booking-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    .tekom-booking-modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .tekom-booking-modal {
      background: white;
      border-radius: 12px;
      width: 95%;
      max-width: ${config.modalWidth};
      height: 90%;
      max-height: ${config.modalHeight};
      position: relative;
      overflow: hidden;
      transform: scale(0.9);
      transition: transform 0.3s;
    }
    .tekom-booking-modal-overlay.open .tekom-booking-modal {
      transform: scale(1);
    }
    .tekom-booking-modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border: none;
      background: #f3f4f6;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.2s;
    }
    .tekom-booking-modal-close:hover {
      background: #e5e7eb;
    }
    .tekom-booking-modal-close svg {
      width: 16px;
      height: 16px;
      color: #6b7280;
    }
    .tekom-booking-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .tekom-booking-button {
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.05em;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .tekom-booking-button.default {
      background: #${config.primaryColor};
      color: #EFEDE5;
      border: none;
    }
    .tekom-booking-button.default:hover {
      opacity: 0.9;
    }
    .tekom-booking-button.outline {
      background: transparent;
      color: #${config.primaryColor};
      border: 2px solid #${config.primaryColor};
    }
    .tekom-booking-button.outline:hover {
      background: #${config.primaryColor}10;
    }
    .tekom-booking-button.minimal {
      background: transparent;
      color: #${config.primaryColor};
      border: none;
      padding: 8px 16px;
    }
    .tekom-booking-button.minimal:hover {
      background: #${config.primaryColor}10;
    }
    .tekom-booking-button svg {
      width: 18px;
      height: 18px;
    }
    @media (max-width: 640px) {
      .tekom-booking-modal {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        border-radius: 0;
      }
    }
  `;

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create modal HTML
  const modalHTML = `
    <div class="tekom-booking-modal-overlay" id="tekom-booking-modal">
      <div class="tekom-booking-modal">
        <button class="tekom-booking-modal-close" onclick="TekomBooking.close()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <iframe
          class="tekom-booking-iframe"
          src="${baseUrl}/embed/booking?primaryColor=${config.primaryColor}&bgColor=${config.bgColor}"
          allow="clipboard-write"
        ></iframe>
      </div>
    </div>
  `;

  // Add modal to body
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Get modal element
  const modal = document.getElementById('tekom-booking-modal');

  // Listen for booking success message
  window.addEventListener('message', function(event) {
    if (event.data?.type === 'TEKOM_BOOKING_SUCCESS') {
      // Optionally close modal after success
      // TekomBooking.close();

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('tekomBookingSuccess', {
        detail: event.data.data
      }));
    }
  });

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      TekomBooking.close();
    }
  });

  // Close on overlay click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      TekomBooking.close();
    }
  });

  // Global API
  window.TekomBooking = {
    open: function() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    },
    close: function() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    },
    // Create a booking button
    createButton: function(container, options = {}) {
      const btn = document.createElement('button');
      btn.className = `tekom-booking-button ${options.style || config.buttonStyle}`;
      btn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        ${options.text || config.buttonText}
      `;
      btn.onclick = function() {
        TekomBooking.open();
      };

      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (container) {
        container.appendChild(btn);
      }
      return btn;
    }
  };

  // Auto-create buttons for elements with data-tekom-booking attribute
  document.querySelectorAll('[data-tekom-booking]').forEach(function(el) {
    el.addEventListener('click', function() {
      TekomBooking.open();
    });
  });

})();
