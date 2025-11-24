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
    const pageName = page || 'home';
    const pageFile = `/pages/${pageName}.html`; // pages/home.html
    const JsFile = `/js/${pageName}.js`;     // js/home.js

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
            history.pushState({ page: pageName }, '', `/#${pageName}`);
            // update title
            document.title = `JustAWebSite - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
            // set focus to content div for accessibility
            contentDiv.focus();
        })
        .catch(error => {
            contentDiv.innerHTML = '<p tabindex="-1">failed to load page, please try again later。</p>';
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
            script.textContent = jsCode;
            script.setAttribute('data-name', pageName);
            document.body.appendChild(script);
        })
        .catch(error => {
            // pass
        });
}

// handle page load URL (support direct access to #{pageName})
window.onload = function() {
    const contentDiv = document.querySelector('.main-content');
    // extract #pageName from URL
    const page = window.location.hash.replace('#', '') || 'home';

    fetchPage(page, contentDiv);
};

// handle browser back/forward buttons
window.onpopstate = function(event) {
    const contentDiv = document.querySelector('.main-content');
    const page = event.state?.page || window.location.hash.replace('#', '') || 'home';

    fetchPage(page, contentDiv);
};