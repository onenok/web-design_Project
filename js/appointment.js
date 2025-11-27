// Extracted scripts from appointment.html

const hash = window.location.hash;
    let service = null;
    if (hash.includes('?')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        service = params.get('service');
    }

    if (service) {
        fetch('./json/services_form.json')
            .then(res => res.json())
            .then(data => {
                const config = data[service];
                if (!config) {
                    document.getElementById('form-fields').innerHTML = '<p>找不到對應的服務設定。</p>';
                    return;
                }

                // Set title
                document.getElementById('form-title').textContent = config.title;

                // Dynamically generate fields
                const container = document.getElementById('form-fields');
                container.innerHTML = '';
                config.fields.forEach(field => {
                    let html = '';
                    if (field.type === 'select') {
                        html = `<label class="form-label" for="${field.name}">${field.label}</label>
                                <select class="form-select" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                </select>`;
                    } else if (field.type === 'textarea') {
                        html = `<label class="form-label" for="${field.name}">${field.label}</label>
                                <textarea class="form-textarea" id="${field.name}" name="${field.name}"></textarea>`;
                    } else {
                        html = `<label class="form-label" for="${field.name}">${field.label}</label>
                                <input type="${field.type}" class="form-input" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
                    }
                    const div = document.createElement('div');
                    div.className = 'form-input-group';
                    div.innerHTML = html;
                    container.appendChild(div);
                });
            });
    }
    function doubleCheckAndSave(form) {
        const formData = new FormData(form);
        const entries = Array.from(formData.entries());
        let allValid = true;
        entries //check if any required field is empty
            .forEach(([key, value]) => {
                if (!value.trim()) {
                    alert(`Please fill in all required fields: ${key}`);
                    allValid = false;
                }
                if (key.toLowerCase().includes('email')) {
                    if (!validator.isEmail(value.trim())) {
                        alert("Invalid email address\nPlease enter a valid email address.");
                        allValid = false;
                    }
                }
            });
        if (!allValid) return false;
        const confirmation = confirm("Please confirm your appointment information is correct. Submit?");
        if (!confirmation) {
            return false;
        }
        alert("Thank you for your appointment! Proceeding to payment page.");
        const newEntries = entries.map(([key,value]) => [key.charAt(0).toUpperCase() + key.slice(1), value]);
        sessionStorage.setItem('submittedItems', newEntries.map(([key]) => key).toString());
        newEntries.forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });
        
        return true; 
    }

