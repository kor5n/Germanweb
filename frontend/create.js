let add_btn = document.querySelector(".add-term-btn")
let rm_btn = document.querySelector(".rm-term-btn")
let submit_btn = document.querySelector(".submit-btn")
let cookies = document.cookie.split(";")
let isCookieSaved = false
let session = ""
let isLoggedIn = false


console.log(cookies)
for (let i = 0; i< cookies.length; i++){
    if(cookies[i].split("=")[0] == "user"){
        //console.log(cookies[i].split("=")[0])
        isCookieSaved = true
        session = cookies[i].split("=")[1]
        isLoggedIn = true
        index = i
        //console.log(cookies[i].split("=")[1])
        break
    }
}
console.log(session)
console.log(isCookieSaved, isLoggedIn)

if (isCookieSaved){

    if(isLoggedIn != true){
        logInBtn.style.display = "inline-block"
        signInBtn.style.display = "inline-block"
        profilePic.style.display = "none"
    }
}else{
    window.alert("You are not logged in")
    window.location.assign("signup.html")
}

add_btn.addEventListener("click", function(){
    document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20"></textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="defenition"></textarea></div>`
})
rm_btn.addEventListener("click", function(){
    let terms = document.querySelectorAll(".inner-div")
    terms[terms.length - 1].remove()
})
submit_btn.addEventListener("click", async function(){
    let proceed = true
    let title_text = document.querySelector(".title-input")
    let description_text = document.querySelector(".desc-input")
    let term_values = document.querySelectorAll(".term-input")
    let def_values = document.querySelectorAll(".def-input")
    let term_value = ""
    let def_value = ""

    if (title_text.value != "" && description_text.value != ""){
        for (let i = 0; i < term_values.length; i++){
            term_value += ";"+term_values[i].value
            def_value += ';' + def_values[i].value
            if (term_values[i].value == "" && def_values[i].value == ""){
                alert("You have to write something")
                proceed = false
                break
            }
        }
        term_value = term_value.substring(1)
        console.log(def_value)

        def_value = def_value.substring(1)
        console.log(term_value)

        
        if(proceed){
            const sess = {
                "session_id":session,
                "title": title_text.value,
                "description": description_text.value,
                "term": term_value,
                "defenition": def_value
            }
            const options = {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sess)
            }
            const response = await fetch("http://127.0.0.1:5000/create", options)
            const data = await response.json()
            console.log(response.status)
            if(response.status == 201 || response.status == 200){
                window.alert(data.message)
                window.location.assign("main.html")
            }
            else{
                alert(data.message)
            }
        }
        
    }else{
        alert("You have to write something")
    }
})
