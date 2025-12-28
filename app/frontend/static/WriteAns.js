let realDefList = []
let rightAnswers = 0
let attempts = 0
let fetchedDefs
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
const flashTitle = document.querySelector(".flash-title")
const url_split = window.location.pathname.slice(1).split("/")
const subMenu = document.querySelector(".sub-menu")

const nav = document.querySelector("nav");
document.querySelector(".header-drop").addEventListener("click", () => {
	if (nav.style.display === "none" || nav.style.display == ""){
		nav.style.display = "flex";
	}else if (nav.style.display === "flex"){
		nav.style.display = "none";
	}
});

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
    const response = await fetch("/b/view/" + url_split[1])
    const data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
        window.alert(data.message)
        window.location.assign("/")
    } else {
        document.querySelector("title").innerHTML = "Write " + data.message[0]
        termList = data.message[2].split(";")
        defList = data.message[3].split(";")
        fetchedDefs = data.message[3].split(";")
        realDefList = data.message[3].split(";")
        flashTitle.innerHTML = data.message[0]
        flashTitle.href = '/view/'+ window.location.pathname.slice(1).split('/')[1]
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
