document.querySelector("#menu_btn").addEventListener("click", () => {
    document.querySelector("#menu").classList.add("active")
})
document.querySelector("#off_menu_btn").addEventListener("click", () => {
    document.querySelector("#menu").classList.remove("active")
})