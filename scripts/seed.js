const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define inline Schemas or use collection names directly to avoid ES Module import issues in Node context
const DEFAULT_PRICING = [
  { category: 'shirts', service: 'wash_iron', basePrice: 30, pricePerUnit: 30, description: 'Formal Shirt', isActive: true },
  { category: 't-shirts', service: 'wash', basePrice: 20, pricePerUnit: 20, description: 'Cotton T-Shirt', isActive: true },
  { category: 'jeans', service: 'wash_iron', basePrice: 40, pricePerUnit: 40, description: 'Trouser / Jeans', isActive: true },
  { category: 'sarees', service: 'dry_clean', basePrice: 80, pricePerUnit: 80, description: 'Designer Silk Saree', isActive: true },
  { category: 'blazers', service: 'dry_clean', basePrice: 100, pricePerUnit: 100, description: 'Designer Blazer', isActive: true },
  { category: 'blankets', service: 'premium', basePrice: 150, pricePerUnit: 150, description: 'Duvet / Heavy Blanket', isActive: true },
  { category: 'curtains', service: 'wash', basePrice: 80, pricePerUnit: 80, description: 'Curtain', isActive: true },
  { category: 'shoes', service: 'premium', basePrice: 120, pricePerUnit: 120, description: 'Premium Shoes', isActive: true },
];

