import { 
  users, type User, type InsertUser,
  wasteRecords, type WasteRecord, type InsertWasteRecord,
  collections, type Collection, type InsertCollection,
  reminders, type Reminder, type InsertReminder,
  disposalLocations, type DisposalLocation, type InsertDisposalLocation,
  recyclingTips, type RecyclingTip, type InsertRecyclingTip,
  educationalResources, type EducationalResource, type InsertEducationalResource
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waste record operations
  getWasteRecords(userId: number): Promise<WasteRecord[]>;
  getWasteRecordsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<WasteRecord[]>;
  createWasteRecord(record: InsertWasteRecord): Promise<WasteRecord>;
  
  // Collection operations
  getCollections(): Promise<Collection[]>;
  getUpcomingCollections(limit?: number): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  
  // Reminder operations
  getRemindersByUser(userId: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminderStatus(id: number, isActive: boolean): Promise<Reminder | undefined>;
  
  // Disposal location operations
  getDisposalLocations(): Promise<DisposalLocation[]>;
  getNearbyDisposalLocations(lat: number, lon: number, limit?: number): Promise<DisposalLocation[]>;
  createDisposalLocation(location: InsertDisposalLocation): Promise<DisposalLocation>;
  
  // Recycling tip operations
  getRecyclingTips(limit?: number): Promise<RecyclingTip[]>;
  getRecyclingTipsByCategory(category: string): Promise<RecyclingTip[]>;
  createRecyclingTip(tip: InsertRecyclingTip): Promise<RecyclingTip>;
  
  // Educational resource operations
  getEducationalResources(limit?: number): Promise<EducationalResource[]>;
  getEducationalResourcesByType(resourceType: string): Promise<EducationalResource[]>;
  createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wasteRecords: Map<number, WasteRecord>;
  private collections: Map<number, Collection>;
  private reminders: Map<number, Reminder>;
  private disposalLocations: Map<number, DisposalLocation>;
  private recyclingTips: Map<number, RecyclingTip>;
  private educationalResources: Map<number, EducationalResource>;
  
  private currentUserId: number;
  private currentWasteRecordId: number;
  private currentCollectionId: number;
  private currentReminderId: number;
  private currentLocationId: number;
  private currentTipId: number;
  private currentResourceId: number;

  constructor() {
    this.users = new Map();
    this.wasteRecords = new Map();
    this.collections = new Map();
    this.reminders = new Map();
    this.disposalLocations = new Map();
    this.recyclingTips = new Map();
    this.educationalResources = new Map();
    
    this.currentUserId = 1;
    this.currentWasteRecordId = 1;
    this.currentCollectionId = 1;
    this.currentReminderId = 1;
    this.currentLocationId = 1;
    this.currentTipId = 1;
    this.currentResourceId = 1;
    
    this.seedData();
  }

  // Seed initial data for testing
  private seedData() {
    // Seed users
    const defaultUser: InsertUser = {
      username: "alex",
      password: "password123",
      fullName: "Alex Johnson",
      email: "alex@example.com"
    };
    this.createUser(defaultUser);
    
    // Seed waste records
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    
    this.createWasteRecord({ 
      userId: 1, 
      wasteType: "general", 
      amount: 5, 
      date: today 
    });
    this.createWasteRecord({ 
      userId: 1, 
      wasteType: "recycling", 
      amount: 3, 
      date: today 
    });
    this.createWasteRecord({ 
      userId: 1, 
      wasteType: "compost", 
      amount: 2, 
      date: today 
    });
    this.createWasteRecord({ 
      userId: 1, 
      wasteType: "general", 
      amount: 6, 
      date: yesterday 
    });
    this.createWasteRecord({ 
      userId: 1, 
      wasteType: "recycling", 
      amount: 4, 
      date: yesterday 
    });
    this.createWasteRecord({ 
      userId: 1, 
      wasteType: "compost", 
      amount: 3, 
      date: yesterday 
    });
    
    // Seed collections
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    this.createCollection({
      wasteType: "recycling",
      scheduledDate: tomorrow,
      timeWindow: "8AM - 10AM",
      locationId: 1,
      isRecurring: true,
      recurringPattern: "weekly"
    });
    this.createCollection({
      wasteType: "general",
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      timeWindow: "8AM - 10AM",
      locationId: 1,
      isRecurring: true,
      recurringPattern: "weekly"
    });
    this.createCollection({
      wasteType: "compost",
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9),
      timeWindow: "8AM - 10AM",
      locationId: 1,
      isRecurring: true,
      recurringPattern: "weekly"
    });
    
    // Seed disposal locations
    this.createDisposalLocation({
      name: "Downtown Recycling Center",
      address: "123 Main St",
      city: "Seattle",
      latitude: 47.6062,
      longitude: -122.3321,
      acceptedWasteTypes: "general,recycling,compost",
      operatingHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-5PM",
      phoneNumber: "(206) 555-1234",
      website: "https://example.com/downtown-recycling"
    });
    this.createDisposalLocation({
      name: "Eastside Disposal Facility",
      address: "456 Oak Ave",
      city: "Bellevue",
      latitude: 47.6101,
      longitude: -122.2015,
      acceptedWasteTypes: "general,recycling,hazardous",
      operatingHours: "Mon-Sat: 8AM-7PM",
      phoneNumber: "(206) 555-5678",
      website: "https://example.com/eastside-disposal"
    });
    this.createDisposalLocation({
      name: "University District Drop-Off",
      address: "789 Campus Way",
      city: "Seattle",
      latitude: 47.6553,
      longitude: -122.3035,
      acceptedWasteTypes: "recycling,compost,electronics",
      operatingHours: "Mon-Fri: 7AM-8PM, Sat-Sun: 9AM-6PM",
      phoneNumber: "(206) 555-9012",
      website: "https://example.com/ud-dropoff"
    });
    
    // Seed recycling tips
    this.createRecyclingTip({
      title: "Rinse Food Containers",
      description: "Make sure to rinse food residue from containers before recycling to prevent contamination.",
      category: "general"
    });
    this.createRecyclingTip({
      title: "Flatten Cardboard Boxes",
      description: "Break down boxes to save space in your recycling bin and make collection more efficient.",
      category: "paper"
    });
    this.createRecyclingTip({
      title: "Remove Lids from Bottles",
      description: "Separate plastic lids from glass bottles as they are often made from different materials.",
      category: "plastic"
    });
    
    // Seed educational resources
    this.createEducationalResource({
      title: "Complete Recycling Guide",
      description: "Learn what items can be recycled and how to prepare them properly.",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      contentUrl: "/resources/recycling-guide",
      resourceType: "guide"
    });
    this.createEducationalResource({
      title: "Composting 101",
      description: "Start turning your food scraps and yard waste into nutrient-rich soil.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      contentUrl: "/resources/composting-101",
      resourceType: "article"
    });
    this.createEducationalResource({
      title: "Reducing Household Waste",
      description: "Simple strategies to minimize waste production in your home.",
      imageUrl: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      contentUrl: "/resources/reducing-waste",
      resourceType: "article"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Waste record operations
  async getWasteRecords(userId: number): Promise<WasteRecord[]> {
    return Array.from(this.wasteRecords.values()).filter(
      (record) => record.userId === userId,
    );
  }
  
  async getWasteRecordsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<WasteRecord[]> {
    return Array.from(this.wasteRecords.values()).filter(
      (record) => record.userId === userId && record.date >= startDate && record.date <= endDate,
    );
  }
  
  async createWasteRecord(insertRecord: InsertWasteRecord): Promise<WasteRecord> {
    const id = this.currentWasteRecordId++;
    const record: WasteRecord = { ...insertRecord, id };
    this.wasteRecords.set(id, record);
    return record;
  }
  
  // Collection operations
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }
  
  async getUpcomingCollections(limit: number = 10): Promise<Collection[]> {
    const now = new Date();
    return Array.from(this.collections.values())
      .filter((collection) => collection.scheduledDate > now)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, limit);
  }
  
  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.currentCollectionId++;
    const collection: Collection = { ...insertCollection, id };
    this.collections.set(id, collection);
    return collection;
  }
  
  // Reminder operations
  async getRemindersByUser(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(
      (reminder) => reminder.userId === userId,
    );
  }
  
  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.currentReminderId++;
    const reminder: Reminder = { ...insertReminder, id };
    this.reminders.set(id, reminder);
    return reminder;
  }
  
  async updateReminderStatus(id: number, isActive: boolean): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder: Reminder = { ...reminder, isActive };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
  
  // Disposal location operations
  async getDisposalLocations(): Promise<DisposalLocation[]> {
    return Array.from(this.disposalLocations.values());
  }
  
  async getNearbyDisposalLocations(lat: number, lon: number, limit: number = 5): Promise<DisposalLocation[]> {
    // Very simple distance calculation (not accurate for real use)
    const locations = Array.from(this.disposalLocations.values()).map(location => {
      const distance = Math.sqrt(
        Math.pow(location.latitude - lat, 2) + 
        Math.pow(location.longitude - lon, 2)
      );
      return { ...location, distance };
    });
    
    return locations
      .sort((a, b) => (a.distance as number) - (b.distance as number))
      .slice(0, limit)
      .map(({ distance, ...location }) => location);
  }
  
  async createDisposalLocation(insertLocation: InsertDisposalLocation): Promise<DisposalLocation> {
    const id = this.currentLocationId++;
    const location: DisposalLocation = { ...insertLocation, id };
    this.disposalLocations.set(id, location);
    return location;
  }
  
  // Recycling tip operations
  async getRecyclingTips(limit: number = 10): Promise<RecyclingTip[]> {
    return Array.from(this.recyclingTips.values()).slice(0, limit);
  }
  
  async getRecyclingTipsByCategory(category: string): Promise<RecyclingTip[]> {
    return Array.from(this.recyclingTips.values()).filter(
      (tip) => tip.category === category,
    );
  }
  
  async createRecyclingTip(insertTip: InsertRecyclingTip): Promise<RecyclingTip> {
    const id = this.currentTipId++;
    const tip: RecyclingTip = { ...insertTip, id };
    this.recyclingTips.set(id, tip);
    return tip;
  }
  
  // Educational resource operations
  async getEducationalResources(limit: number = 10): Promise<EducationalResource[]> {
    return Array.from(this.educationalResources.values()).slice(0, limit);
  }
  
  async getEducationalResourcesByType(resourceType: string): Promise<EducationalResource[]> {
    return Array.from(this.educationalResources.values()).filter(
      (resource) => resource.resourceType === resourceType,
    );
  }
  
  async createEducationalResource(insertResource: InsertEducationalResource): Promise<EducationalResource> {
    const id = this.currentResourceId++;
    const resource: EducationalResource = { ...insertResource, id };
    this.educationalResources.set(id, resource);
    return resource;
  }
}

export const storage = new MemStorage();
