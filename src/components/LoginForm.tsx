import { githubLogin, loginAction } from "@/lib/action";

export default function LoginForm() {
  return (
    <>
      <form action={loginAction}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <form action={githubLogin}>
        <button type="submit">Github Login</button>
      </form>
    </>
  );
}
