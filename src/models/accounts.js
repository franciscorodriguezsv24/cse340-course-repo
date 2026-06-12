import db from './db.js';

const getAllAccounts = async () => {
    const query = `
        SELECT account_id, name, email, role
        FROM public.account
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getAccountByEmail = async (email) => {
    const query = `
        SELECT account_id, name, email, password, role
        FROM public.account
        WHERE email = $1;
    `;

    const result = await db.query(query, [email]);

    return result.rows[0];
};

const createAccount = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO public.account (name, email, password, role)
        VALUES ($1, $2, $3, 'user')
        RETURNING account_id, name, email, role;
    `;

    const result = await db.query(query, [name, email, hashedPassword]);

    return result.rows[0];
};

export {
    getAllAccounts,
    getAccountByEmail,
    createAccount
};
