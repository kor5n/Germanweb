let cookies = document.cookie.split(";")
let session = ""
let isCookieSaved = false
let isViewing = false
let realDefList = []
let rightAnswers = 0
let attempts = 0
let fetchedDefs

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

const genTest = () => {
    shuffle(defList)
    for (let i = 0; i < defList.length; i++) {
        document.querySelector("main").innerHTML += `<div class="answer-card">
        <div class="question-half">
            <h1 class="question-label">${defList[i]}</h1>
        </div>
        <div class="input-half">
            <textarea cols="30" rows="1" class="answer-input" placeholder="Type answer"></textarea>
            <button class="ans-btn">Submit answer</button>
        </div>
    </div>`

    }
    document.querySelector("main").innerHTML += `<h2 class="acc-score" style="display: inline-block;">Your accuracy: </h2><button class="retry-btn">Retry</button>`
    for (let i = 0; i < document.querySelectorAll(".ans-btn").length; i++) {

        document.querySelectorAll(".ans-btn")[i].addEventListener("click", function () {
            const myQuestion = this.parentNode.parentNode.querySelector(".question-label").innerHTML
            const myAnswer = this.parentNode.querySelector("textarea").value
            if (this.style.background !== "red" || this.style.background !== "green") {
                if (myAnswer !== "") {
                    if (termList.includes(myAnswer)) {
                        if (termList.indexOf(myAnswer) === realDefList.indexOf(myQuestion)) {
                            this.style.background = "green"
                            rightAnswers += 1
                        } else {
                            this.style.background = "red"
                        }
                    } else {
                        this.style.background = "red"
                    }
                    attempts += 1

                    document.querySelector(".acc-score").innerHTML = "Your accuracy score: " + rightAnswers / attempts * 100 + "%"

                }
            }
        })
    }
    document.querySelector(".retry-btn").addEventListener("click", () => {
        document.querySelector("main").innerHTML = ""
        defList = fetchedDefs
        attempts = 0
        rightAnswers = 0
        genTest()
    })

}

const getTest = async () => {
    const response = await fetch("http://127.0.0.1:5000/b/view/" + viewing_test)
    const data = await response.json()
    if (response.status != 200 && response.status != 201) {
        window.alert(data.message)
        document.cookie = `viewing_test=${viewing_test}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        window.location.assign("main.html")
    } else {
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        fetchedDefs = data.message[3].split(";")
        realDefList = data.message[3].split(";")
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