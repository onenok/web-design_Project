// Extracted scripts from feedback.html

console.log('feedback page script loaded.');

(function () {
console.log('feedback page script loaded Double Check.');

console.log('Feedback page script loaded');
    function doubleCheckAndSave(form) {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const service = form.service.value;
        const comments = form.comments.value.trim();

        if (!name || !email || !service || !comments) {
            alert("Please fill in all required fields.");
            return false;
        }

        if (!validator.isEmail(email)) {
            alert("Invalid email address\nPlease enter a valid email address.");
            return false;
        }

        const confirmation = confirm(`Please confirm your feedback:\n\nName: ${name}\nEmail: ${email}\nService Category: ${service}\nFeedback: ${comments}\n\nSubmit?`);
        if (!confirmation) {
            return false; // Cancel form submission
        }
        alert("Thank you for your feedback!");
        
        sessionStorage.clear();
        sessionStorage.setItem('submittedItems', ['Name', 'Email', 'Service', 'Comments']);
        sessionStorage.setItem('Name', name);
        sessionStorage.setItem('Email', email);
        sessionStorage.setItem('Service', service);
        sessionStorage.setItem('Comments', comments);
        // Here you can add code to actually save the feedback, e.g., send it to a server
        window.location.hash = "#showFormValue";
        return false; // Proceed with form submission
    }
    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();
        doubleCheckAndSave(feedbackForm)
    });

})();
