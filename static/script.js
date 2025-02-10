document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginButton = document.getElementById("login-toggle");
    const signupButton = document.getElementById("signup-toggle");

    loginButton.addEventListener("click", () => {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
        loginButton.classList.add("active");
        signupButton.classList.remove("active");
    });

    signupButton.addEventListener("click", () => {
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
        signupButton.classList.add("active");
        loginButton.classList.remove("active");
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const loginForm = document.getElementById("login-form");

//     loginForm.addEventListener("submit", async function (event) {
//         event.preventDefault(); // Prevent default form submission

//         const formData = new FormData(this);
//         const response = await fetch("/login", {
//             method: "POST",
//             body: formData
//         });

//         if (response.ok) {
//             showMessage("Login successful! Please connect your wallet.", "success");
//             promptWalletConnection();
//         } else {
//             showMessage("Invalid username or password", "error");
//         }
//     });
// });

// function showMessage(message, type) {
//     const messageBox = document.createElement("div");
//     messageBox.textContent = message;
//     messageBox.classList.add("message-box", type);
//     document.body.appendChild(messageBox);

//     setTimeout(() => messageBox.remove(), 3000);
// }

// async function promptWalletConnection() {
//     if (typeof window.ethereum !== 'undefined') {
//         try {
//             await window.ethereum.request({ method: 'eth_requestAccounts' });
//             showMessage("Wallet connected! Redirecting...", "success");
//             setTimeout(() => {
//                 window.location.href = "/account"; // Redirect after wallet connection
//             }, 2000);
//         } catch (error) {
//             showMessage("Wallet connection failed!", "error");
//         }
//     } else {
//         alert("Please install MetaMask to connect your wallet!");
//     }
// }


// Enhanced form validation and submission

// document.addEventListener("DOMContentLoaded", () => {
//     const loginForm = document.getElementById("login-form");

//     if (loginForm) {
//         loginForm.addEventListener("submit", async (event) => {
//             event.preventDefault();

//             const formData = new FormData(loginForm);
//             const response = await fetch("/login", {
//                 method: "POST",
//                 body: formData,
//             });

//             console.log("hello")
//             if (response.ok) {
//                 alert("Login successful! Please connect your wallet before proceeding.");
//                 // Show wallet connection prompt
//                 connectWallet();
//             } else {
//                 alert("Invalid login credentials. Please try again.");
//             }
//         });
//     }
// });

// async function connectWallet() {
//     if (typeof window.ethereum !== "undefined") {
//         try {
//             await window.ethereum.request({ method: "eth_requestAccounts" });
//             alert("Wallet connected successfully!");
//             window.location.href = "/account"; // Redirect after successful connection
//         } catch (error) {
//             alert("Wallet connection failed. Please try again.");
//         }
//     } else {
//         alert("Please install MetaMask to connect your wallet!");
//     }
// }
