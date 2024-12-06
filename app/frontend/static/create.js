const add_btn = document.querySelector(".add-term-btn")
const rm_btn = document.querySelector(".rm-term-btn")
const submit_btn = document.querySelector(".submit-btn")
const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
let isEditing = false
const title_text = document.querySelector(".title-input")
const description_text = document.querySelector(".desc-input")
const url_split = window.location.pathname.slice(1).split("/")
const subMenu = document.querySelector(".sub-menu")

async function getImg() {
    const respimg = await fetch("/b/img")
    const img = await respimg.json()

    if (Math.round(respimg.status) === 200) {
        if (img.img) {
            profilePic.querySelector(".profile-img").src = `/static/img/${img.img}`
            profilePic.querySelector(".profile-img").alt = img.img
        }
    } else if (respimg.status === 401) {
        alert(img.message)
        window.location.assign("/")
    }


}

logInBtn.style.display = "none"
signInBtn.style.display = "none"
profilePic.style.display = "inline-block"
getImg()

document.querySelector(".dropdown-btn").addEventListener("click", () => {
    if (document.querySelector(".smartsorter-div").style.display === "none") {
        document.querySelector(".smartsorter-div").style.display = "block"
    } else {
        document.querySelector(".smartsorter-div").style.display = "none"
    }
})

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block"
    } else {
        subMenu.style.display = "none"
    }
})

if (url_split[0] === "edit") {
    isEditing = true
} else {
    isEditing = false
}
async function setupEdit() {
    const response = await fetch("/b/view/" + url_split[1])
    const data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
        window.alert(data.message)
    } else {
        document.querySelector("title").innerHTML = "Edit " + data.message[0]
        title_text.value = data.message[0]
        description_text.value = data.message[1]
        for (let i = 0; i < data.message[2].split(";").length; i++) {
            document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20">${data.message[2].split(";")[i]}</textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="defenition">${data.message[3].split(";")[i]}</textarea><button onclick='console.log(document.querySelectorAll(".rm-this-btn"))' class="rm-this-btn">X</button></div>`
        }
        for (let i =0; i<document.querySelectorAll(".rm-this-btn").length;i++){
            document.querySelectorAll(".rm-this-btn")[i].addEventListener("click", function(){
                console.log(document.querySelectorAll(".inner-div"))
                if (document.querySelectorAll(".inner-div").length > 1){
                    document.querySelectorAll(".inner-div")[i].remove()
                }else{
                    document.querySelectorAll(".inner-div")[0].remove()
                }
                
            })
        }
    }
}

add_btn.addEventListener("click", function () {
    let savedTerm = []
    let savedDef = []
    let lastindex;
    for (let i = 0; i < document.querySelectorAll(".term-input").length; i++) {
        savedTerm.push(document.querySelectorAll(".term-input")[i].value)
        savedDef.push(document.querySelectorAll(".def-input")[i].value)
    }
    document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20"></textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="defenition"></textarea><button class="rm-this-btn">X</button></div>`
    for (let i = 0; i < document.querySelectorAll(".term-input").length; i++) {
        if (savedTerm[i] != undefined && savedDef != undefined) {
            document.querySelectorAll(".term-input")[i].value = savedTerm[i]
            document.querySelectorAll(".def-input")[i].value = savedDef[i]
        }
    }
    lastindex = document.querySelectorAll(".rm-this-btn").length -1
    for (let i =0; i<document.querySelectorAll(".rm-this-btn").length;i++){
        document.querySelectorAll(".rm-this-btn")[i].addEventListener("click", function(){
            console.log(document.querySelectorAll(".inner-div"))
            if (document.querySelectorAll(".inner-div").length > 1){
                document.querySelectorAll(".inner-div")[i].remove()
            }else{
                document.querySelectorAll(".inner-div")[0].remove()
            }
            
        })
    }
    
})
rm_btn.addEventListener("click", function () {
    let terms = document.querySelectorAll(".inner-div")
    terms[terms.length - 1].remove()
})
submit_btn.addEventListener("click", async function () {
    let proceed = true
    const term_values = document.querySelectorAll(".term-input")
    const def_values = document.querySelectorAll(".def-input")

    let term_value = ""
    let def_value = ""


    if (title_text.value !== "" && description_text.value !== "") {
        for (let i = 0; i < term_values.length; i++) {
            term_value += ";" + term_values[i].value
            def_value += ';' + def_values[i].value
            if (term_values[i].value === "" && def_values[i].value === "") {
                alert("You have to write something")
                proceed = false
                break
            }
        }

        term_value = term_value.substring(1)
        def_value = def_value.substring(1)

        if (proceed) {
            const sess = {
                "title": title_text.value,
                "description": description_text.value,
                "term": term_value,
                "defenition": def_value
            }
            if (isEditing === false) {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sess)
                }
                const response = await fetch("/b/create", options)
                const data = await response.json()
                if (response.status === 201 || response.status === 200) {
                    window.alert(data.message)
                    window.location.assign("/")
                }
                else {
                    window.alert(data.message)
                }
            } else if (isEditing) {
                const sess = {
                    "title": title_text.value,
                    "description": description_text.value,
                    "terms": term_value,
                    "defenition": def_value
                }
                const options = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sess)
                }
                const response = await fetch("/b/edit-test/" + url_split[1], options)
                const data = await response.json()
                if (response.status === 201 || response.status === 200) {
                    window.alert(data.message)
                    window.location.assign("/view/" + url_split[1])
                }
                else {
                    alert(data.message)
                }
            }

        }
    } else {
        alert("You have to write something")
    }

})




if (isEditing) {
    setupEdit()
}
