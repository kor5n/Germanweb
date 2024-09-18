let testDivsId = []
let testDiv = []
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const subMenu = document.querySelector(".sub-menu")
let data = 0
let response = 0

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

const addTests = (tests, authors) => {
    document.querySelector("main").innerHTML = `<div class="search-div"><textarea rows="1" cols="40" placeholder="Search for tests"
    class="search-input"></textarea><button class="search-btn">Search</button></div>`

    for (let i = 0; i < tests.length; i++) {
        document.querySelector("main").innerHTML += `<div class="test-profile">
                                                <h3 class="test-name">${tests[i]["title"]}</h3>
                                                <p class="quest-count">${tests[i]["terms"].split(";").length} questions</p>
                                                <p class="author-name">${authors[i]}</p>
                                            </div>`
    }
    for (let j = 0; j < tests.length; j++) {
        document.querySelectorAll(".test-profile")[j].addEventListener("click", () => {
            window.location.assign("/view/" + tests[j]["id"])
        })
    }
    document.querySelector(".search-btn").addEventListener("click", () => {
        if(document.querySelector(".search-input").value !== ""){
            let testsfound = []
            let authorslist = []
            for (let i = 0; i < data.tests.length; i++) {
                if (data.tests[i]["title"].toLowerCase().includes(document.querySelector(".search-input").value.toLowerCase()) || data.tests[i]["description"].toLowerCase().includes(document.querySelector(".search-input").value.toLowerCase())){
                    testsfound.push(data.tests[i])
                }
            }
            for(let j=0;j<testsfound;j++){
                if (testsfound[i]["user_id"] == data.authors[testsfound[i]["user_id"]-1]["id"]){
                    authorslist.push(json_users[element["user_id"]-1]["user_name"])
                }
            }
            addTests(testsfound, authorslist)
        }else{
            getBrowse()
        }
    })
}

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
    response = await fetch("/b/browse")
    data = await response.json()

    if (response.status !== 200 && response.status !== 201) {
        document.querySelector("main").innerHTML += `<h1 style="margin-top:20%; transform:scale(2); margin-left:15%;color:white">Something went wrong :(, try to refresh the page<h1/>`
    } else {
        if (data.loggedIn === true) {
            getImg()
            addTests(data.tests, data.authors)
        }

    }
}

if (true) {
    getBrowse()
}