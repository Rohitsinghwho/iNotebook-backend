const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
// const User = require('../models/User');

const router = express.Router();

//  Route :1 Fetching all notes ofthe  user /api/notes/fetchallnotes - login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.email });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
  }
});
//  Route :2 adding notes /api/notes/addnotes - login required
router.post(
  "/addnotes",fetchuser,
  [
    body("title", "Enter a Better title").isLength({ min: 3 }),
    body("description", "Enter a valid Description").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const results = validationResult(req);
      // if there are error
      if (!results.isEmpty()) {
        return res.status(400).json({ error: results.array() });
      }

      const notes = new Note({
        title,
        description,
        tag,
        user: req.user.email,
      });
      const savedNote = await notes.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal error occured");
    }
  }
);

module.exports = router;
