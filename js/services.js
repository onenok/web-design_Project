// Extracted scripts from services.html

console.log('services page script loaded.');

(function () {
console.log('services page script loaded Double Check.');

// Example of dynamically adding service items to the car-inspection list
    fetch('./json/services_form.json') 
    .then(res => res.json())
    .then(data => {
        console.log('Service form data loaded:', data);
        const services_container = document.querySelector('#services_container');
        const allServices = Object.entries(data);
        let html = '';
        allServices.forEach(([serviceKey, serviceItems]) => {
            const title = serviceItems['service_name'] || serviceKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            html = `
            <div>
                <h2><a href="#${serviceKey}">${title}</a></h2>
                <ul>
                ${serviceItems["services"].map(item => {
                    item.price = item.price || 0;
                    item.discount_percent = Math.max(0,Math.min(100, item.discount_percent || 100));
                    const savePercent = 100 - item.discount_percent;
                    let final_price = item.price;
                    if (item.price != '聯繫報價')  final_price = (item.price * (item.discount_percent / 100)).toFixed(2);
                    const price_label = item.price == '聯繫報價' ? '聯繫報價' : (item.discount_percent < 100 ? `HKD $${final_price} (原價 HKD $${item.price}, 節省 ${savePercent}%)` : `HKD $${item.price}`);
                    return`<li>${item.name} -- ${price_label}</li>`
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
    });

})();
