import db from './db.js';

const getAllProjects = async () => {
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
        ORDER BY p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getUpcomingProjects = async (limit = 5) => {
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
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date
        LIMIT $1;
    `;

    const result = await db.query(query, [limit]);

    return result.rows;
};

const getProjectById = async (projectId) => {
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
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows[0];
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            title,
            description,
            location,
            project_date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
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
        JOIN public.project_category pc ON pc.project_id = p.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectById,
    getProjectsByOrganizationId,
    getProjectsByCategoryId
};
