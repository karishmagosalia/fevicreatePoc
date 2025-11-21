import { fetchPlaceholders } from '../../scripts/aem.js';
import { fetchAPi } from '../../scripts/scripts.js';
import Swiper from './swiper.min.js';

// Function to handle wishlist button clicks
function handleWishlistClick(event) {
    const button = event.currentTarget;
    button.classList.toggle('active');

    // You can add your wishlist logic here
    // For example, save to localStorage or send to backend
    const isActive = button.classList.contains('active');
    console.log('Wishlist button clicked:', isActive ? 'Added' : 'Removed');
}

// Function to handle share button clicks
function handleShareClick(event) {
    const button = event.currentTarget;
    const carouselItem = button.closest('.carousel-item');
    const title = carouselItem.querySelector('h3').textContent;
    const link = carouselItem.querySelector('a').href;

    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: title,
            url: link
        }).then(() => {
            console.log('Successfully shared');
        }).catch((error) => {
            console.log('Error sharing:', error);
        });
    } else {
        // Fallback: Copy link to clipboard
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch((error) => {
            console.log('Error copying to clipboard:', error);
        });
    }
}

// Function to add event listeners to action buttons
function addActionButtonListeners(block) {
    const wishlistButtons = block.querySelectorAll('.wishlist-btn');
    const shareButtons = block.querySelectorAll('.share-btn');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', handleWishlistClick);
    });

    shareButtons.forEach(button => {
        button.addEventListener('click', handleShareClick);
    });
}

// Function to get the age tag based on query parameter
function getAgeTagFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const ageParam = urlParams.get('age');
    console.log('Age query parameter:', ageParam);

    // Check for age-specific query parameters
    if (ageParam === 'six-eight-years') {
        return 'fevi-create:age/6-8years';
    } else if (ageParam === 'three-five-years') {
        return 'fevi-create:age/3-5years';
    } else if (ageParam === 'nine-fourteen-years') {
        return 'fevi-create:age/9-14years';
    }

    return null;
}

// Function to filter data by age tag
function filterDataByTag(data, targetTag) {
    if (!targetTag) {
        console.log('No target tag, returning all data');
        return data;
    }

    const filtered = data.filter(item => {
        if (item.tags && Array.isArray(item.tags)) {
            return item.tags.includes(targetTag);
        }
        return false;
    });

    console.log('Filtered results:', filtered.length, 'items');
    return filtered;
}

