const API_URL = "https://accounting-backend-mpap.onrender.com";
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');
document.getElementById("studentCourseId").value = courseId;

const form=document.getElementById("studentForm");
form.addEventListener("submit", async e=>{
  e.preventDefault();
  const name=document.getElementById("studentName").value;
  const matricNo=document.getElementById("studentMatric").value;
  const score=document.getElementById("studentScore").value||null;
  try{
    await fetch(`${API_URL}/api/attendance/${courseId}`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,matricNo})
    });
    if(score) await fetch(`${API_URL}/api/tests/${courseId}`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,matricNo,score})
    });
    alert("Submission successful!");
    form.reset();
  }catch(err){console.error(err); alert("Error submitting data");}
});
