import axios from 'axios';

const testLoanFlow = async () => {
    try {
        const api = axios.create({ baseURL: 'http://localhost:5000/api' });

        // 1. Login
        const loginRes = await api.post('/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        const token = loginRes.data.data.accessToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2. Get Initial Stats
        const statsPre = await api.get('/expenses/stats');
        console.log('--- Initial Total Balance:', statsPre.data.data.summary.totalBalance);

        // 3. Create Loan (Borrowing money = Income)
        const createRes = await api.post('/loans', {
            type: 'borrowed',
            person: 'Test Bot',
            amount: 100,
            date: new Date().toISOString()
        });
        const loanId = createRes.data.data.loan._id;
        console.log('--- Created Loan ID:', loanId);

        // 4. Get Post-Loan Stats
        const statsMid = await api.get('/expenses/stats');
        console.log('--- After Borrow Total Balance:', statsMid.data.data.summary.totalBalance);

        // 5. Repay Loan (Repaying = Expense)
        await api.post(`/loans/${loanId}/repay`, {
            amount: 100,
            note: 'Test payback'
        });
        console.log('--- Repaid Loan!');

        // 6. Get Post-Repay Stats
        const statsPost = await api.get('/expenses/stats');
        console.log('--- After Repay Total Balance:', statsPost.data.data.summary.totalBalance);

    } catch (e) {
        console.error(e.response?.data || e.message);
    }
};

testLoanFlow();
