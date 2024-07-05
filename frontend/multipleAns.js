let cookies = document.cookie.split(";")
let session = ""
let isCookieSaved = false
let isViewing = false
let termList = []
let defList = []
let ansTerms = []
let rightAnswers = []
let randomElement = ""
let duplicates = []
let indexList = []
let attempts = 0
let rightAttempts = 0


for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].split("=")[0].replace(" ", "") == "user") {
        isCookieSaved = true
        session = cookies[i].split("=")[1]

    }
    if (cookies[i].split("=")[0].replace(" ", "") == "view_test") {
        isViewing = true
        viewing_test = cookies[i].split("=")[1]
    }
}
const buttonType = (index, e) => {
    if (rightAnswers[e] == ansTerms[index]) {
        return "right-btn"
    } else {
        return "wrong-btn"
    }
}
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

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
    for (let i = 0; i < 3; i++) {
        randomElement = termList[Math.floor(Math.random() * termList.length)]
        ansTerms.push(randomElement)
    }
    duplicates = ansTerms.filter((item, index) => ansTerms.indexOf(item) !== index)
    if (duplicates.length > 0) {
        randomAnswers(rightAnswer)
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
    console.log(WrongBtnList.length)
    for (let i = 0; i < WrongBtnList.length; i++) {
        console.log(WrongBtnList[i])
        WrongBtnList[i].addEventListener("click", function () {
            console.log("WRONG")
            this.style.background = "red"
            attempts += 1
        })
    }
    let RightBtnList = document.querySelectorAll(".right-btn")
    console.log(RightBtnList.length)
    for (let i = 0; i < RightBtnList.length; i++) {
        console.log(RightBtnList[i])
        RightBtnList[i].addEventListener("click", function () {
            console.log("RIGHT")
            this.style.background = "green"
            attempts += 1
            rightAttempts += 1
            if (rightAttempts == document.querySelectorAll(".question-text").length) {
                document.querySelector(".acc-score").innerHTML = "Your accuracy score: " + rightAttempts / attempts * 100 + "%"
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
    const response = await fetch("http://127.0.0.1:5000/view/" + viewing_test)
    const data = await response.json()
    if (response.status != 200 && response.status != 201) {
        window.alert(data.message)
        document.cookie = `viewing_test=${viewing_test}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        window.location.assign("main.html")
    } else {
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        document.querySelector(".flash-title").innerHTML = data.message[0]
        genTest()
    }
}

if (isCookieSaved) {
    if (isViewing) {
        getTest()
    } else {
        window.alert("No test was loaded")
        window.location.assign("main.html")
    }
} else {
    window.alert("You have to bet logged int to use this feature")
    window.location.assign("signup.html")
}
