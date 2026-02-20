# Setup de Supabase Edge Functions

Necesitas crear dos Edge Functions en tu proyecto de Supabase para que la recuperación de contraseña funcione.

## 1. Crear la estructura de carpetas

En tu proyecto, crea esta estructura:
```
supabase/
  functions/
    send-recovery-code/
      index.ts
    reset-password/
      index.ts
```

## 2. Crear `send-recovery-code` Edge Function

Ve a tu dashboard de Supabase → Functions → Create a new function

**Nombre:** `send-recovery-code`

**Código:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(JSON.stringify({ error: "Missing email or code" }), {
        status: 400,
      });
    }

    // Aquí puedes integrar tu servicio de email favorito
    // Opciones: Resend, SendGrid, Twilio SendGrid, etc.
    
    // EJEMPLO CON RESEND (recomendado):
    // Primero instala: supabase functions deploy send-recovery-code
    // Luego configura tu API key de Resend en variables de entorno
    
    // Por ahora, solo retornamos success
    // El código ya se guardó en la BD desde el cliente
    
    console.log(`Recovery code ${code} sent to ${email}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Código enviado al correo" 
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

## 3. Crear `reset-password` Edge Function

**Nombre:** `reset-password`

**Código:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // Inicializar cliente Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Verificar que el código sea válido
    const { data: codeData, error: codeError } = await supabase
      .from("password_recovery_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (codeError || !codeData) {
      return new Response(JSON.stringify({ error: "Invalid or expired code" }), {
        status: 400,
      });
    }

    // Obtener el user_id del email
    const { data: users, error: userError } = await supabase.auth.admin
      .listUsers();

    if (userError) throw userError;

    const user = users.users.find((u) => u.email === email);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Actualizar contraseña
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    // Marcar el código como usado
    await supabase
      .from("password_recovery_codes")
      .update({ used: true })
      .eq("code", code)
      .eq("email", email);

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successfully" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

## 4. Integración de Email (Opcional pero Recomendado)

Para que realmente se envíen los emails, integra uno de estos servicios:

### Opción A: Resend (Recomendado - Más fácil)
1. Ve a https://resend.com y crea una cuenta
2. Obtén tu API key
3. En tu Edge Function `send-recovery-code`, reemplaza el código con:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, code } = await req.json();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "noreply@techstore.com",
        to: email,
        subject: "Código de recuperación de contraseña - TechStore",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Recuperar tu contraseña</h2>
            <p>Usa el siguiente código para recuperar tu contraseña:</p>
            <h1 style="color: #7c3aed; font-size: 48px; letter-spacing: 10px; text-align: center;">
              ${code}
            </h1>
            <p>Este código es válido por 10 minutos.</p>
            <p>Si no solicitaste esta recuperación, ignora este email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) throw new Error("Failed to send email");

    return new Response(
      JSON.stringify({ success: true, message: "Email sent" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

4. Luego en Supabase, ve a Project Settings → Edge Functions → Secrets y agrega:
   - Key: `RESEND_API_KEY`
   - Value: Tu API key de Resend

## 5. Desplegar las Edge Functions

En tu terminal:
```bash
supabase functions deploy send-recovery-code
supabase functions deploy reset-password
```

O usa Supabase Dashboard → Functions → Deploy

## Listo! 🎉

Ahora la recuperación de contraseña debería funcionar completamente.
