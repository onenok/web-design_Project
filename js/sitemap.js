// Extracted scripts from sitemap.html

console.log('sitemap page script loaded.');

(function () {
console.log('sitemap page script loaded Double Check.');

fetch('./json/services_form.json') 
    .then(res => res.json())
    .then(data => {
        console.log('Service form data loaded:', data);
        const service_list = document.querySelector('#services-list');
        const appointment_list = document.querySelector('#appointment-list');
        const allServicesKeys = Object.keys(data);
        let service_html = '';
        let appointment_html = '';
        allServicesKeys.forEach(serviceKey => {
            service_html = `
                <a class="betterA" href="#services?scrollTo=${serviceKey}">
                    ${data[serviceKey]['service_name'] || serviceKey}
                </a>
            `;
            const li = document.createElement('li');
            li.innerHTML = service_html;
            service_list.appendChild(li);
            appointment_html = `
                <a class="betterA" href="#appointment?service=${serviceKey}">
                    ${data[serviceKey].form.title || serviceKey}
                </a>
            `;
            const li2 = document.createElement('li');
            li2.innerHTML = appointment_html;
            appointment_list.appendChild(li2);
        });
    });

})();
