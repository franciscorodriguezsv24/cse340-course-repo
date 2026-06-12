-- ========================================
-- CSE 340 Service Network — database setup
-- Re-runnable: drops dependent tables first.
-- ========================================

DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS account;

-- ========================================
-- Organization
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project
-- Each project is sponsored by exactly one organization.
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    project_date DATE NOT NULL
);

INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Neighborhood Playground Build', 'Construct a new accessible playground for the local elementary school.', 'Lincoln Elementary, Rexburg, ID', '2026-06-13'),
(1, 'Senior Center Ramp Install', 'Install a wheelchair ramp and refinish the front porch at the senior center.', 'Rexburg Senior Center', '2026-06-27'),
(1, 'Habitat Wall Raising', 'Frame walls for a Habitat for Humanity home with a partner family.', '412 Oak St, Rexburg, ID', '2026-07-11'),
(1, 'Community Garden Shed', 'Build a tool shed for the shared community garden plots.', 'East Main Garden, Rexburg, ID', '2026-07-25'),
(1, 'Park Bench Restoration', 'Sand, stain, and repair benches throughout Smith Park.', 'Smith Park, Rexburg, ID', '2026-08-08'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Spring Planting Day', 'Plant tomatoes, peppers, and herbs in the community garden.', 'East Main Garden, Rexburg, ID', '2026-05-30'),
(2, 'Composting Workshop', 'Free workshop on backyard composting for local families.', 'GreenHarvest HQ, Rexburg, ID', '2026-06-14'),
(2, 'Farmers Market Volunteer', 'Help set up booths and assist vendors at the weekly market.', 'Porter Park, Rexburg, ID', '2026-06-21'),
(2, 'School Garden Build', 'Build raised garden beds at Madison High School.', 'Madison HS, Rexburg, ID', '2026-07-12'),
(2, 'Harvest Distribution', 'Pack and deliver fresh produce to families in need.', 'GreenHarvest HQ, Rexburg, ID', '2026-09-05'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful.', 'Porter Park, Rexburg, ID', '2026-06-06'),
(3, 'Food Drive', 'Help collect and distribute food to those in need.', 'Community Food Basket, Rexburg, ID', '2026-06-20'),
(3, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Madison Library, Rexburg, ID', '2026-07-18'),
(3, 'Blood Drive Support', 'Greet donors and assist staff at the annual blood drive.', 'Madison HS Gym, Rexburg, ID', '2026-08-01'),
(3, 'Winter Coat Drive', 'Sort and distribute donated winter coats and outerwear.', 'UnityServe HQ, Rexburg, ID', '2026-10-17');

-- ========================================
-- Category
-- A service project can be classified under one or more categories.
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Project ↔ Category (many-to-many join table)
-- Composite primary key prevents duplicate associations.
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO project_category (project_id, category_id)
VALUES
-- BrightFuture Builders projects
(1, 3), (1, 2),     -- Playground Build → Community Service, Educational
(2, 3), (2, 4),     -- Senior Ramp → Community Service, Health and Wellness
(3, 3),             -- Habitat Wall Raising → Community Service
(4, 1), (4, 3),     -- Garden Shed → Environmental, Community Service
(5, 1),             -- Park Bench Restoration → Environmental

-- GreenHarvest Growers projects
(6, 1), (6, 2),     -- Spring Planting → Environmental, Educational
(7, 1), (7, 2),     -- Composting Workshop → Environmental, Educational
(8, 3),             -- Farmers Market → Community Service
(9, 2), (9, 1),     -- School Garden Build → Educational, Environmental
(10, 3), (10, 4),   -- Harvest Distribution → Community Service, Health and Wellness

-- UnityServe Volunteers projects
(11, 1), (11, 3),   -- Park Cleanup → Environmental, Community Service
(12, 3), (12, 4),   -- Food Drive → Community Service, Health and Wellness
(13, 2), (13, 3),   -- Tutoring → Educational, Community Service
(14, 4), (14, 3),   -- Blood Drive → Health and Wellness, Community Service
(15, 3);            -- Winter Coat Drive → Community Service

-- ========================================
-- Account
-- Registered users who can log in. Roles control access to
-- protected pages (e.g. only 'admin' may view the users list).
-- Passwords are stored as bcrypt hashes, never plain text.
-- The admin testing account is seeded separately in scripts/init-db.js
-- so its password can be hashed at runtime.
-- ========================================
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);
