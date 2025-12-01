// Extracted scripts from testing.html

(function () {
console.log('Testing page script loaded');
    // Find the test div and display viewport dimensions
    const testDiv = document.querySelector('div.test');
    const updateViewport = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        testDiv.innerHTML = `Viewport: ${vw}px × ${vh}px`;
    };
    // Initial update
    updateViewport();
    // Update on window resize
    window.addEventListener('resize', updateViewport);

})();
