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
const randomBtn = document.querySelector(".random-btn")


const nav = document.querySelector("nav");
document.querySelector(".header-drop").addEventListener("click", () => {
	if (nav.style.display === "none" || nav.style.display == ""){
		nav.style.display = "flex";
	}else if (nav.style.display === "flex"){
		nav.style.display = "none";
	}
});

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const randomAction = () => {
    count = random(0, termList.length)
    writeTerm()
}

randomBtn.addEventListener("click", function () {
    randomAction()
})

document.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.key === " " || event.key === "ArrowDown" || event.key === "s") {
        randomAction();
    } else if (event.key === "ArrowLeft" || event.key === "a") {
        arrowAction("left");
    } else if (event.key === "ArrowRight" || event.key === "d") {
        arrowAction("right");
    } else if (event.key === "w" || event.key === "ArrowUp"){
        flashAction();
    }
});

async function getImg() {
    const respimg = await fetch("/b/img")
    const img = await respimg.json()

    if (img.img) {
        profilePic.querySelector("img").src = `/static/img/${img.img}`
        profilePic.querySelector("img").alt = img.img
    }
}

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

function rotateFlashcard() {
    rotateOn = true
    degRotate += 10
    flashcard.style.transform = `rotateX(${degRotate}deg)`
    if (degRotate == 90) {
        if (flashTerm.style.display !== "none") {
            flashTerm.style.display = "none"
            flashDef.style.display = "inline-flex"
            flashDef.style.transform = "scale(1, -1)"

        } else {
            flashDef.style.display = "none"
            flashTerm.style.display = "inline-flex"
            flashTerm.style.transform = "scale(1, -1)"
        }
    }
    if (degRotate >= 180) {
        clearInterval(rotateIntervalId)
        rotateOn = false
        degRotate = 0
    }
}
function transAnimation(way) {
    if (way === "right") {
        anime({
            targets: ".flashcard",
            translateX: [
                { value: 250, duration: 0, delay: 0 },
                { value: 0, duration: 100, delay: 100 }
            ],
            rotateY: [
                { value: 40, duration: 0, delay: 0 },
                { value: 0, duration: 100, delay: 200 }
            ],
            easing: "easeInOutQuad",
            loop: false
        })
    } else if (way === "left") {
        anime({
            targets: ".flashcard",
            translateX: [
                { value: -250, duration: 0, delay: 0 },
                { value: 0, duration: 100, delay: 100 }
            ],
            rotateY: [
                { value: -40, duration: 0, delay: 0 },
                { value: 0, duration: 100, delay: 200 }
            ],
            easing: "easeInOutQuad",
            loop: false
        })
    }
}

const flashAction = () =>{
    if (!rotateOn) {
        rotateIntervalId = setInterval(rotateFlashcard, 10)
    }
}

flashcard.addEventListener("click", function () {
    flashAction()
})
function writeTerm() {
    flashTerm.innerHTML = termList[count]
    flashDef.innerHTML = defList[count]
}

const arrowAction = (direction) => {
    if (direction === "right") {
        count += 1
        if (count === termList.length) {
            count = 0
        } else {
            transAnimation("right")
            writeTerm()
        }
    } else if (direction === "left") {
        count -= 1
        if (count < 0) {
            count = termList.length - 1
        } else {
            transAnimation("left")
            writeTerm()
        }
    }
}

righArrow.addEventListener("click", function () {
    arrowAction("right");
})
leftArrow.addEventListener("click", function () {
    arrowAction("left");
})
async function getTest() {
    const response = await fetch("/b/view/" + url_split[1])
    const data = await response.json()

    if (response.status !== 200 && response.status !== 201) {
        window.alert(data.message)
        window.location.assign("/")
    } else {
        document.querySelector("title").innerHTML = "Flashcards " + data.message[0]
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        flashTitle.innerHTML = data.message[0]
        flashTitle.href = '/view/'+ window.location.pathname.slice(1).split('/')[1]
        count = 0
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
        writeTerm()
    }

}

if (url_split[1] !== null) {
    getTest()
} else {
    window.alert("No test was loaded")
    window.location.assign("/")
}
