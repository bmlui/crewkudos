// lib/auth.ts

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// --- Config ---
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const transport = nodemailer.createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          replyTo: process.env.EMAIL_REPLY_TO || provider.from,
          subject: `Sign in to ${new URL(url).host}`,
          text: `Sign in to ${new URL(url).host}\n${url}`,
          html: `<p>Sign in to <strong>${new URL(url).host}</strong></p>
                 <p><a href="${url}">Click here to sign in</a></p>
                 <p>Or copy and paste this URL into your browser:</p>
                 <p>${url}</p>`,
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    // signIn: "/auth/signin",
    // verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn({ user }) {
      // Reject sign-in if user email doesn't exist in your DB
      if (!user.email) {
        // ⛔ Prevent magic link from being sent or used
        return false;
      }
      const allowedUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!allowedUser) {
        // ⛔ Prevent magic link from being sent or used
        return false;
      }

      return true;
    },
  },
};

// --- Auth.js v5 exports ---
export const {
  handlers, signIn, signOut, auth
} = NextAuth(authConfig);

// --- Optional compatibility alias ---
export const authOptions = authConfig;