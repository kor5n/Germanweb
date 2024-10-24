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
    const respimg = await fetch("/b/img")
    const img = await respimg.json()

    if (img.img) {
        profilePic.querySelector("img").src = `/static/img/${img.img}`
        profilePic.querySelector("img").alt = img.img
    }
}

async function getData() {
    const response = await fetch("/b/tests")
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.status !== 200 && response.status !== 201) {
        //window.alert(data.message)
    }
    else {
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        getImg()

        document.querySelector(".sub-name").innerHTML = data.username
        data.message.forEach(element => {
            document.querySelector("main").innerHTML += `<div class="test-profile">
                                                    <h3 class="test-name">${element["title"]}</h3>
                                                    <p class="quest-count">${element["terms"].split(";").length} questions</p>
                                                    <p class="author-name">${data.username}</p>
                                                </div>`
            testDivsId.push(element["id"])
        })

        testDiv = document.querySelectorAll(".test-profile")

        for (let i = 0; i < testDiv.length; i++) {
            testDiv[i].addEventListener("click", function () {
                window.location.assign("/view/" + testDivsId[i])
            })
        }


    }



}
if (true) {
    getData()
} else {
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}




