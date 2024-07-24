document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector("#content");
  const loader = document.querySelector("#loader");
  fetch("https://picsum.photos/v2/list?page=2&limit=100")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Chuyển đổi dữ liệu nhận được sang JSON
    })
    .then((data) => {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              data.map((image) => {
                const newItem = document.createElement("div");
                newItem.className = "content-inner";
                const newItemInner = document.createElement("div");
                newItemInner.className = "image_content";
                const newImage = document.createElement("img");
                const ImageLink = document.createElement("a");
                ImageLink.className = "hover-link";
                ImageLink.href = image.download_url;
                ImageLink.textContent = image.download_url;
                newImage.className = "thumbnail";
                newImage.alt = image.url;
                newImage.src = image.download_url;
                newItemInner.appendChild(ImageLink);
                newItemInner.appendChild(newImage);
                newItem.appendChild(newItemInner);
                content.appendChild(newItem);
              });
            }, 1000);
          }
        });
      });
      observer.observe(loader);
    });
});
