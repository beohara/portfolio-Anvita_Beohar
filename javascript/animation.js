document.addEventListener("DOMContentLoaded", () => {
    fetch("../javascript/animation.json")
        .then(response => response.json())
        .then(data => {
            const sections = data.section;  // Get all sections

            // Get the container to insert content
            const advSection = document.getElementById("adv_section");

            sections.forEach(section => {
                // Create a container for each section
                const sectionContainer = document.createElement("div");
                sectionContainer.className = "adv_section";

                // Create and append heading
                const heading = document.createElement("h1");
                heading.className = "heading_page";
                heading.textContent = section.heading;
                sectionContainer.appendChild(heading);

                // Create and append subheading (optional, if you want to use it)
                if (section.subheading) {
                    const subheading = document.createElement("h2");
                    subheading.className = "content_heading";
                    subheading.textContent = section.subheading;
                    sectionContainer.appendChild(subheading);
                }

                // Create and append description
                const description = document.createElement("p");
                description.className = "adv_description";
                description.textContent = section.description;
                sectionContainer.appendChild(description);

                // Create the row for video columns
                const row = document.createElement("div");
                row.className = "row";

                // Split videos into columns
                const columns = [[], [], [], []]; // We will have 4 columns
                section.videos.forEach((video, index) => {
                    columns[index % 4].push(video);  // Distribute videos into columns
                });

                // Create and append columns with videos
                columns.forEach(colVideos => {
                    const column = document.createElement("div");
                    column.className = "column";

                    colVideos.forEach(videoData => {
                        const video = document.createElement("video");
                        video.setAttribute("controls", "true");
                        video.src = videoData.src;
                        video.alt = videoData.alt;
                        video.width = 440;
                        video.height = 440;
                        video.muted = true;
                        video.loop = true;

                        column.appendChild(video);
                    });

                    row.appendChild(column);
                });

                sectionContainer.appendChild(row);

                // Append the entire section to the main container
                advSection.appendChild(sectionContainer);
            });
        })
        .catch(error => console.error("Error loading JSON:", error));
});
