import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertWasteRecordSchema, 
  insertCollectionSchema,
  insertReminderSchema,
  insertDisposalLocationSchema,
  insertRecyclingTipSchema,
  insertEducationalResourceSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Waste record routes
  app.post("/api/waste-records", async (req: Request, res: Response) => {
    try {
      const recordData = insertWasteRecordSchema.parse(req.body);
      const record = await storage.createWasteRecord(recordData);
      return res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid waste record data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create waste record" });
    }
  });
  
  app.get("/api/waste-records", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check for date range if provided
      const startDateStr = req.query.startDate as string | undefined;
      const endDateStr = req.query.endDate as string | undefined;
      
      if (startDateStr && endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
        
        const records = await storage.getWasteRecordsByDateRange(userId, startDate, endDate);
        return res.json(records);
      } else {
        const records = await storage.getWasteRecords(userId);
        return res.json(records);
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch waste records" });
    }
  });
  
  // Collection routes
  app.post("/api/collections", async (req: Request, res: Response) => {
    try {
      const collectionData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(collectionData);
      return res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid collection data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create collection" });
    }
  });
  
  app.get("/api/collections", async (req: Request, res: Response) => {
    try {
      const collections = await storage.getCollections();
      return res.json(collections);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch collections" });
    }
  });
  
  app.get("/api/collections/upcoming", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const upcomingCollections = await storage.getUpcomingCollections(limit);
      return res.json(upcomingCollections);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch upcoming collections" });
    }
  });
  
  // Reminder routes
  app.post("/api/reminders", async (req: Request, res: Response) => {
    try {
      const reminderData = insertReminderSchema.parse(req.body);
      const reminder = await storage.createReminder(reminderData);
      return res.status(201).json(reminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reminder data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create reminder" });
    }
  });
  
  app.get("/api/reminders", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const reminders = await storage.getRemindersByUser(userId);
      return res.json(reminders);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });
  
  app.patch("/api/reminders/:id", async (req: Request, res: Response) => {
    try {
      const reminderId = parseInt(req.params.id);
      if (isNaN(reminderId)) {
        return res.status(400).json({ message: "Invalid reminder ID" });
      }
      
      const { isActive } = req.body;
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: "isActive must be a boolean" });
      }
      
      const updatedReminder = await storage.updateReminderStatus(reminderId, isActive);
      if (!updatedReminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      return res.json(updatedReminder);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update reminder" });
    }
  });
  
  // Disposal location routes
  app.post("/api/disposal-locations", async (req: Request, res: Response) => {
    try {
      const locationData = insertDisposalLocationSchema.parse(req.body);
      const location = await storage.createDisposalLocation(locationData);
      return res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create disposal location" });
    }
  });
  
  app.get("/api/disposal-locations", async (req: Request, res: Response) => {
    try {
      const locations = await storage.getDisposalLocations();
      return res.json(locations);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch disposal locations" });
    }
  });
  
  app.get("/api/disposal-locations/nearby", async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      const limit = parseInt(req.query.limit as string) || 5;
      
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ message: "Invalid latitude or longitude" });
      }
      
      const nearbyLocations = await storage.getNearbyDisposalLocations(lat, lon, limit);
      return res.json(nearbyLocations);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch nearby disposal locations" });
    }
  });
  
  // Recycling tip routes
  app.post("/api/recycling-tips", async (req: Request, res: Response) => {
    try {
      const tipData = insertRecyclingTipSchema.parse(req.body);
      const tip = await storage.createRecyclingTip(tipData);
      return res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tip data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create recycling tip" });
    }
  });
  
  app.get("/api/recycling-tips", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (category) {
        const tips = await storage.getRecyclingTipsByCategory(category);
        return res.json(tips);
      } else {
        const tips = await storage.getRecyclingTips(limit);
        return res.json(tips);
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch recycling tips" });
    }
  });
  
  // Educational resource routes
  app.post("/api/educational-resources", async (req: Request, res: Response) => {
    try {
      const resourceData = insertEducationalResourceSchema.parse(req.body);
      const resource = await storage.createEducationalResource(resourceData);
      return res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create educational resource" });
    }
  });
  
  app.get("/api/educational-resources", async (req: Request, res: Response) => {
    try {
      const resourceType = req.query.resourceType as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (resourceType) {
        const resources = await storage.getEducationalResourcesByType(resourceType);
        return res.json(resources);
      } else {
        const resources = await storage.getEducationalResources(limit);
        return res.json(resources);
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch educational resources" });
    }
  });
  
  // Summary route for dashboard
  app.get("/api/dashboard-summary/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get recent waste records
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const wasteRecords = await storage.getWasteRecordsByDateRange(userId, thirtyDaysAgo, today);
      
      // Get upcoming collections
      const upcomingCollections = await storage.getUpcomingCollections(3);
      
      // Get recycling tips
      const recyclingTips = await storage.getRecyclingTips(3);
      
      // Get nearby disposal locations - using a default location for demo
      const nearbyLocations = await storage.getNearbyDisposalLocations(47.6062, -122.3321, 3);
      
      // Get educational resources
      const educationalResources = await storage.getEducationalResources(3);
      
      // Calculate waste summary
      let generalWaste = 0;
      let recycling = 0;
      let compost = 0;
      
      wasteRecords.forEach(record => {
        if (record.wasteType === "general") generalWaste += record.amount;
        if (record.wasteType === "recycling") recycling += record.amount;
        if (record.wasteType === "compost") compost += record.amount;
      });
      
      const totalWaste = generalWaste + recycling + compost;
      
      // Calculate weekly data for chart
      const today7DaysAgo = new Date(today);
      today7DaysAgo.setDate(today.getDate() - 7);
      
      const dailyWaste = Array(7).fill(0);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      
      wasteRecords
        .filter(record => record.date >= today7DaysAgo)
        .forEach(record => {
          const dayIndex = 6 - Math.floor((today.getTime() - record.date.getTime()) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) {
            dailyWaste[dayIndex] += record.amount;
          }
        });
      
      const chartData = dailyWaste.map((amount, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - index));
        return {
          day: dayNames[date.getDay()],
          amount: Math.round(amount * 10) / 10, // Round to 1 decimal place
        };
      });
      
      // Calculate weekly average and recycling rate
      const weeklyAverage = totalWaste === 0 ? 0 : Math.round((totalWaste / 4) * 10) / 10;
      const recyclingRate = totalWaste === 0 ? 0 : Math.round((recycling / totalWaste) * 100);
      
      return res.json({
        user: {
          name: user.fullName,
          date: today.toISOString().split('T')[0]
        },
        wasteSummary: {
          generalWaste: Math.round(generalWaste),
          recycling: Math.round(recycling),
          compost: Math.round(compost),
          total: Math.round(totalWaste),
          comparison: -12 // Placeholder for now
        },
        upcomingCollections,
        recyclingTips,
        wasteTracking: {
          chartData,
          weeklyAverage,
          recyclingRate,
          weeklyComparison: -8, // Placeholder
          recyclingComparison: 5 // Placeholder
        },
        disposalLocations: nearbyLocations,
        educationalResources
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
