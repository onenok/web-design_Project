// Extracted scripts from appointment.html

document.addEventListener('DOMContentLoaded', () => {
        const hash = window.location.hash;
        let service = null;
        if (hash.includes('?')) {
            const params = new URLSearchParams(hash.split('?')[1]);
            service = params.get('service');
        }

        if (service) {
            fetch('services_form.json')
                .then(res => res.json())
                .then(data => {
                    const config = data[service];
                    if (!config) {
                        document.getElementById('form-fields').innerHTML = '<p>找不到對應的服務設定。</p>';
                        return;
                    }

                    // 設定標題
                    document.getElementById('form-title').textContent = config.title;

                    // 動態生成欄位
                    const container = document.getElementById('form-fields');
                    container.innerHTML = '';
                    config.fields.forEach(field => {
                        let html = '';
                        if (field.type === 'select') {
                            html = `<label class="form-label">${field.label}</label>
                                <select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>
                                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                </select>`;
                        } else if (field.type === 'textarea') {
                            html = `<label class="form-label">${field.label}</label>
                                <textarea class="form-textarea" name="${field.name}"></textarea>`;
                        } else {
                            html = `<label class="form-label">${field.label}</label>
                                <input type="${field.type}" class="form-input" name="${field.name}" ${field.required ? 'required' : ''}>`;
                        }
                        const div = document.createElement('div');
                        div.className = 'form-input-group';
                        div.innerHTML = html;
                        container.appendChild(div);
                    });
                });
        }
    });

