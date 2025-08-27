const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/gallery/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const [images] = await pool.execute('SELECT * FROM gallery ORDER BY uploaded_at DESC');
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gallery image by ID
router.get('/:id', async (req, res) => {
  try {
    const [images] = await pool.execute('SELECT * FROM gallery WHERE id = ?', [req.params.id]);

    if (images.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(images[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload gallery image (admin only)
router.post('/', auth(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const image_path = req.file ? req.file.path : null;

    const [result] = await pool.execute(
      'INSERT INTO gallery (title, image_path) VALUES (?, ?)',
      [title, image_path]
    );

    res.status(201).json({ message: 'Image uploaded successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update gallery image (admin only)
router.put('/:id', auth(['admin']), upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const image_path = req.file ? req.file.path : null;

    const [result] = await pool.execute(
      'UPDATE gallery SET title = ?, image_path = ? WHERE id = ?',
      [title, image_path, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM gallery WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
