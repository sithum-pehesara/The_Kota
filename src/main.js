document.addEventListener('DOMContentLoaded', () => {
  // Loading Slide Logic
  const loader = document.getElementById('loader');
  
  // Wait a bit to show off the loader animation
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    document.body.classList.remove('loading');
    
    // Trigger initial animations
    triggerAnimations();
  }, 4000);

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function triggerAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Fetch Latest YouTube Videos
  const fetchYouTubeVideos = async () => {
    try {
      const channelId = 'UC3UVENYr99HSHFi01lLMohg';
      const rssUrl = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'ok' && data.items && data.items.length >= 2) {
        const videos = data.items.slice(0, 2);
        const videoCards = document.querySelectorAll('#youtube .video-card');

        videos.forEach((video, index) => {
          if (videoCards[index]) {
            const card = videoCards[index];
            card.href = video.link;
            
            const thumbContainer = card.querySelector('.video-thumb');
            const placeholder = thumbContainer.querySelector('.thumb-placeholder');
            
            // Create image element if it doesn't exist
            let img = thumbContainer.querySelector('.thumb-img');
            if (!img) {
              img = document.createElement('img');
              img.className = 'thumb-img';
              // Insert before play-overlay if possible to keep overlay on top
              const overlay = thumbContainer.querySelector('.play-overlay');
              if (overlay) {
                thumbContainer.insertBefore(img, overlay);
              } else {
                thumbContainer.appendChild(img);
              }
            }
            
            // Extract video ID from URL
            let videoId = '';
            if (video.link.includes('v=')) {
              videoId = video.link.split('v=')[1];
            } else if (video.link.includes('youtu.be/')) {
              videoId = video.link.split('youtu.be/')[1];
            }

            if (videoId) {
              const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
              img.src = thumbUrl;
              
              img.onload = () => {
                if (placeholder) placeholder.style.display = 'none';
              };
              img.onerror = () => {
                // Fallback if maxresdefault doesn't exist
                if (img.src.includes('maxresdefault')) {
                  img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
              };
            }

            const titleEl = card.querySelector('.video-title');
            if (titleEl) {
              // Decode HTML entities in title
              const temp = document.createElement('div');
              temp.innerHTML = video.title;
              titleEl.textContent = temp.textContent;
            }

            const dateEl = card.querySelector('.video-date');
            if (dateEl) {
              const pubDate = new Date(video.pubDate);
              dateEl.textContent = pubDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  fetchYouTubeVideos();
});
