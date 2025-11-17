const API_URL = "https://accounting-backend-mpap.onrender.com"; 


const loginForm = document.getElementById("adminLoginForm");
if(loginForm){
  loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try{
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(res.ok){
        localStorage.setItem("adminToken", data.token);
        alert("Login successful");
        window.location.href="dashboard.html";
      } else alert(data.message || "Login failed");
    } catch(err){
      console.error(err);
      alert("Error connecting to backend");
    }
  });
}

async function fetchCourses(){
  try{
    const res = await fetch(`${API_URL}/api/courses`);
    const courses = await res.json();
    const tbody = document.querySelector("#coursesTable tbody");
    tbody.innerHTML = courses.map(c=>`
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.students.length}</td>
      </tr>
    `).join("");
  }catch(err){
    console.error(err);
    alert("Error fetching courses");
  }
}
if(window.location.pathname.includes("dashboard.html")) fetchCourses();

// ================== QR CODE ==================
function generateQRCode(){
  const courseId = prompt("Enter Course ID to generate QR code:");
  if(!courseId) return;
  const qrText = `${API_URL}/api/attendance/${courseId}`;
  document.getElementById("qrcode").innerHTML="";
  new QRCode(document.getElementById("qrcode"), { text: qrText, width: 200, height: 200 });
  alert("QR code generated! Students can scan and submit attendance.");
}

// ================== STUDENT SUBMISSION ==================
const studentForm = document.getElementById("studentForm");
if(studentForm){
  studentForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name = document.getElementById("studentName").value;
    const matricNo = document.getElementById("studentMatric").value;
    const courseId = document.getElementById("studentCourseId").value;
    const score = document.getElementById("studentScore").value || null;
    try{
      // Attendance
      await fetch(`${API_URL}/api/attendance/${courseId}`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, matricNo })
      });
      // Test (if score provided)
      if(score) await fetch(`${API_URL}/api/tests/${courseId}`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, matricNo, score })
      });
      alert("Submission successful!");
      fetchCourses();
    }catch(err){
      console.error(err);
      alert("Error submitting data");
    }
  });
}
