import LoginForm from "@/pages/auth/LoginForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <LoginForm/>
   </div>
  );
}
