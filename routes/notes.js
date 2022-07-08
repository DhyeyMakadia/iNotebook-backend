const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

const ValidateNotes = [
  body("title", "Title cannot be null").exists(),
  body("description", "Description must be 6 characters long").isLength({
    min: 6,
  }),
];

// ROUTE 1: Get All Notes using: GET "/api/notes/getnotes". Login Required
router.get("/getnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a Note using: POST "/api/notes/addnote". Login Required
router.post("/addnote", fetchuser, ValidateNotes, async (req, res) => {
  // IF there are errors, return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tag } = req.body;
    const savedNote = await Notes.create({
      title,
      description,
      tag,
      user: req.user.id,
    });
    res.json(savedNote);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Update a Note using: PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id", fetchuser, ValidateNotes, async (req, res) => {
  // IF there are errors, return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tag } = req.body;
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow to Update Note only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete a Note using: Delete "/api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow to Delete Note only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
