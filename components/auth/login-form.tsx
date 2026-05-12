"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Sparkles } from "lucide-react";
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
import { DEMO_PASSWORD } from "@/lib/constants";
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
      email: "operator@neon.local",
      password: DEMO_PASSWORD,
    },
  });

  const handleQuickAccess = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", DEMO_PASSWORD);
  };

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
    <Card className="neon-ring mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Acceso rápido</CardTitle>
        <CardDescription>
          Inicia sesión para operar el POS o administrar la operación desde
          casa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-3">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <p className="text-muted text-xs font-semibold tracking-[0.18em] uppercase">
              Acceso demo
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAccess("operator@neon.local")}
              >
                <Sparkles className="size-4" />
                Operador
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAccess("admin@neon.local")}
              >
                <Sparkles className="size-4" />
                Admin
              </Button>
            </div>
            <p className="text-muted text-xs">
              Contraseña demo:{" "}
              <span className="text-foreground">{DEMO_PASSWORD}</span>
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={isSubmitting}
            type="submit"
          >
            <LogIn className="size-4" />
            {isSubmitting ? "Entrando..." : "Entrar a NEON OS"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
