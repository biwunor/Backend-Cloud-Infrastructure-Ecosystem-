'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');

// Get all waste items
router.get('/', async (req, res, next) => {
  try {
    const result = await db.getAllWasteItems();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Get waste item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.getWasteItemById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Waste item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
});

// Create new waste item
router.post('/', async (req, res, next) => {
  try {
    const newItem = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    await db.createWasteItem(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// Update waste item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.getWasteItemById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Waste item not found' });
    }
    
    const updatedItem = {
      ...item,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await db.updateWasteItem(id, updatedItem);
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// Delete waste item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db.getWasteItemById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Waste item not found' });
    }
    
    await db.deleteWasteItem(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;