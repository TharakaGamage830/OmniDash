const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:5000/api';
const ADMIN_LOGIN = { username: 'admin@anutouch.com', password: 'admin123' };

let token = '';
let testResults = [];

const log = (name, status, details) => {
    testResults.push({ name, status, details: details || '' });
    console.log(`[${status}] ${name}`);
};

async function runTests() {
    console.log('--- Starting API End-to-End Tests ---');

    try {
        // 1. Admin Login
        const loginRes = await axios.post(`${BASE_URL}/admin/login`, ADMIN_LOGIN);
        token = loginRes.data.token;
        log('Admin Login', 'PASS', `Token length: ${token.length}`);
    } catch (e) {
        log('Admin Login', 'FAIL', e.response?.data?.message || e.message);
        return;
    }

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Admin Profile
    try {
        const res = await axios.get(`${BASE_URL}/admin/profile`, authHeader);
        log('GET Admin Profile', 'PASS', `User: ${res.data.fullName}`);
    } catch (e) {
        log('GET Admin Profile', 'FAIL', e.message);
    }

    // 3. Category Management
    let testCategoryId = '';
    try {
        const res = await axios.get(`${BASE_URL}/admin/categories`);
        log('GET Categories', 'PASS', `Count: ${res.data.length}`);

        const createRes = await axios.post(`${BASE_URL}/admin/categories`, { name: 'Test Category', prefix: 'TST' }, authHeader);
        testCategoryId = createRes.data._id;
        log('POST Create Category', 'PASS', `ID: ${testCategoryId}`);
    } catch (e) {
        log('Category Suite', 'FAIL', e.message);
    }

    // 4. Product Management
    let testProductId = '';
    try {
        const productsRes = await axios.get(`${BASE_URL}/api/products`); // Error in script: BASE_URL already has /api
        // Fixing path...
    } catch (e) { }

    // Refined run with corrected paths
}

// Actually let's use a more robust script structure
async function refinedRun() {
    const results = [];
    const report = async (name, testFn) => {
        try {
            const res = await testFn();
            const detail = typeof res === 'string' ? res : (res?.data?.message || 'Success');
            console.log(`✅ ${name}`);
            results.push({ name, status: 'PASS', details: detail });
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            console.log(`❌ ${name}: ${msg}`);
            if (err.response?.data) console.log('   Body:', JSON.stringify(err.response.data));
            results.push({ name, status: 'FAIL', details: msg });
            return false;
        }
    };

    // 1. Login
    let loginData;
    const loginOk = await report('Admin Login', async () => {
        const res = await axios.post(`${BASE_URL}/admin/login`, ADMIN_LOGIN);
        loginData = res.data;
        return `Logged in as ${res.data.admin.fullName}`;
    });

    if (!loginOk) return finish(results);
    const auth = { headers: { Authorization: `Bearer ${loginData.token}` } };

    // 2. Profile
    await report('Get Profile', () => axios.get(`${BASE_URL}/admin/profile`, auth));

    // 3. Categories
    let category;
    const catOk = await report('Create Category', async () => {
        const res = await axios.post(`${BASE_URL}/admin/categories`, { name: `Test ${Date.now()}`, prefix: 'TST' }, auth);
        category = res.data;
        return `Created: ${category.name}`;
    });

    if (catOk) await report('List Categories', () => axios.get(`${BASE_URL}/admin/categories`));

    // 4. Products
    let product;
    if (catOk) {
        const prodOk = await report('Create Product', async () => {
            const res = await axios.post(`${BASE_URL}/products/admin/add`, {
                name: 'Test Product',
                description: 'Test Desc',
                price: 1000,
                category: category.name,
                stock: { totalQty: 50 }
            }, auth);
            product = res.data;
            return `Created: ${product.productCode}`;
        });

        if (prodOk) {
            await report('Track Click', () => axios.post(`${BASE_URL}/products/${product._id}/click`));
            await report('List Products (Public)', () => axios.get(`${BASE_URL}/products`));
            await report('Update Product Stock (GRN)', () => axios.post(`${BASE_URL}/products/admin/grn`, { productId: product._id, quantity: 10 }, auth));
            await report('Update Product Stock (Return)', () => axios.post(`${BASE_URL}/products/admin/return`, { productId: product._id, quantity: 5 }, auth));

            // 5. Orders
            await report('Create Quotation Log', () => axios.post(`${BASE_URL}/orders`, { items: [{ name: product.name, price: product.price, quantity: 1 }], totalAmount: 1000 }));
            await report('Get Order History', () => axios.get(`${BASE_URL}/orders/admin/history`, auth));

            // 6. Admin Management
            await report('List Admins', () => axios.get(`${BASE_URL}/admin/list`, auth));

            // 7. Cleanup
            await report('Delete Product', () => axios.delete(`${BASE_URL}/products/admin/delete/${product._id}`, auth));
        }
    }

    if (category) await report('Delete Category', () => axios.delete(`${BASE_URL}/admin/categories/${category._id}`, auth));

    finish(results);
}

function finish(results) {
    const md = `# API Test Report\nGenerated at: ${new Date().toLocaleString()}\n\n| Endpoint | Status | Details |\n|----------|--------|---------|\n` +
        results.map(r => `| ${r.name} | ${r.status === 'PASS' ? '✅ PASS' : '❌ FAIL'} | ${r.details} |`).join('\n');

    fs.writeFileSync('api-test-report.md', md);
    console.log('\nReport generated: api-test-report.md');
}

refinedRun();
