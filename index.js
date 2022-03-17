const express = require("express");
const getRecipes = require("./services/notion");
const getTodaysRecipe = require("./services/notion");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static('public'))

app.get('/recipes', async (req, res) => {
  const recipes = await getRecipes()
  res.json(recipes)
})

app.get('/today', async (req, res) => {
  const todaysRecipe = await getTodaysRecipe()
  res.json(todaysRecipe)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))
