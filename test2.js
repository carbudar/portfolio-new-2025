function createButton(size, buttonText, className, highlightColor, color, parentElement = null) {
    const button = document.createElement('div');
    button.classList.add('button');

    const buttonExpand = document.createElement('div');
    buttonExpand.classList.add('button-expand');

    const buttonContent = document.createElement('div');
    const buttonTitle = document.createElement(size);
    buttonTitle.innerHTML = buttonText;

    buttonContent.style.padding = "1vw"
    buttonContent.appendChild(buttonTitle);
    buttonContent.classList.add('buttonContent');

    button.appendChild(buttonExpand);
    button.appendChild(buttonContent);

    buttonContent.style.color = color;

    buttonContent.addEventListener('mouseover', () => {
        const buttonContentRect = buttonContent.getBoundingClientRect();
        buttonExpand.style.width = `${buttonContentRect.width}px`;
        buttonExpand.style.height = `${buttonContentRect.height}px`;
        buttonExpand.style.backgroundColor = highlightColor;
        buttonContent.style.color = "#126889";
    });

    buttonContent.addEventListener('mouseout', () => {
        buttonExpand.style.width = "0";
        buttonContent.style.color = color;
    });

    if (parentElement) {
        parentElement.appendChild(button);
    } else {
        const buttonPlaceHolder = document.querySelector(`.${className}`);
        if (buttonPlaceHolder) {
            buttonPlaceHolder.appendChild(button);
        } else {
            console.error(`Placeholder for button with class "${className}" not found.`);
        }
    }
}

// Initialize buttons (from file 2)
createButton("h1", "Back to Top", "backToTop", "#FFD2FF", "#FFD2FF");
createButton("h2", "Email", "email", "#EDED14", "#000");
createButton("h2", "LinkedIn", "linkedin", "#EDED14", "#000");
createButton("h2", "Instagram", "instagram", "#EDED14", "#000");
createButton("h3", "Back", "backBtn", "#EDED14", "#126889");
createButton("h3", "Visit my photo archive here!", "photo-archive-btn", "#EDED14", "#FFD2FF");

createButton("h3", "Generate new Dot Map", "generateNewDotMap", "#EDED14", "#126889");

function enlargeMedia() {
    const mediaImages = document.querySelectorAll('img:not(.noEnlarge)'); // Exclude .noEnlarge images

    mediaImages.forEach(img => {
        img.style.cursor = 'pointer'; // Optional: makes it feel interactive

        img.addEventListener('click', () => {
            console.log("image clicked:", img.src);
            window.open(img.src, '_blank');
        });
    });
}

