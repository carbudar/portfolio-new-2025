function createButton(size, buttonText, className, highlightColor, color, parentElement = null) {
    const button = document.createElement('div');
    button.classList.add('button');

    const buttonExpand = document.createElement('div');
    buttonExpand.classList.add('button-expand');

    const buttonContent = document.createElement('div');
    const buttonTitle = document.createElement(size);
    buttonTitle.innerHTML = buttonText;

    buttonContent.appendChild(buttonTitle);
    buttonContent.classList.add('buttonContent');
    buttonContent.style.padding = "1vh"

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

createButton("h1", "Back to Top", "backToTop", "#FFD2FF", "#FFD2FF");
createButton("h2", "Email", "email", "#EDED14", "#000");
createButton("h2", "LinkedIn", "linkedin", "#EDED14", "#000");
createButton("h2", "Instagram", "instagram", "#EDED14", "#000");
createButton("h3", "Back", "backBtn", "#EDED14", "#126889");
createButton("h3", "Visit my photo archive here!", "photo-archive-btn", "#EDED14", "#FFD2FF");


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
            if (key === "Highlight2") {
                window.location.href = 'stroll-app.html';
            } else {
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


// THEN UPDATE YOUR DOMContentLoaded:
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');

        // Fetch the JSON once
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Failed to fetch projects.json');
        const data = await response.json();

        // Check if we're on the archive page (no section parameter AND archive container exists)
        if (!section && document.getElementById('archive-container')) {
            loadArchivedWorks(data); // Pass data here
            return;
        }

        // If there's a section parameter, load the archive/project list
        if (section) {
            console.log("Loading section:", section);

            if (!data[section]) {
                console.error(`Section "${section}" not found in the JSON file`);
                return;
            }
            const projects = data[section];

            const container = document.getElementById('projects-container');
            container.innerHTML = '';

            // ... rest of your section loading code
        } else {
            // No section parameter - we're on the landing page, load highlights
            loadProjectHighlights(data);
        }
    } catch (error) {
        console.error('Error fetching project data:', error);
    }
});

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


const archiveInfo = document.querySelector('#archive-info')
archiveInfo.innerHTML="Hover over the images!"


function startSmoothCarouselLeft(container, projectsArray) {
    const infoLeftSide = document.getElementById("archive-info");
    let carouselAnimation;
    
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
            duration: singleCycleHeight / 50, // Adjust speed here (higher number = slower)
            ease: "none",
            y: `-=${singleCycleHeight}`, // Move up by one cycle height
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % singleCycleHeight)
            },
            repeat: -1
        });
    }, 100);
    
    function createThumbnailElement(project, index) {
        const eachProjectThumbnail = document.createElement('div');
        eachProjectThumbnail.classList.add('eachProjectThumbnail');
        
        // Set background image from JSON
        eachProjectThumbnail.style.backgroundImage = `url('${project.documentation.thumbnail}')`;
        eachProjectThumbnail.style.backgroundSize = 'cover';
        eachProjectThumbnail.style.backgroundPosition = 'center';
        eachProjectThumbnail.style.backgroundRepeat = 'no-repeat';
        eachProjectThumbnail.style.position = 'absolute';
        
        // Add click handler
        eachProjectThumbnail.addEventListener('click', () => {
            window.location.href = `project-info.html?project=${encodeURIComponent(project.name)}`;
        });

        eachProjectThumbnail.addEventListener('mouseenter', () => {
            gsap.to(eachProjectThumbnail, {
                scale: 1.1,
                duration: 0.25,
                ease: "power2.out"
            });
            
            // Pause the animation
            if (carouselAnimation) {
                carouselAnimation.pause();
            }

             infoLeftSide.innerHTML = `
        <h1>${project.name}</h1>
        <h2>${project.year}</h2>
        <p>${project.info}</p>
        <span>Click on the image to learn more</span>
    `;
        });

        eachProjectThumbnail.addEventListener('mouseleave', () => {
            gsap.to(eachProjectThumbnail, {
                scale: 1,
                duration: 0.25,
                ease: "power2.out"
            });
            
            // Resume the animation
            if (carouselAnimation) {
                carouselAnimation.resume();
            }

            infoLeftSide.innerHTML = "Hover over the images!";
        });
        
        return eachProjectThumbnail;
    }
}

     

function startSmoothCarouselRight(container, projectsArray) {
    const infoLeftSide = document.getElementById("archive-info");
    let carouselAnimation;

    // Duplicate projects array for seamless looping
    const duplicatedProjects = [...projectsArray, ...projectsArray];

    // Create all thumbnails
    duplicatedProjects.forEach((project, index) => {
        const thumbnail = createThumbnailElement(project, index);
        container.appendChild(thumbnail);
    });

    // Wait for DOM to update
    setTimeout(() => {
        const thumbnails = Array.from(container.children);

        // Get individual heights
        const heights = thumbnails.map(t => t.offsetHeight);

        // Height of one cycle (first set only)
        const singleCycleHeight = heights
            .slice(0, projectsArray.length)
            .reduce((sum, h) => sum + h, 0);

        // 1️⃣ Stack thumbnails with last project at bottom of container
        gsap.set(thumbnails, {
            y: (i) => {
                let yPos = -singleCycleHeight + container.offsetHeight; // pull everything up so last project aligns bottom
                for (let j = 0; j < i; j++) {
                    yPos += heights[j];
                }
                return yPos;
            }
        });

        // 2️⃣ Animate downward continuously
        carouselAnimation = gsap.to(thumbnails, {
            duration: singleCycleHeight / 50, // adjust speed
            ease: "none",
            y: `+=${singleCycleHeight}`,
            modifiers: {
                y: gsap.utils.unitize(y => parseFloat(y) % singleCycleHeight)
            },
            repeat: -1
        });
    }, 100);

    function createThumbnailElement(project, index) {
        const eachProjectThumbnail = document.createElement('div');
        eachProjectThumbnail.classList.add('eachProjectThumbnail');

        // Match left carousel sizing
        eachProjectThumbnail.style.width = "100%";
        eachProjectThumbnail.style.height = "50vh";
        eachProjectThumbnail.style.flexShrink = "0";

        eachProjectThumbnail.style.backgroundImage = `url('${project.documentation.thumbnail}')`;
        eachProjectThumbnail.style.backgroundSize = 'cover';
        eachProjectThumbnail.style.backgroundPosition = 'center';
        eachProjectThumbnail.style.backgroundRepeat = 'no-repeat';
        eachProjectThumbnail.style.position = 'absolute';

        // Click
        eachProjectThumbnail.addEventListener('click', () => {
            window.location.href = `project-info.html?project=${encodeURIComponent(project.name)}`;
        });

        // Hover
        eachProjectThumbnail.addEventListener('mouseenter', () => {
            gsap.to(eachProjectThumbnail, { scale: 1.1, duration: 0.25, ease: "power2.out" });
            if (carouselAnimation) carouselAnimation.pause();
              infoLeftSide.innerHTML = `
        <h1>${project.name}</h1>
        <h2>${project.year}</h2>
        <p>${project.info}</p>
        <span>Click on the image to learn more</span>
    `;
        });

        eachProjectThumbnail.addEventListener('mouseleave', () => {
            gsap.to(eachProjectThumbnail, { scale: 1, duration: 0.25, ease: "power2.out" });
            if (carouselAnimation) carouselAnimation.resume();
            infoLeftSide.innerHTML = "Hover over the images!";
        });

        return eachProjectThumbnail;
    }
}
