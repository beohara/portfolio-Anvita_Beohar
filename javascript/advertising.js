class AdvertisingRenderer {
    constructor(jsonPath, containerId) {
        this.jsonPath = jsonPath; // Path to the JSON file
        this.container = document.getElementById(containerId); // Main container to append sections
        this.cookieName = "favoriteImages"; // Name of the cookie to store favorites
    }

    // Utility to fetch JSON data
    async fetchData() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            return data.section;
        } catch (error) {
            console.error("Error fetching JSON:", error);
        }
    }

    // Utility to get cookie value
    getCookie(name) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? JSON.parse(decodeURIComponent(match[2])) : [];
    }

    // Utility to set cookie value
    setCookie(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
        console.log(setCookie);
    }

    // Utility to create a DOM element
    createElement(tag, className = "", content = "") {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    // Toggle favorite status for an image
    toggleFavorite(imageSrc) {
        let favorites = this.getCookie(this.cookieName);
        if (favorites.includes(imageSrc)) {
            favorites = favorites.filter(src => src !== imageSrc); // Remove if already a favorite
        } else {
            favorites.push(imageSrc); // Add if not a favorite
        }
        this.setCookie(this.cookieName, favorites);
        return favorites.includes(imageSrc);
    }

    // Create favorite button for an image
    createFavoriteButton(imageSrc) {
        const button = this.createElement("button", "favorite-btn");
        button.textContent = "❤"; // Heart icon
        button.title = "Add to Favorites";

        // Check if the image is already a favorite
        const favorites = this.getCookie(this.cookieName);
        if (favorites.includes(imageSrc)) {
            button.classList.add("favorited");
        }

        // Add click event to toggle favorite status
        button.addEventListener("click", () => {
            const isFavorited = this.toggleFavorite(imageSrc);
            button.classList.toggle("favorited", isFavorited);
        });

        return button;
    }

    // Render a single section
    renderSection(section) {
        const sectionContainer = this.createElement("div", "adv_section");
        const heading = this.createElement("h1", "heading_page", section.heading);
        const subheading = this.createElement("h2", "content_heading", section.subheading);
        const description = this.createElement("p", "adv_description", section.description);

        sectionContainer.appendChild(heading);
        sectionContainer.appendChild(subheading);
        sectionContainer.appendChild(description);

        const row = this.createElement("div", "row");
        const columns = [[], [], [], []];
        section.images.forEach((image, index) => {
            columns[index % 4].push(image);
        });

        columns.forEach(colImages => {
            const column = this.createElement("div", "column");
            colImages.forEach(imgData => {
                const imgWrapper = this.createElement("div", "img-wrapper");
                const img = document.createElement("img");
                img.src = imgData.src;
                img.alt = imgData.alt;

                const favoriteBtn = this.createFavoriteButton(imgData.src);
                imgWrapper.appendChild(img);
                imgWrapper.appendChild(favoriteBtn);
                column.appendChild(imgWrapper);
            });
            row.appendChild(column);
        });

        sectionContainer.appendChild(row);
        this.container.appendChild(sectionContainer);
    }

    // Render all sections
    async render() {
        const sections = await this.fetchData();
        if (sections) {
            sections.forEach(section => this.renderSection(section));
        }
    }
}

// Instantiate and run the renderer
document.addEventListener("DOMContentLoaded", () => {
    const advertisingRenderer = new AdvertisingRenderer("../javascript/advertising.json", "adv_section");
    advertisingRenderer.render();
});
