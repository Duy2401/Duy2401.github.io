const accessKey = "wpWg9j7ZTXEzdnPFwJX09qyQ0B92jbAH7UKHjJ6Lt2Y";
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("#loader");
  const gallery = document.querySelector("#gallery");

  let currentPage = 1;
  let isLoading = false;

  const loadImages = async (page = 1) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${page}&query=random&per_page=12&client_id=${accessKey}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      console.log(data.results);

      loader.style.display = "none";

      data.results.forEach((image, index) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("image-item");

        const imgElement = document.createElement("img");
        imgElement.src = image.urls.small; // Use data-src for lazy loading
        imgElement.alt = "Image " + (index + 1);

        const linkUrl = document.createElement("span");
        linkUrl.classList.add("desc");
        linkUrl.textContent = image.links.self;

        imgWrapper.appendChild(imgElement);
        imgWrapper.appendChild(linkUrl);
        gallery.appendChild(imgWrapper);
      });

      // Use Intersection Observer for lazy loading
      const lazyLoadImages = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector("img");
            img.src = img.getAttribute("src");
            observer.unobserve(entry.target);
          }
        });
      };

      const observer = new IntersectionObserver(lazyLoadImages, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });

      document.querySelectorAll(".image-item").forEach((item) => {
        observer.observe(item);
      });

      isLoading = false;
    } catch (error) {
      loader.style.display = "none";
      console.error("There was a problem with the fetch operation:", error);
      isLoading = false;
    }
  };

  const loadMoreImages = () => {
    if (isLoading) return; // Prevent multiple simultaneous loads
    isLoading = true;
    loader.style.display = "block";
    loadImages(currentPage);
    currentPage++;
  };

  // Load initial set of images
  loadMoreImages();

  // Add scroll event listener to load more images when reaching the bottom
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMoreImages();
    }
  });
});
