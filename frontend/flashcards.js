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
let cookies = document.cookie.split(";")
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const flashTitle = document.querySelector(".flash-title")

function rotateFlashcard(){
    rotateOn = true
    degRotate +=10
    flashcard.style.transform = `rotateX(${degRotate}deg)`
    if(degRotate==90){
        if(flashTerm.style.display != "none"){
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
    if(way == "right"){
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
    }else if(way == "left"){
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
    if(count == termList.length){
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
    const response = await fetch("http://127.0.0.1:5000/view/"+ viewing_test)
    const data = await response.json()

    if(response.status != 200 && response.status != 201){
        window.alert(data.message)
        document.cookie = `viewing_test=${viewing_test}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        window.location.assign("main.html")
    }else{
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        flashTitle.innerHTML = data.message[1]
        count = 0
        writeTerm()
    }
}
for (let i = 0; i< cookies.length; i++){
    if(cookies[i].split("=")[0].replace(" ", "") == "user"){
        isCookieSaved = true
    }
    if(cookies[i].split("=")[0].replace(" ", "") == "view_test"){
        isViewing = true
        viewing_test = cookies[i].split("=")[1]
    }
}
if(isCookieSaved){
    logInBtn.style.display = "none"
    signInBtn.style.display = "none"
    profilePic.style.display = "inline-block"
}else{
    logInBtn.style.display = "inline-block"
    signInBtn.style.display = "inline-block"
    profilePic.style.display = "none"
}

if(isViewing){
    getTest()
} else{
    window.alert("No test was loaded")
    window.location.assign("main.html")
}