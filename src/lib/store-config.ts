import { prisma } from "./prisma";

export interface StoreConfiguration {
    id: string;
    storeName: string;
    storeDescription: string | null;
    logoUrl: string | null;
    primaryColor: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

let cachedConfig: StoreConfiguration | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function getStoreConfig(): Promise<StoreConfiguration> {
    const now = Date.now();

    if (cachedConfig && (now - cacheTime) < CACHE_DURATION) {
        return cachedConfig;
    }

    let config = await prisma.storeConfig.findFirst();

    // Create default config if none exists
    if (!config) {
        config = await prisma.storeConfig.create({
            data: {
                storeName: "My Shop",
                storeDescription: "Welcome to our online store",
                primaryColor: "#6366f1",
                currency: "USD",
            },
        });
    }

    cachedConfig = config;
    cacheTime = now;

    return config;
}

export async function updateStoreConfig(data: Partial<Omit<StoreConfiguration, 'id' | 'createdAt' | 'updatedAt'>>) {
    const config = await getStoreConfig();

    const updated = await prisma.storeConfig.update({
        where: { id: config.id },
        data,
    });

    // Invalidate cache
    cachedConfig = updated;
    cacheTime = Date.now();

    return updated;
}

export function invalidateConfigCache() {
    cachedConfig = null;
    cacheTime = 0;
}
