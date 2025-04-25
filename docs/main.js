const API = 'https://script.google.com/macros/s/AKfycbwW_X8nbHJy2ZOGn2LoqqqqF9Za6byp_zo3c_lOsIM824vNJLrjsgjx4Z2RwmeCgQofDA/exec'; // your Apps Script URL

// Your fixed list — just edit here to add/remove items:
const ITEMS = [
  { id: 'laundry',  label: 'Do the laundry' },
  { id: 'draft',    label: 'Write first draft' },
  { id: 'exercise', label: 'Go for a run' },
];

async function fetchState() {
  console.log('🔄 fetchState() called');
  try {
    const res = await fetch(API);
    const data = await res.json();
    console.log('📥 fetchState result:', data);
    return data;
  } catch (err) {
    console.error('❗️ fetchState error:', err);
    return {};
  }
}

async function updateItem(id, status) {
  console.log(`✏️ updateItem() called for id="${id}", status="${status}"`);
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    console.log('📤 updateItem response:', data);
  } catch (err) {
    console.error('❗️ updateItem error:', err);
  }
  // reload state & UI
  loadAndRender();
}

document.getElementById('reset').onclick = () => {
  console.log('🔁 Reset button clicked');
  ITEMS.forEach(i => updateItem(i.id, 'pending'));
};

async function loadAndRender() {
  console.log('▶️ loadAndRender()');
  const state = await fetchState();

  ['pending','done','disregarded'].forEach(cat => {
    const ul = document.getElementById(cat);
    ul.innerHTML = '';

    ITEMS
      .filter(i => (state[i.id] || 'pending') === cat)
      .forEach(i => {
        const li = document.createElement('li');
        li.textContent = i.label;

        if (cat === 'pending') {
          const doneBtn = document.createElement('button');
          done
