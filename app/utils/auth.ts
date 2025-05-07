// app/utils/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from 'bcrypt';

const prisma = new PrismaClient(); // Or import prisma from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            // Optional profile callback...
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // --- Explicit Type Checking ---
                const email = credentials?.email;
                const password = credentials?.password;

                // 1. Validate that email and password are provided and are strings
                if (typeof email !== 'string' || email.length === 0 || typeof password !== 'string' || password.length === 0) {
                    console.error('Credentials missing or invalid type');
                    return null; // Return null if validation fails
                }
                // --- End Explicit Type Checking ---

                // 2. Find user by email (now TypeScript knows 'email' is a string)
                const user = await prisma.user.findUnique({
                    where: { email: email }, // Use the validated 'email' constant
                });

                // 3. Check if user exists and has a password stored (for credentials login)
                if (!user || !user.password) {
                    // Log why it failed: no user OR user exists but has no password (likely OAuth user)
                    console.error(`Login failed for ${email}: No user found or password not set (is this an OAuth user?)`);
                    return null;
                }

                // 4. Compare passwords (now TypeScript knows 'password' is a string, and user.password is checked)
                const isValidPassword = await compare(password, user.password); // Use validated 'password' constant

                if (!isValidPassword) {
                    console.error(`Login failed for ${email}: Invalid password`);
                    return null;
                }

                // 5. Login successful
                console.log('Credentials Login Successful for:', user.email);
                // Return user object compatible with NextAuth User type (must include id)
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    image: user.image
                    // Do NOT return the password hash
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) { // Simplified params if others aren't used
            // Add user ID from the user object (available on initial sign in) to the token
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Add user ID from the JWT token to the session object
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
        // Optional signIn callback...
    },
    pages: {
        signIn: "/signin",
    },
    // Optional debug...
    secret: process.env.AUTH_SECRET, // or NEXTAUTH_SECRET
});