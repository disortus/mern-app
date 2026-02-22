import { body } from "express-validator";

export const registerValidator = [
    body('email', 'invalid email format').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullname').isLength({ mmin: 3 }),
    body('avatarUrl').optional().isURL()
];

