let testDivsId = []
let testDiv = []
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const subMenu = document.querySelector(".sub-menu")

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

async function getImg() {
    logInBtn.style.display = "none"
    signInBtn.style.display = "none"
    profilePic.style.display = "inline-block"
    const respimg = await fetch("/b/img")
    const img = await respimg.json()

    if (img.img) {
        profilePic.querySelector("img").src = `/static/img/${img.img}`
        profilePic.querySelector("img").alt = img.img
    }
}

async function getBrowse() {
    const response = await fetch("/b/browse")
    const data = await response.json()

    if (response.status !== 200 && response.status !== 201) {
        document.querySelector("main").innerHTML += `<h1 style="margin-top:20%; transform:scale(2); margin-left:15%;color:white">Something went wrong :(, try to refresh the page<h1/>`
    } else {
        if (data.loggedIn === true) {
            getImg()
        }
        for(let i=0; i<data.tests.length;i++){
            document.querySelector("main").innerHTML += `<div class="test-profile">
                                                    <h3 class="test-name">${data.tests[i]["title"]}</h3>
                                                    <p class="quest-count">${data.tests[i]["terms"].split(";").length} questions</p>
                                                    <p class="author-name">${data.authors[i]}</p>
                                                </div>`
        }
        for(let j=0; j<data.tests.length;j++){
            document.querySelectorAll(".test-profile")[j].addEventListener("click", ()=>{
                window.location.assign("/view/" + data.tests[j]["id"])
            })
        }
    }
}


if (true) {
    getBrowse()
}