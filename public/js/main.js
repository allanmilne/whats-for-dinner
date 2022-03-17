const recipesElement = document.querySelector("#recipes");
const loadingElement = document.querySelector("#loading");
let loading = false;

// const getRecipesFromBackend = async () => {
//   loading = true;
//   const res = await fetch("http://localhost:5001/recipes");
//   const data = await res.json();
//   loading = false;
//
//   return data;
// };

const getTodaysRecipeFromBackend = async () => {
  loading = true;
  const res = await fetch("http://localhost:5001/today");
  const data = await res.json();
  loading = false;

  return data;
};

const addTodaysRecipeToDom = async () => {
  const recipe = await getTodaysRecipeFromBackend();

  if (!loading) {
    loadingElement.innerHTML = "";
  }

  const div = document.createElement("div");
  div.className = "recipe";
  div.innerHTML = `
        <h2>${recipe.title}</h2>
        <ul>
          <li><strong>Cooking on: </strong> ${recipe.date}</li>
        </ul>
        <br>
        <h3>Instructions: </h3>
        <ul>
          ${recipe.ingredients}
        </ul>
        <br>
        <h3>Directions: </h3>
        <ol>
          ${recipe.directions}
        </ol>
        <div>
          <a href="${recipe.url}">Source</a>
        </div>
    `;
  recipesElement.appendChild(div);
};

addTodaysRecipeToDom();

// const addRecipesToDom = async () => {
//   const recipes = await getRecipesFromBackend();
//
//   if (!loading) {
//     loadingElement.innerHTML = "";
//   }
//
//   recipes.forEach((recipe) => {
//     const div = document.createElement("div");
//     div.className = "recipe";
//     div.innerHTML = `
//         <h2>${recipe.title}</h2>
//         <ul>
//           <li><strong>Cooking on: </strong> ${recipe.date}</li>
//         </ul>
//         <br>
//         <h3>Instructions: </h3>
//         <ul>
//           ${recipe.ingredients}
//         </ul>
//         <br>
//         <h3>Directions: </h3>
//         <ol>
//           ${recipe.directions}
//         </ol>
//         <div>
//           <a href="${recipe.url}">Source</a>
//         </div>
// <!--        <div class="tags">${recipe.tags}</div>-->
//     `;
//     recipesElement.appendChild(div);
//   });
// };
//
// addRecipesToDom();
