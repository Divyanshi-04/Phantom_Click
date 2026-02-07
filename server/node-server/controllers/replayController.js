const replayService = require("../services/scam-replay/replayService");

exports.buildReplay = async (req, res) => {
  try {
    const report = req.body;

    const replayJson = await replayService.buildReplay(report);

    res.json(replayJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Replay build failed" });
  }
};
