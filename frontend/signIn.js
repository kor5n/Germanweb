let signUpDiv = document.querySelector(".sign-up-div")
let logInDiv = document.querySelector(".log-in-div")
let switchSignUp = document.querySelector('.sign-in')
let switchLogIn = document.querySelector(".log-in")
let eyeIcon = document.querySelector(".eye-icon")

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
    console.log("clicked")
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

