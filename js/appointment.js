// Extracted scripts from appointment.html

console.log('appointment page script loaded.');

(function () {
console.log('appointment page script loaded Double Check.');

console.log('Appointment page script loaded');
    const container = document.getElementById('form-fields');
    const serviceSelect = document.getElementById('service-type');

    function loadServiceOptions(serviceType, datas) {
        const config = datas[serviceType];
        if (!config) {
            container.innerHTML = '<p>No matching service configuration found.</p>';
            return;
        }

        // Set title
        document.getElementById('form-title').textContent = config.title;

        // Dynamically generate fields
        container.innerHTML = '';
        config.form.fields.forEach(field => {
            let html = '';
            if (field.type === 'select') {
                // Use the option's label as value, and store price and discount in data attributes
                html = `<label class="form-label" for="${field.name}">${field.label}</label>
                        <select class="form-select" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} data-price=${field['data-price'] ? 'true' : 'false'}>
                            <option value="" disabled selected>Select a service</option>
                            ${
                                config[field.options].map(opt => {
                                    opt.price = opt.price || 0;
                                    opt.discount_percent = Math.max(0,Math.min(100, opt.discount_percent || 100));
                                    const savePercent = 100 - opt.discount_percent;
                                    let final_price = opt.price;
                                    if (opt.has_price)  final_price = (opt.price * (opt.discount_percent / 100)).toFixed(2);
                                    const price_label = !opt.has_price ? opt.price : (opt.discount_percent < 100 ? `HKD $${final_price} (Original price HKD $${opt.price}, save ${savePercent}%)` : `HKD $${opt.price}`);
                                    return `
                                        <option value="${opt.name}" 
                                            data-has-price="${opt.has_price}"
                                            data-final-price="${final_price}"
                                            data-price="${opt.price}" 
                                            data-discount="${opt.discount_percent}"
                                        >
                                            ${opt.name} -- ${price_label}
                                        </option>
                                        `
                                }).join('')
                            }
                        </select>`;
            } else if (field.type === 'textarea') {
                html = `<label class="form-label" for="${field.name}">${field.label}</label>
                        <textarea class="form-textarea" cols="${field.cols || ''}" rows="${field.rows || ''}" placeholder="${field.placeholder}" id="${field.name}" name="${field.name}"></textarea>`;
            } else {
                html = `<label class="form-label" for="${field.name}">${field.label}</label>
                        <input type="${field.type}" placeholder="${field.placeholder}" class="form-input" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} min="${field.min || ''}">`;
            }
            const div = document.createElement('div');
            div.className = 'form-input-group';
            div.innerHTML = html;
            container.appendChild(div);
        });
    }

    let datas = null
    fetch('./json/services_form.json') 
    .then(res => res.json())
    .then(data => {
        datas = data;
        console.log('Service form data loaded:', data);
        const allKeys = Object.keys(data);
        serviceSelect.innerHTML = `
            <option value="" disabled selected>Select a service</option>
        `;

        allKeys.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            serviceSelect.appendChild(option);
        });
        serviceSelect.disabled = false;
    })
    .catch(err => {
        console.error('Error fetching service form data:', err);
        container.innerHTML = '<p>Unable to load service configuration, please try again later.</p>';
    })
    .then(() => {
    const hash = window.location.hash;
    let serviceType = null; // Store the current service type (e.g., 'car-inspection')
    let hashash = false;
    if (hash.includes('?')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        serviceType = params.get('service');
        if (serviceType) {
            loadServiceOptions(serviceType, datas);
            serviceSelect.value = serviceType;
            hashash = true;
        }
    }
    if (!hashash) { 
        container.innerHTML = '<p>Please select a service type from the dropdown above.</p>';
    }
    serviceSelect.addEventListener('change', (event) => {
        serviceType = event.target.value;
        loadServiceOptions(serviceType, datas);
    });

    // Phone number validation logic (using regular expression)
    const telInput = document.getElementById('phone');
    if (telInput) {
        telInput.addEventListener('input', () => {
            // Simple check for Hong Kong phone number format: starts with +852, followed by 8 digits
            const hkPhoneRegex = /^\+852\s?[4-9]\d{3}( )?\d{4}$/; 
            if (hkPhoneRegex.test(telInput.value.trim())) {
                telInput.setCustomValidity('');
            } else {
                telInput.setCustomValidity('Invalid phone number. Please enter a valid Hong Kong phone number (+852 xxxx xxxx). The first digit of the phone number must be between 4 and 9.');
            }
            telInput.reportValidity();
        });
    }

    });

})();
console.log('appointment page script loaded.');

