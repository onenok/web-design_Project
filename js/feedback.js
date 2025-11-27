// Extracted scripts from feedback.html

function doubleCheckAndSave(form) {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const service = form.service.value;
        const comments = form.comments.value.trim();

        if (!name || !email || !service || !comments) {
            alert("請填寫所有必填欄位。");
            return false;
        }

        if (!validator.isEmail(email)) {
            alert("電子郵件地址無效\n請輸入有效的電子郵件地址。");
            return false;
        }

        const confirmation = confirm(`請確認您的反饋內容：\n\n姓名: ${name}\n電子郵件: ${email}\n服務類別: ${service}\n意見反饋: ${comments}\n\n是否提交？`);
        if (confirmation) {
            alert("感謝您的反饋！");
            sessionStorage.setItem('submittedItems', ['Name', 'Email', 'Service', 'Comments']);
            sessionStorage.setItem('Name', name);
            sessionStorage.setItem('Email', email);
            sessionStorage.setItem('Service', service);
            sessionStorage.setItem('Comments', comments);
            // Here you can add code to actually save the feedback, e.g., send it to a server
            return true; // Proceed with form submission
        } else {
            return false; // Cancel form submission
        }
    }

