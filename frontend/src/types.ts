export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    productCode: string;
    stock: {
        totalQty: number;
        status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
        lowStockThreshold?: number;
    };
    visibility: {
        showProduct: boolean;
        showPrice: boolean;
        showStockStatus: boolean;
    };
    clicks: {
        total: number;
        dailyStats: { date: string; count: number }[];
    };
    createdAt: string;
    updatedAt: string;
}

export interface QuotationItem extends Product {
    quantity: number;
}
