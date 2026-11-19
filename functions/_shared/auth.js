
export async function requireUser(request, env) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return {
      user: null,
      response: Response.json(
        { error: "Please sign in to use RETIMEA AI." },
        { status: 401 }
      )
    };
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return {
      user: null,
      response: Response.json(
        { error: "Authentication service is not configured." },
        { status: 503 }
      )
    };
  }

  try {
    const supabaseResponse = await fetch(
      `${env.SUPABASE_URL.replace(/\/+$/, "")}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          "apikey": env.SUPABASE_ANON_KEY,
          "Authorization": authorization
        }
      }
    );

    if (!supabaseResponse.ok) {
      return {
        user: null,
        response: Response.json(
          { error: "Your session is invalid or expired. Please sign in again." },
          { status: 401 }
        )
      };
    }

    const user = await supabaseResponse.json();

    if (!user || !user.id) {
      return {
        user: null,
        response: Response.json(
          { error: "Unable to verify your account." },
          { status: 401 }
        )
      };
    }

    return {
      user,
      response: null
    };

  } catch (error) {
    return {
      user: null,
      response: Response.json(
        { error: "Authentication service is temporarily unavailable." },
        { status: 503 }
      )
    };
  }
}
