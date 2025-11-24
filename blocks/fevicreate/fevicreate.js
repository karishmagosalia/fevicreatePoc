export default function decorate(block) {
    const homeSection = document.querySelector('.section.home');

    // Store user selection in localStorage (single selection only)
    function storeUserSelection(targetUrl, cardText) {
        console.log('Storing user selection:', { targetUrl, cardText });
        
        // Store only the current selection
        const selection = {
            url: targetUrl,
            text: cardText,
            timestamp: new Date().getTime(),
            date: new Date().toLocaleString()
        };
        
        localStorage.setItem('userCategorySelection', targetUrl);
        localStorage.setItem('userCategoryText', cardText);
        localStorage.setItem('selectionTimestamp', selection.timestamp);
        
        console.log('Selection stored:', selection);
    }

    // Clear user selection
    window.clearUserSelection = function() {
        console.log('Clearing user selection');
        localStorage.removeItem('userCategorySelection');
        localStorage.removeItem('userCategoryText');
        localStorage.removeItem('selectionTimestamp');
        console.log('User selection cleared');
    };

    // Get user's selection
    window.getUserSelection = function() {
        const url = localStorage.getItem('userCategorySelection');
        const text = localStorage.getItem('userCategoryText');
        const timestamp = localStorage.getItem('selectionTimestamp');
        
        if (url && timestamp) {
            return {
                url,
                text,
                timestamp: parseInt(timestamp),
                date: new Date(parseInt(timestamp)).toLocaleString()
            };
        }
        return null;
    };

    // Check if selection is expired (7 days)
    function isSelectionExpired() {
        const timestamp = localStorage.getItem('selectionTimestamp');
        if (!timestamp) return true;
        
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const now = new Date().getTime();
        const daysSinceSelection = (now - parseInt(timestamp)) / (24 * 60 * 60 * 1000);
        
        return daysSinceSelection > 7;
    }
    
    // Clear selection if expired
    if (isSelectionExpired()) {
        window.clearUserSelection();
        console.log('Expired selection cleared');
    }

    // Check if we're on the homepage and should redirect
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || currentPath === '/index.html';
    
    if (isHomePage && homeSection) {
        const storedSelection = window.getUserSelection();
        
        if (storedSelection && storedSelection.url) {
            console.log('Redirecting to stored selection:', storedSelection.url);
            window.location.href = storedSelection.url;
            return; // Stop execution after redirect
        }
    }

    if (homeSection) {

        // Add class names to default content wrappers
        const defaultWrappers = homeSection.querySelectorAll('.default-content-wrapper');
        defaultWrappers.forEach((wrapper, index) => {
            if (index === 0) {
                wrapper.classList.add('home-header-logos');
                // Add classes to images within this wrapper
                const images = wrapper.querySelectorAll('img');
                images.forEach((img, imgIndex) => {
                    if (imgIndex === 0) {
                        img.classList.add('login-logo');
                    } else if (imgIndex === 1) {
                        img.classList.add('header-logo');
                    }
                });
            } else if (index === 1) {
                wrapper.classList.add('home-bottom-content');
                // Add class to the cartoon image
                const cartoonImg = wrapper.querySelector('img[alt="cartoon"]');
                if (cartoonImg) {
                    cartoonImg.classList.add('cartoon-image');
                }
            }
        });

        // Add class names to cards wrapper and its contents
        const cardsWrappers = homeSection.querySelectorAll('.cards-wrapper');
        cardsWrappers.forEach((cardsWrapper) => {
            cardsWrapper.classList.add('home-cards-wrapper');

            // Add classes to card elements
            const cardItems = cardsWrapper.querySelectorAll('.cards ul li');
            cardItems.forEach((item, index) => {
                item.classList.add('home-card-item');

                const cardImage = item.querySelector('.cards-card-image');
                const cardBody = item.querySelector('.cards-card-body');

                if (cardImage) {
                    cardImage.classList.add('home-card-image');
                }
                if (cardBody) {
                    cardBody.classList.add('home-card-body');
                    // Add specific classes based on content
                    const text = cardBody.textContent.trim().toLowerCase();
                    if (text.includes('years')) {
                        cardBody.classList.add('age-category');
                    } else if (text === 'teacher') {
                        cardBody.classList.add('teacher-category');
                    } else if (text === 'school') {
                        cardBody.classList.add('school-category');
                    }
                }

                // Add click functionality to each card
                item.style.cursor = 'pointer';
                item.addEventListener('click', function () {
                    const cardText = cardBody ? cardBody.textContent.trim().toLowerCase() : '';
                    let targetUrl = '/home';
                    let queryParam = '';

                    // Define query parameters based on card content
                    if (cardText.includes('3 to 5 years')) {
                        queryParam = '?age=three-five-years';
                    } else if (cardText.includes('6 to 8 years')) {
                        queryParam = '?age=six-eight-years';
                    } else if (cardText.includes('9 to 14 years')) {
                        queryParam = '?age=nine-fourteen-years';
                    } else if (cardText === 'teacher') {
                        queryParam = '?category=teacher';
                    } else if (cardText === 'school') {
                        queryParam = '?category=school';
                    }

                    if (queryParam) {
                        const fullUrl = targetUrl + queryParam;
                        // Store user selection before navigating
                        storeUserSelection(fullUrl, cardText);
                        window.location.href = fullUrl;
                    }
                });
            });
        });

        // Add classes to all pictures and images within home section
        const pictures = homeSection.querySelectorAll('picture');
        pictures.forEach((picture) => {
            picture.classList.add('home-picture');
        });

        const allImages = homeSection.querySelectorAll('img');
        allImages.forEach((img) => {
            if (!img.classList.length) {
                img.classList.add('home-image');
            }
        });

        // Add classes to paragraphs
        const paragraphs = homeSection.querySelectorAll('p');
        paragraphs.forEach((p) => {
            p.classList.add('home-paragraph');
        });
    }
    // Hide header and footer only for the exact page, not child pages
    const pathname = window.location.pathname;
    const isExactPage = pathname === '/' || 
                        pathname === '/index.html';
    
    if (isExactPage) {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        if (header) {
            header.style.display = 'none';
        }
        
        if (footer) {
            footer.style.display = 'none';
        }
    }
}
