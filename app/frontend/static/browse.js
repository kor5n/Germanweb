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

const addTests = async (tests, authors) => {
    document.querySelector("main").innerHTML = `<div class="search-div"><textarea rows="1" cols="40" placeholder="Search for tests"
    class="search-input"></textarea><button class="search-btn">Search</button></div>`
    
    let loggedIn = false
    let testsResp = await fetch("/b/tests")
    let clientTests = await testsResp.json()
    if (testsResp.status == 200){
        loggedIn = true	    
    }
    let btnColor = "grey"
    let favourites = ""
    if (loggedIn){
	if (typeof clientTests !== 'undefined') {
    	    if (clientTests.favourites.length >= 1){
		for(let i=0; i<clientTests.favourites.length; i++){
		    favourites += clientTests.favourites[i]["id"]+","
		}
    	    }else {let favourites = ","}
	}else{ let favourites = ","  }
    }
    let displayType = "inline"
    for (let i = 0; i < tests.length; i++) {
	if (loggedIn){
	    if (typeof favourites !== 'undefined'){
                if (favourites.length > 0){
                    if (favourites.includes(tests[i]["id"].toString())){
                        btnColor = "red"
                    }
                }
 	    }
	}
	 
	if (clientTests.message !== "You don't have any tests"){
	    for (let j=0; j<clientTests.message.length; j++){
	    	if(clientTests.message[j]["id"] == tests[i]["id"]){
		    displayType = "none"
		    break
		}
	    }
	}
        document.querySelector("main").innerHTML += `<div class="test-profile">
                                                <h3 class="test-name">${tests[i]["title"]}</h3>
                                                <p class="quest-count">${tests[i]["terms"].split(";").length} questions</p>
                                                <p class="author-name">${authors[i]} <button style="--c:${btnColor}; display: ${displayType}" class="heart-btn"></button></p>
                                            </div>`
        btnColor = "grey"
	displayType = "inline"
    }

    //console.log("...")

    for (let j = 0; j < tests.length; j++) {
        document.querySelectorAll(".test-profile")[j].addEventListener("click", () => {
            window.location.assign("/view/" + tests[j]["id"])
        })
        document.querySelectorAll(".heart-btn")[j].addEventListener("click", async function (e) {
	    if (!loggedIn){window.alert("You have to have an account for this function")
	    }else{
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
	    }
        })
    }
    
    document.querySelector(".search-btn").addEventListener("click", () => {
        if (document.querySelector(".search-input").value !== "") {
            let testsfound = []
            let authorslist = []
            let testindexes = []
            for (let i = 0; i < tests.length; i++) {
                if (tests[i]["title"].toLowerCase().includes(document.querySelector(".search-input").
                    value.toLowerCase()) || tests[i]["description"].toLowerCase().includes(document.querySelector(".search-input").value.toLowerCase())) {
                    testsfound.push(tests[i])
                    testindexes.push(i)
                }
            }
            //console.log(testsfound)
            for (let j = 0; j < testsfound.length; j++) {
                authorslist.push(authors[testindexes])
            }

            addTests(testsfound, authorslist)
        } else {
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
        }
        addTests(data.tests, data.authors)
    }
}

if (true) {
    getBrowse()
}
