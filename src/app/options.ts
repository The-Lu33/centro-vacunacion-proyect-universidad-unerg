import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/utils/conn";  
export const options: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
  
          const user = await prisma.users.findUnique({
            where: { email: credentials.email }
          });
  
          if (!user) {
            return null;
          }
  
          const isPasswordValid = await compare(
            credentials.password, 
            user.password
          );
  
          if (!isPasswordValid) {
            return null;
          }
  
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      })
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.role = token.role;
        return session;
      }
    },
    secret: process.env.NEXTAUTH_SECRET
  };

