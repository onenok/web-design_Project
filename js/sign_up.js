// Extracted scripts from sign_up.html

console.log('sign-up page script loaded.');

(function () {
console.log('sign-up page script loaded Double Check.');

console.log('Sign-up page script loaded');
    const passwordInfoElement = document.querySelector('.password-requirements');
    const passwordRules = {
        length: {
            regex: /.{8,}/,
            message: 'At least 8 characters long',
            status: false
        },
        uppercase: {
            regex: /[A-Z]/,
            message: 'At least one uppercase letter(A-Z)',
            status: false
        },
        lowercase: {
            regex: /[a-z]/,
            message: 'At least one lowercase letter(a-z)',
            status: false
        },
        number: {
            regex: /[0-9]/,
            message: 'At least one number(0-9)',
            status: false
        },
        specialChar: {
            regex: /[!@#$%^&*(),.?":{}|<>]/,
            message: 'At least one special character(e.g., !@#$%^&*)',
            status: false
        }
    };
    passwordInfoElement.innerHTML = 'Password must contain：' + Object.values(passwordRules).map(rule => `<span style="color: ${rule.status ? 'green' : 'red'};">${rule.message}</span>`).join('，') + '。';
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', () => {
        const passwordValue = passwordInput.value;
        Object.values(passwordRules).forEach(rule => {
            rule.status = rule.regex.test(passwordValue);
        });
        passwordInfoElement.innerHTML = 'Password must contain：' + Object.values(passwordRules).map(rule => `<span style="color: ${rule.status ? 'green' : 'red'};">${rule.message}</span>`).join('，') + '。';
    });
    function doubleCheckAndSave(form) {
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        if (!username || !email || !password) {
            alert("Please fill in all required fields.");
            return false; // prevent form submission
        }

        if (password !== form["confirm-password"].value) {
            alert("Passwords do not match.");
            return false; // prevent form submission
        }

        if (Object.values(passwordRules).some(rule => !rule.status)) {
            alert("Password does not meet the required criteria.");
            return false; // prevent form submission
        }



        if (!validator.isEmail(email)) {
            alert("Please enter a valid email address.");
            return false; // prevent form submission
        }
        const confirmation = confirm(`Please confirm your Submit: `);
        if (!confirmation) {
            return false; // Cancel form submission
        }
        alert("Registration successful!");
        sessionStorage.clear();
        sessionStorage.setItem("submittedItems", ["Username", "Email", "Password"].toString());
        sessionStorage.setItem("Username", username);
        sessionStorage.setItem("Email", email);
        sessionStorage.setItem("Password", password);
        window.location.hash = "#showFormValue";
        return false; // allow form submission
    };
    const signUpForm = document.getElementById('sign-up-form');
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission if validation fails
        doubleCheckAndSave(signUpForm)
    });

    function initSignUpForm(password, confirmPassword) {
        [password, confirmPassword].forEach(input => {
            input.addEventListener('input', () => {
                if (password.value === confirmPassword.value) {
                    confirmPassword.setCustomValidity('');
                    confirmPassword.classList.remove('invalid');
                } else {
                    confirmPassword.setCustomValidity('Passwords do not match.');
                    confirmPassword.classList.add('invalid');
                }
            });
        });

        // Add show/hide password functionality
        const togglePasswordBtn = password.parentElement.querySelector('#togglePassword');
        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', () => {
                const isPassword = password.type === 'password';
                password.type = isPassword ? 'text' : 'password';
                togglePasswordBtn.textContent = isPassword ? '👁️' : '🙈';
            });
        }
    }
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    initSignUpForm(password, confirmPassword);

})();
