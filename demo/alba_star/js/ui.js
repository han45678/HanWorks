document.querySelector("#menu_btn").addEventListener("click", () => {
    document.querySelector("#menu").classList.add("active")
})
document.querySelector("#off_menu_btn").addEventListener("click", () => {
    document.querySelector("#menu").classList.remove("active")
})


const mainPic = document.querySelector("#introduce .main_pic .item img");
const prevBtn = document.querySelector("#introduce .choose_pic .btn.prev");
const nextBtn = document.querySelector("#introduce .choose_pic .btn.next");
const itemElements = document.querySelectorAll("#introduce .choose_pic .item");
const contentContainer = document.querySelector("#introduce .choose_pic_content");

let activeIndex = 0;

function updateActiveItem() {
    itemElements.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    const newImageSrc = itemElements[activeIndex].querySelector("img").src;

    mainPic.style.opacity = 0;

    setTimeout(() => {
        mainPic.src = newImageSrc;
        mainPic.style.opacity = 1;
    }, 300);
}

prevBtn.addEventListener("click", function () {
    if (activeIndex !== 0) {
        contentContainer.scrollTop += itemElements[activeIndex].offsetHeight;
    }
    activeIndex = (activeIndex - 1 + itemElements.length) % itemElements.length;
    updateActiveItem();
});

nextBtn.addEventListener("click", function () {
    if (activeIndex !== itemElements.length - 1) {
        contentContainer.scrollTop += itemElements[activeIndex].offsetHeight;
        
    } else {
        console.log("1111")
        contentContainer.scrollTop = 0;
    }

    activeIndex = (activeIndex + 1) % itemElements.length;
    updateActiveItem();
});

itemElements.forEach((item,i) => {
    item.addEventListener("click", ()=> {
        activeIndex=i;
        updateActiveItem();
        contentContainer.scrollTop=itemElements[0].offsetHeight*i;
    });
})
