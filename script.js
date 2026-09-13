const grades={S:10,A:9,B:8,C:7,D:6,E:5,F:0};
const subjects=document.getElementById("subjects");
const semesters=document.getElementById("semesters");

function subjectRow(name="",credit="",grade="S"){
  const row=document.createElement("div"); row.className="subject";
  row.innerHTML=`<input class="sub-name" placeholder="Subject name" value="${name}">
    <input class="credit" type="number" min="0" step="0.5" placeholder="Credits" value="${credit}">
    <select class="grade">${Object.keys(grades).map(g=>`<option ${g===grade?"selected":""}>${g}</option>`).join("")}</select>
    <button class="remove" type="button">Remove</button>`;
  row.querySelector(".remove").onclick=()=>{row.remove();calcGPA()};
  row.querySelectorAll("input,select").forEach(x=>x.oninput=calcGPA);
  subjects.appendChild(row);
}
function semesterRow(gpa="",credit=""){
  const row=document.createElement("div"); row.className="semester";
  row.innerHTML=`<input class="sem-gpa" type="number" min="0" max="10" step="0.01" placeholder="GPA" value="${gpa}">
    <input class="sem-credit" type="number" min="0" step="0.5" placeholder="Credits" value="${credit}">
    <button class="remove" type="button">Remove</button>`;
  row.querySelector(".remove").onclick=()=>{row.remove();calcCGPA()};
  row.querySelectorAll("input").forEach(x=>x.oninput=calcCGPA);
  semesters.appendChild(row);
}
function calcGPA(){
  let total=0,credits=0,fail=false;
  subjects.querySelectorAll(".subject").forEach(r=>{
    const c=parseFloat(r.querySelector(".credit").value)||0,g=r.querySelector(".grade").value;
    if(g==="F")fail=true; total+=c*grades[g]; credits+=c;
  });
  const gpa=credits?total/credits:0;
  document.getElementById("gpaResult").textContent=gpa.toFixed(2);
  document.getElementById("gpaPercent").textContent=(gpa*10).toFixed(2)+"%";
  document.getElementById("gpaStatus").textContent=credits?(fail?"Backlog":"Pass"):"—";
  document.getElementById("gpaMessage").textContent=credits?(fail?"⚠️ You have an F grade. Check your backlog.":gpa>=9?"🔥 Excellent performance!":gpa>=8?"👏 Great job!":gpa>=7?"👍 Good performance.":"Keep improving — you can do it!"): "Add subjects and credits to calculate.";
}
function calcCGPA(){
  let total=0,credits=0;
  semesters.querySelectorAll(".semester").forEach(r=>{const g=parseFloat(r.querySelector(".sem-gpa").value)||0,c=parseFloat(r.querySelector(".sem-credit").value)||0;total+=g*c;credits+=c});
  const cg=credits?total/credits:0;
  document.getElementById("cgpaResult").textContent=cg.toFixed(2);
  document.getElementById("cgpaPercent").textContent=(cg*10).toFixed(2)+"%";
  document.getElementById("cgpaStatus").textContent=credits?(cg>=9?"Outstanding":cg>=8?"Excellent":cg>=7?"Very Good":cg>=6?"Good":"Needs Improvement"):"—";
  document.getElementById("cgpaMessage").textContent=credits?"Your weighted CGPA is calculated using semester credits.":"Add semester GPA and credits to calculate.";
}
document.getElementById("addSubject").onclick=()=>subjectRow();
document.getElementById("addSemester").onclick=()=>semesterRow();
document.getElementById("saveBtn").onclick=()=>{
  localStorage.setItem("cgpaPro",JSON.stringify({subjects:[...subjects.querySelectorAll(".subject")].map(r=>({name:r.querySelector(".sub-name").value,credit:r.querySelector(".credit").value,grade:r.querySelector(".grade").value})),semesters:[...semesters.querySelectorAll(".semester")].map(r=>({gpa:r.querySelector(".sem-gpa").value,credit:r.querySelector(".sem-credit").value}))}));
  alert("Saved successfully!");
};
document.getElementById("loadBtn").onclick=()=>{
  const d=JSON.parse(localStorage.getItem("cgpaPro")||"null"); if(!d){alert("No saved data found.");return}
  subjects.innerHTML="";semesters.innerHTML="";
  (d.subjects||[]).forEach(x=>subjectRow(x.name,x.credit,x.grade));(d.semesters||[]).forEach(x=>semesterRow(x.gpa,x.credit));calcGPA();calcCGPA();
};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Reset all calculator data?")){subjects.innerHTML="";semesters.innerHTML="";subjectRow();semesterRow();calcGPA();calcCGPA()}};
document.getElementById("printBtn").onclick=()=>window.print();
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("light");document.getElementById("themeBtn").textContent=document.body.classList.contains("light")?"🌙":"☀️";localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("theme")==="light"){document.body.classList.add("light");document.getElementById("themeBtn").textContent="🌙"}
subjectRow();subjectRow();semesterRow();semesterRow();calcGPA();calcCGPA();
