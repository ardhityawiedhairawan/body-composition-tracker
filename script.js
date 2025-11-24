const paramLabels = {
  weight: "Weight (kg)",
  bmi: "BMI",
  bodyFat: "Body Fat (%)",
  visceralFat: "Visceral Fat",
  bodyAge: "Body Age",
  subcutaneous: "Subcutaneous Fat (%)",
  trunkSubcutaneous: "Trunk Subcutaneous (%)",
  armsFat: "Arms Fat (%)",
  legsFat: "Legs Fat (%)",
  skeletalMuscle: "Skeletal Muscle (%)",
  skeletalTrunk: "Skeletal Trunk (%)",
  skeletalArms: "Skeletal Arms (%)",
  skeletalLegs: "Skeletal Legs (%)",
  bmr: "BMR (kcal)"
};

const paramDesc = {
  BMI: "Indeks Massa Tubuh. Rasio berat badan (kg) dibagi tinggi badan kuadrat (m²).",
  "Body Fat (%)": "Persentase berat badan Anda yang merupakan lemak tubuh.",
  "Visceral Fat": "Perkiraan jumlah lemak yang tersimpan di sekitar organ dalam.",
  "Body Age": "Usia tubuh berdasarkan komposisi tubuh menurut alat, bukan usia sebenarnya.",
  "Subcutaneous Fat (%)": "Lemak di bawah kulit sebagai persentase dari total berat badan.",
  "Trunk Subcutaneous (%)": "Persentase lemak di bawah kulit pada bagian tubuh/trunk.",
  "Arms Fat (%)": "Persentase lemak pada lengan.",
  "Legs Fat (%)": "Persentase lemak pada bagian kaki.",
  "Skeletal Muscle (%)": "Persentase otot rangka terhadap total berat badan.",
  "Skeletal Trunk (%)": "Persentase otot rangka di bagian tubuh/trunk.",
  "Skeletal Arms (%)": "Persentase otot rangka di lengan.",
  "Skeletal Legs (%)": "Persentase otot rangka di bagian kaki.",
  "BMR (kcal)": "Laju Metabolisme Basal. Jumlah kalori yang dibakar tubuh saat istirahat."
};

const rekomendasi = {
  bmi: { min: 18.5, max: 24.9, status: v=>(v>=18.5 && v<=24.9?'Good':'Needs Attention'), rec: '18.5-24.9' },
  bodyFat: { min: 10, max: 20, status: v=>(v>=10 && v<=20?'Good':'Needs Attention'), rec: '10-20%' },
  visceralFat: { min: 1, max: 9, status: v=>(v>=1&&v<=9?'Good':'Needs Attention'), rec: '1-9' },
  bodyAge: { status: (v,age)=>(v<=age?'Good':'Needs Attention'), rec: '≤ actual age' },
  subcutaneous: { min: 12, max: 14, status: v=>(v>=12&&v<=14?'Good':'Needs Attention'), rec:'12-14%' },
  trunkSubcutaneous: { min: 10, max: 12, status: v=>(v>=10&&v<=12?'Good':'Needs Attention'), rec:'10-12%' },
  armsFat: { min: 15, max: 20, status: v=>(v>=15&&v<=20?'Good':'Needs Attention'), rec:'15-20%' },
  legsFat: { min: 15, max: 20, status: v=>(v>=15&&v<=20?'Good':'Needs Attention'), rec:'15-20%' },
  skeletalMuscle: { min: 30, status: v=>(v>=30?'Good':'Needs Attention'), rec:'>30%' },
  skeletalTrunk: { status: v=>(v>=25?'Good':'Needs Attention'), rec:'Higher is better' },
  skeletalArms: { status: v=>(v>=35?'Good':'Needs Attention'), rec:'Higher is better' },
  skeletalLegs: { status: v=>(v>=50?'Good':'Needs Attention'), rec:'Higher is better' },
  bmr: { min:1400, max:1700, status:v=>(v>=1400&&v<=1700?'Good':'Needs Attention'), rec:'1400-1700' }
};

const getProfile = ()=>JSON.parse(localStorage.getItem('profile')||'null');
const setProfile = prof=>localStorage.setItem('profile',JSON.stringify(prof));
const getData = ()=>JSON.parse(localStorage.getItem('measurements')||'[]');
const setData = arr=>localStorage.setItem('measurements',JSON.stringify(arr));

const showModal = (id)=>new bootstrap.Modal(document.getElementById(id)).show();
const hideModal = (id)=>bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();

function renderProfileHeader() {
  let prof = getProfile();
  document.getElementById('userName').textContent = prof ? `Hello, ${prof.name} | ${prof.height} cm | Age: ${prof.age})` : '';
}

