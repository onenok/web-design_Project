// Extracted scripts from sign_in.html

(function () {
function handlefunc(form) {
        const username = form.username.value;
        const password = form.password.value;

        // For demonstration, we use hardcoded credentials.
        const validCustomUsername = "user123";
        const validCustomPassword = "pass123";

        const validAdminUsername = "admin";
        const validAdminPassword = "adminpass";
        if (username === validAdminUsername && password === validAdminPassword) {
            alert("Admin sign-in successful!");
            // Redirect to admin dashboard
            window.location.hash = "#adminDashboard";
        } 
        else if (username === validCustomUsername && password === validCustomPassword) {
            alert("Sign-in successful!");
            // Redirect to main page or dashboard
            window.location.hash = "#home";
        } else {
            alert("Invalid username or password. Please try again.");
        }
    }
    const form = document.getElementById('sign-in-form');
    form.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission
        handlefunc(form);
    };

})();
