let signUpDiv = document.querySelector(".sign-up-div")
let logInDiv = document.querySelector(".log-in-div")
let switchSignUp = document.querySelector('.sign-in')
let switchLogIn = document.querySelector(".log-in")
let eyeIcon = document.querySelector(".eye-icon")
let logInBtn = document.querySelector(".login-btn")
let signUpBtn = document.querySelector(".signup-btn")
let emailSignUp = document.querySelector(".signup-email")
let nameSignUp = document.querySelector(".name-input")
let passwordSignUp = document.querySelector(".signup-password")

switchSignUp.addEventListener("click", function(){
    signUpDiv.style.display = "flex"
    logInDiv.style.display = "none"
    eyeIcon.style.top = "37.7%"
})
switchLogIn.addEventListener("click", function(){
    signUpDiv.style.display = "none"
    logInDiv.style.display = "flex"
    eyeIcon.style.top = "34.25%"
})
eyeIcon.addEventListener("click", function(){
    let passwordInput = document.querySelectorAll(".passwd-input")
    for (let i =0;i<passwordInput.length;i++){
        if(passwordInput[i].style.display != "none"){
            if(passwordInput[i].type == "text"){
                passwordInput[i].type = "password"
            }else{
                passwordInput[i].type = "text"
            }
        }
    }
})
signUpBtn.addEventListener("click", async function(){
    if (emailSignUp.value != "" && nameSignUp.value != "" && passwordSignUp.value != ""){
        const data = {
            "username":nameSignUp.value,
            "email":emailSignUp.value,
            "password":passwordSignUp.value
        }
        const options = {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch("http://127.0.0.1:5000/sign-up", options)
        if (response.status != 201 && response.status != 200){
            const resp = await response.json()
            alert(resp.message)
        }else{
            window.location.assign("main.html")
        }
    }else{
        alert("You must include a valid name, email and password")
    }
})

