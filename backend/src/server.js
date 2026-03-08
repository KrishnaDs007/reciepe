import express from "express";
import { eq, and } from "drizzle-orm";
import { ENV } from "./config/env.js";
import { db } from "./db/db.js";
import { favoritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: true, message: "Server is running" });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title || !image || !cookTime || !servings) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const result = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();
    res.status(201).json({
      status: true,
      message: "Recipe added to favorites",
      data: result[0],
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Failed to add recipe to favorites" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const result = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, Number(recipeId)),
        ),
      )
      .returning();
    res.status(200).json({
      status: true,
      message: "Recipe deleted from favorites",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: false,
        message: "Failed to delete recipe from favorites",
      });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    res.status(200).json({
      status: true,
      message: "Favorites fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch favorites" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
