import db from './db.js';

const addVolunteer = async (accountId, projectId) => {
    const query = `
        INSERT INTO public.project_volunteer (account_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (account_id, project_id) DO NOTHING;
    `;

    await db.query(query, [accountId, projectId]);
};

const removeVolunteer = async (accountId, projectId) => {
    const query = `
        DELETE FROM public.project_volunteer
        WHERE account_id = $1 AND project_id = $2;
    `;

    await db.query(query, [accountId, projectId]);
};

const isVolunteer = async (accountId, projectId) => {
    const query = `
        SELECT 1
        FROM public.project_volunteer
        WHERE account_id = $1 AND project_id = $2;
    `;

    const result = await db.query(query, [accountId, projectId]);

    return result.rowCount > 0;
};

const getProjectsByVolunteer = async (accountId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON o.organization_id = p.organization_id
        JOIN public.project_volunteer pv ON pv.project_id = p.project_id
        WHERE pv.account_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(query, [accountId]);

    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    isVolunteer,
    getProjectsByVolunteer
};
