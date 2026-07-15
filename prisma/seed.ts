// prisma/seed.ts

import bcrypt from "bcryptjs";
import {UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

async function main() {
  const email = "admin@flex-accountant.com";
  const password = "admin12345";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: "Flex Admin",
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      name: "Flex Admin",
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log("Admin account ready:");
  console.log("Email:", admin.email);
  console.log("Password:", password);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });