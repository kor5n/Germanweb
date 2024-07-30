const flashcard = document.querySelector('.flashcard')
let degRotate = 0
let rotateOn = false
const flashTerm = document.querySelector(".flash-term")
const flashDef = document.querySelector(".flash-def")
const righArrow = document.querySelector(".right-trans")
const leftArrow = document.querySelector(".left-trans")
const fakeFlash = document.querySelector(".trans-flash")
let termList = []
let defList = [] 
let count = 0
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const flashTitle = document.querySelector(".flash-title")
const url_split = window.location.pathname.slice(1).split("/")
const subMenu = document.querySelector(".sub-menu")

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

function rotateFlashcard(){
    rotateOn = true
    degRotate +=10
    flashcard.style.transform = `rotateX(${degRotate}deg)`
    if(degRotate==90){
        if(flashTerm.style.display !== "none"){
            flashTerm.style.display = "none"
            flashDef.style.display = "inline-flex"
            flashDef.style.transform = "scale(1, -1)"

        } else{
            flashDef.style.display = "none"
            flashTerm.style.display = "inline-flex"
            flashTerm.style.transform = "scale(1, -1)"
        }
    }
    if(degRotate >= 180){
        clearInterval(rotateIntervalId)
        rotateOn = false
        degRotate = 0
    }
}
function transAnimation(way){
    if(way === "right"){
        anime({
            targets: ".flashcard",
            translateX:[
                {value: 250, duration: 0, delay: 0},
                {value: 0, duration: 100, delay: 100}
            ],
            rotateY:[
                {value: 40, duration: 0, delay: 0},
                {value: 0, duration: 100, delay: 200}
            ],
            easing: "easeInOutQuad",
            loop: false
        })
    }else if(way === "left"){
        anime({
            targets: ".flashcard",
            translateX:[
                {value: -250, duration: 0, delay: 0},
                {value: 0, duration: 100, delay: 100}
            ],
            rotateY:[
                {value: -40, duration: 0, delay: 0},
                {value: 0, duration: 100, delay: 200}
            ],
            easing: "easeInOutQuad",
            loop: false
        })
    }
}
flashcard.addEventListener("click", function(){
    if(!rotateOn){
        rotateIntervalId = setInterval(rotateFlashcard,10)
    }
})
function writeTerm(){
    flashTerm.innerHTML = termList[count]
    flashDef.innerHTML = defList[count]
}
righArrow.addEventListener("click", function(){
    count += 1
    if(count === termList.length){
        count -= 1
    }else{
        transAnimation("right")
        writeTerm()
    }
})
leftArrow.addEventListener("click", function(){
    count -= 1
    if(count< 0){
        count += 1
    }else{
        transAnimation("left")
        writeTerm()
    }
    
})
async function getTest(){
    const response = await fetch("/b/view/"+ url_split[1])
    const data = await response.json()

    if(response.status !== 200 && response.status !== 201){
        window.alert(data.message)
        window.location.assign("/")
    }else{
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        flashTitle.innerHTML = data.message[0]
        count = 0
        if (data.loggedIn === true) {
            logInBtn.style.display = "none"
            signInBtn.style.display = "none"
            profilePic.style.display = "inline-block"
        } else if(data.loggedIn === false) {
            logInBtn.style.display = "inline-block"
            signInBtn.style.display = "inline-block"
            profilePic.style.display = "none"
        }
        writeTerm()
    }
    
}

if(url_split[1] !== null){
    getTest()
} else{
    window.alert("No test was loaded")
    window.location.assign("/")
}