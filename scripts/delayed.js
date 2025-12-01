// add delayed functionality here

// Search component dropdown functionality
function initSearchDropdowns() {
  const searchComponent = document.querySelector('.search-component .default-content-wrapper ul');
  if (!searchComponent) return;

  const dropdownItems = searchComponent.querySelectorAll('li:nth-child(2), li:nth-child(3)');
  
  dropdownItems.forEach((dropdown) => {
    const nestedUl = dropdown.querySelector('ul');
    if (!nestedUl) return;

    // Toggle dropdown on click
    dropdown.addEventListener('click', (e) => {
      // Don't close if clicking on nested ul
      if (e.target.closest('ul') !== searchComponent) return;
      
      e.stopPropagation();
      dropdown.classList.toggle('active');
      
      // Close other dropdowns
      dropdownItems.forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove('active');
        }
      });
    });

    // Handle option selection
    const options = nestedUl.querySelectorAll('li');
    options.forEach((option, index) => {
      if (index === 0) return; // Skip header
      
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Get the text content before the nested ul
        const textNode = Array.from(dropdown.childNodes).find(
          node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
        );
        
        if (textNode) {
          textNode.textContent = option.textContent;
        }
        
        dropdown.classList.remove('active');
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    dropdownItems.forEach((dropdown) => {
      dropdown.classList.remove('active');
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearchDropdowns);
} else {
  initSearchDropdowns();
}
