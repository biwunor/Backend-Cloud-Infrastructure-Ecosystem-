'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Create user
router.post('/', async (req, res, next) => {
  try {
    const existingUser = await db.getUserByEmail(req.body.email);
    
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    const newUser = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    await db.createUser(newUser);
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = {
      ...user,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await db.updateUser(id, updatedUser);
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Get user activity
router.get('/:id/activity', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const activity = await db.getUserActivity(id);
    
    res.status(200).json(activity);
  } catch (error) {
    next(error);
  }
});

// Update user preferences
router.put('/:id/preferences', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...req.body
      },
      updatedAt: new Date().toISOString()
    };
    
    await db.updateUser(id, updatedUser);
    
    // Only return the preferences
    res.status(200).json(updatedUser.preferences);
  } catch (error) {
    next(error);
  }
});

module.exports = router;