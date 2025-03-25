const svgIcons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>`,
    failure: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>`
};

(function() {
    const styles = `
        :root {
            /* Background Colors */
            --sd-bg-light: #f9f9f9;
            --sd-bg-dark: #282828;
            
            /* Notification Type Colors */
            --sd-success-color: #4CAF50;
            --sd-failure-color: #f44336;
            --sd-warning-color: #ff9800;
            --sd-info-color: #2196F3;
            
            /* Text Colors */
            --sd-text-primary-light: #030303;
            --sd-text-primary-dark: #ffffff;
            --sd-text-secondary-light: rgba(0,0,0,0.7);
            --sd-text-secondary-dark: rgba(255,255,255,0.7);
            
            /* Close Button Colors */
            --sd-close-btn-light: rgba(0,0,0,0.5);
            --sd-close-btn-dark: rgba(255,255,255,0.5);
            
            /* Progress Bar Colors */
            --sd-progress-bar-color: rgba(0,0,0,0.2);
            
            /* Shadow */
            --sd-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        #sd-notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            width: 350px;
            font-family: Arial, sans-serif;
        }
        .sd-notification {
            display: flex;
            align-items: center;
            background-color: var(--sd-bg-light);
            border-radius: 8px;
            box-shadow: var(--sd-shadow);
            margin-bottom: 10px;
            padding: 12px 15px;
            overflow: hidden;
            animation: sd-slide-in 0.3s ease-out;
            position: relative;
        }
        .sd-notification-icon {
            margin-right: 12px;
            display: flex;
            align-items: center;
        }
        .sd-notification-content {
            flex-grow: 1;
        }
        .sd-notification-title {
            font-weight: 600;
            margin-bottom: 4px;
            color: var(--sd-text-primary-light);
        }
        .sd-notification-message {
            color: var(--sd-text-secondary-light);
            font-size: 14px;
        }
        .sd-notification-close {
            background: none;
            border: none;
            color: var(--sd-close-btn-light);
            cursor: pointer;
            font-size: 18px;
            padding: 0 5px;
            transition: color 0.2s;
        }
        .sd-notification-close:hover {
            color: rgba(0,0,0,0.8);
        }
        .sd-notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background-color: var(--sd-progress-bar-color);
            width: 100%;
            transform-origin: left;
            animation: sd-progress-bar 3s linear;
        }
        .sd-notification-success { 
            background-color: var(--sd-success-color); 
            color: var(--sd-text-primary-dark); 
        }
        .sd-notification-failure { 
            background-color: var(--sd-failure-color); 
            color: var(--sd-text-primary-dark); 
        }
        .sd-notification-warning { 
            background-color: var(--sd-warning-color); 
            color: var(--sd-text-primary-dark); 
        }
        .sd-notification-info { 
            background-color: var(--sd-info-color); 
            color: var(--sd-text-primary-dark); 
        }
        @keyframes sd-slide-in {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes sd-progress-bar {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
    `;

    class NotificationManager {
        constructor() {
            this.container = null;
            this.maxNotifications = 3;
            this.init();
        }

        init() {
            // Create style element
            const styleEl = document.createElement('style');
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);

            // Create container
            this.container = document.createElement('div');
            this.container.id = 'sd-notification-container';
            document.body.appendChild(this.container);
        }

        create(type, title, message) {
            // Remove excess notifications
            while (this.container.children.length >= this.maxNotifications) {
                this.container.removeChild(this.container.firstChild);
            }

            const notification = document.createElement('div');
            notification.className = `sd-notification sd-notification-${type}`;

            notification.innerHTML = `
                <div class="sd-notification-icon">
                    ${svgIcons[type]}
                </div>
                <div class="sd-notification-content">
                    <div class="sd-notification-title">${title}</div>
                    <div class="sd-notification-message">${message}</div>
                </div>
                <button class="sd-notification-close">&times;</button>
                <div class="sd-notification-progress"></div>
            `;

            // Add close button functionality
            const closeBtn = notification.querySelector('.sd-notification-close');
            closeBtn.addEventListener('click', () => this.remove(notification));

            // Auto-remove after animation
            setTimeout(() => this.remove(notification), 3000);

            this.container.appendChild(notification);
        }

        remove(notification) {
            notification.style.animation = 'sd-slide-in 0.3s ease-out reverse';
            setTimeout(() => {
                this.container.removeChild(notification);
            }, 300);
        }

        success(message = '') {
            this.create('success', 'Success', message);
        }

        failure(message = '') {
            this.create('failure', 'Error', message);
        }

        warning(message = '') {
            this.create('warning', 'Warning', message);
        }

        info(message = '') {
            this.create('info', 'Info', message);
        }
    }

    const notifications = new NotificationManager();
    window.success = notifications.success.bind(notifications);
    window.failure = notifications.failure.bind(notifications);
    window.warning = notifications.warning.bind(notifications);
    window.info = notifications.info.bind(notifications);
})();
