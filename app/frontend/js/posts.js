document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    const postsContainer = document.getElementById("postsContainer");
    const paginationContainer = document.getElementById("pagination");
    let currentPage = 1;

    // Fetch and display posts based on the selected category and page
    function fetchPostsByCategoryAndPage(category, page) {
        postsContainer.innerHTML = "<p>Loading...</p>";

        fetch(`../api/posts/get_posts_by_category.php?category=${category}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    displayPosts(data.posts);
                    setupPagination(data.totalPages, category);
                } else {
                    postsContainer.innerHTML = "<p>No posts found for this category.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
                postsContainer.innerHTML = "<p>An error occurred while fetching posts.</p>";
            });
    }

    // Display posts in the container
    function displayPosts(posts) {
        postsContainer.innerHTML = "";

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement("a");
            postElement.classList.add("post");
            postElement.href = `post.html?id=${post.id}`;

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                <button class="read-more-btn">Read More</button>
            `;

            postsContainer.appendChild(postElement);
        });
    }

    // Setup pagination buttons
    function setupPagination(totalPages, category) {
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("pagination-btn");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", function () {
                currentPage = i;
                fetchPostsByCategoryAndPage(category, currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }

    // Fetch posts when the category changes
    categorySelect.addEventListener("change", function () {
        const selectedCategory = categorySelect.value;
        currentPage = 1;
        fetchPostsByCategoryAndPage(selectedCategory, currentPage);
    });

    // Fetch posts for the default category (All) and page 1
    fetchPostsByCategoryAndPage("all", 1);
});