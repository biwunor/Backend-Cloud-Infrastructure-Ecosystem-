'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');

// Get all disposal locations
router.get('/', async (req, res, next) => {
  try {
    const result = await db.getAllLocations();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Get locations by type
router.get('/type/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const locations = await db.getLocationsByType(type);
    
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
});

// Get location by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await db.getLocationById(id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
});

// Get locations by proximity
router.get('/nearby', async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const locations = await db.getNearbyLocations(parseFloat(lat), parseFloat(lng), parseFloat(radius));
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
});

// Create new location
router.post('/', async (req, res, next) => {
  try {
    const newLocation = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    await db.createLocation(newLocation);
    res.status(201).json(newLocation);
  } catch (error) {
    next(error);
  }
});

// Update location
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await db.getLocationById(id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    const updatedLocation = {
      ...location,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await db.updateLocation(id, updatedLocation);
    res.status(200).json(updatedLocation);
  } catch (error) {
    next(error);
  }
});

// Delete location
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await db.getLocationById(id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    await db.deleteLocation(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;