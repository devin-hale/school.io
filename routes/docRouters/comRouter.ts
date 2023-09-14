import express from "express";
import comController from "../../controllers/docTypes/comController.js";

const router = express.Router();

router.get("/:comId", comController.get_communication_page);

export default router;
