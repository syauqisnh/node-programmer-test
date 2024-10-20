import connection from '../config/database.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { userSchema, loginSchema, updateUserSchema } from '../validations/user-validation.js';
import jwt from "jsonwebtoken"

const registrasi = async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 102,
            message: error.details[0].message,
            data: null
        });
    }

    const checkEmailQuery = `
        SELECT COUNT(*) as count FROM users WHERE email = ?
    `;

    try {
        const [rows] = await connection.execute(checkEmailQuery, [email]);
        const emailExists = rows[0].count > 0;

        if (emailExists) {
            return res.status(400).json({
                status: 101,
                message: "Email sudah terdaftar",
                data: null
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (email, first_name, last_name, password, profile_image)
            VALUES (?, ?, ?, ?, ?)
        `;

        await connection.execute(query, [email, first_name, last_name, hashPassword, null]);
        res.status(200).json({
            status: 0,
            message: "Registrasi berhasil silahkan login",
            data: null
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 102,
            message: error.details[0].message,
            data: null
        });
    }

    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({
                status: 103,
                message: "Username atau password salah",
                data: null
            });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 103,
                message: "Email atau password salah",
                data: null
            });
        }

        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRED,
        });

        res.status(200).json({
            status: 0,
            message: "Login Sukses",
            data: { token }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const profile = async (req, res) => {
    try {
        const email = req.user.id;
        const query = `SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?`;
        const [user] = await connection.execute(query, [email]);

        if (user.length === 0) {
            return res.status(404).json({
                status: 102,
                message: "Pengguna tidak ditemukan.",
                data: null
            });
        }

        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: user[0]
        });
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const email = req.user.id; 

        const { error } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 102,
                message: error.details[0].message,
                data: null
            });
        }

        const { first_name, last_name } = req.body;

        const updateQuery = `
            UPDATE users 
            SET first_name = ?, last_name = ?
            WHERE email = ?
        `;

        const [updateResult] = await connection.execute(updateQuery, [first_name, last_name, email]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                status: 102,
                message: "Pengguna tidak ditemukan atau tidak ada perubahan yang dilakukan.",
            });
        }

        const selectQuery = `
            SELECT email, first_name, last_name, profile_image
            FROM users
            WHERE email = ?
        `;

        const [rows] = await connection.execute(selectQuery, [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 102,
                message: "Pengguna tidak ditemukan.",
            });
        }

        const user = rows[0];

        res.status(200).json({
            status: 0,
            message: "Update Profile berhasil",
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_images: user.profile_image || null
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const profileImg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 102,
                message: "File gambar profil harus diupload",
                data: null
            });
        }

        const email = req.user.id;
        const profileImagePath = req.file.path;
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;

        console.log("Profile image path:", profileImagePath);
        console.log("User email:", email);

        const oldQuery = `SELECT profile_image, first_name, last_name FROM users WHERE email = ?`;
        const [oldResult] = await connection.execute(oldQuery, [email]);
        
        if (oldResult.length > 0) {
            const oldImageUrl = oldResult[0].profile_image;

            if (oldImageUrl) {
                const oldImagePath = path.join(process.cwd(), 'uploads/images', path.basename(oldImageUrl));

                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old profile image:", err);
                    } else {
                        console.log("Old profile image deleted successfully.");
                    }
                });
            } else {
                console.log("No old image to delete.");
            }
        }

        const query = `UPDATE users SET profile_image = ? WHERE email = ?`;
        const [result] = await connection.execute(query, [imageUrl, email]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 102,
                message: "Pengguna tidak ditemukan atau tidak ada perubahan yang dilakukan",
                data: null
            });
        }

        const updatedUserQuery = `SELECT first_name, last_name FROM users WHERE email = ?`;
        const [updatedUser] = await connection.execute(updatedUserQuery, [email]);

        res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: { email, first_name: updatedUser[0].first_name, last_name: updatedUser[0].last_name, profile_image: imageUrl }
        });

    } catch (error) {
        console.error("Error uploading profile image:", error.message);
        res.status(500).json({
            status: 500,
            message: "Terjadi kesalahan saat mengupload gambar profil.",
            data: null
        });
    }
};

export { registrasi, login, update, profile, profileImg };
