import express from "express";
import {authentication} from "../middlewares/authentication.js";

const router = express.Router()

router.get("/school", authentication, getSchoolDashboardController)