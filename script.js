const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const lightbox = document.querySelector(".lightbox");
const downloadImgBtn = lightbox.querySelector(".uil-import");
const closeImgBtn = lightbox.querySelector(".close-icon");

// Number of images to load initially and per page
const perPage = 10;
let currentPage = 1;
let images = [];

// Function to load images from the repository
const loadImages = async () => {
    try {
        // Fetch image names from the GitHub repository
        const response = await fetch("https://api.github.com/repos/naresh29mpakp/IMAGE1/contents/GALLERY");
        const data = await response.json();
        
        // Extract image URLs from the response
        images = data.map(file => file.download_url);
        
        // Load the initial set of images
        renderImages();
    } catch (error) {
        console.error("Failed to load images:", error);
    }
};

// Function to render images in the gallery
const renderImages = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, images.length);

    for (let i = startIndex; i < endIndex; i++) {
        const img = images[i];
        const li = document.createElement("li");
        li.classList.add("card");
        li.innerHTML = `
            <img onclick="showLightbox('Image', '${img}')" src="${img}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>Photographer</span>
                </div>
                <button onclick="downloadImg('${img}')">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        `;
        imageWrapper.appendChild(li);
    }

    if (endIndex < images.length) {
        loadMoreBtn.style.display = "block";
    } else {
        loadMoreBtn.style.display = "none";
    }
};

// Function to load more images
const loadMoreImages = () => {
    currentPage++;
    renderImages();
};

// Function to show lightbox
const showLightbox = (name, img) => {
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
};

// Function to hide lightbox
const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
};

// Function to download image
const downloadImg = (imgUrl) => {
    fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement("a");
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = "image.jpg";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => console.error("Failed to download image:", error));
};

// Event listeners
loadMoreBtn.addEventListener("click", loadMoreImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", () => downloadImg(downloadImgBtn.getAttribute("data-img")));

// Load images when the page is loaded
window.addEventListener("load", loadImages);
