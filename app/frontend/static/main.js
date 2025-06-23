let testDivsId = []
let testDiv = []
let favTestId = []
let combinedTests = []
const myDiv = document.querySelector(".self-div")
const favDiv = document.querySelector(".fav-div")
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

const showMyTests = (myTests, username) =>{
    if (myTests === "You don't have any tests" || myTests.length == 0){
        myTests = []
    }else{
        myTests.forEach(element => {
	    myDiv.innerHTML += `<div class="test-profile">
                                                    <h3 class="test-name">${element["title"]}</h3>
                                                    <p class="quest-count">${element["terms"].split(";").length} questions</p>
                                                    <p class="author-name">${username}</p>
                                                </div>`
	})
     
	
    }
}

const showFavTests = (favTests, username) =>{
    if (typeof favTests == 'undefined' || favTests.length == 0){
        favTests = []
    }else{
	favTests.forEach(element => {
	    favDiv.innerHTML += `<div class="test-profile">
                                                    <h3 class="test-name">${element["title"]}</h3>
                                                    <p class="quest-count">${element["terms"].split(";").length} questions</p>
                                                    <p class="author-name">${username} <button style="--c:red" class="heart-btn"></button></p>
                                                </div>`
	
	})
    }
}


async function getData() {
    const response = await fetch("/b/tests")
    const data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
        //window.alert(data.message)
    }
    else {
            
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        getImg()

        document.querySelector(".sub-name").innerHTML = data.username
        let isRed = "grey"

	console.log(data)

	showMyTests(data.message, data.username)

	showFavTests(data.favourites, data.username)

	const combinedTests = data.message + data.favourites   

        testDiv = document.querySelectorAll(".test-profile")

        for (let i = 0; i < testDiv.length; i++) {
            testDiv[i].addEventListener("click", function () {
                window.location.assign("/view/" + combinedTests[i])
            })
        }
        for (let i=0; i<document.querySelectorAll(".heart-btn").length;i++){
            document.querySelectorAll(".heart-btn")[i].addEventListener("click", async function (e) {
                e.stopPropagation();
                const computedStyle = getComputedStyle(this);
                const currentColor = computedStyle.getPropertyValue("--c").trim();
                if (currentColor === "grey"){
                    this.style.setProperty('--c', 'red')
                    await fetch("/b/add-favourite/"+data.favourites[i]["id"], {method: "POST"})
                }else if (currentColor === "red"){
                    this.style.setProperty("--c", "grey")
                    await fetch("/b/del-favourite/"+data.favourites[i]["id"], {method: "POST"})
                }
                
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




