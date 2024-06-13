import { registerAction } from "@/lib/action";

export default function RegisterForm() {
  return (
    <>
      <form action={registerAction}>
        <input type="text" name="name" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </>
  );
}
