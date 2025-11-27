/* not used
function switchFunction(element) {
    const page = element.getAttribute('data-pages');
    const contentDiv = document.querySelector('.main-content');

    // load page content
    fetchPage(page, contentDiv);
}
*/

// load page content function
function fetchPage(page, contentDiv) {
    // default page: 'home'
    const tempName = page || 'home';
    const pageName = tempName.includes('?') ? tempName.split('?')[0] : tempName;
    const pageFile = `pages/${pageName}.html`; // pages/home.html (relative to base)
    const JsFile = `js/${pageName}.js`;     // js/home.js (relative to base)

    fetch(pageFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('failed to load page');
            }
            return response.text();
        })
        .then(data => {
            contentDiv.innerHTML = data;
            // update URL，add #pageName
            //const newUrl = location.pathname + `#${tempName}`;
            //history.pushState({ page: pageName }, '', newUrl);
            // update title
            document.title = `C.C.S. - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
            // set focus to content div for accessibility
            contentDiv.focus();
        })
        .catch(error => {
            contentDiv.innerHTML = `<p tabindex="-1">failed to load page "${pageName}", please try again later。</p>`;
            console.error(error);
        });
    // load associated JS file if exists
    const allExistingScripts = document.querySelectorAll('script[data-page-script]');
    allExistingScripts.forEach(script => {
        if (script.dataset.name === pageName) {
            // already loaded
            return;
        } else if (script.dataset.name) {
            // remove previous page script
            script.remove();
        }
    });
    fetch(JsFile)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('no associated JS file');
        })
        .then(jsCode => {
            // execute the JS code
            const script = document.createElement('script');
            script.src = JsFile;
            script.setAttribute('data-name', pageName);
            script.setAttribute('data-page-script', 'true');
            document.body.appendChild(script);
        })
        .catch(error => {
            // pass
        });
}

// handle page load URL (support direct access to #{pageName})
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.querySelector('.main-content');
    const page = window.location.hash.replace('#', '') || 'home';
    fetchPage(page, contentDiv);
});

// handle browser back/forward buttons
window.onpopstate = function(event) {
    const contentDiv = document.querySelector('.main-content');
    const page = event.state?.page || window.location.hash.replace('#', '') || 'home';

    fetchPage(page, contentDiv);
};