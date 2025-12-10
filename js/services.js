// Extracted scripts from services.html

console.log('services page script loaded.');

(function () {
console.log('services page script loaded Double Check.');

fetch('./json/services_form.json') 
    .then(res => res.json())
    .then(data => {
        console.log('Service form data loaded:', data);
        const services_container = document.querySelector('#services_container');
        services_container.innerHTML = ''; // Clear the loading message
        const allServices = Object.entries(data);
        let html = '';
        allServices.forEach(([serviceKey, serviceItems]) => {
            const title = serviceItems['service_name'] || serviceKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            html = `
            <div>
                <h2 id="${serviceKey}" data-scroll-to='true'>${title}</h2>
                <ul>
                ${serviceItems["services"].map(item => {
                    item.price = item.price || 0;
                    item.discount_percent = Math.max(0,Math.min(100, item.discount_percent || 100));
                    const savePercent = 100 - item.discount_percent;
                    let final_price = item.price;
                    if (item.has_price)  final_price = (item.price * (item.discount_percent / 100)).toFixed(2);
                    const price_label = item.has_price ? (item.discount_percent < 100 ? `HKD $${final_price} (Original price HKD $${item.price}, save ${savePercent}%)` : `HKD $${item.price}`) : item.price;
                    return`
                        <li>
                        ${item.name}
                        <br>
                        ${price_label}
                        <br>
                        ${item.detail || ''}
                        </li>
                    `
                }).join('')}
                </ul>
                <button onclick="location.href='#appointment?service=${serviceKey}'" aria-label="Book ${title} Service Appointment">Book ${title} Service Appointment</button>
            </div>
            <img src="./img/${serviceKey.replace(/-/g, '_')}.jpeg" alt="${title} Image" class="service-image">
            `;
            const section = document.createElement('section');
            section.className = 'services-section';
            section.innerHTML = html;
            services_container.appendChild(section);
        });
        const hash = window.location.hash;
        let serviceType = null; // Store the current service type (e.g., 'car-inspection')
        if (hash.includes('?')) {
            const params = new URLSearchParams(hash.split('?')[1]);
            serviceType = params.get('scrollTo');
            if (serviceType) {
                const targetElement = document.getElementById(serviceType);
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }
    });

})();
