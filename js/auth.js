function auth(type) {
  if (type === "login") {
    event.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userInput = document.getElementById("identifier").value;
    const passwordInput = document.getElementById("password").value;

    if (!(userInput && passwordInput)) {
      alert("Please fill all the fields!");
      return;
    } else if (
      users.find(
        (user) =>
          (user.username == userInput || user.email == userInput) &&
          user.password == passwordInput
      )
    ) {
      logged = users.find((user) => user.username == userInput || user.email == userInput)
      localStorage.setItem("logged", logged.id)
      window.location.href = "/view/home.html"
    } else {
      alert("Incorrect username/email and password!")
    }

  } else if (type === "register") {
    event.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currId = Number(localStorage.getItem("cumulativeId")) || 0;

    const userInput = document.getElementById("username").value;
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;
    const confirmInput = document.getElementById("confirm-password").value;

    if (!(userInput && emailInput && passwordInput && confirmInput)) {
      alert("Please fill all the fields!");
      return;
    } else if (passwordInput != confirmInput) {

      alert("Password does not match!");
      return;
    } else if (
      users.find(
        (user) => user.username == userInput || user.email == emailInput,
      )
    ) {
      alert("Username or email is already registered!");
      return;
    } else {
      const regUser = {
        id: currId + 1,
        username: userInput,
        email: emailInput,
        password: passwordInput,
      };
      users.push(regUser);
      currId += 1;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("cumulativeId", currId);
      window.location.href = "/view/login.html";
    }
  }
}
