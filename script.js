// Show Login Form
function showLogin() {
  document.getElementById("loginArea").style.display = "flex";
  document.getElementById("signupArea").style.display = "none";
  document.getElementById("choiceArea").style.display = "none";
}

// Show Signup Form
function showSignup() {
  document.getElementById("signupArea").style.display = "flex";
  document.getElementById("loginArea").style.display = "none";
  document.getElementById("choiceArea").style.display = "none";
}

// Password strength checker
function isStrongPassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Signup Function
function signup() {
  let email = document.getElementById("signupEmail").value.trim();
  let password = document.getElementById("signupPassword").value.trim();
  let error = document.getElementById("signupError");
  error.textContent = "";

  if (email === "" || password === "") {
    error.textContent = "Please fill all fields!";
    return;
  }

  if (!isStrongPassword(password)) {
    error.textContent = "Password must be 8+ chars, include uppercase, lowercase, number, and special char.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[email]) {
    error.textContent = "Email already exists! Please login.";
    return;
  }

  // Save new user
  users[email] = password;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully! You can now login.");
  showLogin();
}

// Login Function
function login() {
  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();
  let error = document.getElementById("loginError");
  error.textContent = "";

  if (email === "" || password === "") {
    error.textContent = "Please fill all fields!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[email] && users[email] === password) {
    alert("Login successful ");
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("chatSection").style.display = "block";
    document.getElementById("chatbox").innerHTML = 
      `<div class="bot-message"><b>Bot:</b> Welcome, ${email}! </div>`;
  } else {
    error.textContent = "Invalid email or password ";
  }
}

// Logout function
function logout() {
  document.getElementById("chatSection").style.display = "none";
  document.getElementById("choiceArea").style.display = "flex";
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("loginError").textContent = "";
  document.getElementById("signupError").textContent = "";
}

// Send message function
function sendMessage() {
  let input = document.getElementById("userInput").value;
  let chatbox = document.getElementById("chatbox");

  if (input.trim() === "") return;

  // Show user message
  let userDiv = document.createElement("div");
  userDiv.className = "user-message";
  userDiv.innerHTML = "<b>You:</b> " + input;
  chatbox.appendChild(userDiv);

  // Bot reply
  let botReply = "";
  if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
    botReply = "Hello!";
  } else if (input.toLowerCase().includes("bye")) {
    botReply = "Goodbye!";
  } else {
    botReply = "Sorry, I don't understand.";
  }

  let botDiv = document.createElement("div");
  botDiv.className = "bot-message";
  botDiv.innerHTML = "<b>Bot:</b> " + botReply;
  chatbox.appendChild(botDiv);

  document.getElementById("userInput").value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Press Enter to send message
document.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && document.getElementById("userInput") === document.activeElement) {
    sendMessage();
  }
});

// Trigger login or signup on Enter key
document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    // If chat input is focused → send message
    if (document.getElementById("userInput") === document.activeElement) {
      sendMessage();
    }
    // If login form is visible → trigger login
    else if (document.getElementById("loginArea").style.display === "flex") {
      login();
    }
    // If signup form is visible → trigger signup
    else if (document.getElementById("signupArea").style.display === "flex") {
      signup();
    }
  }
});

