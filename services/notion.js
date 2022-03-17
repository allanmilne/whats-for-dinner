require("dotenv").config();
const { Client } = require("@notionhq/client");

// init Client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;

// display helper functions
function ingredientsToList(page) {
  let ingredientsString = page.properties.Ingredients.rich_text[0].text.content;
  let ingredientsArray = ingredientsString.split("\n");
  let ingredientsList = "";

  ingredientsArray.forEach(function (ingredient) {
    ingredientsList += "<li>" + ingredient + "</li>";
  });

  return ingredientsList;
}

function getIngredients(page) {
  if (page.properties.Ingredients.rich_text[0] === undefined) {
    return "Ingredients have still to be added";
  } else {
    return ingredientsToList(page);
  }
}

function directionsToList(page) {
  let directionsString = page.properties.Directions.rich_text[0].text.content;
  let directionsArray = directionsString.split("\n");
  let directionsList = "";

  directionsArray.forEach(function (direction) {
    directionsList += "<li>" + direction + "</li>";
  });

  return directionsList;
}

function getDirections(page) {
  if (page.properties.Directions.rich_text[0] === undefined) {
    return "Directions have still to be added";
  } else {
    return directionsToList(page);
  }
}

function getTitle(page) {
  // console.log(page.properties);
  if (page.properties.Name.title[0] === undefined) {
    return "Title has still to be added";
  } else {
    return page.properties.Name.title[0].text.content;
  }
}

function getDate(page) {
  if (page.properties.Date.date === null) {
    return "Date has still to be added";
  } else {
    return page.properties.Date.date.start;
  }
}

function getTags(page) {
  return page.properties.Tags.multi_select.map((tags) => tags.name);
}

function getUrl(page) {
  if (page.properties.Source.url === null) {
    return "Recipe source has still to be added";
  } else {
    return page.properties.Source.url;
  }
}

// all recipes
module.exports = async function getRecipes() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: "POST",
  };

  try {
    const { results } = await notion.request(payload);

    return results.map((page) => {
      return {
        id: page.id,
        title: getTitle(page),
        date: getDate(page),
        ingredients: getIngredients(page),
        directions: getDirections(page),
        tags: getTags(page),
        url: getUrl(page),
      };
    });
  } catch (error) {
    console.error(error);
  }
};

// today's recipe
module.exports = async function getTodaysRecipe() {
  try {
    const currentDate = new Date().toISOString();
    let dateAsYearMonthDay = currentDate.split("T");

    const todaysRecipe = await notion.databases.query({
      database_id: `${database_id}`,
      filter: {
        property: "Date",
        date: {
          equals: `${dateAsYearMonthDay[0]}`,
        },
      },
    });

    return {
      id: todaysRecipe.results[0].id,
      title: getTitle(todaysRecipe.results[0]),
      date: getDate(todaysRecipe.results[0]),
      ingredients: getIngredients(todaysRecipe.results[0]),
      directions: getDirections(todaysRecipe.results[0]),
      tags: getTags(todaysRecipe.results[0]),
      url: getUrl(todaysRecipe.results[0]),
    };
  } catch (error) {
    console.error(error);
  }
};
