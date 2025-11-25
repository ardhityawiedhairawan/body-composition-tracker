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
  male: {
    bmi: { min: 18.5, max: 24.9, rec: '18.5-24.9' },
    bodyFat: { min: 10, max: 20, rec: '10-20%' },
    visceralFat: { min: 1, max: 9, rec: '1-9' },
    subcutaneous: { min: 8, max: 14, rec: '8-14%' },
    trunkSubcutaneous: { min: 10, max: 12, rec: '10-12%' },
    armsFat: { min: 15, max: 20, rec: '15-20%' },
    legsFat: { min: 15, max: 20, rec: '15-20%' },
    skeletalMuscle: { min: 28, rec: '>28%' },
    skeletalTrunk: { min: 28, rec: '>28%' },
    skeletalArms: { min: 28, rec: '>28%' },
    skeletalLegs: { min: 50, rec: '>50%' },
    bmr: { min: 1500, max: 1800, rec: '1500-1800' }
  },
  female: {
    bmi: { min: 18.5, max: 24.9, rec: '18.5-24.9' },
    bodyFat: { min: 25, max: 31, rec: '25-31%' },
    visceralFat: { min: 1, max: 9, rec: '1-9' },
    subcutaneous: { min: 18, max: 28, rec: '18-28%' },
    trunkSubcutaneous: { min: 16, max: 20, rec: '16-20%' },
    armsFat: { min: 22, max: 28, rec: '22-28%' },
    legsFat: { min: 18, max: 22, rec: '18-22%' },
    skeletalMuscle: { min: 22, rec: '>22%' },
    skeletalTrunk: { min: 20, rec: '>20%' },
    skeletalArms: { min: 25, rec: '>25%' },
    skeletalLegs: { min: 40, rec: '>40%' },
    bmr: { min: 1200, max: 1500, rec: '1200-1500' }
  },
  general: {
    bodyAge: { rec: '≤ actual age' }
  }
};

const getProfile = ()=>JSON.parse(localStorage.getItem('profile')||'null');
const setProfile = prof=>localStorage.setItem('profile',JSON.stringify(prof));
const getData = ()=>JSON.parse(localStorage.getItem('measurements')||'[]');
const setData = arr=>localStorage.setItem('measurements',JSON.stringify(arr));

const showModal = (id)=>new bootstrap.Modal(document.getElementById(id)).show();
const hideModal = (id)=>bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();

function renderProfileHeader() {
  let prof = getProfile();
  document.getElementById('userName').textContent = prof ? `Hello, ${prof.name} (${prof.gender}) | ${prof.height} cm | Age: ${prof.age}` : '';
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
        <td>${row.bodyFat}</td>
        <td>${row.visceralFat}</td>
        <td>${row.bodyAge}</td>
        <td>
         <a href="#" data-no="${idx}" class="btn btn-sm btn-outline-info"><i data-no="${idx}" class="bi bi-eye viewBtn"></i> </a>
          <a href="#" data-no="${idx}" class="btn btn-sm btn-outline-danger ms-1"><i data-no="${idx}" class="bi bi-trash delBtn"></i></a> 
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
    age: parseInt(f.age.value),
    gender: f.gender.value
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
  f.gender.value = prof.gender||'';
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
  const profileHeader = [
    `Name: ${prof.name}`,
    `Age: ${prof.age}`,
    `Height (cm): ${prof.height}`,
    "" 
  ];
  const csvHeader = [
    "Date", "Weight (kg)", "BMI", "Body Fat (%)", "Visceral Fat", "Body Age",
    "Subcutaneous Fat (%)", "Trunk Subcutaneous (%)", "Arms Fat (%)", "Legs Fat (%)",
    "Skeletal Muscle (%)", "Skeletal Trunk (%)", "Skeletal Arms (%)", "Skeletal Legs (%)",
    "BMR (kcal)"
  ];
  const rows = arr.map(row =>
    [
      row.date, row.weight || '', row.bmi, row.bodyFat, row.visceralFat, row.bodyAge,
      row.subcutaneous, row.trunkSubcutaneous, row.armsFat, row.legsFat,
      row.skeletalMuscle, row.skeletalTrunk, row.skeletalArms, row.skeletalLegs,
      row.bmr
    ]
  );
  let csv = profileHeader.join("\n") + "\n"
    + csvHeader.join(",") + "\n"
    + rows.map(r=>r.join(",")).join("\n");
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
    console.log("loading...")
    let idx = parseInt(e.target.dataset.no,10);
    let data = getData()[idx];
    let prof = getProfile();
    if (!prof || !prof.gender) {
      alert("Please set your gender in the profile to get an accurate assessment.");
      return;
    }

    const genderSpecificRec = rekomendasi[prof.gender];
    const allParams = { ...paramLabels };

    let hasil = Object.keys(allParams).map(param=>{
      let v = data[param];
      let key = paramLabels[param] || param;
      let recData = genderSpecificRec[param] || rekomendasi.general[param];
      let status = "N/A";
      let recText = "-";

      if (recData) {
        recText = recData.rec;
        if (param === 'bodyAge') {
          status = v <= prof.age ? 'Good' : 'Needs Attention';
        } else if (recData.min && recData.max) {
          status = (v >= recData.min && v <= recData.max) ? 'Good' : 'Needs Attention';
        } else if (recData.min) {
          status = v >= recData.min ? 'Good' : 'Needs Attention';
        }
      }

      return {
        label: key,
        desc: paramDesc[key] || "",
        value: v != null ? v : "-",
        status,
        rec: recText
      }
    });
    let html = `${prof.name} (${prof.gender}, ${prof.age} | ${prof.height} cm)
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

document.getElementById('printFormBtn').onclick = function(){
  generatePrintableForms();
  window.print();
};

function generatePrintableForms() {
  const printableArea = document.getElementById('printableArea');
  const formTemplate = printableArea.querySelector('.printable-form');
  if (!formTemplate) return;

  const templateHTML = formTemplate.innerHTML;
  printableArea.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const newForm = document.createElement('div');
    newForm.className = 'printable-form';
    newForm.innerHTML = templateHTML;
    printableArea.appendChild(newForm);
  }
}


renderTable();
