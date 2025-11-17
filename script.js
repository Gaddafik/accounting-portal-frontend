const API_URL = "https://accounting-backend-mpap.onrender.com"; 
const loginForm = document.getElementById("adminLoginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html"; // redirect to dashboard
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend. Make sure your Render backend is live and CORS is enabled.");
    }
  });
}

async function fetchCourses() {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_URL}/api/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const courses = await res.json();
    const coursesList = document.getElementById("coursesList");
    if (coursesList) {
      coursesList.innerHTML = courses.map(c => `<p>${c.name} (${c.students.length} students)</p>`).join("");
    }
  } catch (err) {
    console.error(err);
    alert("Error fetching courses. Make sure backend is live and CORS is configured.");
  }
}


async function submitAttendance(courseId, studentData) {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_URL}/api/attendance/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    });

    const data = await res.json();
    alert("Attendance submitted!");
  } catch (err) {
    console.error(err);
    alert("Error submitting attendance. Check backend.");
  }
}


async function submitTest(courseId, testData) {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch(`${API_URL}/api/tests/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    const data = await res.json();
    alert("Test submitted!");
  } catch (err) {
    console.error(err);
    alert("Error submitting test. Check backend.");
  }
}


function scanQRCode() {
  alert("QR code scanning feature coming soon!");
}

if (window.location.pathname.includes("dashboard.html")) {
  fetchCourses();
}
