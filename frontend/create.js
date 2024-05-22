let add_btn = document.querySelector(".add-term-btn")
let rm_btn = document.querySelector(".rm-term-btn")
let submit_btn = document.querySelector(".submit-btn")

add_btn.addEventListener("click", function(){
    document.querySelector(".term-div").innerHTML += `<div class="inner-div" style="display: inline-flex; margin-top: 5%;"><textarea class="term-input" placeholder="term" rows="1" cols="20"></textarea><span style="margin-right: 2%; margin-left: 2%; scale: 2; margin-top: 4.5%;">|</span><textarea rows="1" cols="20" class="def-input" placeholder="defenition"></textarea></div>`
})
rm_btn.addEventListener("click", function(){
    let terms = document.querySelectorAll(".inner-div")
    terms[terms.length - 1].remove()
})
submit_btn.addEventListener("click", function(){
    let proceed = true
    let title_text = document.querySelector(".title-input")
    let description_text = document.querySelector(".desc-input")
    let term_values = document.querySelectorAll(".term-input")
    let def_values = document.querySelectorAll(".def-input")
    if (title_text.value != "" && description_text.value != ""){
        let new_list = [title_text.value, description_text.value]
        for (let i = 0; i < term_values.length; i++){
            new_list.push(term_values[i].value)
            new_list.push(term_values[i].value)
            if (term_values[i].value == "" && def_values[i].value == ""){
                alert("You have to write something")
                proceed = false
                break
            }
        }
        if(proceed){
            console.log("hello")
        }
        
    }else{
        alert("You have to write something")
    }
})
