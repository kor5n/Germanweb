let cookies = document.cookie.split(";")
let isCookieSaved = false
let session = ""
let testDivsId = []
let testDiv = []
let logInBtn = document.querySelector(".log-in")
let signInBtn = document.querySelector(".sign-in")
let profilePic = document.querySelector(".profile-pic")
for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].split("=")[0].replace(" ", "") == "user") {
        isCookieSaved = true
        session = cookies[i].split("=")[1]
        break
    }
}

async function getData() {
    const sess = {
        "session_id": session
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sess)
    }
    const response = await fetch("http://127.0.0.1:5000/tests", options)
    const data = await response.json()
    if (response.status != 200 && response.status != 201) {
        alert(data.message)
        document.cookie = `user=${session}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    }
    else {
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        data.message.forEach(element => {
            document.querySelector("main").innerHTML += `<div class="test-profile" onclick="document.cookie = 'view_test=${element["id"]}; max-age=${60 * 60}; path=/'; window.location.assign('view.html')">
                                                    <h3 class="test-name">${element["title"]}</h3>
                                                    <p class="quest-count">${element["terms"].split(";").length} questions</p>
                                                    <p class="author-name">${data.username}</p>
                                                </div>`
            testDivsId.push(element["id"])
        })

        testDiv = document.querySelectorAll(".test-profile")

    }



}
if (isCookieSaved) {
    getData()
} else {
    //window.location.assign("signup.html")
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}




