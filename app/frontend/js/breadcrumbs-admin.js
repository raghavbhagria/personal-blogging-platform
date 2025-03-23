document.addEventListener("DOMContentLoaded", () => {
    const adminPageMap = {
        "admin_blogs.html": { name: "Blogs", parent: "admin.html" },
        "admin_edit_blog.html": { name: "Edit Blog", parent: "admin_blogs.html" },
        "admin_comments.html": { name: "Comments", parent: "admin.html" },
        "post_comments.html": { name: "Post Comments", parent: "admin_comments.html" },
        "admin_activity.html": { name: "Activity Reports", parent: "admin.html" },
        "admin_settings.html": { name: "Settings", parent: "admin.html" }
    };

    const currentPage = window.location.pathname.split("/").pop();

    // Only build breadcrumbs for pages in the admin hierarchy
    if (!adminPageMap[currentPage] && currentPage !== "admin.html") return;

    const breadcrumbTrail = buildAdminTrail(currentPage, adminPageMap);
    renderBreadcrumbs(breadcrumbTrail);
});

function buildAdminTrail(current, map) {
    const trail = [{ name: "Admin Dashboard", url: "admin.html" }];

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
