const API = 'https://script.google.com/macros/s/AKfycbwGDHuPlhPiyTKzFU3sRneBv2m8zYMZTwtVulHiJl0pB7y545AVKd01rZkbds4ZDxnZYQ/exec'; // your Apps Script URL

// Edit this for your items:
const ITEMS = [
  { id: 'laundry',  label: 'Do the laundry' },
  { id: 'draft',    label: 'Write first draft' },
  { id: 'exercise', label: 'Go for a run' },
];

async function fetchState() {
  const res = await fetch(API);
  return res.json();
}

async function updateItem(id, status) {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  loadAndRender();
}

document.getElementById('reset').onclick = () => {
  ITEMS.forEach(i => updateItem(i.id, 'pending'));
};

async function loadAndRender() {
  const state = await fetchState();
  ['pending','done','disregarded'].forEach(cat => {
    const ul = document.getElementById(cat);
    ul.innerHTML = '';
    ITEMS.filter(i => (state[i.id] || 'pending') === cat)
         .forEach(i => {
           const li = document.createElement('li');
           li.textContent = i.label;
           if (cat === 'pending') {
             const done = Object.assign(document.createElement('button'), {textContent:'✔️'});
             done.onclick = () => updateItem(i.id,'done');
             const skip = Object.assign(document.createElement('button'), {textContent:'✖️'});
             skip.onclick = () => updateItem(i.id,'disregarded');
             li.append(done, skip);
           }
           ul.append(li);
         });
  });
}

loadAndRender();