function renderTable() {
  let arr = getData();
  arr.sort((a,b)=>b.date.localeCompare(a.date));
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = '';
  if(arr.length === 0) {
    document.getElementById('emptyState').textContent = "No measurement history yet.";
  } else {
    document.getElementById('emptyState').textContent = "";
    arr.forEach((row,idx)=>{
      let tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.weight || ''}</td>
        <td>${row.bodyFat}</td>
        <td>${row.visceralFat}</td>
        <td>${row.bodyAge}</td>
        <td>
          <button data-no="${idx}" class="btn btn-sm btn-info viewBtn">View</button>
          <button data-no="${idx}" class="btn btn-sm btn-danger delBtn ms-1">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

if(!getProfile()){
  showModal('profileModal');
}
renderProfileHeader();

document.getElementById('profileForm').onsubmit = function(e){
  e.preventDefault();
  const f = e.target;
  setProfile({
    name: f.name.value,
    height: parseInt(f.height.value),
    age: parseInt(f.age.value) 
  });
  renderProfileHeader();
  hideModal('profileModal');
  renderTable();
};

document.getElementById('editProfileBtn').onclick = function() {
  let prof = getProfile() || {};
  let f = document.getElementById('profileForm');
  f.name.value = prof.name||'';
  f.age.value = prof.age||'';
  f.height.value = prof.height||'';
  showModal('profileModal');
};

document.getElementById('addBtn').onclick = function(){
  document.getElementById('inputForm').reset();
  showModal('inputModal');
};

document.getElementById('inputForm').onsubmit = function(e){
  e.preventDefault();
  const f = e.target;
  let obj = {
    date: f.date.value,
    weight: parseFloat(f.weight.value),
    bmi: parseFloat(f.bmi.value),
    bodyFat: parseFloat(f.bodyFat.value),
    visceralFat: parseFloat(f.visceralFat.value),
    bodyAge: parseFloat(f.bodyAge.value),
    subcutaneous: parseFloat(f.subcutaneous.value),
    trunkSubcutaneous: parseFloat(f.trunkSubcutaneous.value),
    armsFat: parseFloat(f.armsFat.value),
    legsFat: parseFloat(f.legsFat.value),
    skeletalMuscle: parseFloat(f.skeletalMuscle.value),
    skeletalTrunk: parseFloat(f.skeletalTrunk.value),
    skeletalArms: parseFloat(f.skeletalArms.value),
    skeletalLegs: parseFloat(f.skeletalLegs.value),
    bmr: parseFloat(f.bmr.value)
  };
  let arr = getData(); arr.push(obj); setData(arr);
  hideModal('inputModal');
  renderTable();
};

document.getElementById('exportBtn').onclick = function(){
  let arr = getData();
  let prof = getProfile();
  if(arr.length === 0 || !prof) {
    alert("No data or profile to export!");
    return;
  }
  // Profile info at the top
  const profileHeader = [
    `Name: ${prof.name}`,
    `Age: ${prof.age}`,
    `Height (cm): ${prof.height}`,
    "" // empty line for separation
  ];
  // CSV header
  const csvHeader = [
    "Date", "Weight (kg)", "BMI", "Body Fat (%)", "Visceral Fat", "Body Age",
    "Subcutaneous Fat (%)", "Trunk Subcutaneous (%)", "Arms Fat (%)", "Legs Fat (%)",
    "Skeletal Muscle (%)", "Skeletal Trunk (%)", "Skeletal Arms (%)", "Skeletal Legs (%)",
    "BMR (kcal)"
  ];
  // Map each row to CSV format
  const rows = arr.map(row =>
    [
      row.date, row.weight || '', row.bmi, row.bodyFat, row.visceralFat, row.bodyAge,
      row.subcutaneous, row.trunkSubcutaneous, row.armsFat, row.legsFat,
      row.skeletalMuscle, row.skeletalTrunk, row.skeletalArms, row.skeletalLegs,
      row.bmr
    ]
  );
  // Combine all
  let csv = profileHeader.join("\n") + "\n"
    + csvHeader.join(",") + "\n"
    + rows.map(r=>r.join(",")).join("\n");
  // Download as file
  let blob = new Blob([csv],{type:'text/csv'});
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'body-composition-history.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



document.querySelector("tbody").onclick = function(e){
  if(e.target.classList.contains('viewBtn')){
    let idx = parseInt(e.target.dataset.no,10);
    let data = getData()[idx];
    let prof = getProfile();
    let hasil = Object.keys(rekomendasi).map(param=>{
      let v = data[param];
      let key = paramLabels[param] || param;
      let status = param === "bodyAge" ?
        rekomendasi[param].status(v, prof?prof.age:null) :
        rekomendasi[param].status(v);
      return {
        label: key,
        desc: paramDesc[key]||"",
        value: v!=null?v:"-",
        status,
        rec:rekomendasi[param].rec
      }
    });
    let html = `${prof.name} (${prof.age} | ${prof.height} cm)
    <div><b>Date:</b> ${data.date}</div>
    <table class="table table-sm table-responsive">
    <thead><tr>
      <th>Parameter</th><th>Value</th><th>Status</th><th>Reference</th>
    </tr></thead><tbody>`;
    hasil.forEach(r=>{
      html+=`<tr class="${r.status==="Good"?"table-success":"table-warning"}">
        <td>
          <span data-bs-toggle="tooltip" title="${r.desc}">
            ${r.label}
          </span>
        </td>
        <td>${r.value}</td>
        <td>${r.status}</td>
        <td>${r.rec}</td>
      </tr>`;
    });
    html+=`</tbody></table>`;
    document.getElementById('detailContent').innerHTML = html;

    // Activate Bootstrap tooltip for all relevant elements
    setTimeout(() => {
      let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 150);

    showModal('viewModal');
  }
  if(e.target.classList.contains('delBtn')){
    if(confirm("Are you sure you want to delete this data?")){
      let idx = parseInt(e.target.dataset.no,10);
      let arr = getData();
      arr.splice(idx,1); setData(arr);
      renderTable();
    }
  }
};

renderTable();

