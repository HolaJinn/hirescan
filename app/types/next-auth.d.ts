import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            image: string | null;
            verified: boolean;
            companyId?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        image: string | null;
        verified: boolean;
        companyId: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        image: string | null;
        verified: boolean;
        companyId?: string | null;
    }
}
