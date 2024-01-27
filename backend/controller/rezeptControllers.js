import UserSchema from "../models/rezeptSchema.js";

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await UserSchema.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send("Fehler beim Abrufen der Recipe: " + error.message);
  }
};

export const createUser = async (req, res) => {
  const userData = req.body;
  const user = new UserSchema(userData);
  try {
    await user.save();
    res.send("user gespeichert");
  } catch (error) {
    console.error(error);
  }
};

export const createRecipe = async (req, res) => {
  console.log("Hallo Welt", req.body);
  try {
    const recipeData = req.body;
    const userId = "65a66c5ddc5bf3e33f495cd6"; 

    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.recipes.push(recipeData);

    await user.save();
    res.send("Recipe saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipeId = req.params.recipeId;
    console.log("userId", userId);
    console.log("recepiId", recipeId);
    await UserSchema.updateOne(
      { _id: userId },
      { $pull: { recipes: { _id: recipeId } } }
    );
    res.send("Daten gelösht");
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};

export const updateRecipe = async (req, res) => {
  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
  const recipeUpdate = req.body;
  try {
    await UserSchema.findOneAndUpdate(
      { _id: userId, "recipes._id": recipeId },
      {
        $set: {
          "recipes.$.title": recipeUpdate.title,
          "recipes.$.ingredients": recipeUpdate.ingredients,
          "recipes.$.steps": recipeUpdate.steps,
          "recipes.$.time": recipeUpdate.time,
          "recipes.$.difficulty": recipeUpdate.difficulty,
        },
      }
    );
    res.send("Recipe updated");
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send("Internal Server Error");
  }
};
