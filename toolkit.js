/* ==========================================================================
   toolkit.js — the "My Toolkit" content on the homepage.
   Edit the text here; the page builds itself from this list.

   Each tool:   name, use (one or two lines on what I use it for),
                used (optional) — project keys from TOOLKIT_PROJECTS below,
                      or plain text for work that has no page.
   ========================================================================== */

const TOOLKIT_PROJECTS = {
    flower:    { name: 'When The Flower Stops Breathing', href: 'when-the-flower-stops-breathing.html' },
    mirror:    { name: 'Mirror Selfie',          href: 'mirror-selfie.html' },
    stroll:    { name: 'Stroll',                 href: 'stroll-app.html' },
    labyrinth: { name: 'LABYRINTH',              href: 'labyrinth.html' },
    dotmap:    { name: 'Dot Map',                href: 'dotmap.html' },
    oddfellow: { name: 'Odd Fellow Says Hello',  href: 'odd-fellow-says-hello.html' },
    huehunter: { name: 'Hue Hunter',             href: 'project-info.html?project=Hue%20Hunter' },
    timekeeper:{ name: 'Time Keeper',            href: 'project-info.html?project=Time%20Keeper' },
    dataportrait: { name: 'Data Portrait',       href: 'project-info.html?project=Data%20Portrait' },
    sircle:    { name: 'Sircle',                 href: 'project-info.html?project=Sircle' },
    photos:    { name: 'Photo Archive',          href: 'project-info.html?project=Photo%20Archive' },
};

const TOOLKIT = [
    {
        id: 'design',
        title: 'Design',
        blurb: 'From first sketch to finished interface, brand and physical object.',
        groups: [
            {
                title: 'Design',
                tools: [
                    { name: 'Figma', icon: 'figma.png', use: 'UI design, wireframes and interactive prototypes, including the ones I user-test. I hand designs off to developers and teach Figma prototyping as a tutor.', used: ['stroll', 'Lead Digital Curator'] },
                    { name: 'Miro', icon: 'miro.png', use: 'Brainstorming, affinity mapping, user journeys and information architecture.' },
                    { name: 'Illustrator', icon: 'illustrator.png', use: 'Brand identity and logos, vector graphics, generative-art layouts and marketing assets.', used: ['stroll', 'dotmap', 'La MaMa'] },
                    { name: 'Photoshop', icon: 'photoshop.png', use: 'Image editing, mockups and UI visuals.', used: ['stroll', 'sircle'] },
                    { name: 'InDesign', icon: 'indesign.png', use: 'Documentation booklets, zines and print layouts.', used: ['flower'] },
                    { name: 'Lightroom', icon: 'lightroom.png', use: 'Editing my photography and project documentation.', used: ['photos'] },
                    { name: 'Premiere Pro', icon: 'premiere-pro.png', use: 'Project documentation videos and demo reels.' },
                    { name: 'After Effects', use: 'Motion graphics and animation.' },
                    { name: 'Fusion 360', icon: 'fusion 360 logo.png', iconRaw: true, use: '3D modelling and mechanism design, like the rack-and-pinion petals in my thesis, plus enclosures like the LABYRINTH cabinet.', used: ['flower', 'labyrinth'] },
                    { name: '3D printing, laser cutting & CNC', short: 'Fabrication', use: 'Prototyping and fabrication. I ran these machines as a Student Technician in the Parsons fab lab.' },
                ],
            },
        ],
    },
    {
        id: 'code',
        title: 'Code',
        blurb: 'Websites, games, and installations that sense people and move.',
        groups: [
            {
                title: 'Front-end & web',
                tools: [
                    { name: 'HTML & CSS', icon: 'html.png', use: 'Hand-coded, responsive and accessible websites, including this portfolio and two Parsons research sites.' },
                    { name: 'JavaScript', icon: 'js.png', iconRaw: true, use: 'Interaction, animation and data-driven pages, plus browser games.', used: ['huehunter'] },
                    { name: 'TypeScript', icon: 'typescript.png', use: 'Typed front-end and back-end code.', used: ['oddfellow'] },
                    { name: 'React', use: 'Component-based UI. I teach it as a tutor.' },
                    { name: 'Tailwind CSS', use: 'Utility-first styling. I teach it as a tutor.' },
                    { name: 'GSAP', use: 'Scroll and motion animation, like the carousels on my project pages.' },
                    { name: 'p5.js', use: 'Creative coding and generative visuals. I also teach it.', used: ['dotmap', 'timekeeper', 'dataportrait'] },
                    { name: 'Deno & Oak', use: 'Back-end servers and API routes.', used: ['oddfellow'] },
                    { name: 'Wix', use: 'Building and maintaining client websites.', used: ['Thresh', 'The Red Curtain Project'] },
                    { name: 'Git & GitHub', use: 'Version control, pull requests, and hosting this portfolio on GitHub Pages.' },
                    { name: 'VS Code', use: 'My everyday code editor.' },
                ],
            },
            {
                title: 'Creative tech & physical computing',
                tools: [
                    { name: 'Python', icon: 'python.png', use: 'Computer vision and hardware control.', used: ['flower', 'mirror'] },
                    { name: 'OpenCV', use: 'Face and person tracking.', used: ['flower', 'mirror'] },
                    { name: 'Raspberry Pi', use: 'Running installations and controlling hardware.', used: ['flower', 'mirror'] },
                    { name: 'Arduino', icon: 'arduino.png', use: 'Sensors, servos and joystick input. I also teach it.', used: ['flower', 'labyrinth'] },
                    { name: 'C / C++', icon: 'c-.png', iconRaw: true, use: 'Arduino and microcontroller code.' },
                    { name: 'C#', icon: 'c-sharp.png', iconRaw: true, use: 'Scripting in Unity.', used: ['labyrinth'] },
                    { name: 'Unity', icon: 'Unity.png', use: 'Game logic and interaction.', used: ['labyrinth'] },
                    { name: 'Bash', use: 'Scripts that run and automate installations.', used: ['mirror'] },
                ],
            },
        ],
    },
    {
        id: 'ai',
        title: 'AI',
        blurb: 'Used as a collaborator and as a material, not a replacement for the work.',
        groups: [
            {
                title: 'Tools & APIs',
                tools: [
                    { name: 'Claude & Claude Code', use: 'Building and refactoring this portfolio, design prototypes, and writing and editing copy.' },
                    { name: 'ChatGPT', use: 'Brainstorming and ideation.', used: ['stroll'] },
                    { name: 'OpenAI (GPT) API', use: 'An LLM as the game engine: prompt design and parsing its answers into consistent, playable puzzles.', used: ['oddfellow'] },
                ],
            },
        ],
    },
];

/* "Used in" links for a tool (plain text for work without its own page) */
function toolkitUsedIn(tool) {
    return (tool.used || []).map(key => {
        const p = TOOLKIT_PROJECTS[key];
        return p ? `<a class="tk-project" href="${p.href}">${p.name}</a>` : `<span class="tk-project tk-project-plain">${key}</span>`;
    }).join('');
}
