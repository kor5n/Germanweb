let flashcard = document.querySelector('.flashcard')
let degRotate = 0
let rotateOn = false
let flashTerm = document.querySelector(".flash-term")
let flashDef = document.querySelector(".flash-def")
let righArrow = document.querySelector(".right-trans")
let leftArrow = document.querySelector(".left-trans")
let fakeFlash = document.querySelector(".trans-flash")

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
righArrow.addEventListener("click", function(){
    transAnimation("right")
})
leftArrow.addEventListener("click", function(){
    transAnimation("left")
})