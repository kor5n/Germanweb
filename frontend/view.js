let cookies = document.cookie.split(";")
let isViewing = false
let viewing_test = ""
let logInBtn = document.querySelector(".log-in")
let signInBtn = document.querySelector(".sign-in")
let profilePic = document.querySelector(".profile-pic")
let testLabel = document.querySelector(".test-name")
for (let i = 0; i< cookies.length; i++){
    if(cookies[i].split("=")[0].replace(" ", "") == "user"){
        isCookieSaved = true
    }
    if(cookies[i].split("=")[0].replace(" ", "") == "view_test"){
        isViewing = true
        viewing_test = cookies[i].split("=")[1]
        break
    }
    console.log(cookies[i].split("=")[0].replace(" ",""))
    console.log(cookies[i].split("=")[0] == "view_test")
    console.log(cookies)
}

async function getTest(){
    const response = await fetch("http://127.0.0.1:5000/view/"+ viewing_test)
    const data = await response.json()
    console.log(data.message)
    if(response.status != 200 && response.status != 201){
        window.alert(data.message)
        document.cookie = `viewing_test=${viewing_test}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        window.location.assign("main.html")
    }else{
        testLabel.innerHTML = data.message[0]
        for(let i=0;i<data.message[2].split(";").length; i++){
            document.querySelector("main").innerHTML += `<div class="show-def">
            <span class="term-text">${data.message[2].split(";")[i]}</span><span style="margin-left: 3%;">|</span><span class="def-text">${data.message[3].split(";")[i]}</span>
            </div>`
        }
    }
    document.querySelector("main").innerHTML += `<button class="edit-btn">Edit</button><button class="delete-btn">Remove</button>`
}

if(isCookieSaved){
    logInBtn.style.display = "none"
    signInBtn.style.display = "none"
    profilePic.style.display = "inline-block"
}else{
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}

if (isViewing){
    getTest()
}else{
    window.alert("No test was loaded")
    
    window.location.assign("main.html")
}

