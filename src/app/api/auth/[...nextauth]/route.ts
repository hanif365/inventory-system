import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [credentials.email],
          });

          const user = result.rows[0];

          if (!user) {
            throw new Error("User not found!");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password as string
          );

          if (isPasswordCorrect) {
            return {
              id: String(user.id),
              name: String(user.name),
              email: String(user.email),
            };
          } else {
            throw new Error("Wrong credentials!");
          }
        } catch (err) {
          console.error("Authentication error:", err);
          throw new Error("Something went wrong!");
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    error: "/login",
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        console.error('No email provided from OAuth provider');
        return false;
      }

      if (account?.provider === "credentials") {
        return true;
      }

      // Handle OAuth sign-ins
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [user.email],
          });

          if (result.rows.length === 0) {
            // Create new user if they don't exist
            await db.execute({
              sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
              args: [
                user.name ?? '',
                user.email,
                await bcrypt.hash(Math.random().toString(36), 10),
              ],
            });
          }
          return true;
        } catch (error) {
          console.error("OAuth sign-in error:", error);
          return '/login?error=OAuthSignInError';  // Redirect to login with error
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
