"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useSpinner } from "@/components/ui/spinner-provider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { show, hide } = useSpinner();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      show();
      e.preventDefault();
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result?.error === "CredentialsSignin") {
          toast({
            title: "Error",
            description: "Credenciales inválidas",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    } finally {
      hide();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
