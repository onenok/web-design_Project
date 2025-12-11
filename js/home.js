// Extracted scripts from home.html

console.log('home page script loaded.');

(function () {
console.log('home page script loaded Double Check.');

fetch('./json/services_form.json') 
    .then(res => res.json())
    .then(data => {
        console.log('Service form data loaded:', data);
        const service_list = document.querySelector('#service_list');
        service_list.innerHTML = 'loading...'; // loading message
        const allServicesKeys = Object.keys(data);
        service_list.innerHTML = ''; // clear loading message
        let html = '';
        allServicesKeys.forEach(serviceKey => {
            html = `
                <a class="betterA" href="#services?scrollTo=${serviceKey}">
                    ${data[serviceKey]['service_name'] || serviceKey}
                </a>
            `;
            const li = document.createElement('li');
            li.innerHTML = html;
            service_list.appendChild(li);
        });
    });

})();