export default async function decorate(block) {
    let kids = window.location.search;
    console.log('URL search params:', kids);
    
    // Get the section element to check for specific class names
    const parentSection = block.closest('.section');
    
    // Determine which API endpoint to use based on section class
    let apiKey = 'featureApi'; // default
    if (parentSection?.classList.contains('video-carousel')) {
        apiKey = 'videos';
    } else if (parentSection?.classList.contains('simple-section')) {
        apiKey = 'howVideos';
    } else if (parentSection?.classList.contains('main-section')) {
        apiKey = 'scienceCraft';
    } else if (parentSection?.classList.contains('feature-products')) {
        apiKey = 'featureProduct';
    }
    
    const placeholders = await fetchPlaceholders();
    const apiEndpoint = placeholders[apiKey];
    const publisherHost = placeholders.publisherHost;
    
    console.log('API Key:', apiKey);
    console.log('API Endpoint:', apiEndpoint);
    console.log('Full URL:', `${publisherHost}${apiEndpoint}`);
    
    let graphQL = await fetchAPi(`${publisherHost}${apiEndpoint}`);
    console.log('GraphQL Response:', graphQL);
    
    // Handle different GraphQL response structures
    let allData;
    let mainHeading = null;
    if (parentSection?.classList.contains('video-carousel') || parentSection?.classList.contains('simple-section')) {
        // For video carousel and simple-section: journalArticlesByPath response
        allData = graphQL.data.journalArticlesByPath.item.data;
        console.log('Has data?', !!graphQL?.data?.journalArticlesByPath?.item?.data);
    } else if (parentSection?.classList.contains('main-section')) {
        // For main-section: scienceCraftByPath response
        allData = graphQL.data.scienceCraftByPath.item.data;
        console.log('Has data?', !!graphQL?.data?.scienceCraftByPath?.item?.data);
    } else if (parentSection?.classList.contains('feature-products')) {
        // For feature-products: featureProductsByPath response
        allData = graphQL.data.featureProductsByPath.item.data;
        mainHeading = graphQL.data.featureProductsByPath.item.mainHeading;
        console.log('Has data?', !!graphQL?.data?.featureProductsByPath?.item?.data);
        console.log('Main heading:', mainHeading);
    } else {
        // For default carousel: fevicreatesByPath response
        allData = graphQL.data.fevicreatesByPath.item.data;
        console.log('Has data?', !!graphQL?.data?.fevicreatesByPath?.item?.data);
    }
    
    console.log('Total items fetched:', allData?.length || 0);

    console.log('All data from API:', allData);
    console.log('Sample item tags:', allData[0]?.tags);

    // Get the age tag for current page
    const currentAgeTag = getAgeTagFromUrl();

    // Filter data based on the age tag
    let data = allData;
    if (currentAgeTag) {
        data = filterDataByTag(allData, currentAgeTag);
        console.log('Filtered data for tag:', currentAgeTag, 'Found:', data.length, 'items');
    } else {
        console.log('No age filter applied, showing all data:', data.length, 'items');
    }

    // If no data after filtering, show all data as fallback
    if (data.length === 0) {
        console.warn('No items matched the filter, showing all data');
        data = allData;
    }


    // Clear block content
    block.innerHTML = '';
    
    // For feature-products, create wrapper for all carousel content
    const isFeatureProducts = parentSection?.classList.contains('feature-products');
    let containerDiv = block;
    
    if (isFeatureProducts) {
        const innerWrapper = document.createElement('div');
        innerWrapper.classList.add('feature-products-inner');
        block.appendChild(innerWrapper);
        containerDiv = innerWrapper;
    }
    
    // Add main heading if it exists (for feature-products)
    if (mainHeading && mainHeading.html) {
        const headingWrapper = document.createElement('div');
        headingWrapper.classList.add('heading-title');
        headingWrapper.innerHTML = mainHeading.html;
        containerDiv.appendChild(headingWrapper);
    }
    
    // Create swiper container
    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper');
    
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperContainer.appendChild(swiperWrapper);
    
    // Add navigation/pagination elements
    const btnWrapper = document.createElement('div');
    btnWrapper.classList.add('btn-wrapper');
    const divPagination = document.createElement('div');
    divPagination.classList.add('swiper-pagination');
    btnWrapper.appendChild(divPagination);
    const leftArrow = document.createElement('div');
    leftArrow.classList.add('swiper-button-prev');
    btnWrapper.appendChild(leftArrow);
    const rightArrow = document.createElement('div');
    rightArrow.classList.add('swiper-button-next');
    btnWrapper.appendChild(rightArrow);
    swiperContainer.appendChild(btnWrapper);
    
    containerDiv.appendChild(swiperContainer);
    // Determine Swiper settings based on class or parent
    const isVideoCarousel = parentSection?.classList.contains('video-carousel') || parentSection?.classList.contains('simple-section');
    
    let swiperOptions = {
        initialSlide: isVideoCarousel ? 1 : 0,
        spaceBetween: 20,
        loop: true,
        centeredSlides: isVideoCarousel,
        pagination: {
            el: divPagination,
            clickable: true
        },
            navigation: {
            nextEl: rightArrow,
            prevEl: leftArrow
        },
        breakpoints: {
            0: {
                slidesPerView: 1.8,
                slidesOffsetAfter: 40
            },
            768: {
                slidesPerView: (isVideoCarousel ? 2 : 2)
            },
            912: {
                slidesPerView: (isVideoCarousel ? 3 : 3)
            },
            1024: {
                slidesPerView: isFeatureProducts ? 3 : (isVideoCarousel ? 3 : 4)
            },
            1200: {
                slidesPerView: isFeatureProducts ? 3 : (isVideoCarousel ? 3 : 4)
            },
        },
    };

    data.forEach((item) => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        
        // Check if this is a video carousel or simple-section
        if (parentSection?.classList.contains('video-carousel') || parentSection?.classList.contains('simple-section')) {
            // Extract video ID from URL if it's a YouTube link
            let videoId = '';
            if (item.video._publishUrl) {
                const urlMatch = item.video._publishUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                videoId = urlMatch ? urlMatch[1] : '';
            }
            
            slide.innerHTML = `
                <div class="carousel-item">
                    <div class="carousel-item-img-wrapper">
                        <picture>
                            <img src="${item.video._publishUrl}" alt="${item.title}" loading="lazy" />
                        </picture>
                    </div>
                    <div class="vedio-caption">
                        <h4><a href="javascript:;">${item.title}</a></h4>
                    </div>
                </div>  
            `;
        } else if (parentSection?.classList.contains('feature-products')) {
            // Feature products layout
            slide.innerHTML = `
                <div class="carousel-item">
                    <div class="product-box-wrap">
                        <div class="product-img">
                            <div class="heart-shape">
                                <button class="wishlist-btn" aria-label="Add to wishlist" title="Add to wishlist">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                            <a href="javascript:;">
                                    <img src="${item.image._publishUrl}" alt="${item.title}" class="img-fluid" loading="lazy" />
                            </a>
                        </div>
                        <div class="product-text">
                            <span><a href="javascript:;" class="noclick">${item.ages || ''}</a></span>
                            <h3><a href="javascript:;">${item.title}</a></h3>
                            <div class="price-btn">
                                ${item.buy ? `<span>${item.buy.html}</span>` : ''}
                                </div>
                            <a target="_blank" href="javascript:;">${item.submit || 'View'}</a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default carousel layout
            slide.innerHTML = `
                <div class="carousel-item">
                    <div class="carousel-item-img-wrapper">
                        <img src="${item.image._publishUrl}" alt="${item.title}" />
                        <div class="carousel-item-actions">
                            <button class="wishlist-btn" aria-label="Add to wishlist" title="Add to wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="share-btn" aria-label="Share" title="Share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.categories}</p>
                    <p>${item.time}</p>
                    <a href="${item?.link}">${item.button} <span><i class="fas fa-arrow-right"></i></span></a>
                </div>
            `;
        }
        
        swiperContainer.querySelector('.swiper-wrapper').appendChild(slide);
    });

    // Add event listeners for wishlist and share buttons
    addActionButtonListeners(block);
    const swiperInstance = Swiper(swiperContainer, swiperOptions);

    // Connect the < and > buttons in the header to the carousel
    const section = block.closest('.section');
    if (section) {
        // Try to find navigation buttons in default-content-wrapper or heading-title
        const defaultWrapper = section.querySelector('.default-content-wrapper ul') || 
                               section.querySelector('.heading-title ul') ||
                               block.querySelector('.heading-title ul');
        if (defaultWrapper) {
            const listItems = defaultWrapper.querySelectorAll('li');
            listItems.forEach((item) => {
                const text = item.textContent.trim();
                if (text === '<') {
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        swiperInstance.slidePrev();
                    });
                } else if (text === '>') {
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        swiperInstance.slideNext();
                    });
                }
            });
        }
    }
}