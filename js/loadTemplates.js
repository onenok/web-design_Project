// Load template components (nav and footer)
async function loadTemplates() {
    try {
        // Load nav
        const navResponse = await fetch('/templates/nav.html');
        const navData = await navResponse.text();
        
        // Load footer
        const footerResponse = await fetch('/templates/footer.html');
        const footerData = await footerResponse.text();

        // Insert nav at the beginning of major-container
        const majorContainer = document.querySelector('.major-container');
        majorContainer.insertAdjacentHTML('afterbegin', navData);

        // Insert footer at the end of body
        document.body.insertAdjacentHTML('beforeend', footerData);

    } catch (error) {
        console.error('Failed to load templates:', error);
    }
}

// Call loadTemplates when DOM is ready
document.addEventListener('DOMContentLoaded', loadTemplates);