(function () {
console.log('appointment page script loaded Double Check.');

function doubleCheckAndSave(form) {
        console.log('Form submission triggered');
        const formData = new FormData(form);
        const entries = Array.from(formData.entries());
        let allValid = true;
        
        // Basic validation
        console.log('Starting basic validation');
        entries.forEach(([key, value]) => {
            if (!value.trim()) {
            alert(`Please fill in all required fields: ${key}`);
            allValid = false;
            }
            if (key.toLowerCase().includes('email')) {
            // Simple email format check
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(value.trim())) {
                alert("Invalid email address. Please enter a valid email address.");
                    allValid = false;
                }
            }
        });
        if (!allValid) return false;

        console.log('Basic validation passed');

        // Price calculation and confirmation
        let totalAmount = 0;

        console.log('Calculating price and preparing confirmation message');
        // Find the selected option in the Select field and calculate price
        const serviceSelectElement = form.querySelector('select[data-price="true"]');
        
        if (serviceSelectElement) {
            const selectedOption = serviceSelectElement.options[serviceSelectElement.selectedIndex];
            const finalPrice = selectedOption.getAttribute('data-final-price');
            const price = selectedOption.getAttribute('data-price');
            const discount = selectedOption.getAttribute('data-discount');
            const hasPrice = selectedOption.getAttribute('data-has-price') == 'true';
            console.log(`Selected service price details - Price: ${price}, Discount: ${discount}, Final Price: ${finalPrice}, Has Price: ${hasPrice}`);
            console.log(`hasPrice value type: ${typeof hasPrice}`);
            if (!hasPrice) {
                 alert("The service you selected requires us to contact you for a quote. Please wait for our confirmation call.");
                 totalAmount = price; 
            } else {
                totalAmount = parseFloat(finalPrice);
            }
        }
        else {
            console.log('No price-related select element found.');
        }
        console.log('Preparing confirmation message');
        // Confirmation information
        let confirmationMessage = "Please confirm that your appointment information is correct:\n\n";
        const newEntries = entries.map(([key,value]) => [key.charAt(0).toUpperCase() + key.slice(1), value]);
        newEntries.forEach(([key, value]) => {
             confirmationMessage += `${key}: ${value}\n`;
        });

        if (totalAmount > 0 && typeof totalAmount === 'number') {
            confirmationMessage += `\nEstimated total amount: HKD $${totalAmount.toFixed(2)}`;
        }
        
        const confirmation = confirm(confirmationMessage);
        if (!confirmation) {
            return false;
        }

        // Save to sessionStorage and redirect (kept the original sessionStorage logic)
        alert("Thank you for your appointment! Redirecting to the payment page.");
        sessionStorage.clear();
        newEntries.forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });
        
        // Store the final price for use on the payment page
        sessionStorage.setItem('FinalAmount', typeof totalAmount === 'number' ? totalAmount.toFixed(2) : totalAmount);
        const keys = newEntries.map(([key]) => key);
        keys.push('FinalAmount');
        console.log(keys.toString());
        sessionStorage.setItem('submittedItems', keys.toString());

        window.location.hash = "#payment";
        return false; 
    }
    // Sart script execution
    const appointmentForm = document.getElementById('appointment-form');
    appointmentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission if validation fails
        doubleCheckAndSave(appointmentForm);
    });

})();
