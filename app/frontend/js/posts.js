document.addEventListener("DOMContentLoaded", function () {
    loadPosts();
});

function loadPosts() {
    fetch("http://localhost:8080/api/posts.php")
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById("postsContainer");
            postsContainer.innerHTML = "";
            data.posts.forEach(post => {
                let postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p>
                    <a href="post.html?id=${post.id}">Read More</a>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
}

function searchPosts() {
    const query = document.getElementById("searchBar").value;
    fetch(`http://localhost:8080/api/posts.php?search=${query}`)
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById("postsContainer");
            postsContainer.innerHTML = "";
            data.posts.forEach(post => {
                let postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p>
                    <a href="post.html?id=${post.id}">Read More</a>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error searching posts:", error));
}
