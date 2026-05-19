import bcrypt from 'bcryptjs';
import { userData } from '../data/user.data.js';
import { signJWT } from '../lib/auth.js';

/**
 * Service layer for Authentication operations.
 * Contains business logic for login/credential verification.
 */
export const authService = {
  /**
   * Authenticate a user by email and password.
   * Returns a signed JWT token and user info on success, or null on failure.
   */
  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`[AUTH-DEBUG] Login attempt for email: "${email}" (Normalized: "${normalizedEmail}")`);

    const user = await userData.findByEmail(normalizedEmail);

    if (!user) {
      console.log(`[AUTH-DEBUG] User not found in database for email: "${normalizedEmail}"`);
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    console.log(`[AUTH-DEBUG] Password correct: ${isPasswordCorrect}`);

    if (!isPasswordCorrect) {
      return null;
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },
};
