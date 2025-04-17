class UserGuide {
    constructor() {
        this.hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial') === 'true';
        this.currentToast = null;
        this.isWaitingForTopicHover = false;
        this.isWaitingForCourseHover = false;
        
        // Check if mobile and show warning
        if (window.innerWidth < 768) {
            this.showMobileWarning();
        }
        
        // Hide share panel initially if tutorial hasn't been completed
        if (!this.hasCompletedTutorial) {
            const sharePanel = document.querySelector('.social-share-panel');
            if (sharePanel) {
                sharePanel.style.display = 'none';
            }
        }
    }

    async start() {
        if (this.hasCompletedTutorial) {
            // If tutorial is already completed, show share panel and cohort toast after delay
            setTimeout(() => {
                const sharePanel = document.querySelector('.social-share-panel');
                const cohortToast = document.getElementById('cohortToast');
                if (sharePanel) {
                    sharePanel.style.display = '';
                    setTimeout(() => sharePanel.classList.add('visible'), 100);
                }
                if (cohortToast) {
                    cohortToast.classList.remove('hidden');
                }
            }, 5000);
            return;
        }

        // Welcome message (keep in top-right)
        await this.showToast('👋 Welcome to the Kubestronaut Knowledge Graph.', 3000, 'info');
        
        // Get the first topic element
        const firstTopic = document.querySelector('.topic-box');
        
        // Topic hover instruction next to first topic
        this.isWaitingForTopicHover = true;
        await this.showToast('👈 Try hovering over a topic to see if it\'s present in other courses.', null, 'info', firstTopic);
        
        // Wait for topic hover
        await this.waitForTopicHover();
        await this.showToast('✅ Great Job!', 2000, 'success', firstTopic);
        
        // Get the first course title
        const firstCourseTitle = document.querySelector('.course-title');
        
        // Course hover instruction next to first course title
        this.isWaitingForCourseHover = true;
        await this.showToast('👈 Now hover over a course name to see how topics in that course are linked to other courses. Click to leave the selection on.', null, 'info', firstCourseTitle);
        
        // Wait for course hover
        await this.waitForCourseHover();
        
        // Final success message with share buttons
        const finalMessage = `
            <div class="flex flex-col gap-4">
                <span>🎉 Great Job! If you found this helpful, share it with your friends!</span>
                <div class="flex gap-2">
                    <button onclick="shareOnLinkedIn()" class="share-button-small linkedin p-2 rounded-full hover:opacity-80">
                        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ffffff" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>
                    </button>
                    <button onclick="shareOnTwitter()" class="share-button-small twitter p-2 rounded-full hover:opacity-80">
                        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/></svg>
                    </button>
                    <button onclick="shareOnBlueSky()" class="share-button-small bluesky p-2 rounded-full hover:opacity-80">
                        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/></svg>
                    </button>
                </div>
            </div>
        `;
        
        await this.showToast(finalMessage, 20000, 'success', firstCourseTitle);
        
        // After tutorial completes, show the cohort toast
        const cohortToast = document.getElementById('cohortToast');
        if (cohortToast) {
            cohortToast.classList.remove('hidden');
        }

        // Mark tutorial as completed
        this.hasCompletedTutorial = true;
        localStorage.setItem('hasCompletedTutorial', 'true');
    }

    createToast(message, type = 'info', targetElement = null) {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-900/10 backdrop-blur-md border border-green-200/20 text-white',
            error: 'bg-red-900/10 backdrop-blur-md border border-red-200/20 text-white',
            info: 'bg-blue-900/10 backdrop-blur-md border border-blue-200/20 text-white',
            warning: 'bg-yellow-900/10 backdrop-blur-md border border-yellow-200/20 text-white'
        };
        
        // Remove fixed positioning and adjust base classes
        toast.className = `absolute ${colors[type]} px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out opacity-0 z-50 flex items-center gap-2`;
        toast.style.maxWidth = '300px';
        
        toast.innerHTML = `
            <span>${message}</span>
            <button class="ml-auto hover:text-gray-200" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Position the toast relative to the target element if provided
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Position toast to the right of the element
            toast.style.left = `${rect.right + 20}px`;
            toast.style.top = `${rect.top + scrollTop - 10}px`;
        } else {
            // Fallback to top-right corner if no target element
            toast.style.top = '1rem';
            toast.style.right = '1rem';
        }
        
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.remove('opacity-0');
        });
        
        return toast;
    }

    async showToast(message, duration = null, type = 'info', targetElement = null) {
        return new Promise((resolve) => {
            if (this.currentToast) {
                this.currentToast.remove();
            }

            this.currentToast = this.createToast(message, type, targetElement);
            
            if (duration) {
                setTimeout(() => {
                    this.currentToast.remove();
                    resolve();
                }, duration);
            } else {
                resolve();
            }
        });
    }

    waitForTopicHover() {
        return new Promise((resolve) => {
            const topicHoverHandler = () => {
                if (!this.isWaitingForTopicHover) return;
                this.isWaitingForTopicHover = false;
                document.removeEventListener('mouseover', topicHoverHandler);
                resolve();
            };

            document.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('topic-box')) {
                    topicHoverHandler();
                }
            });
        });
    }

    waitForCourseHover() {
        return new Promise((resolve) => {
            const courseHoverHandler = () => {
                if (!this.isWaitingForCourseHover) return;
                this.isWaitingForCourseHover = false;
                document.removeEventListener('mouseover', courseHoverHandler);
                resolve();
            };

            document.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('course-title')) {
                    courseHoverHandler();
                }
            });
        });
    }

    showMobileWarning() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-dark-800 rounded-lg p-6 max-w-sm w-full shadow-xl border border-dark-700">
                <h3 class="text-xl font-bold text-white mb-4">🚀 Houston, We Have a Mobile Device!</h3>
                <p class="text-gray-300 mb-6">
                    This interactive knowledge graph is best viewed on a desktop device for the full experience.
                </p>
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Launch Anyway 🛸
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add click handler to close button
        modal.querySelector('button').addEventListener('click', () => {
            modal.classList.add('fade-out');
            setTimeout(() => modal.remove(), 300);
        });
    }
}

// Initialize the guide when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const guide = new UserGuide();
    guide.start();
}); 