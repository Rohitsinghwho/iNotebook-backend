const express = require("express");
//required validation to check whether the notes accessed belong to the particular user
const { body, validationResult } = require("express-validator");
//fetching user
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
// const User = require('../models/User');

const router = express.Router();

//  Route :1 Fetching all notes ofthe  user /api/notes/fetchallnotes - login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    //trying to find the note belonging to the particular user by email
    const notes = await Note.find({ user: req.user.email });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
  }
});
//  Route :2 adding notes /api/notes/addnotes - login required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a Better title").isLength({ min: 3 }),
    body("description", "Enter a valid Description").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      //taking all the compulsory entries from the body
      const { title, description, tag } = req.body;
      const results = validationResult(req);
      // if there are error
      if (!results.isEmpty()) {
        return res.status(400).json({ error: results.array() });
      }
      //creating a new note to add
      const notes = new Note({
        title,
        description,
        tag,
        user: req.user.email,
      });
      //saving the note
      const savedNote = await notes.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal error occured");
    }
  }
);
// Route :3 update the user details /api/notes/updatenotes/id - login required
router.put("/updatenotes/:email", fetchuser, async (req, res) => {
  //taking out all the neccessary details from the body
  const { title, description, tag } = req.body;
  // creating a new note
  try {
    const newnote = {};
    //apending the details
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    //find the note
    let note = await Note.findById(req.params.email);
    //checking if the note exists
    if (!note) {
      return res.status(401).send("not found");
    }
    //checking if the note fetched belongs to the particular user?
    if (note.user.toString() !== req.user.email) {
      return res.status(401).send("not allowed");
    }
    //upadating the note
    note = await Note.findByIdAndUpdate(
      req.params.email,
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
  }
});

// Route :4 Delete the user details /api/notes/deletenotes/id - login required
router.delete("/deletenotes/:email", fetchuser, async (req, res) => {
  try {
    //find the note
    let note = await Note.findById(req.params.email);
    //checking if the note exists
    if (!note) {
      return res.status(401).send("not found");
    }
    //checking if the note fetched belongs to the particular user?
    if (note.user.toString() !== req.user.email) {
      return res.status(401).send("not allowed");
    }
    //deleting the note
    note = await Note.findByIdAndDelete(req.params.email);
    res.json({ success: "note has been deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal error occured");
  }
});

module.exports = router;
