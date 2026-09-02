require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: Seed script cannot be run in production environment as it deletes all products!');
  process.exit(1);
}

const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const categories = [
  {
    name: 'Classic Blends',
    slug: 'classic-blends',
    description: 'Our traditional 1:1 sugar replacements.',
    sortOrder: 1,
  },
  {
    name: 'Golden Blends',
    slug: 'golden-blends',
    description: 'Rich, brown-sugar-like replacements.',
    sortOrder: 2,
  },
  {
    name: 'Liquid Drops',
    slug: 'liquid-drops',
    description: 'Concentrated liquid sweetness.',
    sortOrder: 3,
  },
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding Database...');

    // Idempotent approach: Use updateOne with upsert to avoid duplicate errors on re-runs
    for (const cat of categories) {
      await Category.updateOne({ slug: cat.slug }, { $set: cat }, { upsert: true });
    }
    console.log('Categories seeded.');

    // Fetch them back to get ObjectIds
    const classicCat = await Category.findOne({ slug: 'classic-blends' });
    const goldenCat = await Category.findOne({ slug: 'golden-blends' });
    const liquidCat = await Category.findOne({ slug: 'liquid-drops' });

    const products = [
      {
        name: 'Sweet Monk Classic',
        slug: 'classic-monk-fruit-sweetener',
        description: 'Our classic 1:1 sugar replacement. Perfect for baking, coffee, and everyday use.',
        shortDescription: 'Classic 1:1 sugar replacement.',
        price: 14.99, // default to lowest price
        compareAtPrice: 19.99,
        category: classicCat._id,
        stock: 800, // total stock
        images: ['/assets/products/product-box.jpg', '/assets/products/product-front-back.jpg'],
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 128,
        variants: [
          { size: '16 oz', price: 14.99, compareAtPrice: 19.99, stock: 500 },
          { size: '32 oz', price: 24.99, compareAtPrice: 29.99, stock: 300 }
        ]
      },
      {
        name: 'Sweet Monk Golden',
        slug: 'golden-monk-fruit-sweetener',
        description: 'A rich, brown-sugar-like replacement perfect for cookies and marinades.',
        shortDescription: 'Brown-sugar-like replacement.',
        price: 15.99,
        compareAtPrice: 20.99,
        category: goldenCat._id,
        stock: 500,
        images: ['/assets/products/product-box.jpg'],
        isFeatured: true,
        rating: 4.7,
        reviewsCount: 54,
        variants: [
          { size: '16 oz', price: 15.99, compareAtPrice: 20.99, stock: 200 },
          { size: '32 oz', price: 26.99, compareAtPrice: 32.99, stock: 300 }
        ]
      },
      {
        name: 'Sweet Monk Liquid Drops',
        slug: 'liquid-monk-fruit-drops',
        description: 'Concentrated liquid sweetness. Perfect for cold beverages and smoothies.',
        shortDescription: 'Concentrated liquid sweetness.',
        price: 12.99,
        category: liquidCat._id,
        stock: 150,
        images: ['/assets/products/product-box.jpg'],
        isFeatured: false,
        rating: 4.9,
        reviewsCount: 212,
        variants: [
          { size: 'Original', price: 12.99, stock: 150 }
        ]
      },
    ];

    // Clear old products first
    await Product.deleteMany({});
    
    for (const prod of products) {
      await Product.updateOne({ slug: prod.slug }, { $set: prod }, { upsert: true });
    }
    console.log('Products seeded.');

    console.log('Database Seeding Completed Successfully.');
    process.exit();
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();
