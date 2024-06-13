import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import connectDB from "./lib/db";
import { User } from "./lib/schema";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("✨credentials", credentials);
        const { email, password } = credentials;
        if (!email || !password) {
          throw new CredentialsSignin("모두 작성해 주세요!");
        }

        connectDB();
        const user = await User.findOne({ email }).select("+password +role");
        if (!user) {
          throw new CredentialsSignin("가입되지 않은 회원입니다.");
        }

        // 회원이 입력한 비밀번호 데이터와 DB의 비밀번호가 같은지 확인
        const isMatched = await compare(String(password), user.password);
        if (!isMatched) {
          throw new CredentialsSignin("비밀번호가 일치하지 않습니다.");
        }

        return {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id,
        };
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // TODO: 구글로그인도 해보기!
  ],
  callbacks: {
    signIn: async ({ user, account }: { user: any; account: any }) => {
      console.log("signIn user", user);
      console.log("signIn account", account);
      // github 로그인일 때
      if (account?.provider === "github") {
        const { name, email } = user;

        await connectDB();

        const existingUser = await User.findOne({ authProviderId: user.id });
        if (!existingUser) {
          await new User({
            name,
            email,
            authProviderId: user.id,
            role: "user",
          }).save();
        }

        const socialUser = await User.findOne({ authProviderId: user.id });

        user.role = socialUser?.role || "user";
        user.id = socialUser?._id || null;

        return true;
      } else {
        return true;
      }
    },
    async jwt({ token, user }: { token: any; user: any }) {
      console.log("jwt token:", token);
      console.log("jwt user:", user);
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.role) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
});
