"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { loginUser } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      const user = await loginUser(values.email, values.password);
      setUser(user);
      toast.success(`Bienvenido, ${user.name}.`);
      router.replace("/pos");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card
      variant="elevated"
      className="mx-auto w-full max-w-md border-white/15 shadow-[0_0_50px_rgba(255,62,171,0.2)]"
    >
      <CardHeader>
        <div className="mb-3 flex items-center gap-3.5 lg:hidden">
          <Image
            src="/logo.jpg"
            alt="Neon Logo"
            width={44}
            height={44}
            className="size-11 rounded-xl border border-white/20 object-cover shadow-[0_0_16px_rgba(255,62,171,0.4)]"
          />
          <div>
            <p className="font-display text-gradient-neon text-lg font-black tracking-[0.2em] uppercase">
              NEON
            </p>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Drinks & Concentrados
            </p>
          </div>
        </div>
        <CardTitle className="font-display text-xl font-bold text-white">
          Acceso a Neon OS
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Inicia sesión para operar el POS o administrar la operación desde
          cualquier dispositivo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs font-bold text-slate-300">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@clubneon.co"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-destructive text-xs font-medium">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="text-xs font-bold text-slate-300"
            >
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-destructive text-xs font-medium">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button
            className="w-full font-bold"
            size="lg"
            disabled={isSubmitting}
            type="submit"
          >
            <LogIn className="size-4" />
            {isSubmitting ? "Autenticando..." : "Entrar a NEON OS"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
