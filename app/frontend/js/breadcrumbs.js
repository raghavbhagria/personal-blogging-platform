document.addEventListener("DOMContentLoaded", () => {
    const pageMap = {
        "posts.html": { name: "Posts", parent: "home.html" },
        "post.html": { name: "Post", parent: "posts.html" },
        "createPost.html": { name: "Create Post", parent: "posts.html" },
        "editPost.html": { name: "Edit Post", parent: "posts.html" },

        "profile.html": { name: "Profile", parent: "home.html" },
        "edit-profile.html": { name: "Edit Profile", parent: "profile.html" },
        "userPosts.html": { name: "Your Posts", parent: "profile.html" },

        "search.html": { name: "Search", parent: "home.html" },
        "notifications.html": { name: "Notifications", parent: "home.html" },
        "about.html": { name: "About", parent: "home.html" },
    };

    const excludePages = [
        "home.html", "login.html", "register.html",
        "admin.html", "admin_activity.html", "admin_blogs.html",
        "admin_comments.html", "admin_edit_blog.html", "admin_settings.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();

    if (excludePages.includes(currentPage)) return;

    const breadcrumbTrail = buildTrail(currentPage, pageMap);
    renderBreadcrumbs(breadcrumbTrail);
});

function buildTrail(current, map) {
    const trail = [{ name: "Home", url: "home.html" }];

    const stack = [];
    let pointer = current;

    while (map[pointer]) {
        stack.unshift({ name: map[pointer].name, url: pointer });
        pointer = map[pointer].parent;
    }

    return trail.concat(stack);
}

function renderBreadcrumbs(trail) {
    const container = document.getElementById("breadcrumb-container");
    if (!container) return;

    const ul = document.createElement("ul");
    ul.className = "breadcrumb";

    trail.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "breadcrumb-item";

        if (index === trail.length - 1) {
            li.classList.add("active");
            li.textContent = item.name;
        } else {
            const a = document.createElement("a");
            a.href = item.url;
            a.textContent = item.name;
            li.appendChild(a);
        }

        ul.appendChild(li);
    });

    container.innerHTML = "";
    container.appendChild(ul);
}
