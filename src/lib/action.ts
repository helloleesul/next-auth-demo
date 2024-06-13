"use server";

import { redirect } from "next/navigation";
import connectDB from "./db";
import { User } from "./schema";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";

/**
 * 회원가입
 */
export async function registerAction(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) {
    console.log("모두 작성해 주세요!");
    return;
  }

  connectDB();

  // 회원 존재 여부 체크
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("이미 가입된 회원입니다.");
    return;
  }

  // 비밀번호 암호화
  const hashPassword = await hash(String(password), 10);
  const newUser = new User({
    name,
    email,
    password: hashPassword,
  });

  // 유저 저장
  await newUser.save();
  redirect("/login");
}

/**
 * 로그인
 */
export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    console.log("모두 작성해 주세요!");
    return;
  }

  try {
    // auth.js 연동
    // console.log(email, password);
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (err) {
    console.log(err);
  }
  redirect("/");
}

/**
 * github 로그인
 */
export async function githubLogin() {
  await signIn("github", { callbackUrl: "/" });
}

export async function logoutAction() {
  await signOut();
}
