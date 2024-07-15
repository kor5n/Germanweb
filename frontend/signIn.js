let signUpDiv = document.querySelector(".sign-up-div")
let logInDiv = document.querySelector(".log-in-div")
let switchSignUp = document.querySelector('.sign-in')
let switchLogIn = document.querySelector(".log-in")
let eyeIcon = document.querySelectorAll(".eye-icon")
let logInBtn = document.querySelector(".login-btn")
let signUpBtn = document.querySelector(".signup-btn")
let emailSignUp = document.querySelector(".signup-email")
let nameSignUp = document.querySelector(".name-input")
let passwordSignUp = document.querySelector(".signup-password")
let logInSwitch = document.querySelector(".log-in")
let signUpSwitch = document.querySelector(".sign-in")
let profilePic = document.querySelector(".profile-pic")
let emailLogIn = document.querySelector(".login-email")
let passwordLogIn = document.querySelector(".login-password")

switchSignUp.addEventListener("click", function () {
    signUpDiv.style.display = "flex"
    passwordLogIn.innerHTML -= eyeIcon
    logInDiv.style.display = "none"
    passwordSignUp.innerHTML += eyeIcon
})
switchLogIn.addEventListener("click", function () {
    passwordSignUp.innerHTML -= eyeIcon
    signUpDiv.style.display = "none"
    logInDiv.style.display = "flex"
    passwordLogIn.innerHTML += eyeIcon
})
for(let i =0; i<eyeIcon.length; i++){
    eyeIcon[i].addEventListener("click", function () {
        let passwordInput = document.querySelectorAll(".passwd-input")
        console.log("ckickdd")
        for (let i = 0; i < passwordInput.length; i++) {
            if (passwordInput[i].style.display != "none") {
                if (passwordInput[i].type == "text") {
                    passwordInput[i].type = "password"
                } else {
                    passwordInput[i].type = "text"
                }
            }
        }
    })
}

signUpBtn.addEventListener("click", async function () {
    if (emailSignUp.value != "" && nameSignUp.value != "" && passwordSignUp.value != "") {
        const data = {
            "username": nameSignUp.value,
            "email": emailSignUp.value,
            "password": passwordSignUp.value
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch("http://127.0.0.1:5000/sign-up", options)
        const resp = await response.json()
        if (response.status != 201 && response.status != 200) {

            alert(resp.message)
        } else {
            logInSwitch.style.display = "none"
            signUpSwitch.style.display = "none"
            profilePic.style.display = "inline"
            signUpDiv.style.display = "none"
            eyeIcon.style.display = "none"

            console.log(resp.cookie)
            document.cookie = `user=${resp.cookie}; max-age=${20 * 60 * 24 * 60}; path=/`
            window.location.assign("main.html")
        }
    } else {
        alert("Yosu must include a valid name, email and password")
    }
})
logInBtn.addEventListener("click", async function () {
    console.log("clicked")
    if (emailLogIn.value != "" && passwordLogIn.value != "") {
        const data = {
            "email": emailLogIn.value,
            "password": passwordLogIn.value
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch("http://127.0.0.1:5000/sign-in", options)
        const resp = await response.json()
        if (response.status != 201 && response.status != 200) {

            alert(resp.message)
        } else {
            logInSwitch.style.display = "none"
            signUpSwitch.style.display = "none"
            profilePic.style.display = "inline"
            logInDiv.style.display = "none"
            eyeIcon.style.display = "none"

            console.log(resp.cookie)
            document.cookie = `user=${resp.cookie}; max-age=${20 * 60 * 24 * 60}; path=/`
            window.location.assign("main.html")
        }
    } else {
        alert("You must include a valid email and password")
    }
})

