
//let cookies = document.cookie.split(";")
//let isCookieSaved = false
//let isLoggedIn = false

let logInBtn = document.querySelector(".log-in")
let signInBtn = document.querySelector(".sign-in")
let profilePic = document.querySelector(".profile-pic")
/*for (let i = 0; i< cookies.length; i++){
    if(cookies[i].split("=")[0] == "isLoggedIn"){
        console.log(cookies[i].split("=")[0])
        isCookieSaved = true
        isLoggedIn = cookies[i].split("=")[1]
        console.log(cookies[i].split("=")[1])
        break
    }
}*/

async function getData(){
    const response = await fetch("http://127.0.0.1:5000/tests")
    const data = await response.json()
    
    if(data.message != 200 && data.message != 201){
        alert(data.message)
        /*if(data.message == "you are not logged in"){
            window.location.assign("singup.html")
        }*/
    }
    else{
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        console.log(data.tests)
        data.tests.forEach(element => {
            console.log(element["title"])
            document.querySelector("main").innerHTML += `<div class="test-profile" onclick="location.href='view.html'">
                                                    <h3 class="test-name">${element["title"]}</h3>
                                                    <p class="quest-count">x questions</p>
                                                    <p class="author-name">author name</p>
                                                </div>`
        })
    }
        

    
}
getData()
/*if (isCookieSaved){
    if (isLoggedIn){
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        getData()
    } else{
        logInBtn.style.display = "inline-block"
        signInBtn.style.display = "inline-block"
        profilePic.style.display = "none"
    }
}else{
    document.cookie = `isLoggedIn=${isLoggedIn};max-age=9999999999999`
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}*/




