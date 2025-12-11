const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Real stock images from Unsplash
const productImages = {
    Electronics: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    ],
    Clothing: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
    ],
    "Home & Garden": [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=400&fit=crop",
    ],
    Sports: [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    ],
    Beauty: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1570194065650-d99fb4b38b3e?w=400&h=400&fit=crop",
    ],
    Kitchen: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1495461199391-8c39ab674295?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=400&fit=crop",
    ],
    Books: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=400&fit=crop",
    ],
    Toys: [
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&h=400&fit=crop",
    ],
    Pet: [
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=400&fit=crop",
    ],
    Office: [
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    ],
};

const productCategories = [
    { name: 'Electronics', items: ['Wireless Headphones', 'Smart Watch', 'Bluetooth Speaker', 'USB-C Hub', 'Portable Charger', 'LED Desk Lamp', 'Webcam HD', 'Mechanical Keyboard', 'Gaming Mouse', 'Monitor Stand'] },
    { name: 'Clothing', items: ['Cotton T-Shirt', 'Denim Jacket', 'Casual Hoodie', 'Slim Fit Jeans', 'Sport Shorts', 'Wool Sweater', 'Linen Shirt', 'Running Shoes', 'Canvas Sneakers', 'Leather Belt'] },
    { name: 'Home & Garden', items: ['Ceramic Plant Pot', 'LED String Lights', 'Throw Pillow', 'Scented Candle', 'Wall Clock', 'Photo Frame Set', 'Door Mat', 'Storage Basket', 'Table Runner', 'Curtain Set'] },
    { name: 'Sports', items: ['Yoga Mat', 'Resistance Bands', 'Dumbbells Set', 'Jump Rope', 'Water Bottle', 'Gym Bag', 'Fitness Tracker', 'Foam Roller', 'Exercise Ball', 'Workout Gloves'] },
    { name: 'Beauty', items: ['Face Moisturizer', 'Lip Balm Set', 'Hair Serum', 'Nail Polish Kit', 'Makeup Brush Set', 'Face Mask Pack', 'Body Lotion', 'Perfume Spray', 'Hand Cream', 'Eye Cream'] },
    { name: 'Kitchen', items: ['Cutting Board', 'Knife Set', 'Mixing Bowls', 'Measuring Cups', 'Silicone Spatula', 'Coffee Mug Set', 'Wine Glasses', 'Cast Iron Pan', 'Blender', 'Toaster'] },
    { name: 'Books', items: ['Bestseller Novel', 'Cookbook', 'Self-Help Book', 'Biography', 'Science Fiction', 'History Book', 'Art Book', 'Poetry Collection', 'Travel Guide', 'Business Book'] },
    { name: 'Toys', items: ['Building Blocks', 'Puzzle Set', 'Board Game', 'Stuffed Animal', 'Remote Car', 'Art Supplies', 'Science Kit', 'Doll House', 'Action Figure', 'Card Game'] },
    { name: 'Pet', items: ['Dog Bed', 'Cat Toy', 'Pet Bowl', 'Leash Set', 'Grooming Brush', 'Pet Carrier', 'Treat Bag', 'Scratching Post', 'Pet Blanket', 'Food Container'] },
    { name: 'Office', items: ['Notebook Set', 'Pen Collection', 'Desk Organizer', 'Sticky Notes', 'Paper Clips', 'Stapler', 'File Folders', 'Desk Pad', 'Business Cards', 'Label Maker'] },
];

const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Navy', 'Pink', 'Purple', 'Orange'];
const adjectives = ['Premium', 'Deluxe', 'Classic', 'Modern', 'Vintage', 'Eco', 'Pro', 'Ultra', 'Essential', 'Luxury'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateDescription(name, category) {
    const descriptions = [
        `High-quality ${name.toLowerCase()} perfect for everyday use. Made with premium materials and designed for durability.`,
        `Discover the amazing ${name.toLowerCase()}. A must-have for any ${category.toLowerCase()} enthusiast. Great value!`,
        `Our bestselling ${name.toLowerCase()} combines style and functionality. Loved by thousands of customers!`,
        `Upgrade your lifestyle with this exceptional ${name.toLowerCase()}. Features premium construction and modern design.`,
        `Experience the difference with our ${name.toLowerCase()}. Crafted with attention to detail and customer satisfaction in mind.`,
    ];
    return getRandomElement(descriptions);
}

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data (respecting foreign key constraints)
    await prisma.invoice.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    console.log('🗑️ Cleared existing data');

    // Create store config
    await prisma.storeConfig.upsert({
        where: { id: 'default' },
        update: {
            storeName: 'Test Shop LLA',
            storeDescription: 'Your one-stop destination for premium products. Quality guaranteed, fast shipping, and exceptional customer service.',
            primaryColor: '#6366f1',
        },
        create: {
            id: 'default',
            storeName: 'Test Shop LLA',
            storeDescription: 'Your one-stop destination for premium products. Quality guaranteed, fast shipping, and exceptional customer service.',
            primaryColor: '#6366f1',
            currency: 'USD',
        },
    });
    console.log('✅ Store config created');

    // Create test user
    const hashedPassword = await bcrypt.hash('123abc', 10);
    await prisma.user.upsert({
        where: { email: 'test1@example.com' },
        update: {},
        create: {
            email: 'test1@example.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Test user created (test1@example.com / 123abc)');

    // Generate 100 products with real images
    const products = [];
    let productId = 0;

    for (const category of productCategories) {
        const categoryImages = productImages[category.name] || productImages['Electronics'];

        for (const item of category.items) {
            const adjective = getRandomElement(adjectives);
            const color = getRandomElement(colors);
            const name = `${adjective} ${color} ${item}`;
            const price = (Math.random() * 200 + 9.99).toFixed(2);
            const stock = Math.floor(Math.random() * 100) + 5;
            const image = categoryImages[productId % categoryImages.length];

            products.push({
                name,
                description: generateDescription(name, category.name),
                price: parseFloat(price),
                stock,
                images: JSON.stringify([image]),
            });
            productId++;
        }
    }

    // Insert all products
    for (const product of products) {
        await prisma.product.create({ data: product });
    }
    console.log(`✅ Created ${products.length} products with real images`);

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
