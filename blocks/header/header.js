  import { getMetadata } from '../../scripts/aem.js';
  import { loadFragment } from '../fragment/fragment.js';

  // media query match that indicates mobile/tablet width
  const isDesktop = window.matchMedia('(min-width: 900px)');

  function closeOnEscape(e) {
    if (e.code === 'Escape') {
      const nav = document.getElementById('nav');
      const navSections = nav.querySelector('.nav-sections');
      const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
      if (navSectionExpanded && isDesktop.matches) {
        // eslint-disable-next-line no-use-before-define
        toggleAllNavSections(navSections);
        navSectionExpanded.focus();
      } else if (!isDesktop.matches) {
        // eslint-disable-next-line no-use-before-define
        toggleMenu(nav, navSections);
        nav.querySelector('button').focus();
      }
    }
  }

  function closeOnFocusLost(e) {
    const nav = e.currentTarget;
    if (!nav.contains(e.relatedTarget)) {
      const navSections = nav.querySelector('.nav-sections');
      const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
      if (navSectionExpanded && isDesktop.matches) {
        // eslint-disable-next-line no-use-before-define
        toggleAllNavSections(navSections, false);
      } else if (!isDesktop.matches) {
        // eslint-disable-next-line no-use-before-define
        toggleMenu(nav, navSections, false);
      }
    }
  }

  function openOnKeydown(e) {
    const focused = document.activeElement;
    const isNavDrop = focused.className === 'nav-drop';
    if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
      const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(focused.closest('.nav-sections'));
      focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
    }
  }

  function focusNavSection() {
    document.activeElement.addEventListener('keydown', openOnKeydown);
  }

  /**
   * Toggles all nav sections
   * @param {Element} sections The container element
   * @param {Boolean} expanded Whether the element should be expanded or collapsed
   */
  function toggleAllNavSections(sections, expanded = false) {
    sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
      // Only apply aria-expanded to nav-drop elements, not age-select elements
      if (section.classList.contains('nav-drop')) {
        section.setAttribute('aria-expanded', expanded);
      }
    });
  }

  /**
   * Toggles the entire nav
   * @param {Element} nav The container element
   * @param {Element} navSections The nav sections within the container element
   * @param {*} forceExpanded Optional param to force nav expand behavior when not null
   */
  function toggleMenu(nav, navSections, forceExpanded = null) {
    const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
    const button = nav.querySelector('.nav-hamburger button');
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    // enable nav dropdown keyboard accessibility
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }

    // enable menu collapse on escape keypress
    if (!expanded || isDesktop.matches) {
      // collapse menu on escape press
      window.addEventListener('keydown', closeOnEscape);
      // collapse menu on focus lost
      nav.addEventListener('focusout', closeOnFocusLost);
    } else {
      window.removeEventListener('keydown', closeOnEscape);
      nav.removeEventListener('focusout', closeOnFocusLost);
    }
  }

  /**
   * Creates mobile sidebar menu
   * @param {Element} navSections The navigation sections element
   * @returns {Element} Sidebar element
   */
  function createSidebar(navSections) {
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.className = 'collapse';
    
    // Close button
    const closeBtn = document.createElement('div');
    closeBtn.id = 'toggle_close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => toggleSidebar(false));
    
    // Logo
    const logoDiv = document.createElement('div');
    logoDiv.className = 'sidebar_logo';
    logoDiv.innerHTML = `
      <a href="https://www.fevicreate.com/web/fevicreate/home">
        <img width="177" height="75" 
            src="https://www.fevicreate.com/o/fevicreate-theme/images/new_footer_logo.png" 
            alt="Fevicreate Logo" loading="lazy">
      </a>
    `;
    
    // Menu container
    const menuDiv = document.createElement('div');
    menuDiv.id = 'cssmenu';
    
    // Search section
    const searchDiv = document.createElement('div');
    searchDiv.className = 'mobile-search';
    searchDiv.innerHTML = `
      <input type="text" class="form-control" placeholder="Search..." />
    `;
    
    // Navigation menu
    const navList = document.createElement('ul');
    navList.setAttribute('role', 'menubar');
    
    // Define menu items with icons and links
    const menuItems = [
      {
        text: 'Activities',
        url: 'https://www.fevicreate.com/web/fevicreate/activities',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685171&t=1762442026511'
      },
      {
        text: 'How to Videos',
        url: 'https://www.fevicreate.com/web/fevicreate/how-to-videos',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685301&t=1762442026527'
      },
      {
        text: 'Products',
        url: 'https://www.fevicreate.com/web/fevicreate/all-products',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685319&t=1762442026565'
      },
      {
        text: 'Contests & Events',
        url: 'https://www.fevicreate.com/web/fevicreate/contests-and-events',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685400&t=1762442026588'
      },
      {
        text: 'Freebies',
        url: 'https://www.fevicreate.com/web/fevicreate/freebies',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685426&t=1762442026608'
      },
      {
        text: 'Live TV',
        url: 'https://www.fevicreate.com/web/fevicreate/live-tv',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685444&t=1762442026622'
      },
      {
        text: 'Blogs',
        url: 'https://www.fevicreate.com/web/fevicreate/blogs',
        icon: 'https://www.fevicreate.com/image/layout_icon?img_id=390685464&t=1762442026644'
      }
    ];
    
    // Create menu items with icons
    menuItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'parants';
      li.innerHTML = `
        <a class="bubbly-button" href="${item.url}" role="menuitem">
          <h2>
            <img width="40" height="40" loading="lazy" src="${item.icon}" alt="${item.text}">
            ${item.text}
          </h2>
        </a>
      `;
      navList.appendChild(li);
    });
    
    // Add additional menu items
    const aboutLi = document.createElement('li');
    aboutLi.innerHTML = `
      <a href="https://www.fevicreate.com/web/fevicreate/about-us">
        <span><img src="https://www.fevicreate.com/o/fevicreate-theme/images/mobile/about.gif" alt="About" width="40" height="40" loading="lazy"></span>
        About Us
      </a>
    `;
    navList.appendChild(aboutLi);
    
    const moreLi = document.createElement('li');
    moreLi.className = 'has-sub';
    moreLi.innerHTML = `
      <a href="javascript:;">
        <span><img src="https://www.fevicreate.com/o/fevicreate-theme/images/mobile/more.gif" alt="More" width="40" height="40" loading="lazy"></span>
        More Pages
      </a>
      <ul>
        <li><a href="https://www.fevicreate.com/web/fevicreate/faq">FAQ</a></li>
        <li><a href="https://www.fevicreate.com/web/fevicreate/contact-us">Contact Us</a></li>
        <li><a href="https://www.fevicreate.com/web/fevicreate/privacy-policy">Privacy Policy</a></li>
        <li><a href="https://www.fevicreate.com/web/fevicreate/terms-and-conditions">Terms and Conditions</a></li>
      </ul>
    `;
    navList.appendChild(moreLi);
    
    // Social links
    const socialDiv = document.createElement('div');
    socialDiv.className = 'social-links';
    socialDiv.innerHTML = `
      <a href="https://www.facebook.com/Fevicreate/" target="_blank"><i class="fab fa-facebook-f"></i></a>
      <a href="https://twitter.com/fevicreate" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
      <a href="https://www.instagram.com/fevicreate" target="_blank"><i class="fab fa-instagram"></i></a>
      <a href="https://www.youtube.com/c/FevicreatePidilite" target="_blank"><i class="fab fa-youtube"></i></a>
    `;
    
    menuDiv.appendChild(searchDiv);
    menuDiv.appendChild(navList);
    menuDiv.appendChild(socialDiv);
    
    sidebar.appendChild(closeBtn);
    sidebar.appendChild(logoDiv);
    sidebar.appendChild(menuDiv);
    
    // Handle submenu toggle
    const hasSubItems = sidebar.querySelectorAll('.has-sub > a');
    hasSubItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = item.parentElement;
        parent.classList.toggle('open');
      });
    });
    
    return sidebar;
  }

  /**
   * Toggle sidebar visibility
   * @param {Boolean} show Whether to show or hide the sidebar
   */
  function toggleSidebar(show) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
      if (show) {
        sidebar.classList.add('show');
        sidebar.style.left = '0px';
        document.body.style.overflow = 'hidden';
        if (overlay) overlay.classList.add('show');
      } else {
        sidebar.classList.remove('show');
        sidebar.style.left = '-100%';
        document.body.style.overflow = '';
        if (overlay) overlay.classList.remove('show');
      }
    }
  }

  /**
   * Creates mobile menu structure
   * @param {Element} navSections The navigation sections element
   * @returns {Element} Mobile menu element
   */
  function createMobileMenu(navSections) {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu-main';
    
    mobileMenu.innerHTML = `
      <div class="mobile-menu-container">
        <div class="mobile-left">
          <button class="back-fc-btn" onclick="history.back()"></button>
          <a class="mobile-logo" href="https://www.fevicreate.com/web/fevicreate/home">
            <img width="127" height="29" 
                src="https://www.fevicreate.com/o/fevicreate-theme/images/mobile-logo.png" 
                alt="Fevicreate Logo" loading="lazy">
          </a>
        </div>
        <div class="mobile-right">
          <div class="respos-user">
            <ul>
              <li class="tv-icon">
                <div class="search-icon">
                  <a href="javascript:;">
                    <img width="36" height="36" 
                        src="https://www.fevicreate.com/o/fevicreate-theme/images/mobile-magnifier.gif" 
                        alt="Search" loading="lazy">
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <button class="navbar-toggler" type="button" aria-label="Toggle navigation">
            <img width="30" height="30" 
                src="https://www.fevicreate.com/o/fevicreate-theme/images/bar.png" 
                alt="Menu" loading="lazy">
          </button>
        </div>
      </div>
    `;

    // Add click handler for mobile menu toggle
    const toggler = mobileMenu.querySelector('.navbar-toggler');
    toggler.addEventListener('click', () => {
      toggleSidebar(true);
    });

    return mobileMenu;
  }

  /**
   * loads and decorates the header, mainly the nav
   * @param {Element} block The header block element
   */
  export default async function decorate(block) {
    // load nav as fragment
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    const fragment = await loadFragment(navPath);

    // decorate nav DOM
    block.textContent = '';
    const nav = document.createElement('nav');
    nav.id = 'nav';
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

    const classes = ['brand', 'sections', 'tools', 'quick-links'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const quickLinks = nav.querySelector('.nav-quick-links');
    document.querySelector('footer')?.appendChild(quickLinks);
    const navBrand = nav.querySelector('.nav-brand');
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      // Get all ul elements to identify which section we're in
      const allUls = navSections.querySelectorAll(':scope .default-content-wrapper > ul');
      
      navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
        const subList = navSection.querySelector('ul');
        const mainText = navSection.querySelector('p')?.textContent?.trim();
        const hasLink = navSection.querySelector('a');
        
        // Determine which ul this li belongs to
        const parentUl = navSection.parentElement;
        const isInToolsSection = parentUl === allUls[1]; // Second ul is the tools section
        
        // Check if this is the search section - empty or minimal li in tools section
        const isEmptyOrMinimal = (!mainText || mainText === '') && !hasLink && !subList;
        
        if (isEmptyOrMinimal && isInToolsSection) {
          // Replace with search input field
          navSection.classList.add('search-bar');
          navSection.innerHTML = `
            <div class="input-group-item search-bar-keywords-input-wrapper">
              <input class="form-control input-group-inset input-group-inset-after search-bar-keywords-input" 
                    data-qa-id="searchInput" 
                    id="headerSearchInput" 
                    name="q" 
                    placeholder="Search..." 
                    title="Search" 
                    type="text" 
                    value="">
              <input class="field form-control" 
                    id="search_scope" 
                    name="scope" 
                    type="hidden" 
                    value="">
              <div class="input-group-inset-item input-group-inset-item-after">
                <button class="btn search-btn" aria-label="Submit" id="searchSubmitBtn" type="submit">
                  <svg class="lexicon-icon lexicon-icon-search" focusable="false" role="presentation" viewBox="0 0 512 512">
                    <g>
                      <path class="lexicon-icon-outline" d="M503.254 467.861l-133.645-133.645c27.671-35.13 44.344-79.327 44.344-127.415 0-113.784-92.578-206.362-206.362-206.362s-206.362 92.578-206.362 206.362 92.578 206.362 206.362 206.362c47.268 0 90.735-16.146 125.572-42.969l133.851 133.851c5.002 5.002 11.554 7.488 18.106 7.488s13.104-2.486 18.106-7.488c10.004-10.003 10.004-26.209 0.029-36.183zM52.446 206.801c0-85.558 69.616-155.173 155.173-155.173s155.174 69.616 155.174 155.173-69.616 155.173-155.173 155.173-155.173-69.616-155.173-155.173z"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          `;
          
          // Add search functionality
          const searchBtn = navSection.querySelector('.search-btn');
          const searchInput = navSection.querySelector('.search-bar-keywords-input');
          
          const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
              // Redirect to search page or perform search action
              window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
          };
          
          searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
          });
          
          searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              performSearch();
            }
          });
        } else if (subList) {
          // Check if this is an age-related dropdown
          // Check both the main text and the full text content (including sublists)
          const fullText = navSection.textContent || '';
          const isAgeDropdown = fullText.includes('years') || fullText.includes('age');

          if (isAgeDropdown) {
            // Convert to select dropdown for age selection
            navSection.classList.add('age-select');

            // Create select element
            const selectWrapper = document.createElement('li');
            selectWrapper.className = 'age-select';

            const iconSpan = document.createElement('span');
            const iconImg = document.createElement('img');
            iconImg.setAttribute('data-src', 'https://www.fevicreate.com/o/fevicreate-theme/images/smile.png');
            iconImg.setAttribute('alt', 'img');
            iconImg.setAttribute('loading', 'lazy');
            iconImg.className = 'inline';
            iconImg.src = 'https://www.fevicreate.com/o/fevicreate-theme/images/smile.png';
            iconSpan.appendChild(iconImg);

            const select = document.createElement('select');
            select.id = 'userSelector';
            select.name = 'age';

            // Get current age from URL query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const currentAge = urlParams.get('age');
            let selectedValue = 'age3_5'; // default

            // Map URL parameter to select value
            if (currentAge === 'three-five-years') {
              selectedValue = 'age3_5';
            } else if (currentAge === 'six-eight-years') {
              selectedValue = 'age6_8';
            } else if (currentAge === 'nine-fourteen-years') {
              selectedValue = 'age9_14';
            }

            // Create options from existing list items
            const listItems = subList.querySelectorAll('li');
            listItems.forEach((item, index) => {
              const option = document.createElement('option');
              option.textContent = item.textContent.trim();

              // Set values based on age ranges
              if (item.textContent.includes('3 to 5')) {
                option.value = 'age3_5';
                option.selected = (selectedValue === 'age3_5');
              } else if (item.textContent.includes('6 to 8')) {
                option.value = 'age6_8';
                option.selected = (selectedValue === 'age6_8');
              } else if (item.textContent.includes('9 to 14')) {
                option.value = 'age9_14';
                option.selected = (selectedValue === 'age9_14');
              }

              select.appendChild(option);
            });

            // Add change event listener to redirect based on selected age
            select.addEventListener('change', (e) => {
              const selectedValue = e.target.value;
              let ageParam = '';

              // Map the option values to the URL query parameters
              switch (selectedValue) {
                case 'age3_5':
                  ageParam = 'three-five-years';
                  break;
                case 'age6_8':
                  ageParam = 'six-eight-years';
                  break;
                case 'age9_14':
                  ageParam = 'nine-fourteen-years';
                  break;
                default:
                  ageParam = 'three-five-years';
              }

              // Redirect to the page with age query parameter
              window.location.href = `${window.location.pathname}?age=${ageParam}`;
            });

            selectWrapper.appendChild(iconSpan);
            selectWrapper.appendChild(select);

            // Replace the original nav section with the new select
            navSection.parentNode.replaceChild(selectWrapper, navSection);
          } else {
            // Check if this is Sign In / Sign Up dropdown - don't add click functionality
            const isSignInDropdown = subList && subList.textContent.toLowerCase().includes('sign in');
            
            // Keep as regular dropdown for non-age items
            navSection.classList.add('nav-drop');
            
            // Only add click functionality if NOT the Sign In dropdown
            if (!isSignInDropdown) {
              navSection.addEventListener('click', () => {
                if (isDesktop.matches) {
                  const expanded = navSection.getAttribute('aria-expanded') === 'true';
                  toggleAllNavSections(navSections);
                  navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                }
              });
            }
          }
        }
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    // Create mobile menu and sidebar
    const mobileMenu = createMobileMenu(navSections);
    block.prepend(mobileMenu);
    
    // Create sidebar
    const sidebar = createSidebar(navSections);
    document.body.appendChild(sidebar);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', () => toggleSidebar(false));
    document.body.appendChild(overlay);

    // Add scroll event listener for sticky header behavior
    let isScrolled = false;
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeSticky = scrollTop > 50; // Trigger sticky after 50px scroll

      if (shouldBeSticky && !isScrolled) {
        // Add sticky class when scrolling down
        block.classList.add('header-sticky');
        navWrapper.style.position = 'fixed';
        navWrapper.style.top = '0';
        navWrapper.style.left = '0';
        navWrapper.style.right = '0';
        navWrapper.style.zIndex = '1000';
        isScrolled = true;
      } else if (!shouldBeSticky && isScrolled) {
        // Remove sticky class when back to top
        block.classList.remove('header-sticky');
        navWrapper.style.position = 'fixed';
        navWrapper.style.top = '';
        navWrapper.style.left = '';
        navWrapper.style.right = '';
        navWrapper.style.zIndex = '';
        isScrolled = false;
      }
    }

    // Initial check on page load
    handleScroll();

    // Throttled scroll event listener for better performance
    let scrollTimer;
    window.addEventListener('scroll', () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(handleScroll, 10);
    }, { passive: true });
  }
