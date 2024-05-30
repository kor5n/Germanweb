
let cookies = document.cookie.split(";")
console.log(cookies)
let isCookieSaved = false
let isLoggedIn = false
let session = "" 

let logInBtn = document.querySelector(".log-in")
let signInBtn = document.querySelector(".sign-in")
let profilePic = document.querySelector(".profile-pic")
for (let i = 0; i< cookies.length; i++){
    if(cookies[i].split("=")[0] == "user"){
        //console.log(cookies[i].split("=")[0])
        isCookieSaved = true
        session = cookies[i].split("=")[1]
        isLoggedIn = true
        //console.log(cookies[i].split("=")[1])
        break
    }
}

async function getData(){
    const sess = {
        "session_id":session
    }
    const options = {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sess)
    }
    const response = await fetch("http://127.0.0.1:5000/tests", options)
    const data = await response.json()
    console.log(data.message)
    if(response.status != 200 && response.status != 201){
        alert(data.message)
        document.cookie = `user=${session}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    }
    else{
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        console.log(data.message)
        console.log(typeof(data.message))
        data.message.forEach(element => {
            console.log(element["title"])
            document.querySelector("main").innerHTML += `<div class="test-profile" onclick="location.href='view.html'">
                                                    <h3 class="test-name">${element["title"]}</h3>
                                                    <p class="quest-count">x questions</p>
                                                    <p class="author-name">author name</p>
                                                </div>`
        })
        
        
        
    }
        

    
}
if (isCookieSaved){
    if (isLoggedIn){
        getData()
        
    } else{
        logInBtn.style.display = "inline-block"
        signInBtn.style.display = "inline-block"
        profilePic.style.display = "none"
    }
}else{
    //window.location.assign("signup.html")
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}




