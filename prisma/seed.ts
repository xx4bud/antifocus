// prisma/seed.ts
import {
  PrismaClient,
  Prisma,
  ProductStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingCourier,
  ShippingStatus,
  AddressLabel,
  MediaType,
  UserRole,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { slugify } from "@/lib/utils";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Mulai seeding data...");

  await prisma.media.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipping.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.design.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.spec.deleteMany();
  await prisma.option.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding categories...");
  const categoryData = [];
  for (let i = 0; i < 6; i++) {
    const categoryName = faker.commerce.department();
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: slugify(`${categoryName}-${faker.string.numeric(4)}`),
        description: faker.lorem.sentence(),
        featured: true,
        views: i,
        media: {
          create: {
            type: MediaType.IMAGE,
            url: faker.image.url(),
            alt: categoryName,
            order: 0,
          },
        },
      },
    });
    categoryData.push(category);
  }

  console.log("Seeding subcategories...");
  const subCategoryData = [];
  for (const category of categoryData) {
    for (let i = 0; i < 2; i++) {
      const subCatName = `${category.name} ${faker.commerce.productAdjective()}`;
      const subCategory = await prisma.subCategory.create({
        data: {
          name: subCatName,
          slug: slugify(`${category.name}-${faker.string.numeric(4)}`),
          description: faker.lorem.sentence(),
          featured: true,
          views: i,
          category: { connect: { id: category.id } },
          media: {
            create: {
              type: MediaType.IMAGE,
              url: faker.image.url(),
              alt: subCatName,
              order: 0,
            },
          },
        },
      });
      subCategoryData.push(subCategory);
    }
  }

  console.log("Seeding products...");
  const productData = [];
  for (let i = 0; i < 24; i++) {
    const productName = faker.commerce.productName();
   
    const randomCategory =
      categoryData[Math.floor(Math.random() * categoryData.length)];
 
    const subCats = subCategoryData.filter(
      (sc) => sc.categoryId === randomCategory.id
    );
    const randomSubCategory =
      subCats[Math.floor(Math.random() * subCats.length)];
 
    const priceValue = faker.number.int({ min: 1000, max: 1000000 });

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: slugify(`${randomCategory.slug}-${faker.string.numeric(4)}`),
        description: faker.commerce.productDescription(),
        price: new Prisma.Decimal(priceValue.toString()),
        stock: faker.number.int({ min: 0, max: 100 }),
        minOrder: faker.number.int({ min: 1, max: 5 }),
        maxOrder: faker.number.int({ min: 6, max: 10 }),
        weight: parseFloat(faker.string.numeric(2)),
        length: parseFloat(faker.string.numeric(2)),
        width: parseFloat(faker.string.numeric(2)),
        height: parseFloat(faker.string.numeric(2)),
        status: ProductStatus.AVAILABLE,
        categories: { connect: { id: randomCategory.id } },
        subCategories: { connect: { id: randomSubCategory.id } },
        media: {
          create: {
            type: MediaType.IMAGE,
            url: faker.image.url(),
            alt: productName,
            order: 0,
          },
        },
        specs: {
          create: {
            label: "Color",
            values: JSON.stringify([
              faker.color.human(),
              faker.color.human(),
              faker.color.human(),
            ]),
          },
        },
        variants: {
          create: {
            label: "Size",
            value: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
            price: new Prisma.Decimal((priceValue + 10).toString()),
            stock: faker.number.int({ min: 0, max: 50 }),
            minOrder: faker.number.int({ min: 1, max: 2 }),
            maxOrder: faker.number.int({ min: 3, max: 5 }),
            weight: parseFloat(faker.string.numeric(2)),
            length: parseFloat(faker.string.numeric(2)),
            width: parseFloat(faker.string.numeric(2)),
            height: parseFloat(faker.string.numeric(2)),
            options: {
              create: {
                label: "Extra",
                value: "Gift Wrap",
                price: new Prisma.Decimal("5"),
                minOrder: 1,
                maxOrder: 1,
              },
            },
            media: {
              create: {
                type: MediaType.IMAGE,
                url: faker.image.url(),
                alt: "Variant image",
                order: 0,
              },
            },
          },
        },
        options: {
          create: {
            label: "Warranty",
            value: "1 year",
            price: new Prisma.Decimal("20"),
            minOrder: 1,
            maxOrder: 1,
          },
        },
      },
    });
    productData.push(product);
  }

  console.log("Seeding admin and regular users...");
  const allUsers = [];

  const adminData = [
    { name: "Admin One", email: "admin1@example.com", password: "Admin1@16810", phone: "08123456789" },
    { name: "Admin Two", email: "admin2@example.com", password: "Admin2@16810", phone: "08123456780" },
  ];
  for (const admin of adminData) {
    const hashedPassword = await hash(admin.password, 10);
    const adminUser = await prisma.user.create({
      data: {
        name: admin.name,
        slug: slugify(`${admin.name}-${faker.string.numeric(4)}`),
        email: admin.email,
        phone: admin.phone,
        image: faker.image.avatar(),
        role: UserRole.ADMIN,
        passwordHash: hashedPassword,
      },
    });
    allUsers.push(adminUser);
    await prisma.address.create({
      data: {
        label: AddressLabel.HOME,
        receipient: adminUser.name || "Admin",
        phone: adminUser.phone || "08123456789",
        province: faker.location.state(),
        city: faker.location.city(),
        district: faker.location.county(),
        subDistrict: faker.location.city(),
        postalCode: faker.location.zipCode(),
        fullAddress: faker.location.streetAddress({ useFullAddress: true }),
        notes: faker.lorem.sentence(),
        default: true,
        user: { connect: { id: adminUser.id } },
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    const userPassword = await hash(`User${i}@16810`, 10);
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        slug: slugify(`User ${i}-${faker.string.numeric(4)}`),
        email: `user${i}@example.com`,
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        role: UserRole.USER,
        passwordHash: userPassword,
      },
    });
    allUsers.push(user);
    await prisma.address.create({
      data: {
        label: AddressLabel.HOME,
        receipient: user.name || "User",
        phone: user.phone || faker.phone.number(),
        province: faker.location.state(),
        city: faker.location.city(),
        district: faker.location.county(),
        subDistrict: faker.location.city(),
        postalCode: faker.location.zipCode(),
        fullAddress: faker.location.streetAddress({ useFullAddress: true }),
        notes: faker.lorem.sentence(),
        default: true,
        user: { connect: { id: user.id } },
      },
    });
  }

  console.log("Seeding carts and cart items...");
  for (const user of allUsers) {
    const cart = await prisma.cart.create({
      data: {
        totalQuantity: 0,
        totalAmount: new Prisma.Decimal("0"),
        user: { connect: { id: user.id } },
      },
    });
    let totalQuantity = 0;
    let totalAmount = 0;
    for (let i = 0; i < 2; i++) {
      const randomProduct =
        productData[Math.floor(Math.random() * productData.length)];
      const quantity = faker.number.int({ min: 1, max: 5 });
      const priceNum = parseFloat(randomProduct.price.toString());
      const amount = parseFloat((priceNum * quantity).toFixed(2));
      totalQuantity += quantity;
      totalAmount += amount;
      await prisma.cartItem.create({
        data: {
          data: {},
          quantity,
          amount: new Prisma.Decimal(amount.toString()),
          cart: { connect: { id: cart.id } },
          product: { connect: { id: randomProduct.id } },
        },
      });
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalQuantity,
        totalAmount: new Prisma.Decimal(totalAmount.toString()),
      },
    });
  }

  console.log("Seeding designs...");
  for (const user of allUsers) {
    for (let i = 0; i < 2; i++) {
      const randomProduct =
        productData[Math.floor(Math.random() * productData.length)];
      await prisma.design.create({
        data: {
          label: faker.commerce.productName(),
          data: { text: faker.lorem.words(5) },
          user: { connect: { id: user.id } },
          product: { connect: { id: randomProduct.id } },
          media: {
            create: {
              type: MediaType.IMAGE,
              url: faker.image.url(),
              alt: "Design image",
              order: 0,
            },
          },
        },
      });
    }
  }

  console.log("Seeding orders...");
  const orderData = [];
  for (let i = 0; i < 30; i++) {
    const randomUser =
      allUsers[Math.floor(Math.random() * allUsers.length)];
    const orderItemsData = [];
    for (let j = 0; j < 2; j++) {
      const randomProduct =
        productData[Math.floor(Math.random() * productData.length)];
      orderItemsData.push({
        data: { info: faker.lorem.sentence() },
        quantity: faker.number.int({ min: 1, max: 3 }),
        amount: new Prisma.Decimal(
          faker.commerce.price({ min: 1000, max: 1000000, dec: 0 })
        ),
        product: { connect: { id: randomProduct.id } },
      });
    }
    const totalQuantity = orderItemsData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum + parseFloat(item.amount.toString()),
      0
    );
    const order = await prisma.order.create({
      data: {
        orderNumber: faker.string.alphanumeric(12),
        totalQuantity,
        totalAmount: new Prisma.Decimal(totalAmount.toString()),
        status: OrderStatus.PENDING,
        user: { connect: { id: randomUser.id } },
        orderItems: { create: orderItemsData },
      },
    });
    orderData.push(order);
  }

  console.log("Seeding payments...");
  for (const order of orderData) {
    const orderUser = allUsers.find((u) => u.id === order.userId);
    await prisma.payment.create({
      data: {
        transactionId: faker.string.alphanumeric(12),
        amount: order.totalAmount,
        method: faker.helpers.arrayElement(
          Object.values(PaymentMethod)
        ) as PaymentMethod,
        status: PaymentStatus.PENDING,
        user: { connect: { id: orderUser!.id } },
        order: { connect: { id: order.id } },
        media: {
          create: {
            type: MediaType.IMAGE,
            url: faker.image.url(),
            alt: "Payment proof",
            order: 0,
          },
        },
      },
    });
  }

  console.log("Seeding shippings...");
  for (const order of orderData) {
    const userAddress = await prisma.address.findFirst({
      where: { userId: order.userId },
    });
    await prisma.shipping.create({
      data: {
        trackingId: faker.string.alphanumeric(12),
        courier: faker.helpers.arrayElement(
          Object.values(ShippingCourier)
        ) as ShippingCourier,
        service: "Standard Shipping",
        cost: new Prisma.Decimal(
          faker.commerce.price({ min: 1000, max: 1000000, dec: 0 })
        ),
        status: ShippingStatus.PENDING,
        address: userAddress
          ? { connect: { id: userAddress.id } }
          : undefined,
        order: { connect: { id: order.id } },
      },
    });
  }

  console.log("Seeding reviews...");
  for (let i = 0; i < 40; i++) {
    const randomUser =
      allUsers[Math.floor(Math.random() * allUsers.length)];
    const randomProduct =
      productData[Math.floor(Math.random() * productData.length)];
    await prisma.review.create({
      data: {
        rating: new Prisma.Decimal(faker.number.int({ min: 1, max: 5 }).toString()),
        comment: faker.lorem.sentence(),
        user: { connect: { id: randomUser.id } },
        product: { connect: { id: randomProduct.id } },
        media: {
          create: {
            type: MediaType.IMAGE,
            url: faker.image.url(),
            alt: "Review image",
            order: 0,
          },
        },
      },
    });
  }

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
