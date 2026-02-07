const router = require("express").Router();
const controller = require("../controllers/replayController");

router.post("/build", controller.buildReplay);

module.exports = router;
