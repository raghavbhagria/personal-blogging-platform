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
    const posts = document.querySelectorAll(".post-content");
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Clear previous results

    posts.forEach(post => {
        const regex = new RegExp(`(${query})`, "gi");
        const postContent = post.innerHTML;
        if (regex.test(postContent)) {
            const highlightedContent = postContent.replace(regex, '<span class="highlight">$1</span>');
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");
            resultItem.innerHTML = highlightedContent;
            resultsContainer.appendChild(resultItem);
        }
    });
}

// Clear results function
function clearResults() {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";
}