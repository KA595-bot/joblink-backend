import { PrismaClient} from '@/generated/prisma';
export const prisma = new PrismaClient({
    log: process.env["NODE_ENV"] === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};