// Disable scroll restoration to prevent page from jumping to middle before drawing the lines as the lines then appear at wrong positions.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('data.json');
    const data = await response.json();
    window.courseData = data;
    
    const coursesContainer = document.getElementById('coursesContainer');
    const courseTemplate = document.getElementById('courseTemplate');
  
    // Track active selections
    let activeTopicElement = null;
    let activeCourseElement = null;
  
    data.courses.forEach(course => {
      const courseElement = courseTemplate.content.cloneNode(true);
      const courseCard = courseElement.querySelector('.course-card');
      const courseTitle = courseElement.querySelector('h2');
      const topicsContainer = courseElement.querySelector('.topics-container');
  
      courseCard.dataset.courseName = course.name;
  
      // Add completion percentage div
      const completionDiv = document.createElement('div');
      completionDiv.className = 'completion-percentage hidden';
      courseCard.insertBefore(completionDiv, courseCard.firstChild);
  
      // Add logo and title container
      const titleContainer = document.createElement('div');
      titleContainer.className = 'flex items-center justify-between mb-2';
  
      // Add certification logo
      const logo = document.createElement('img');
      logo.className = 'h-14 w-14';
      logo.alt = `${course.name} certification logo`;
      switch (course.name) {
        case 'CKA':
          logo.src = 'assets/cka-logo.svg';
          break;
        case 'CKAD':
          logo.src = 'assets/ckad-logo.svg';
          break;
        case 'KCNA':
          logo.src = 'assets/kcna-logo.svg';
          break;
        case 'CKS':
          logo.src = 'assets/cks-logo.svg';
          break;
        case 'KCSA':
          logo.src = 'assets/kcsa-logo.svg';
          break;
      }
  
      // Update course title with padding and add link
      courseTitle.className = 'course-title pl-2 flex items-center gap-2';
      courseTitle.textContent = course.name;
  
      // Add prerequisite subtitle for CKS
      if (course.name === 'CKS') {
        const prerequisite = document.createElement('p');
        prerequisite.className = 'text-sm text-red-800 pl-2 mt-1';
        prerequisite.textContent = 'Requires CKA';
        
        // Create a div to hold title and prerequisite vertically
        const titleStack = document.createElement('div');
        titleStack.className = 'flex flex-col';
        titleStack.appendChild(courseTitle);
        titleStack.appendChild(prerequisite);
        
        titleContainer.appendChild(titleStack);
      } else {
        titleContainer.appendChild(courseTitle);
      }
  
      // Add link icon after course name
      const linkIcon = document.createElement('a');
      linkIcon.href = getCourseLink(course.name);
      linkIcon.target = '_blank';
      linkIcon.className = 'text-gray-400 hover:text-blue-400';
      linkIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>`;
      courseTitle.appendChild(linkIcon);
  
      // Title first, then logo
      titleContainer.appendChild(logo);
      courseCard.insertBefore(titleContainer, topicsContainer);
  
      course.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-container';
  
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = section.name;
        sectionDiv.appendChild(sectionTitle);
  
        const sectionTopicsDiv = document.createElement('div');
        sectionTopicsDiv.className = 'flex flex-col';
  
        section.topics.forEach(topic => {
          const topicBox = document.createElement('div');
          topicBox.className = 'topic-box';
          topicBox.dataset.topic = topic;
          topicBox.textContent = topic;
          
          // Add both hover and click handlers
          topicBox.addEventListener('mouseenter', () => {
            if (!activeTopicElement && !activeCourseElement) { // Only highlight if nothing is active
              highlightMatchingTopics(topic);
            }
          });
          
          topicBox.addEventListener('mouseleave', () => {
            if (!activeTopicElement && !activeCourseElement) { // Only reset if nothing is active
              resetTopicHighlights();
            }
          });
          
          // Click handler for persistent highlight
          topicBox.addEventListener('click', () => {
            if (activeTopicElement === topicBox) {
              // If clicking the active topic, deactivate it
              resetTopicHighlights();
              activeTopicElement = null;
            } else {
              // If clicking a new topic, reset previous and activate new
              resetTopicHighlights();
              hideCompletionPercentages();
              activeCourseElement = null;
              highlightMatchingTopics(topic);
              activeTopicElement = topicBox;
            }
          });
          
          sectionTopicsDiv.appendChild(topicBox);
        });
  
        sectionDiv.appendChild(sectionTopicsDiv);
        topicsContainer.appendChild(sectionDiv);
      });
  
      // Similarly, update the course title event handlers:
      courseTitle.addEventListener('mouseenter', () => {
        if (!activeTopicElement && !activeCourseElement) { // Only highlight if nothing is active
          const currentCourseTopics = course.sections.flatMap(section => section.topics);
          const otherCoursesTopics = data.courses
            .filter(c => c.name !== course.name)
            .flatMap(c => c.sections.flatMap(s => s.topics));
          const sharedTopics = currentCourseTopics.filter(topic => 
            otherCoursesTopics.includes(topic)
          );
          highlightCourseTopics(sharedTopics);
          showCompletionPercentages(sharedTopics, course.name, data.courses);
        }
      });
  
      courseTitle.addEventListener('mouseleave', () => {
        if (!activeTopicElement && !activeCourseElement) { // Only reset if nothing is active
          resetTopicHighlights();
          hideCompletionPercentages();
        }
      });
  
      courseTitle.addEventListener('click', () => {
        if (activeCourseElement === courseTitle) {
          // If clicking the active course, deactivate it
          resetTopicHighlights();
          hideCompletionPercentages();
          activeCourseElement = null;
        } else {
          // If clicking a new course, reset previous and activate new
          resetTopicHighlights();
          activeTopicElement = null;
          const currentCourseTopics = course.sections.flatMap(section => section.topics);
          const otherCoursesTopics = data.courses
            .filter(c => c.name !== course.name)
            .flatMap(c => c.sections.flatMap(s => s.topics));
          const sharedTopics = currentCourseTopics.filter(topic => 
            otherCoursesTopics.includes(topic)
          );
          highlightCourseTopics(sharedTopics);
          showCompletionPercentages(sharedTopics, course.name, data.courses);
          activeCourseElement = courseTitle;
        }
      });
  
      coursesContainer.appendChild(courseElement);
    });
  
    // Add click handler to reset when clicking outside
    document.addEventListener('click', (event) => {
      const isTopicClick = event.target.classList.contains('topic-box');
      const isCourseClick = event.target.classList.contains('course-title');
      
      if (!isTopicClick && !isCourseClick) {
        resetTopicHighlights();
        hideCompletionPercentages();
        activeTopicElement = null;
        activeCourseElement = null;
      }
    });
  
    requestAnimationFrame(() => {
      setTimeout(() => {
        drawAllPossibleConnections(data.courses);
      }, 100);
    });
  
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    
    // Function to handle redrawing with debounce
    let redrawTimeout;
    const redrawConnections = () => {
      console.log('Redrawing connections');
      if (redrawTimeout) clearTimeout(redrawTimeout);
      redrawTimeout = setTimeout(() => {
        const svg = document.querySelector('.connections-svg');
        if (svg) svg.remove();
        
        // Get all visible topics
        const visibleTopics = document.querySelectorAll('.topic-box:not(.hidden)');
        const visibleTopicTexts = Array.from(visibleTopics).map(t => t.dataset.topic);
        
        drawConnectionsForTopics(visibleTopicTexts);
      }, 250);
    };
  
    // Handle window resize
    window.addEventListener('resize', redrawConnections);
  
    // Update the search input handler
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      const allTopics = document.querySelectorAll('.topic-box');
      const allSections = document.querySelectorAll('.section-container');
      
      // Reset any active highlights
      resetTopicHighlights();
      hideCompletionPercentages();
      activeTopicElement = null;
      activeCourseElement = null;
  
      allTopics.forEach(topic => {
        const topicText = topic.textContent.toLowerCase();
        if (searchTerm === '') {
          topic.classList.remove('hidden');
        } else {
          if (topicText.includes(searchTerm)) {
            topic.classList.remove('hidden');
          } else {
            topic.classList.add('hidden');
          }
        }
      });
  
      // Hide empty sections
      allSections.forEach(section => {
        const visibleTopics = section.querySelectorAll('.topic-box:not(.hidden)');
        if (visibleTopics.length === 0) {
          section.classList.add('hidden');
        } else {
          section.classList.remove('hidden');
        }
      });
  
      // Redraw connections after search
      redrawConnections();
    });
  });
  
  // Add this array at the top of the file with the other global variables
  const draculaColors = [
    ['#ff79c6', '#bd93f9'], // pink to purple
    ['#8be9fd', '#50fa7b'], // cyan to green
    ['#ffb86c', '#ff5555'], // orange to red
    ['#bd93f9', '#ff79c6'], // purple to pink
    ['#50fa7b', '#8be9fd'], // green to cyan
    ['#f1fa8c', '#ffb86c']  // yellow to orange
  ];
  
  // Add this function to detect Safari
  function isSafari() {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && 
             !/chrome/i.test(navigator.userAgent);
  }
  
  function highlightMatchingTopics(topic) {
    const allTopics = document.querySelectorAll('.topic-box');
    allTopics.forEach(topicElement => {
      if (topicElement.dataset.topic === topic) {
        topicElement.classList.add('bg-blue-600');
      } else {
        topicElement.classList.add('opacity-25');
      }
    });
    
    const connections = document.querySelectorAll('.connection-path, .connection-circle');
    connections.forEach(element => {
      if (element.dataset.topic === topic) {
        if (element.tagName.toLowerCase() === 'path') {
          element.setAttribute('stroke', `url(#${element.dataset.gradientId})`);
          
          // Only add animation if not Safari
          if (!isSafari()) {
              element.innerHTML = `
                  <animate attributeName="stroke-dashoffset" 
                           from="40" 
                           to="0" 
                           dur="1s" 
                           repeatCount="indefinite" />
              `;
          }
        } else if (element.tagName.toLowerCase() === 'circle') {
          // Get the gradient colors for this topic
          const gradientIndex = parseInt(element.dataset.gradientId.split('-')[1]);
          const colors = draculaColors[gradientIndex % draculaColors.length];
          // Use the start color of the gradient for circles
          element.setAttribute('fill', colors[0]);
        }
        element.style.filter = 'url(#glow)';
      } else {
        element.classList.add('opacity-25');
        if (element.tagName.toLowerCase() === 'path') {
          element.innerHTML = '';
        }
      }
    });
  }
  
  function highlightCourseTopics(topics) {
    const allTopics = document.querySelectorAll('.topic-box');
    allTopics.forEach(topicElement => {
      if (topics.includes(topicElement.dataset.topic)) {
        topicElement.classList.add('bg-blue-600');
      } else {
        topicElement.classList.add('opacity-25');
      }
    });
    drawConnectionsForCourse(topics);
  }
  
  function resetTopicHighlights() {
    const allTopics = document.querySelectorAll('.topic-box');
    allTopics.forEach(topicElement => {
      topicElement.classList.remove('bg-blue-600', 'opacity-25');
    });
    
    // Reset connections to muted color
    const connections = document.querySelectorAll('.connection-path, .connection-circle');
    connections.forEach(element => {
      element.setAttribute('stroke', '#262626');
      if (element.tagName === 'circle') {
        element.setAttribute('fill', '#262626');
      }
      element.style.filter = 'none';
      element.classList.remove('opacity-25');
      if (element.tagName.toLowerCase() === 'path') {
        element.innerHTML = ''; // Remove animation
      }
    });
  }
  
  function calculateCompletion(sourceTopics, targetCourse) {
    const targetTopics = targetCourse.sections.flatMap(section => section.topics);
    const commonTopics = targetTopics.filter(topic => sourceTopics.includes(topic));
    return Math.round((commonTopics.length / targetTopics.length) * 100);
  }
  
  function showCompletionPercentages(sourceTopics, sourceName, allCourses) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
      const cardCourseName = card.dataset.courseName;
      const percentageElement = card.querySelector('.completion-percentage');
      
      if (cardCourseName === sourceName) {
        percentageElement.classList.add('hidden');
        return;
      }
  
      const targetCourse = allCourses.find(course => course.name === cardCourseName);
      if (targetCourse) {
        const percentage = calculateCompletion(sourceTopics, targetCourse);
        
        // Create spans to style percentage differently
        const message = `Completing ${sourceName} will help complete `;
        const percentText = `${percentage}%`;
        const endMessage = ` of ${cardCourseName}`;
        
        percentageElement.innerHTML = `${message}<span style="color: ${getPercentageColor(percentage)}">${percentText}</span>${endMessage}`;
        
        percentageElement.classList.remove('hidden');
        percentageElement.classList.add('scale-100', 'opacity-100');
        percentageElement.style.transform = 'scale(1)';
        percentageElement.style.opacity = '1';
      }
    });
  }
  
  // Add this helper function
  function getPercentageColor(percentage) {
    if (percentage < 20) return '#ef4444';      // Red for low completion
    if (percentage < 40) return '#eab308';      // Yellow for medium completion
    return '#22c55e';                          // Green for high completion
  }
  
  function hideCompletionPercentages() {
    const percentageElements = document.querySelectorAll('.completion-percentage');
    percentageElements.forEach(element => {
      element.classList.add('hidden');
      element.style.transform = 'scale(0.95)';
      element.style.opacity = '0';
    });
  }
  
  function createSvgContainer() {
    // Remove existing SVG if any
    const existingSvg = document.querySelector('.connections-svg');
    if (existingSvg) existingSvg.remove();
  
    // Create new SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('connections-svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '5';
    
    // Append to the courses container
    const coursesContainer = document.getElementById('coursesContainer');
    coursesContainer.style.position = 'relative';
    
    // Calculate and set the height based on the content
    const containerHeight = coursesContainer.scrollHeight;
    svg.style.height = `${containerHeight}px`;
    
    coursesContainer.appendChild(svg);
    
    return svg;
  }
  
  function shouldDrawConnections() {
    // Don't draw connections if screen width is less than 768px (typical tablet/mobile breakpoint)
    return window.innerWidth >= 768;
  }
  
  function drawConnections(topics) {
    if (!shouldDrawConnections()) return;
  
    const svg = createSvgContainer();
    
    // Add gradient definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    topics.forEach((topic, index) => {
      const gradientId = `gradient-${index}`;
      const colors = draculaColors[index % draculaColors.length];
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', gradientId);
      gradient.innerHTML = `
        <stop offset="0%" stop-color="${colors[0]}" />
        <stop offset="100%" stop-color="${colors[1]}" />
      `;
      defs.appendChild(gradient);
    });
    svg.appendChild(defs);
  
    const coursesContainer = document.getElementById('coursesContainer');
    const containerRect = coursesContainer.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    topics.forEach((topic, topicIndex) => {
      const matchingTopics = document.querySelectorAll(`.topic-box[data-topic="${topic}"]:not(.hidden)`);
      const gradientId = `gradient-${topicIndex}`;
      
      matchingTopics.forEach((topicElement, index) => {
        if (index < matchingTopics.length - 1) {
          const card1 = topicElement.closest('.course-card');
          const card2 = matchingTopics[index + 1].closest('.course-card');
          
          const rect1 = card1.getBoundingClientRect();
          const rect2 = card2.getBoundingClientRect();
  
          const x1 = rect1.right - containerRect.left;
          const y1 = topicElement.getBoundingClientRect().top + 
                    topicElement.getBoundingClientRect().height / 2 - 
                    containerRect.top + scrollTop;
          const x2 = rect2.left - containerRect.left;
          const y2 = matchingTopics[index + 1].getBoundingClientRect().top + 
                    matchingTopics[index + 1].getBoundingClientRect().height / 2 - 
                    containerRect.top + scrollTop;
  
          const distance = x2 - x1;
          const controlPointX1 = x1 + distance / 3;
          const controlPointX2 = x2 - distance / 3;
  
          // Force a slight curve even for straight lines
          const yOffset = Math.abs(y2 - y1) < 1 ? 20 : 0;
          const controlPointY1 = y1 - yOffset;
          const controlPointY2 = y2 - yOffset;
  
          // Create curved path with forced curve for straight lines
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = `M ${x1} ${y1} 
                    C ${controlPointX1} ${controlPointY1}, 
                      ${controlPointX2} ${controlPointY2}, 
                      ${x2} ${y2}`;
                  
          path.setAttribute('d', d);
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', '#262626');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('stroke-dasharray', '4');
          path.dataset.topic = topic;
          path.dataset.gradientId = gradientId;
          path.classList.add('connection-path');
  
          // Create circles with default muted color and store gradient ID
          const startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          startCircle.setAttribute('cx', x1);
          startCircle.setAttribute('cy', y1);
          startCircle.setAttribute('r', '4');
          startCircle.setAttribute('fill', '#262626');
          startCircle.dataset.topic = topic;
          startCircle.dataset.gradientId = gradientId;
          startCircle.classList.add('connection-circle');
  
          const endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          endCircle.setAttribute('cx', x2);
          endCircle.setAttribute('cy', y2);
          endCircle.setAttribute('r', '4');
          endCircle.setAttribute('fill', '#262626');
          endCircle.dataset.topic = topic;
          endCircle.dataset.gradientId = gradientId;
          endCircle.classList.add('connection-circle');
  
          svg.appendChild(path);
          svg.appendChild(startCircle);
          svg.appendChild(endCircle);
        }
      });
    });
  }
  
  function removeConnections() {
    const svg = document.querySelector('.connections-svg');
    if (svg) svg.remove();
  }
  
  function drawConnectionsForCourse(topics) {
    // Early return if we shouldn't draw connections
    if (!shouldDrawConnections()) return;
  
    // Reset all connections first
    const connections = document.querySelectorAll('.connection-path, .connection-circle');
    connections.forEach(element => {
      if (topics.includes(element.dataset.topic)) {
        if (element.tagName.toLowerCase() === 'path') {
          element.setAttribute('stroke', `url(#${element.dataset.gradientId})`);
          
          // Only add animation if not Safari
          if (!isSafari()) {
              element.innerHTML = `
                  <animate attributeName="stroke-dashoffset" 
                           from="40" 
                           to="0" 
                           dur="1s" 
                           repeatCount="indefinite" />
              `;
          }
        } else if (element.tagName.toLowerCase() === 'circle') {
          // Get the gradient colors for this topic
          const gradientIndex = parseInt(element.dataset.gradientId.split('-')[1]);
          const colors = draculaColors[gradientIndex % draculaColors.length];
          element.setAttribute('fill', colors[0]);
        }
        element.style.filter = 'url(#glow)';
      } else {
        element.classList.add('opacity-25');
        // Remove animation from non-matching paths
        if (element.tagName.toLowerCase() === 'path') {
          element.innerHTML = '';
        }
      }
    });
  }
  
  // Function to draw all possible connections
  function drawAllPossibleConnections(courses) {
    // Get unique topics across all courses and their sections
    const allTopics = new Set();
    courses.forEach(course => {
      course.sections.forEach(section => {
        section.topics.forEach(topic => allTopics.add(topic));
      });
    });
    
    drawConnections(Array.from(allTopics));
  }
  
  // Function to draw connections for specific topics
  function drawConnectionsForTopics(topics) {
    drawConnections(topics);
  }
  
  // Store the course data globally for resize handler
  window.courseData = null;
  
  // Add CSS class for card width
  document.querySelectorAll('.course-card').forEach(card => {
    card.style.width = '300px'; // Or use a CSS class with max-width
  });
  
  // Add this function at the bottom of the file
  function getCourseLink(courseName) {
      const courseLinks = {
          'KCSA': 'https://kode.wiki/423ycSa',
          'KCNA': 'https://kode.wiki/41Z7IRx',
          'CKS': 'https://kode.wiki/420qPuA',
          'CKA': 'https://kode.wiki/3DSEGZO',
          'CKAD': 'https://kode.wiki/3PngiC3'
      };
      return courseLinks[courseName] || '#';
  }
  
  // Common function to get the proper URL
  function getShareableUrl() {
      let url = window.location.href;
      
      // If we're on localhost, replace with production URL
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
          url = 'https://kubestronaut.kodekloud.com';
      }
      
      return encodeURIComponent(url);
  }
  
  const share_message = "ðŸ¤¯ Check out this cool interactive ðŸ§‘â€ðŸš€ Kubestronaut Knowledge Graph";
  
  function shareOnLinkedIn() {
      const url = getShareableUrl();  
      const handle = "@KodeKloud";
      const text = share_message + " created by " + handle; 
      const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${share_message}&summary=${text}&source=${handle}`;
      window.open(linkedinUrl, '_blank');
  }
  
  function shareOnTwitter() {
      const url = getShareableUrl();
      const handle = "@KodeKloudHQ";
      const text = share_message + " created by " + handle; 
      const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      window.open(twitterUrl, '_blank');
  }
  
  function shareOnBlueSky() {
      const url = getShareableUrl();
      const handle = "@kodekloud";
      const text = share_message + " created by " + handle; 
      const blueskyUrl = `https://bsky.app/intent/compose?text=${text}%20${url}`;
      window.open(blueskyUrl, '_blank');
  }