const DEFAULT_COUPONS = [
  { code: 'WELCOME10', discountType: 'percentage', value: 10, minOrderValue: 200, expiresAt: new Date('2028-12-31'), isActive: true },
  { code: 'LAUNDRY20', discountType: 'percentage', value: 20, minOrderValue: 400, expiresAt: new Date('2028-12-31'), isActive: true },
  { code: 'FLAT50', discountType: 'fixed', value: 50, minOrderValue: 300, expiresAt: new Date('2028-12-31'), isActive: true },
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  console.log(`📡 Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);
  console.log('✅ Connected successfully.');

  const db = mongoose.connection.db;

  // Clear existing collections
  console.log('🧹 Clearing existing collections...');
  const collections = ['users', 'addresses', 'pricings', 'coupons', 'orders', 'notifications', 'reviews', 'supporttickets'];
  for (const name of collections) {
    try {
      await db.collection(name).deleteMany({});
      console.log(`   - Cleared collection: ${name}`);
    } catch (e) {
      console.log(`   - Info: Collection ${name} did not exist or could not be cleared.`);
    }
  }

  // Create Users
  console.log('🌱 Seeding Users...');
  const customerId = new mongoose.Types.ObjectId();
  const agentId = new mongoose.Types.ObjectId();
  const adminId = new mongoose.Types.ObjectId();

  const users = [
    {
      _id: customerId,
      phone: '9876543210',
      name: 'Test Customer',
      email: 'customer@laundrywala.com',
      address: '123 Luxury Apartments, Indiranagar, Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      accountType: 'customer',
      firebaseUID: 'test-customer-uid',
      isVerified: true,
      isActive: true,
      preferences: { notifications: true, sms: true, email: true },
      wallet: { balance: 500, transactions: [{ id: 'w_init', amount: 500, type: 'credit', description: 'Welcome Bonus' }] },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: agentId,
      phone: '9876543211',
      name: 'Agent Vinod',
      email: 'agent@laundrywala.com',
      address: '456 Hub Logistics Centre, Koramangala, Bangalore',
      latitude: 12.9352,
      longitude: 77.6245,
      accountType: 'agent',
      firebaseUID: 'test-agent-uid',
      isVerified: true,
      isActive: true,
      preferences: { notifications: true, sms: true, email: false },
      wallet: { balance: 0, transactions: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: adminId,
      phone: '9876543212',
      name: 'Super Admin',
      email: 'admin@laundrywala.com',
      address: 'Admin Head Office, MG Road, Bangalore',
      latitude: 12.9738,
      longitude: 77.6119,
      accountType: 'admin',
      firebaseUID: 'test-admin-uid',
      isVerified: true,
      isActive: true,
      preferences: { notifications: true, sms: true, email: true },
      wallet: { balance: 0, transactions: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('users').insertMany(users);
  console.log(`   - Seeded ${users.length} users (Admin, Agent, Customer)`);

  // Create Addresses
  console.log('🌱 Seeding Addresses for Customer...');
  const addresses = [
    {
      userId: customerId,
      title: 'Home',
      addressLine: '123 Luxury Apartments, Indiranagar, Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: customerId,
      title: 'Office',
      addressLine: 'Summit Tower B, tech park, Whitefield, Bangalore',
      latitude: 12.9698,
      longitude: 77.7499,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  await db.collection('addresses').insertMany(addresses);
  console.log(`   - Seeded ${addresses.length} customer addresses`);

  // Seed Pricing Catalog
  console.log('🌱 Seeding Pricing Catalog...');
  const pricingsWithDates = DEFAULT_PRICING.map(p => ({
    ...p,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await db.collection('pricings').insertMany(pricingsWithDates);
  console.log(`   - Seeded ${pricingsWithDates.length} pricing items`);

  // Seed Coupons
  console.log('🌱 Seeding Coupons...');
  const couponsWithDates = DEFAULT_COUPONS.map(c => ({
    ...c,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await db.collection('coupons').insertMany(couponsWithDates);
  console.log(`   - Seeded ${couponsWithDates.length} coupons`);

  // Seed Orders
  console.log('🌱 Seeding Orders...');
  const orders = [
    {
      orderNumber: 'ORD-0001',
      userId: customerId,
      customerId: customerId,
      clothes: [
        { category: 'shirts', quantity: 2, service: 'wash_iron', price: 30 },
        { category: 'jeans', quantity: 1, service: 'wash_iron', price: 40 }
      ],
      pickupDetails: {
        address: '123 Luxury Apartments, Indiranagar, Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
        scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timeSlot: '09:00 AM - 12:00 PM',
        notes: 'Leave at front desk if not around'
      },
      deliveryDetails: {
        address: '123 Luxury Apartments, Indiranagar, Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
        estimatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        timeSlot: '06:00 PM - 09:00 PM'
      },
      status: 'delivered',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { status: 'assigned', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60000) },
        { status: 'collected', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 3600000) },
        { status: 'in_wash', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { status: 'in_iron', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 3600000) },
        { status: 'ready', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { status: 'out_for_delivery', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 3600000) },
        { status: 'delivered', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 3600000) }
      ],
      pricing: {
        subtotal: 100,
        tax: 18,
        discount: 0,
        deliveryFee: 30,
        total: 148
      },
      payment: {
        method: 'cod',
        status: 'completed',
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 3600000)
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 3600000)
    },
    {
      orderNumber: 'ORD-0002',
      userId: customerId,
      customerId: customerId,
      agentId: agentId,
      clothes: [
        { category: 'sarees', quantity: 1, service: 'dry_clean', price: 80 }
      ],
      pickupDetails: {
        address: '123 Luxury Apartments, Indiranagar, Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        timeSlot: '09:00 AM - 12:00 PM',
        notes: 'Handle with care, silk fabric'
      },
      deliveryDetails: {
        address: '123 Luxury Apartments, Indiranagar, Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
        estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        timeSlot: '06:00 PM - 09:00 PM'
      },
      status: 'in_wash',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { status: 'assigned', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60000) },
        { status: 'collected', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 3600000) },
        { status: 'in_wash', timestamp: new Date(Date.now() - 12 * 3600000) }
      ],
      pricing: {
        subtotal: 80,
        tax: 14.4,
        discount: 10,
        deliveryFee: 30,
        total: 114.4
      },
      payment: {
        method: 'razorpay',
        status: 'completed',
        transactionId: 'pay_test_transaction_99',
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60000)
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 3600000)
    },
    {
      orderNumber: 'ORD-0003',
      userId: customerId,
      customerId: customerId,
      clothes: [
        { category: 'blankets', quantity: 1, service: 'premium', price: 150 }
      ],
      pickupDetails: {
        address: 'Summit Tower B, tech park, Whitefield, Bangalore',
        latitude: 12.9698,
        longitude: 77.7499,
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        timeSlot: '12:00 PM - 03:00 PM',
        notes: ''
      },
      deliveryDetails: {
        address: 'Summit Tower B, tech park, Whitefield, Bangalore',
        latitude: 12.9698,
        longitude: 77.7499,
        estimatedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        timeSlot: '06:00 PM - 09:00 PM'
      },
      status: 'pending',
      timeline: [
        { status: 'pending', timestamp: new Date() }
      ],
      pricing: {
        subtotal: 150,
        tax: 27,
        discount: 0,
        deliveryFee: 30,
        total: 207
      },
      payment: {
        method: 'cod',
        status: 'pending'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('orders').insertMany(orders);
  console.log(`   - Seeded ${orders.length} mock orders`);

  // Seed Notifications
  console.log('🌱 Seeding Notifications...');
  const notifications = [
    {
      userId: customerId,
      title: 'Welcome to Manodrop!',
      message: 'Explore premium smart garment care options starting from just ₹20.',
      type: 'general',
      isRead: false,
      createdAt: new Date()
    },
    {
      userId: customerId,
      title: 'Order Status Update',
      message: 'Your order ORD-0002 has been received and is now in the wash cycle.',
      type: 'order',
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 3600000)
    }
  ];
  await db.collection('notifications').insertMany(notifications);
  console.log(`   - Seeded ${notifications.length} notifications`);

  // Seed Reviews
  console.log('🌱 Seeding Reviews...');
  const reviews = [
    {
      userId: customerId,
      orderId: new mongoose.Types.ObjectId(), // mock order ID
      rating: 5,
      comment: 'Absolutely love the service! The shirts came back crisp and clean, smelled amazing.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];
  await db.collection('reviews').insertMany(reviews);
  console.log(`   - Seeded ${reviews.length} reviews`);

  console.log('🏁 Database seeding completed successfully!');
  await mongoose.disconnect();
}

seedDatabase().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
