import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import {
    getAllAccounts,
    getAccountByEmail,
    createAccount
} from '../models/accounts.js';
import { getProjectsByVolunteer } from '../models/volunteers.js';

const registerValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters.')
        .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('A valid email address is required.')
        .normalizeEmail()
        .isLength({ max: 255 }).withMessage('Email must be 255 characters or fewer.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
];

const loginValidationRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('A valid email address is required.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
];

const showRegister = (req, res) => {
    res.render('register', {
        title: 'Register',
        account: { name: '', email: '' },
        errors: []
    });
};

const processRegister = async (req, res) => {
    const errors = validationResult(req);
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';

    if (!errors.isEmpty()) {
        return res.status(400).render('register', {
            title: 'Register',
            account: { name, email },
            errors: errors.array()
        });
    }

    const existing = await getAccountByEmail(email);

    if (existing) {
        return res.status(400).render('register', {
            title: 'Register',
            account: { name, email },
            errors: [{ msg: 'An account with that email already exists.' }]
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createAccount(name, email, hashedPassword);

    req.flash('success', 'Your account was created. Please log in.');
    res.redirect('/login');
};

const showLogin = (req, res) => {
    res.render('login', {
        title: 'Log In',
        account: { email: '' },
        errors: []
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';

    if (!errors.isEmpty()) {
        return res.status(400).render('login', {
            title: 'Log In',
            account: { email },
            errors: errors.array()
        });
    }

    const account = await getAccountByEmail(email);

    if (!account || !(await bcrypt.compare(password, account.password))) {
        return res.status(400).render('login', {
            title: 'Log In',
            account: { email },
            errors: [{ msg: 'Invalid email or password.' }]
        });
    }

    // Store only non-sensitive fields in the session (never the password hash).
    req.session.account = {
        account_id: account.account_id,
        name: account.name,
        email: account.email,
        role: account.role
    };

    req.flash('success', `Welcome back, ${account.name}!`);
    res.redirect('/dashboard');
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

const showDashboard = async (req, res) => {
    const volunteerProjects = await getProjectsByVolunteer(req.session.account.account_id);
    res.render('dashboard', { title: 'Dashboard', volunteerProjects });
};

const showUsers = async (req, res) => {
    const accounts = await getAllAccounts();
    res.render('users', { title: 'Registered Users', accounts });
};

export {
    showRegister,
    processRegister,
    showLogin,
    processLogin,
    logout,
    showDashboard,
    showUsers,
    registerValidationRules,
    loginValidationRules
};
