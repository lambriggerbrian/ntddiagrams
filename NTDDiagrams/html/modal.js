var navbar = document.getElementById("navbar");

// Get all post elements
var posts = document.getElementsByClassName("post");

// Insert images into modal
for (i = 0; i < posts.length; i++) {
    var image = posts[i].childNodes[0];
    var modal = posts[i].childNodes[2];
    //var modalBody = modal.firstChild.firstChild;

    // Expand on click
    image.onclick = function () {
        navbar.style.display = "none";
        modal.style.display = "block";
        //modal.childNodes[1].innerHTML = this.alt;
        //modal.childNodes[1].src = this.src;
    }

    var closeFunction = function () {
        navbar.style.display = "flex";
        modal.style.display = "none";
    }

    // Close on click
    modal.onclick = closeFunction;
    modal.childNodes[0].onclick = closeFunction;
}

var images = document.images;

for (i = 0; i < images.length; i++) {
    images[i].oncontextmenu = function () {
        return false;
    }
}

function showModal(element) {
    var navbar = document.getElementById("navbar");
    var modal = null;
    element.childNodes.forEach(child => {
        if (child.className === "modal") modal = child;
    })
    if (!modal) return;
    navbar.style.display = "none";
    modal.style.display = "block";
}

function hideModal(element) {
    if (element.className !== "modal") return;
    var navbar = document.getElementById("navbar");
    var modal = element;
    navbar.style.display = "flex";
    modal.style.display = "none";
}
