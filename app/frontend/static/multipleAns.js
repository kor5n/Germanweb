let termList = []
let defList = []
let ansTerms = []
let rightAnswers = []
let randomElement = ""
let duplicates = []
let indexList = []
let attempts = 0
let rightAttempts = 0
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const flashTitle = document.querySelector(".flash-title")
const url_split = window.location.pathname.slice(1).split("/")
const subMenu = document.querySelector(".sub-menu")

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

const buttonType = (index, e) => {
    if (rightAnswers[e] === ansTerms[index]) {
        return "right-btn"
    } else {
        return "wrong-btn"
    }
}
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}
function randomAnswers(rightAnswer) {
    ansTerms = []
    ansTerms.push(rightAnswer)
    console.log(ansTerms)
    for (let i = 0; i < 3; i++) {
        randomElement = termList[Math.floor(Math.random() * termList.length)]
        ansTerms.push(randomElement)
    }
    if (termList.length >= 4) {
        duplicates = ansTerms.filter((item, index) => ansTerms.indexOf(item) !== index)
        console.log(duplicates.length)
        if (duplicates.length > 0) {
            randomAnswers(rightAnswer)
        }
    }
}

const genTest = () => {
    for (let i = 0; i < defList.length; i++) {
        indexList.push(i)
    }
    shuffle(indexList)
    for (let e = 0; e < defList.length; e++) {
        rightAnswers.push(termList[indexList[e]])
        randomAnswers(termList[indexList[e]])
        shuffle(ansTerms)
        document.querySelector("main").innerHTML += `
        <div class="answer-container">
            <div class="def-question">
                <h1 class="question-text">${defList[indexList[e]]}</h1>
            </div>
            <div class="term-answers">
                <div>
                    <button class=${buttonType(0, e)}>${ansTerms[0]}</button>
                    <button class=${buttonType(1, e)}>${ansTerms[1]}</button>
                </div>
                <div>
                    <button class=${buttonType(2, e)}>${ansTerms[2]}</button>
                    <button class=${buttonType(3, e)}>${ansTerms[3]}</button>
                </div>
            </div>
        </div>`
    }
    document.querySelector("main").innerHTML += `<h2 class="acc-score" style="display: inline-block; margin-right: 10%;">Your accuracy: </h2><button class="retry-btn">Retry</button>`
    let WrongBtnList = document.querySelectorAll(".wrong-btn")
    for (let i = 0; i < WrongBtnList.length; i++) {
        WrongBtnList[i].addEventListener("click", function () {
            if (this.style.background !== "red") {
                this.style.background = "red"
                attempts += 1
            }
        })
    }
    let RightBtnList = document.querySelectorAll(".right-btn")
    for (let i = 0; i < RightBtnList.length; i++) {
        RightBtnList[i].addEventListener("click", function () {
            if (this.style.background !== "green") {
                this.style.background = "green"
                attempts += 1
                rightAttempts += 1
                if (rightAttempts === document.querySelectorAll(".question-text").length) {
                    document.querySelector(".acc-score").innerHTML = "Your accuracy score: " + rightAttempts / attempts * 100 + "%"
                }
            }
        })
    }

    document.querySelector(".retry-btn").addEventListener("click", function () {
        attempts = 0
        rightAttempts = 0
        rightAnswers = []
        indexList = []
        document.querySelector("main").innerHTML = ""
        genTest()
    })

}
const getTest = async () => {
    const response = await fetch("/b/view/" + url_split[1])
    const data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
        window.alert(data.message)
        window.location.assign("/")
    } else {
        document.querySelector("title").innerHTML = "Multi " + data.message[0]
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        document.querySelector(".flash-title").innerHTML = data.message[0]
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
        genTest()
    }
}

if (url_split[1] !== null) {
    getTest()
} else {
    window.alert("No test was loaded")
    window.location.assign("/")
}

