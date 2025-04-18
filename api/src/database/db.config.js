import { PrismaClient } from '@prisma/client';

// Create a Prisma client instance
const prisma = new PrismaClient();

/**
 * Connect to the database
 * 
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Perform initial connection validation
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database query validation successful');

    return prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

/**
 * Disconnect from the database
 * 
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    throw error;
  }
};

// Export for use elsewhere
export { prisma };
