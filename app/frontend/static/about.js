const logInBtn = document.querySelector(".log-in")
const signInBtn = document.querySelector(".sign-in")
const profilePic = document.querySelector(".profile-pic")
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

async function getData() {
    const response = await fetch("/b/tests")
    const data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
        //window.alert(data.message)
    }
    else {
        let favourites = data.favourites
        if (favourites.length > 0){
            favourites = favourites.split(",")
            for (let i=0; i<favourites.length;i++){
                favourites[i] = +favourites[i]
            }
        }
        logInBtn.style.display = "none"
        signInBtn.style.display = "none"
        profilePic.style.display = "inline"
        getImg()

        document.querySelector(".sub-name").innerHTML = data.username
    }
}

getData()
