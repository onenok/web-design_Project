/* not used
function switchFunction(element) {
    const page = element.getAttribute('data-pages');
    const contentDiv = document.querySelector('.main-content');

    // load page content
    fetchPage(page, contentDiv);
}
*/
function loadingAnimation(node) {
    if (!node) return;
    let dots = 0;
    loadingEl = node.querySelector('.Loading-page');
    if (!loadingEl) return;
    return setInterval(() => {
        dots = (dots + 1) % 4;
        loadingEl.innerHTML = `
            <h1 style="text-align:center; width: 100%; margin: auto; position: relative;">
                ${'Loading' + '.'.repeat(dots)}
            </h1>
            `;
    }, 500);
}
// load page content function
function fetchPage(page, contentDiv) {
    // default page: 'home'
    const tempName = page || 'home';
    const pageName = tempName.includes('?') ? tempName.split('?')[0] : tempName;
    const pageFile = `pages/${pageName}.html`; // pages/home.html (relative to base)
    const JsFile = `js/${pageName}.js`;     // js/home.js (relative to base)
    contentDiv.innerHTML = `
        <div class="Loading-page">
            <h1 style="text-align:center; width: 100%; margin: auto; position: relative;">Loading...</h1>
        </div>
    `;
    const loadingInterval = loadingAnimation(contentDiv);
    fetch(pageFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('failed to load page');
            }
            return response.text();
        })
        .then(data => {
            clearInterval(loadingInterval);
            contentDiv.innerHTML = data;
            // update URL, add #pageName
            //const newUrl = location.pathname + `#${tempName}`;
            //history.pushState({ page: pageName }, '', newUrl);
            // update title
            document.title = `C.C.S - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
            // set focus to content div for accessibility
            contentDiv.focus();
            const allExistingScripts = document.querySelectorAll('script[data-page-script]');
            allExistingScripts.forEach(script => { script.remove(); }); // remove previously added page scripts
            fetch(JsFile) // check if JS file exists
                .then(response => {
                    if (response.ok) {
                        console.log(`Loading JS file: ${JsFile}`);
                        return response.text();
                    }
                    if (response.status === 404) {
                        throw new Error('404');
                    }
                    throw new Error('failed to load JS file');
                })
                .then(() => {
                    console.log(`JS file found for page "${pageName}", loading it.`);
                    // Remove any existing script for this page (already done above, but double‑check)
                    const existing = document.querySelector(`script[data-page-script][data-name="${pageName}"]`);
                    if (existing) {
                        existing.remove();
                        console.log(`Removed existing script for page ${pageName}`);
                    }
                    // Create a fresh script element with a cache‑busting query string
                    const script = document.createElement('script');
                    script.src = `${JsFile}?t=${Date.now().toString(16)}`;
                    script.setAttribute('data-name', pageName);
                    script.setAttribute('data-page-script', 'true');
                    script.setAttribute('type', 'module');
                    document.body.appendChild(script);
                    console.log(`JS file "${JsFile}" loaded and appended to document.`);
                })
                .catch(error => {
                    if (error.message !== '404') {
                        console.error(error);
                    }
                    else {
                        console.info(`Page "${pageName}" has no associated JS file.`);
                    }
                });
        })
        .catch(error => {
            clearInterval(loadingInterval);
            contentDiv.innerHTML = `<p tabindex="-1">failed to load page "${pageName}", please try again later.</p>`;
            console.error(error);
        });
}

// handle page load URL (support direct access to #{pageName})
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.querySelector('.main-content');
    const page = window.location.hash.replace('#', '') || 'home';
    fetchPage(page, contentDiv);
});

// handle browser back/forward buttons
window.onpopstate = function (event) {
    const contentDiv = document.querySelector('.main-content');
    const page = event.state?.page || window.location.hash.replace('#', '') || 'home';

    fetchPage(page, contentDiv);
};