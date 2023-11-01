
/*---------------------------------------------------------------Sign Up---------------------------------------------------------- */
function savedata() {
    //alert("hi");

    let email, psw;
    email = document.getElementById("email").value;
    psw = document.getElementById("psw").value;
    //localStorage.setItem("Email",email);
    //localStorage.setItem("Password",psw);

    let user_records = new Array();
    user_records = JSON.parse(localStorage.getItem("users")) ? JSON.parse(localStorage.getItem("users")) : [];
    //convert string to object + check if records is in the user array or not if yes return record if no return null

    if (user_records.some((v) => v.email === email)) {
        alert("Duplicate data");
    }
    else {
        user_records.push({
            "email": email,
            "Password": psw
        });

        // Store the updated user_records in local storage
        localStorage.setItem("users", JSON.stringify(user_records)); //convert object to string
    }
}

/*---------------------------------------------------------------Log In---------------------------------------------------------- */
function saveDataLogin() {
    let email, psw;
    email = document.getElementById("email").value;
    psw = document.getElementById("psw").value;

    var user_records = new Array();
    user_records = JSON.parse(localStorage.getItem("users")) ? JSON.parse(localStorage.getItem("users")) : [];

    if (user_records.some((v) => v.email == email)) {
        alert("LogIn succesfully");
    var current_user = user_records.find((v) => v.email == email);
       localStorage.setItem("email", current_user.email);
       var main = document.querySelector(".big-form");
       main.style.visibility = "hidden";

       var other = document.querySelector(".login-header-hidden");
       other.style.display="block";
       other.style.visibility="visibile";

       var h = document.querySelector(".name-hidden");
       h.innerHTML= localStorage.getItem("email");
       h.style.display="block";
       h.style.visibility="visibile";
    }

    else{
        alert("login failed");
    }
}

    function headclick() {
        window.open('index.html', '_self');
    }

    function cancelclick() {
        window.open('index.html', '_self');

    }