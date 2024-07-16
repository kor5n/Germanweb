const cookies = document.cookie.split(";")
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const url_split = window.location.pathname.slice(1).split("/")

for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].split("=")[0].replace(" ", "") == "user") {
        isCookieSaved = true
    }
}
document.querySelector(".flash-btn").addEventListener("click", function(){
    location.href = "/flash/"+url_split[1]
})
document.querySelector(".mult-btn").addEventListener("click", function(){
    location.href = "/multi/"+url_split[1]
})
document.querySelector(".write-btn").addEventListener("click", function(){
    location.href = "/write/"+url_split[1]
})
async function getTest() {
    const response = await fetch("http://127.0.0.1:5000/b/view/" + url_split[1])
    const data = await response.json()
    if (response.status != 200 && response.status != 201) {
        window.alert(data.message)
        window.location.assign("/")
    } else {
        document.querySelector(".test-name").innerHTML = data.message[0]
        document.querySelector(".test-desc").innerHTML = data.message[1]
        for (let i = 0; i < data.message[2].split(";").length; i++) {
            document.querySelector("main").innerHTML += `<div class="show-def">
            <span class="term-text">${data.message[2].split(";")[i]}</span><span style="margin-left: 3%;">|</span><span class="def-text">${data.message[3].split(";")[i]}</span>
            </div>`
        }
    }
    document.querySelector("main").innerHTML += `<button class="edit-btn">Edit</button><button class="delete-btn">Remove</button>`
    document.querySelector(".edit-btn").addEventListener("click", function () {
        document.cookie = `mode=edit; max-age=${60 * 60}; path=/`
        window.location.assign("/create")
    })
    document.querySelector(".delete-btn").addEventListener("click", async function () {
        if (this.innerHTML != "Sure?") {
            this.innerHTML = "Sure?"
        } else {
            const options = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            }
            const response = await fetch("http://127.0.0.1:5000/b/delete/" + viewing_test, options)
            const data = await response.json()
            alert(data.message)

            if (response.status == 200 || response.status == 201) {
                window.location.assign("/")
            }
        }

    })
}

if (isCookieSaved) {
    logInBtn.style.display = "none"
    signInBtn.style.display = "none"
    profilePic.style.display = "inline-block"
} else {
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}

if (url_split[1] !== null) {
    getTest()
} else {
    window.alert("No test was loaded")
    window.location.assign("/")
}

