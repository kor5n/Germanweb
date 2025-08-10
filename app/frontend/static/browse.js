const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const subMenu = document.querySelector(".sub-menu")
let data = 0
let response = 0
const curPage = window.location.split("/")[1]

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

const addTests = async (testlist, authors) => {
    document.querySelector("main").innerHTML = `<div class="search-div"><textarea rows="1" cols="40" placeholder="Search for tests"
    class="search-input"></textarea><button class="search-btn">Search</button></div>`

    let testsResp = await fetch("/b/tests")
    let clientTests = await testsResp.json()
    let btnColor = "grey"
    let favourites = clientTests.favourites.split(",")

    const tests = testlist[curPage]

    for (let i = 0; i < tests.length; i++) {
        if (favourites.length > 0){
            if (favourites.includes(tests[i]["id"].toString())){
                btnColor = "red"
            }
        }
        document.querySelector("main").innerHTML += `<div class="test-profile">
                                                <h3 class="test-name">${tests[i]["title"]}</h3>
                                                <p class="quest-count">${tests[i]["terms"].split(";").length} questions</p>
                                                <p class="author-name">${authors[i]} <button style="--c:${btnColor}" class="heart-btn"></button></p>
                                            </div>`
        btnColor = "grey"
    }

    if (testlist.length > 1){
        document.querySelector("main").innerHTML +=`
        <div class="page-div">
            <button class="previous-btn">previous page</button>
            <button class="next-btn">next page</button>
            <p class="page-tracker">page ${curPage}/${testlist.length}</p>
        </div>
    `
        document.querySelector(".previous-btn").addEventListener("click", () => {
        const newPage = curPage-1
        if (newPage > 0){
            window.location.assign("/browse/"+(newPage).toString())
        }
        })
        document.querySelector(".next-btn").addEventListener("click", () => {
            const newPage = curPage+1
            if (newPage <= testlist.length){
                window.location.assign("/browse/"+(newPage).toString())
            }
        })
    }

    

    for (let j = 0; j < tests.length; j++) {
        document.querySelectorAll(".test-profile")[j].addEventListener("click", () => {
            window.location.assign("/view/" + tests[j]["id"])
        })
        document.querySelectorAll(".heart-btn")[j].addEventListener("click", async function (e) {
            e.stopPropagation();
            const computedStyle = getComputedStyle(this);
            const currentColor = computedStyle.getPropertyValue("--c").trim();
            if (currentColor === "grey"){
                this.style.setProperty('--c', 'red')
                await fetch("/b/add-favourite/"+tests[j]["id"], {method: "POST"})
            }else if (currentColor === "red"){
                this.style.setProperty("--c", "grey")
                await fetch("/b/del-favourite/"+tests[j]["id"], {method: "POST"})
            }
            
        })
    }
    
    document.querySelector(".search-btn").addEventListener("click", () => {
        getBrowse(document.querySelector(".search-input").value)
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

async function getBrowse(prompt) {
    let tmp_prompt = ""
    if (prompt === ""){
        tmp_prompt = "null"
    }else{
        tmp_prompt = prompt
    }
    response = await fetch("/b/browse/"+tmp_prompt)
    data = await response.json()

    if (response.status !== 200 && response.status !== 201) {
        document.querySelector("main").innerHTML += `<h1 style="margin-top:20%; transform:scale(2); margin-left:15%;color:white">Something went wrong :(, try to refresh the page<h1/>`
    } else {
        if (data.loggedIn === true) {
            getImg()
        }
        addTests(data.tests, data.authors)
    }
}

if (true) {
    getBrowse()
}