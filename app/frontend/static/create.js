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
let nodeArray = []
let newNode;


const nav = document.querySelector("nav");
document.querySelector(".header-drop").addEventListener("click", () => {
	if (nav.style.display === "none" || nav.style.display == ""){
		nav.style.display = "flex";
	}else if (nav.style.display === "flex"){
		nav.style.display = "none";
	}
});

class TermDefNode{
    constructor(){
        this.defIndex = 0
        this.termText;
        this.definitions;    
        this.scndIndex = 0    
    }
}

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

const updateListener = () =>{
    for (let i =0; i<document.querySelectorAll(".rm-this-btn").length;i++){
        document.querySelectorAll(".rm-this-btn")[i].addEventListener("click", function(){
            if (document.querySelectorAll(".inner-div").length > 1){
                document.querySelectorAll(".inner-div")[i].remove()
                nodeArray[i].remove()
            }else{
                document.querySelectorAll(".inner-div")[0].remove()
                nodeArray[0].remove()
            }
            
        })
        document.querySelectorAll(".term-input")[i].addEventListener("change", async (event) =>{
            nodeArray[i].termText = event.target.value
            nodeArray[i].defIndex = 0
            nodeArray[i].definitions = await getDef(nodeArray[i].termText)
        })
        document.querySelectorAll(".def-input")[i].addEventListener("click", async (event) =>{            
            if (nodeArray[i].definitions === "..." || nodeArray[i].definitions == [] || nodeArray[i].definitions == undefined){
                event.target.placeholder = "definition"
            }else{
                if(event.target.placeholder === nodeArray[i].definitions[nodeArray[i].defIndex]["definitions"][nodeArray[i].scndIndex]["definition"]){
                    if(nodeArray[i].scndIndex < nodeArray[i].definitions[nodeArray[i].defIndex]["definitions"].length -1){
                        nodeArray[i].scndIndex += 1
                    }else{
                        nodeArray[i].defIndex +=1
                        nodeArray[i].scndIndex = 0
                    }
                }
                try {
                    event.target.placeholder = nodeArray[i].definitions[nodeArray[i].defIndex]["definitions"][nodeArray[i].scndIndex]["definition"]
                }catch{
                    nodeArray[i].defIndex = 0
                    nodeArray[i].scndIndex = 0
                    event.target.placeholder = nodeArray[i].definitions[nodeArray[i].defIndex]["definitions"][nodeArray[i].scndIndex]["definition"]
                }

            }
            if(event.target.placeholder !== "definition"){
                event.target.addEventListener("keydown", (event) =>{
                    if (event.key === "Tab"){
                        event.preventDefault()
                        event.target.value = event.target.placeholder
                    }
                })
            }
        })
    }
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
            document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20">${data.message[2].split(";")[i]}</textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="definition">${data.message[3].split(";")[i]}</textarea><button class="rm-this-btn">X</button></div>`
            newNode = new TermDefNode()
            nodeArray.push(newNode)
        }
        updateListener()
    }
}

const getDef = async (term) => {
    //console.log(term)
    const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
    const data = await resp.json();
    if(resp.ok){   
        try{
            const def = data[0]?.meanings || [];
            if (def == []){
                return "...";
            }
            return def;
        }catch{
            return "..."
        }
    } else{
        return "...";
    }
}
    

add_btn.addEventListener("click", async function () {
    let savedTerm = []
    let savedDef = []
    for (let i = 0; i < document.querySelectorAll(".term-input").length; i++) {
        savedTerm.push(document.querySelectorAll(".term-input")[i].value)
        savedDef.push(document.querySelectorAll(".def-input")[i].value)
    }
    document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20"></textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="definition"></textarea><button class="rm-this-btn">X</button></div>`
    newNode = new TermDefNode(document.querySelectorAll(".term-input")[document.querySelectorAll(".term-input").length -1])
    nodeArray.push(newNode)
   // console.log(nodeArray)
    for (let i = 0; i < document.querySelectorAll(".term-input").length; i++) {
        if (savedTerm[i] != undefined && savedDef != undefined) {
            document.querySelectorAll(".term-input")[i].value = savedTerm[i]
            document.querySelectorAll(".def-input")[i].value = savedDef[i]
        }
    }
    updateListener()
    
    
})
rm_btn.addEventListener("click", function () {
    let terms = document.querySelectorAll(".inner-div")
    terms[terms.length - 1].remove()
    nodeArray.pop()
})
submit_btn.addEventListener("click", async function () {
    let proceed = true
    const term_values = document.querySelectorAll(".term-input")
    const def_values = document.querySelectorAll(".def-input")

    let term_value = ""
    let def_value = ""


    if (title_text.value !== "" && description_text.value !== "") {
        for (let i = 0; i < term_values.length; i++) {
            if(term_values[i].value.includes(";")){
                term_values[i].value = term_values[i].value.replace(/;/g, ';')
            }
            if(def_values[i].value.includes(";")){
                def_values[i].values = def_values[i].value.replace(/;/g, ';')
            }
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
