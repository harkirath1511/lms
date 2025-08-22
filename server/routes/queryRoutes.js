import express from "express";
import { createQuery, getQueries, answerQuery, updateQueryStatus } from "../controllers/queryController.js";
import userAuth from "../middleware/userAuth.js";

const queryRouter = express.Router();

// Create a query
queryRouter.post("/", userAuth, createQuery);

// Get all queries
queryRouter.get("/", userAuth,getQueries);

// Answer a query
queryRouter.post("/:id/answer", userAuth ,answerQuery);

// Update query status
queryRouter.patch("/:id/status", userAuth, updateQueryStatus);

export default queryRouter;
