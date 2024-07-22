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

document.querySelector(".profile-pic").addEventListener("click", () => {
    if (subMenu.style.display == "none") {
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
    if (response.status != 200 && response.status != 201) {
        window.alert(data.message)
    } else {
        title_text.value = data.message[0]
        description_text.value = data.message[1]
        for (let i = 0; i < data.message[2].split(";").length; i++) {
            document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20">${data.message[2].split(";")[i]}</textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="defenition">${data.message[3].split(";")[i]}</textarea></div>`
        }
    }
}

add_btn.addEventListener("click", function () {
    document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20"></textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="defenition"></textarea></div>`
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


    if (title_text.value != "" && description_text.value != "") {
        for (let i = 0; i < term_values.length; i++) {
            term_value += ";" + term_values[i].value
            def_value += ';' + def_values[i].value
            if (term_values[i].value == "" && def_values[i].value == "") {
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
            if (isEditing == false) {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(sess)
                }
                const response = await fetch("/b/create", options)
                const data = await response.json()
                if (response.status == 201 || response.status == 200) {
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
                if (response.status == 201 || response.status == 200) {
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


logInBtn.style.display = "none"
signInBtn.style.display = "none"
profilePic.style.display = "inline-block"

if (isEditing) {
    setupEdit()
}