function loadProjectHighlights(data) {
    const highlights = data.highlight;
    if (!highlights) {
        console.error('No highlight section found in JSON');
        return;
    }

    const projectsFlexContainer = document.querySelector('.projects-flex');
    if (!projectsFlexContainer) {
        console.error('Projects flex container not found');
        return;
    }

    // Clear existing placeholder content
    projectsFlexContainer.innerHTML = '';

    // Convert highlights object to array
    const highlightEntries = Object.entries(highlights);

    highlightEntries.forEach(([key, project], index) => {
        // Add fillers at specific positions
        if (index === 0) {
            const filler = document.createElement('div');
            filler.classList.add('project-flex-filler');
            projectsFlexContainer.appendChild(filler);
        }

        // Create project card
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-flex-each');
        
        // Set background image from JSON
        projectCard.style.backgroundImage = `url('${project.documentation.thumbnail}')`;
        projectCard.style.backgroundSize = 'cover';
        projectCard.style.backgroundPosition = 'center';
        projectCard.style.backgroundRepeat = 'no-repeat';
        
        // Add project info overlay
        const projectOverlay = document.createElement('div');
        projectOverlay.classList.add('project-overlay');
        projectOverlay.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.year}</p>
        `;
        
        projectCard.appendChild(projectOverlay);
        
        // Add click handler
        projectCard.addEventListener('click', () => {
            if(key === "Highlight1"){
                window.location.href = 'mirror-selfie.html';
            }else if(key === "Highlight2") {
                window.location.href = 'stroll-app.html';
            }else if (key === "Highlight3"){
                window.location.href = 'pinterest-casestudy.html';
            }else if(key === "Highlight4") {
                window.location.href = 'odd-fellow-says-hello.html'
            }else if(key === "Highlight5") {
                window.location.href = 'labyrinth.html'
            }else if(key === "Highlight6") {
                window.location.href = 'dotmap.html'
            }
            else{
                window.location.href = `project-info.html?project=${encodeURIComponent(project.name)}`;
            }
        });

        projectsFlexContainer.appendChild(projectCard);

        // Add fillers at specific positions
        if (index === 1 || index === 2 || index === 4) {
            const filler = document.createElement('div');
            filler.classList.add('project-flex-filler');
            projectsFlexContainer.appendChild(filler);
        }
    });

    // Add final filler
    const finalFiller = document.createElement('div');
    finalFiller.classList.add('project-flex-filler');
    projectsFlexContainer.appendChild(finalFiller);
}

function loadArchivedWorks(data) {
    if (!document.getElementById('archive-container')) return;

    if (!data.archive) return;

    const archiveCarouselLeft = document.querySelector('#archive-carousel-left');
    const archiveCarouselRight = document.querySelector('#archive-carousel-right');

    archiveCarouselLeft.innerHTML = '';
    archiveCarouselRight.innerHTML = '';

    const projectsArray = [];

    Object.entries(data.archive).forEach(([key, project]) => {
        projectsArray.push(project);
    });

    // LEFT (normal upward)
    startSmoothCarouselLeft(archiveCarouselLeft, projectsArray);

    // RIGHT (reverse downward)
    startSmoothCarouselRight(archiveCarouselRight, projectsArray);
}

function startSmoothCarouselLeft(container, projectsArray) {
    const infoLeftSide = document.getElementById("archive-info");
    let carouselAnimation;
    let isDragging = false;
    let hasDragged = false; // Track if user actually dragged
    let startY = 0;
    let currentY = 0;
    let dragTimeout;
    
    // Duplicate projects array for seamless looping
    const duplicatedProjects = [...projectsArray, ...projectsArray];
    
    // Create all thumbnails
    duplicatedProjects.forEach((project, index) => {
        const thumbnail = createThumbnailElement(project, index);
        container.appendChild(thumbnail);
    });
    
    // Wait for DOM to update, then get actual heights and position
    setTimeout(() => {
        const thumbnails = Array.from(container.children);
        
        // Calculate individual heights
        const heights = thumbnails.map(thumb => thumb.offsetHeight);
        
        // Calculate the height of one complete cycle (first set only)
        const singleCycleHeight = heights.slice(0, projectsArray.length).reduce((sum, h) => sum + h, 0);
        
        // Position ALL thumbnails in a continuous column
        gsap.set(thumbnails, {
            y: (i) => {
                let yPos = 0;
                // Sum up all heights before this index
                for (let j = 0; j < i; j++) {
                    yPos += heights[j];
                }
                return yPos;
            }
        });
        
        // Create the infinite scroll animation
        carouselAnimation = gsap.to(thumbnails, {
            duration: singleCycleHeight / 50,
            ease: "none",
            y: `-=${singleCycleHeight}`,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % singleCycleHeight)
            },
            repeat: -1
        });

        // Mouse down - start dragging
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasDragged = false; // Reset drag flag
            startY = e.clientY;
            container.style.cursor = 'grabbing';
            
            // Pause auto-scroll
            if (carouselAnimation) {
                carouselAnimation.pause();
            }
            
            // Clear resume timeout
            clearTimeout(dragTimeout);
        });

        // Mouse move - drag
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentY = e.clientY;
            const deltaY = currentY - startY;
            
            // If mouse moved more than 5px, consider it a drag
            if (Math.abs(deltaY) > 5) {
                hasDragged = true;
            }
            
            // Move thumbnails based on drag
            thumbnails.forEach((thumb) => {
                const currentThumbY = gsap.getProperty(thumb, "y");
                gsap.set(thumb, { y: currentThumbY + deltaY });
            });
            
            startY = currentY;
        });

        // Mouse up - stop dragging
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
                
                // Resume auto-scroll after 1.5 seconds
                dragTimeout = setTimeout(() => {
                    if (carouselAnimation) {
                        carouselAnimation.resume();
                    }
                }, 1500);
                
                // Reset hasDragged after a short delay to prevent click
                setTimeout(() => {
                    hasDragged = false;
                }, 100);
            }
        });

        // Set initial cursor
        container.style.cursor = 'grab';

    }, 100);
    
    function createThumbnailElement(project, index) {
        const eachProjectThumbnail = document.createElement('div');
        eachProjectThumbnail.classList.add('eachProjectThumbnail');
        
        eachProjectThumbnail.style.backgroundImage = `url('${project.documentation.thumbnail}')`;
        eachProjectThumbnail.style.backgroundSize = 'cover';
        eachProjectThumbnail.style.backgroundPosition = 'center';
        eachProjectThumbnail.style.backgroundRepeat = 'no-repeat';
        eachProjectThumbnail.style.position = 'absolute';
        eachProjectThumbnail.style.userSelect = 'none'; // Prevent text selection while dragging
        
        eachProjectThumbnail.addEventListener('click', (e) => {
            // Only navigate if not dragging AND haven't just dragged
            if (!isDragging && !hasDragged) {
                window.location.href = `project-info.html?project=${encodeURIComponent(project.name)}`;
            }
        });

        eachProjectThumbnail.addEventListener('mouseenter', () => {
            if (!isDragging) {
                gsap.to(eachProjectThumbnail, {
                    scale: 1.1,
                    duration: 0.25,
                    ease: "power2.out"
                });
                
                if (carouselAnimation) {
                    carouselAnimation.pause();
                }

                infoLeftSide.innerHTML = `
                    <h1>${project.name}</h1>
                    <h2>${project.year}</h2>
                    <p>${project.info}</p>
                    <span>Click on the image to learn more</span>
                `;
            }
        });

        eachProjectThumbnail.addEventListener('mouseleave', () => {
            if (!isDragging) {
                gsap.to(eachProjectThumbnail, {
                    scale: 1,
                    duration: 0.25,
                    ease: "power2.out"
                });
                
                if (carouselAnimation) {
                    carouselAnimation.resume();
                }

                infoLeftSide.innerHTML = "Hover over the images!";
            }
        });
        
        return eachProjectThumbnail;
    }
}

function startSmoothCarouselRight(container, projectsArray) {
    const infoLeftSide = document.getElementById("archive-info");
    let carouselAnimation;
    let isDragging = false;
    let hasDragged = false; // Track if user actually dragged
    let startY = 0;
    let currentY = 0;
    let dragTimeout;

    const duplicatedProjects = [...projectsArray, ...projectsArray];

    duplicatedProjects.forEach((project, index) => {
        const thumbnail = createThumbnailElement(project, index);
        container.appendChild(thumbnail);
    });

    setTimeout(() => {
        const thumbnails = Array.from(container.children);
        const heights = thumbnails.map(t => t.offsetHeight);
        const singleCycleHeight = heights
            .slice(0, projectsArray.length)
            .reduce((sum, h) => sum + h, 0);

        gsap.set(thumbnails, {
            y: (i) => {
                let yPos = -singleCycleHeight + container.offsetHeight;
                for (let j = 0; j < i; j++) {
                    yPos += heights[j];
                }
                return yPos;
            }
        });

        carouselAnimation = gsap.to(thumbnails, {
            duration: singleCycleHeight / 50,
            ease: "none",
            y: `+=${singleCycleHeight}`,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % singleCycleHeight)
            },
            repeat: -1
        });

        // Mouse down - start dragging
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasDragged = false; // Reset drag flag
            startY = e.clientY;
            container.style.cursor = 'grabbing';
            
            if (carouselAnimation) {
                carouselAnimation.pause();
            }
            
            clearTimeout(dragTimeout);
        });

        // Mouse move - drag
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentY = e.clientY;
            const deltaY = currentY - startY;
            
            // If mouse moved more than 5px, consider it a drag
            if (Math.abs(deltaY) > 5) {
                hasDragged = true;
            }
            
            thumbnails.forEach((thumb) => {
                const currentThumbY = gsap.getProperty(thumb, "y");
                gsap.set(thumb, { y: currentThumbY + deltaY });
            });
            
            startY = currentY;
        });

        // Mouse up - stop dragging
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
                
                dragTimeout = setTimeout(() => {
                    if (carouselAnimation) {
                        carouselAnimation.resume();
                    }
                }, 1500);
                
                // Reset hasDragged after a short delay to prevent click
                setTimeout(() => {
                    hasDragged = false;
                }, 100);
            }
        });

        // Set initial cursor
        container.style.cursor = 'grab';

    }, 100);

    function createThumbnailElement(project, index) {
        const eachProjectThumbnail = document.createElement('div');
        eachProjectThumbnail.classList.add('eachProjectThumbnail');

        eachProjectThumbnail.style.width = "100%";
        eachProjectThumbnail.style.height = "50vh";
        eachProjectThumbnail.style.flexShrink = "0";

        eachProjectThumbnail.style.backgroundImage = `url('${project.documentation.thumbnail}')`;
        eachProjectThumbnail.style.backgroundSize = 'cover';
        eachProjectThumbnail.style.backgroundPosition = 'center';
        eachProjectThumbnail.style.backgroundRepeat = 'no-repeat';
        eachProjectThumbnail.style.position = 'absolute';
        eachProjectThumbnail.style.userSelect = 'none';

        eachProjectThumbnail.addEventListener('click', (e) => {
            // Only navigate if not dragging AND haven't just dragged
            if (!isDragging && !hasDragged) {
                window.location.href = `project-info.html?project=${encodeURIComponent(project.name)}`;
            }
        });

        eachProjectThumbnail.addEventListener('mouseenter', () => {
            if (!isDragging) {
                gsap.to(eachProjectThumbnail, { scale: 1.1, duration: 0.25, ease: "power2.out" });
                if (carouselAnimation) carouselAnimation.pause();
                infoLeftSide.innerHTML = `
                    <h1>${project.name}</h1>
                    <h2>${project.year}</h2>
                    <p>${project.info}</p>
                    <span>Click on the image to learn more</span>
                `;
            }
        });

        eachProjectThumbnail.addEventListener('mouseleave', () => {
            if (!isDragging) {
                gsap.to(eachProjectThumbnail, { scale: 1, duration: 0.25, ease: "power2.out" });
                if (carouselAnimation) carouselAnimation.resume();
                infoLeftSide.innerHTML = "Hover over the images!";
            }
        });

        return eachProjectThumbnail;
    }
}
function generateNewDotMap(){
    const generateNewDotMap = document.querySelector('.generateNewDotMap')

    generateNewDotMap.addEventListener('click',()=>{
        const iframe = document.getElementById('dotMapIFrame');
        iframe.src = iframe.src;
    })
}

// Set archive info if element exists (from file 2)
const archiveInfo = document.querySelector('#archive-info');
if (archiveInfo) {
    archiveInfo.innerHTML = "Hover over the images!";
}

// Combined DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const projectKey = urlParams.get('project'); // For project-info page
        const section = urlParams.get('section'); // For section-based pages

        // Fetch the JSON once
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Failed to fetch projects.json');
        const data = await response.json();


        // CASE 1: Project info page (has ?project= parameter)
        if (projectKey) {
            const project = data.archive[projectKey];

            if (project) {
                document.querySelector('.content-left').innerHTML = `<h2>${project.name}</h2><h3>${project.year}</h3>`;
                document.querySelector('.content-center').textContent = project.info;
                document.querySelector('.content-right').innerHTML = project.material?.length ? project.material.map(m => `<li>${m}</li>`).join('') : '<li>Not specified</li>';

                const img = document.querySelector('.projectThumbnail');
                img.classList.add('noEnlarge');
                img.src = project.documentation.thumbnail;
                img.alt = project.name;

                img.addEventListener('click', () => {
                    window.open(project.link);
                });

                document.querySelector('.progressTitle').textContent = "Progress";
                document.querySelector('.reflectionTitle').textContent = "Reflection";

                const contentBackToTop = document.querySelector('.content-backToTop');
                contentBackToTop.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                createButton("h3", "Back To Top", "content-backToTop", "#EDED14", "#126889");

                if (project.link) {
                    const visitSite = document.querySelector('.visitSite');
                    createButton("h3", "Visit Site", "visitSite", "#EDED14", "#126889");

                    visitSite.addEventListener('click', () => {
                        window.open(project.link);
                    });
                }

                
                const projectDocumentation = document.querySelector('.progressPhoto');

                // Clear any existing content first
                projectDocumentation.innerHTML = "";

                // Loop through all keys in the documentation object
                Object.entries(project.documentation).forEach(([key, value]) => {
                    // Skip thumbnail since it's used elsewhere
                    if (key !== "thumbnail" && value) {
                        const fileExtension = value.split('.').pop().toLowerCase();
                        let mediaElement;

                        // Check for common video file extensions
                        if (["mp4", "mov", "webm", "ogg"].includes(fileExtension)) {
                            mediaElement = document.createElement("video");
                            mediaElement.src = value;
                            mediaElement.controls = true;
                            mediaElement.autoplay = true;
                            mediaElement.loop = true;
                            mediaElement.muted = true;
                            mediaElement.classList.add("documentationElement");
                        }
                        // Treat everything else as an image
                        else if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic", "avif"].includes(fileExtension)) {
                            mediaElement = document.createElement("img");
                            mediaElement.src = value;
                            mediaElement.alt = `${project.name} - ${key}`;
                            mediaElement.classList.add("documentationElement");
                        }

                        if (mediaElement) {
                            projectDocumentation.appendChild(mediaElement);
                        }
                    }
                });

                enlargeMedia();
            } else {
                console.error('Project not found');
            }
            return;
        }

        // CASE 2: Archive page (no section parameter AND archive container exists)
        if (!section && document.getElementById('archive-container')) {
            loadArchivedWorks(data);
            return;
        }

        // CASE 3: Section-based page (has ?section= parameter)
        if (section) {
            console.log("Loading section:", section);

            if (!data[section]) {
                console.error(`Section "${section}" not found in the JSON file`);
                return;
            }
            const projects = data[section];

            const container = document.getElementById('projects-container');
            container.innerHTML = '';

            // Add your section loading logic here if needed
            return;
        }

        // CASE 4: Landing page with highlights (no parameters)
        loadProjectHighlights(data);

    } catch (error) {
        console.error('Error loading projects:', error);
    }
});

generateNewDotMap()
