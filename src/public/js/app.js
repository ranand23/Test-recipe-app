const API_BASE = '/api';

async function loadRecipes() {
  try {
    const res = await fetch(`${API_BASE}/recipes`);
    const data = await res.json();
    if (data.success) renderRecipes(data.data);
  } catch (err) {
    console.error(err);
  }
}

function renderRecipes(recipes) {
  const container = document.getElementById('recipes');
  container.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" onclick="showDetail('${recipe.id}')">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="content">
        <h3>${recipe.name}</h3>
        <p>${recipe.description.substring(0, 80)}...</p>
        <p>⏱️ ${recipe.prep} | ${recipe.difficulty}</p>
      </div>
    </div>
  `).join('');
}

async function showDetail(id) {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  const data = await res.json();
  if (data.success) displayDetail(data.data);
}

function displayDetail(recipe) {
  document.getElementById('recipes').style.display = 'none';
  const detailDiv = document.getElementById('detail');
  
  detailDiv.innerHTML = `
    <button class="back-btn" onclick="closeDetail()">← Back</button>
    <div class="detail-layout">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div>
        <h2>${recipe.name}</h2>
        <p>${recipe.description}</p>
        <p>⏱️ Prep: ${recipe.prep} | 🍳 Cook: ${recipe.cook}</p>
      </div>
    </div>
    <div class="ingredients">
      <h3>📝 Ingredients</h3>
      <ul>${recipe.ingredients.map(i => `<li>${i.item} - ${i.amount}</li>`).join('')}</ul>
    </div>
    <div class="steps">
      <h3>👨‍🍳 Steps</h3>
      <ul>${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  `;
  detailDiv.style.display = 'block';
}

function closeDetail() {
  document.getElementById('recipes').style.display = 'grid';
  document.getElementById('detail').style.display = 'none';
}

loadRecipes();
