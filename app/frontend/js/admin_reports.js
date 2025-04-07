document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    fetch("/personal-blogging-platform/app/api/admin/get_dashboard_data.php", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("📊 Dashboard Data:", data); 
        if (data.status === "success") {
            
          renderPostsChart(data.postsPerMonth);
          renderCategoryChart(data.postsByCategory);
          renderSignupsChart(data.userSignups);
          renderActiveUsersChart(data.mostActiveUsers);
          renderTopPostsChart(data.topPostsByComments);
        } else {
          alert("Failed to load report data.");
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error("Error fetching dashboard data:", error);
      });
  
    // =====================
    // Chart Render Functions
    // =====================
  
    function renderPostsChart(postsData) {
      new Chart(document.getElementById("postsChart"), {
        type: "line",
        data: {
          labels: postsData.labels,
          datasets: [{
            label: "Posts per Month",
            data: postsData.counts,
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            tension: 0.4,
            fill: true,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `Posts: ${context.raw}`
              }
            },
            legend: { display: true }
          }
        }
      });
    }
  
    function renderCategoryChart(data) {
      new Chart(document.getElementById("categoryChart"), {
        type: "pie",
        data: {
          labels: data.labels,
          datasets: [{
            data: data.counts,
            backgroundColor: [
              "#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#66bb6a"
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `${context.label}: ${context.raw} posts`
              }
            },
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 15
              }
            }
          }
        }
      });
    }
  
    function renderSignupsChart(data) {
      new Chart(document.getElementById("signupsChart"), {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [{
            label: "User Signups",
            data: data.counts,
            borderColor: "green",
            backgroundColor: "rgba(0,128,0,0.1)",
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `Signups: ${context.raw}`
              }
            }
          }
        }
      });
    }
  
    function renderActiveUsersChart(data) {
      // Store for CSV export
      window.latestActiveUsersData = data.labels.map((label, i) => [
        label,
        data.postCounts[i],
        data.commentCounts[i]
      ]);
  
      new Chart(document.getElementById("activeUsersChart"), {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Posts",
              data: data.postCounts,
              backgroundColor: "rgba(0, 123, 255, 0.7)"
            },
            {
              label: "Comments",
              data: data.commentCounts,
              backgroundColor: "rgba(40, 167, 69, 0.7)"
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `${context.dataset.label}: ${context.raw}`
              }
            },
            legend: {
              position: "bottom"
            }
          }
        }
      });
    }
  
    function renderTopPostsChart(data) {
      new Chart(document.getElementById("topPostsChart"), {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [{
            label: "Comments",
            data: data.counts,
            backgroundColor: "orange"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: context => `Comments: ${context.raw}`
              }
            }
          }
        }
      });
    }
  
    // ===========================
    // Export Tools (Optional)
    // ===========================
  
    window.downloadAllCharts = function () {
      document.querySelectorAll("canvas").forEach((canvas, index) => {
        const link = document.createElement("a");
        link.download = `chart-${index + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    };
  
    window.downloadCSV = function () {
      const rows = [
        ["Username", "Posts", "Comments"],
        ...(window.latestActiveUsersData || [])
      ];
  
      const csvContent = "data:text/csv;charset=utf-8," +
        rows.map(e => e.join(",")).join("\n");
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "user_activity_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  });
  