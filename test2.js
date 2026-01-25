function createButton(size, buttonText, className, highlightColor, color, parentElement = null) {
    console.log("button function is connected")
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

// Add this function at the top of your file (before the DOMContentLoaded)
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

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');

        // Fetch the JSON once
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Failed to fetch projects.json');
        const data = await response.json();

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

            const backgroundImageContainer = document.querySelector('.page-container');

            Object.keys(projects).forEach(projectKey => {
                const project = projects[projectKey];

                const projectElement = document.createElement('div');
                projectElement.classList.add('projectElement');

                // projectElement.addEventListener('mouseenter', () => {
                //     document.body.style.backgroundImage = "url('Big CIty Small World cover.png')";
                //     console.log(`url(${project.documentation.thumbnail})`);
                // });
                
                // projectElement.addEventListener('mouseleave', () => {
                //     console.log("mouse out");
                //     backgroundImageContainer.style.backgroundImage = "none";
                //     backgroundImageContainer.style.backgroundColor = "#F9F7F2";
                // });

                const projectPictureContainer = document.createElement('div');
                projectPictureContainer.classList.add('projectPictureContainer');
                const projectPicture = document.createElement('img');
                projectPicture.src = project.documentation.thumbnail;
                projectPicture.classList.add('projectPicture');

                const projectInfo = document.createElement('div');
                projectInfo.classList.add('projectInfo');

                const projectName = document.createElement('div');
                projectName.classList.add('projectName');

                const projectMaterial = document.createElement('div');
                projectMaterial.classList.add('projectMaterial');

                const projectDetailBtn = document.createElement('div');
                projectDetailBtn.classList.add('projectDetailBtn');

                const moreInfoBtn = document.createElement('div');
                moreInfoBtn.classList.add('moreInfoBtn');
                projectDetailBtn.appendChild(moreInfoBtn);

                createButton("h3", "More Info", "moreInfoBtn", "#EDED14", "#126889", moreInfoBtn);

                if (projectKey === "Pinterest Case Study") {
                    moreInfoBtn.addEventListener('click', () => {
                        window.location.href = `pinterest-casestudy.html`;
                    });
                } else if (projectKey === "Stroll") {
                    moreInfoBtn.addEventListener('click', () => {
                        window.location.href = `stroll-app.html`;
                    });
                } else {
                    moreInfoBtn.addEventListener('click', () => {
                        window.location.href = `project-info.html?project=${projectKey}`;
                    });
                }

                if (project.link) {
                    const visitBtn = document.createElement('div');
                    visitBtn.classList.add('visitBtn');
                    projectDetailBtn.appendChild(visitBtn);
                    createButton("h3", "Visit Site", "visitBtn", "#EDED14", "#126889", visitBtn);

                    visitBtn.addEventListener('click', () => {
                        window.open(project.link, '_blank');
                    });
                }

                const projectNameContent = document.createElement('h1');
                projectNameContent.classList.add('projectNameContent');
                projectNameContent.innerHTML = `<h2>${project.name}</h2> <h3>${project.year}</h3>`;

                const projectMaterialContent = document.createElement('ul');
                projectMaterialContent.classList.add('projectMaterialContent');
                projectMaterialContent.innerHTML = project.material?.length
                    ? project.material.map(m => `<li>${m}</li>`).join('')
                    : '<li>Not specified</li>';

                projectName.appendChild(projectNameContent);
                projectMaterial.appendChild(projectMaterialContent);
                projectInfo.appendChild(projectName);
                projectInfo.appendChild(projectMaterial);
                projectInfo.appendChild(projectDetailBtn);

                container.appendChild(projectElement);
                projectElement.appendChild(projectPictureContainer);
                projectPictureContainer.appendChild(projectPicture);
                projectElement.appendChild(projectInfo);
            });
        } else {
            // No section parameter - we're on the landing page, load highlights
            loadProjectHighlights(data);
        }
    } catch (error) {
        console.error('Error fetching project data:', error);
    }
});