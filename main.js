document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("#loader");
  const gallery = document.querySelector("#gallery");

  loader.style.display = "block";

  const loadImages = async (page = 1) => {
    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=30`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      loader.style.display = "none";

      data.forEach((image, index) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("image-item");

        const imgElement = document.createElement("img");
        imgElement.dataset.src = image.download_url; // Use data-src for lazy loading
        imgElement.alt = "Image " + (index + 1);

        const linkUrl = document.createElement("span");
        linkUrl.classList.add("desc");
        linkUrl.textContent = image.download_url;

        imgWrapper.appendChild(imgElement);
        imgWrapper.appendChild(linkUrl);
        gallery.appendChild(imgWrapper);
      });

      // Use Intersection Observer for lazy loading
      const lazyLoadImages = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector("img");
            img.src = img.dataset.src;
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
    } catch (error) {
      loader.style.display = "none";
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  let currentPage = 1;

  const loadMoreImages = () => {
    loader.style.display = "block";
    loadImages(currentPage);
    currentPage++;
  };

  // Load initial set of images
  loadMoreImages();

  // Add scroll event listener to load more images when reaching the bottom
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      loadMoreImages();
    }
  });
});
