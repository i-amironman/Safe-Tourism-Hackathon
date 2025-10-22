
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// GET /user/favorites - Get all favorites for logged-in user
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      favorites: result.rows
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites'
    });
  }
});

// POST /user/favorites - Add a new favorite
router.post('/favorites', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { place } = req.body;
    
    if (!place || !place.name || place.latitude === undefined || place.longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Invalid place data. Required: name, latitude, longitude'
      });
    }
    
    // Check if favorite already exists
    const existing = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND latitude = $2 AND longitude = $3',
      [userId, place.latitude, place.longitude]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'This place is already in your favorites'
      });
    }
    
    // Insert new favorite
    const result = await pool.query(
      `INSERT INTO favorites (user_id, place_name, latitude, longitude, notes) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        userId,
        place.name,
        place.latitude,
        place.longitude,
        place.notes || JSON.stringify(place.tags || {})
      ]
    );
    
    res.status(201).json({
      success: true,
      favorite: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite'
    });
  }
});

// DELETE /user/favorites/:id - Remove a favorite
router.delete('/favorites/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const favoriteId = req.params.id;
    
    // Ensure the favorite belongs to the user
    const result = await pool.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *',
      [favoriteId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found or does not belong to you'
      });
    }
    
    res.json({
      success: true,
      message: 'Favorite removed successfully',
      favorite: result.rows[0]
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove favorite'
    });
  }
});

// POST /user/journeys - Save a journey/trip
router.post('/journeys', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { title, description, destinations, start, end, mode, distance, duration, riskScore, metadata } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    // Build destinations JSON object
    const destinationsData = {
      destinations: destinations || [],
      start: start || null,
      end: end || null,
      mode: mode || 'car',
      distance: distance || null,
      duration: duration || null,
      riskScore: riskScore !== undefined ? riskScore : null,
      metadata: metadata || {}
    };
    
    const result = await pool.query(
      `INSERT INTO journeys (user_id, title, description, destinations) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [
        userId,
        title,
        description || '',
        JSON.stringify(destinationsData)
      ]
    );
    
    res.status(201).json({
      success: true,
      journey: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving journey:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save journey'
    });
  }
});

// GET /user/journeys - Get all journeys for logged-in user
router.get('/journeys', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const result = await pool.query(
      'SELECT * FROM journeys WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      journeys: result.rows
    });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journeys'
    });
  }
});

module.exports = router;
