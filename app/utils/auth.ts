import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { User } from "next-auth";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(
                credentials: Partial<Record<"email" | "password", unknown>>
            ): Promise<User | null> {
                const email = credentials?.email;
                const password = credentials?.password;

                if (
                    typeof email !== "string" ||
                    email.length === 0 ||
                    typeof password !== "string" ||
                    password.length === 0
                ) {
                    console.error("Credentials missing or invalid type");
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) {
                    console.error(
                        `Login failed for ${email}: No user found or password not set`
                    );
                    throw new CredentialsSignin();
                }

                const isValidPassword = await compare(password, user.password);
                if (!isValidPassword) {
                    console.error(`Login failed for ${email}: Invalid password`);
                    throw new CredentialsSignin();
                }

                console.log("✅ Credentials Login Successful for:", user.email);

                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    image: user.image,
                    verified: user.verified,
                    companyId: user.companyId,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.firstName = user.firstName ?? null;
                token.lastName = user.lastName ?? null;
                token.email = user.email ?? null;
                token.image = user.image ?? null;

                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { verified: true, companyId: true },
                });

                token.verified = dbUser?.verified ?? false;
                token.companyId = dbUser?.companyId ?? null;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.verified = token.verified as boolean;
                session.user.firstName = token.firstName as string | null;
                session.user.lastName = token.lastName as string | null;
                session.user.image = token.image as string | null;
                session.user.companyId = token.companyId as string | null;
                session.user.name = [
                    token.firstName,
                    token.lastName
                ].filter(Boolean).join(" ");
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.AUTH_SECRET,
});
