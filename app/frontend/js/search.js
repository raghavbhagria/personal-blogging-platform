document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchQuery = document.getElementById("searchQuery");
    const searchResults = document.getElementById("searchResults");

    // Function to get query parameter from URL
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get the query from the URL
    const query = getQueryParameter('query');

    // If there is a query, set the input value and perform the search
    if (query) {
        searchQuery.value = query;
        searchAndDisplayResults(query);
    }

    if (searchForm && searchQuery && searchResults) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const query = searchQuery.value.trim();
            if (query) {
                searchAndDisplayResults(query);
            }
        });

        // Add input event listener for real-time search
        searchQuery.addEventListener("input", function () {
            const query = searchQuery.value.trim();
            if (query) {
                searchAndDisplayResults(query);
            } else {
                clearResults();
            }
        });
    }
});

// Search and display results function
function searchAndDisplayResults(query) {
    fetch("/personal-blogging-platform/app/api/posts/get_posts.php")

        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const posts = data.posts;
                const resultsContainer = document.getElementById("searchResults");
                resultsContainer.innerHTML = ""; // Clear previous results

                posts.forEach(post => {
                    const regex = new RegExp(`(${query})`, "gi");
                    if (regex.test(post.title) || regex.test(post.content)) {
                        const highlightedTitle = post.title.replace(regex, '<span class="highlight">$1</span>');
                        const highlightedContent = post.content.replace(regex, '<span class="highlight">$1</span>');
                        const resultItem = document.createElement("div");
                        resultItem.classList.add("result-item");
                        resultItem.innerHTML = `
                            <h3>${highlightedTitle}</h3>
                            <p>${highlightedContent}</p>
                            <p><strong>Author:</strong> ${post.author}</p>
                            <p><strong>Likes:</strong> ${post.likes}</p>
                            <p><strong>Created At:</strong> ${post.created_at}</p>
                        `;
                        resultsContainer.appendChild(resultItem);
                    }
                });
            } else {
                console.error("Failed to fetch posts:", data.message);
            }
        })
        .catch(error => console.error("Error fetching posts:", error));
}

// Clear results function
function clearResults() {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";
}