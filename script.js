const API_URL = "https://accounting-backend-mpap.onrender.com"; 




const loginForm = document.getElementById("adminLoginForm");
if(loginForm){
  loginForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    try{
      const res=await fetch(`${API_URL}/api/admin/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
      const data=await res.json();
      if(res.ok){ localStorage.setItem("adminToken",data.token); window.location.href="dashboard.html"; }
      else alert(data.message||"Login failed");
    }catch(err){console.error(err); alert("Error connecting to backend");}
  });
}

// Fetch courses
async function fetchCourses(){
  try{
    const res = await fetch(`${API_URL}/api/courses`);
    const courses = await res.json();
    const tbody = document.querySelector("#coursesTable tbody");
    tbody.innerHTML = courses.map(c=>`<tr><td>${c.id}</td><td>${c.name}</td><td>${c.students.length}</td></tr>`).join("");
  }catch(err){ console.error(err); alert("Error fetching courses"); }
}
if(window.location.pathname.includes("dashboard.html")) fetchCourses();

// Generate QR code (links to student.html)
function generateQRCode(){
  const courseId=prompt("Enter Course ID:");
  if(!courseId) return;
  const qrText=`https://<your-netlify-frontend>/student.html?courseId=${courseId}`;
  document.getElementById("qrcode").innerHTML="";
  new QRCode(document.getElementById("qrcode"), { text:qrText, width:200, height:200 });
  alert("QR code generated!");
}

}

