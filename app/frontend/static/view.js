const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const url_split = window.location.pathname.slice(1).split("/")
const subMenu = document.querySelector(".sub-menu")

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

async function getImg() {
    const respimg = await fetch("/b/img")
    const img = await respimg.json()

    if (img.img) {
        profilePic.querySelector("img").src = `/static/img/${img.img}`
        profilePic.querySelector("img").alt = img.img
    }
}

async function getTest() {
    const response = await fetch("/b/view/" + url_split[1])
    const data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
        window.alert(data.message)
        window.location.assign("/")
    } else {

        if (data.loggedIn === true) {
            logInBtn.style.display = "none"
            signInBtn.style.display = "none"
            profilePic.style.display = "inline-block"
            getImg()
        } else if (data.loggedIn === false) {
            logInBtn.style.display = "inline-block"
            signInBtn.style.display = "inline-block"
            profilePic.style.display = "none"
        }

        document.querySelector("title").innerHTML = data.message[0]

        document.querySelector(".view-name").innerHTML = data.message[0] + " <span class='by-author'>by "+data.ownerName+"</span>"
        document.querySelector(".test-desc").innerHTML = data.message[1]
        for (let i = 0; i < data.message[2].split(";").length; i++) {
            document.querySelector("main").innerHTML += `<div class="show-def">
            <span class="term-text">${data.message[2].split(";")[i]}</span><span style="margin-left: 3%;">|</span><span class="def-text">${data.message[3].split(";")[i]}</span>
            </div>`
        }
        if (data.canModify === true) {
            document.querySelector("main").innerHTML += `<button class="edit-btn">Edit</button><button class="delete-btn">Remove</button>`
            document.querySelector(".edit-btn").addEventListener("click", function () {
                window.location.assign("/edit/" + url_split[1])
            })
            document.querySelector(".delete-btn").addEventListener("click", async function () {
                if (this.innerHTML !== "Sure?") {
                    this.innerHTML = "Sure?"
                } else {
                    const options = {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    }
                    const response = await fetch("/b/delete/" + url_split[1], options)
                    const data = await response.json()
                    window.alert(data.message)

                    if (response.status === 200 || response.status === 201) {
                        window.location.assign("/")
                    }
                }

            })
        }
        document.querySelector(".flash-btn").addEventListener("click", function () {
            window.location.assign("/flash/" + url_split[1])
        })
        document.querySelector(".mult-btn").addEventListener("click", function () {
            window.location.assign("/multi/" + url_split[1])
        })
        document.querySelector(".write-btn").addEventListener("click", function () {
            window.location.assign("/write/" + url_split[1])
        })
    }
}

if (url_split[1] !== null) {
    getTest()
} else {
    window.alert("No test was loaded")
    window.location.assign("/")
}