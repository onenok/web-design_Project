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
            const p = document.createElement('p');
            p.textContent = 'No matching service configuration found.';
            container.innerHTML = '';
            container.appendChild(p);
            return;
        }

        // Set title
        document.getElementById('form-title').textContent = config.title;

        // 清空 container
        container.innerHTML = '';

        config.form.fields.forEach(field => {
            const div = document.createElement('div');
            div.className = 'form-input-group';

            // label
            const label = document.createElement('label');
            label.className = 'form-label';
            label.setAttribute('for', field.name);
            label.textContent = field.label;
            div.appendChild(label);

            if (field.type === 'select') {
                const select = document.createElement('select');
                select.className = 'form-select';
                select.id = field.name;
                select.name = field.name;
                if (field.required) select.required = true;
                select.dataset.price = field['data-price'] ? 'true' : 'false';

                // default option
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.disabled = true;
                defaultOpt.selected = true;
                defaultOpt.textContent = 'Select a service';
                select.appendChild(defaultOpt);

                config[field.options].forEach(opt => {
                    opt.price = opt.price || 0;
                    opt.discount_percent = Math.max(0, Math.min(100, opt.discount_percent || 100));
                    const savePercent = 100 - opt.discount_percent;
                    let final_price = opt.price;
                    if (opt.has_price) final_price = (opt.price * (opt.discount_percent / 100)).toFixed(2);

                    const price_label = !opt.has_price
                        ? opt.price
                        : (opt.discount_percent < 100
                            ? `HKD $${final_price} (Original price HKD $${opt.price}, save ${savePercent}%)`
                            : `HKD $${opt.price}`);

                    const option = document.createElement('option');
                    option.value = opt.name;
                    option.dataset.priceLabel = price_label;
                    option.dataset.hasPrice = opt.has_price;
                    option.dataset.finalPrice = final_price;
                    option.dataset.price = opt.price;
                    option.dataset.discount = opt.discount_percent;
                    option.dataset.days = opt.ExpectedDaysOfService || 'N/A'; // 假設 datas 裡有 days 屬性
                    option.textContent = `${opt.name} -- ${price_label}`;
                    select.appendChild(option);
                });

                div.appendChild(select);

                // info div
                const infoDiv = document.createElement('div');

                const nameSpanLabel = document.createElement('span');
                nameSpanLabel.textContent = 'Service Name: ';
                infoDiv.appendChild(nameSpanLabel);

                const nameSpanValue = document.createElement('span');
                nameSpanValue.id = 'serviceNameValue';
                nameSpanValue.textContent = 'NAN';
                infoDiv.appendChild(nameSpanValue);

                infoDiv.appendChild(document.createElement('br'));

                const priceSpanLabel = document.createElement('span');
                priceSpanLabel.textContent = 'Price: ';
                infoDiv.appendChild(priceSpanLabel);

                const priceSpanValue = document.createElement('span');
                priceSpanValue.id = 'servicePriceValue';
                priceSpanValue.textContent = 'NAN';
                infoDiv.appendChild(priceSpanValue);

                infoDiv.appendChild(document.createElement('br'));

                const daysSpanLabel = document.createElement('span');
                daysSpanLabel.textContent = 'Estimated days of service: ';
                infoDiv.appendChild(daysSpanLabel);

                const daysSpanValue = document.createElement('span');
                daysSpanValue.id = 'serviceDaysValue';
                daysSpanValue.textContent = 'NAN';
                infoDiv.appendChild(daysSpanValue);

                div.appendChild(infoDiv);

                // 🔑 加事件監聽器
                select.addEventListener('change', function () {
                    const selectedOpt = this.options[this.selectedIndex];
                    document.getElementById('serviceNameValue').textContent = selectedOpt.value || 'NAN';
                    document.getElementById('servicePriceValue').textContent = selectedOpt.dataset.priceLabel || 'NAN';
                    document.getElementById('serviceDaysValue').textContent = selectedOpt.dataset.days || 'NAN';
                });

            } else if (field.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.className = 'form-textarea';
                textarea.id = field.name;
                textarea.name = field.name;
                if (field.cols) textarea.cols = field.cols;
                if (field.rows) textarea.rows = field.rows;
                if (field.placeholder) textarea.placeholder = field.placeholder;
                div.appendChild(textarea);

            } else {
                const input = document.createElement('input');
                input.type = field.type;
                input.className = 'form-input';
                input.id = field.name;
                input.name = field.name;
                if (field.placeholder) input.placeholder = field.placeholder;
                if (field.required) input.required = true;
                if (field.min) input.min = field.min;
                div.appendChild(input);
            }

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
        let totalDays = 0;

        console.log('Calculating price and preparing confirmation message');
        // Find the selected option in the Select field and calculate price
        const serviceSelectElement = form.querySelector('select[data-price="true"]');
        
        if (serviceSelectElement) {
            const selectedOption = serviceSelectElement.options[serviceSelectElement.selectedIndex];
            const finalPrice = selectedOption.getAttribute('data-final-price');
            const price = selectedOption.getAttribute('data-price');
            const discount = selectedOption.getAttribute('data-discount');
            const hasPrice = selectedOption.getAttribute('data-has-price') == 'true';
            const EDoS = selectedOption.getAttribute('data-days');
            console.log(`Selected service price details - Price: ${price}, Discount: ${discount}, Final Price: ${finalPrice}, Has Price: ${hasPrice}, Expected Days of Service: ${EDoS}`);
            console.log(`hasPrice value type: ${typeof hasPrice}`);
            if (!hasPrice) {
                 alert("The service you selected requires us to contact you for a quote. Please wait for our confirmation call.");
                 totalAmount = price; 
            } else {
                totalAmount = parseFloat(finalPrice);
            }
            totalDays = parseInt(EDoS);
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
        if (totalDays > 0 && typeof totalDays === 'number') {
            confirmationMessage += `\nEstimated days of service: ${totalDays} day(s)`;
        }
        else {
            console.log(totalDays)
            console.log(typeof totalDays)
            console.log(typeof totalDays === 'number')
        }
        if (totalAmount > 0 && typeof totalAmount === 'number') {
            confirmationMessage += `\nEstimated total amount: HKD $${totalAmount.toFixed(2)}`;
        }
        else {
            console.log(totalAmount)
            console.log(typeof totalAmount)
            console.log(typeof totalAmount === 'number')
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
        sessionStorage.setItem('ExpectedDaysOfService', totalDays);
        const keys = newEntries.map(([key]) => key);
        keys.push('FinalAmount', 'ExpectedDaysOfService');
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
