import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../../scripts/scripts.js';
  
/**
 * Decorates the nav-quick-links section with mobile navigation functionality
 */
function decorateNavQuickLinks() {
  const navQuickLinks = document.querySelector('.section.nav-quick-links');
  if (!navQuickLinks) return;

  const links = navQuickLinks.querySelectorAll('li');
  
  // Define navigation items with their URLs and image sources
  const navItems = [
    { 
      text: 'Home', 
      url: '/web/fevicreate/home',
      imgSrc: '../../icons/home.gif',
      alt: 'Home IMG'
    },
    { 
      text: 'Live TV', 
      url: '/web/fevicreate/live-tv',
      imgSrc: '../../icons/live.gif',
      alt: 'LiveTV IMG'
    },
    { 
      text: 'Activity', 
      url: '/web/fevicreate/activities',
      imgSrc: '../../icons/activity-center.gif',
      alt: 'Activity IMG'
    },
    { 
      text: 'Product', 
      url: '/web/fevicreate/all-products',
      imgSrc: '../../icons/1product.gif',
      alt: 'Product IMG'
    },
    { 
      text: 'Login', 
      url: 'https://www.fevicreate.com/web/fevicreate/login',
      imgSrc: '../../icons/login.gif',
      alt: 'Login IMG'
    }
  ];

  // Update each link with proper href, picture element, and wrap content in anchor tag
  links.forEach((li, index) => {
    if (index < navItems.length) {
      const navItem = navItems[index];
      const textContent = li.textContent.trim();
      
      // Create anchor element
      const anchor = document.createElement('a');
      anchor.href = navItem.url;
      
      // Create picture element with sources
      const picture = document.createElement('picture');
      picture.setAttribute('data-fileentryid', `39068023${index}`);
      
      // Create source elements for responsive images
      const source1 = document.createElement('source');
      source1.media = '(max-width:40px)';
      source1.srcset = navItem.imgSrc;
      
      const source2 = document.createElement('source');
      source2.media = '(max-width:40px) and (min-width:40px)';
      source2.srcset = navItem.imgSrc;
      
      // Create img element
      const img = document.createElement('img');
      img.width = 40;
      img.height = 40;
      img.alt = navItem.alt;
      img.src = navItem.imgSrc;
      img.setAttribute('data-fileentryid', `39068023${index}`);
      
      // Append sources and img to picture
      picture.appendChild(source1);
      picture.appendChild(source2);
      picture.appendChild(img);
      
      // Create span for text
      const span = document.createElement('span');
      span.textContent = textContent || navItem.text;
      
      // Clear li and add anchor with picture and span
      li.textContent = '';
      anchor.appendChild(picture);
      anchor.appendChild(span);
      li.appendChild(anchor);
      
      // Add center-icon class to the middle item (Activity)
      if (index === 2) {
        li.classList.add('center-icon');
      }
      
      // Add active state on click
      anchor.addEventListener('click', function(e) {
        // Remove active class from all links
        links.forEach(link => link.classList.remove('active'));
        // Add active class to clicked link
        li.classList.add('active');
      });
    }
  });

  // Set active state based on current URL
  const currentPath = window.location.pathname;
  links.forEach((li, index) => {
    if (index < navItems.length) {
      const navItem = navItems[index];
      if (currentPath.includes(navItem.url) || 
          (navItem.url.includes(currentPath) && currentPath !== '/')) {
        li.classList.add('active');
      }
    }
  });
}

/**
 * Decorates social media links in footer
 */
function decorateSocialLinks() {
  const footer2 = document.querySelector('.footer2');
  if (!footer2) return;

  const socialList = footer2.querySelector('.default-content-wrapper ul:nth-child(2)');
  if (!socialList) return;

  const socialLinks = [
    { url: 'https://www.facebook.com/Fevicreate/', icon: 'facebook-f' },
    { url: 'https://twitter.com/fevicreate', icon: 'x-twitter' },
    { url: 'https://www.instagram.com/fevicreate', icon: 'instagram' },
    { url: 'https://www.youtube.com/c/FevicreatePidilite', icon: 'youtube' }
  ];

  const listItems = socialList.querySelectorAll('li');
  listItems.forEach((li, index) => {
    if (index < socialLinks.length) {
      const link = document.createElement('a');
      link.href = socialLinks[index].url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', socialLinks[index].icon);
      
      // Move li content to link and wrap
      li.textContent = '';
      li.appendChild(link);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  // Decorate social links
  setTimeout(() => {
    decorateSocialLinks();
    decorateNavQuickLinks();
  }, 100);
}
