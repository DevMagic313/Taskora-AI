import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes: redirect to login if not authenticated
    const protectedPaths = [
        "/dashboard",
        "/tasks",
        "/ai-planning",
        "/analytics",
        "/notifications",
        "/pricing",
        "/settings",
    ];

    const isProtectedRoute = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // Public-only routes: redirect to dashboard if authenticated
    const publicOnlyPaths = ["/login", "/register"];
    const isPublicOnlyRoute = publicOnlyPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicOnlyRoute && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // Allow authenticated users to view the landing page freely
    // (Removed the automatic redirect from "/" to "/dashboard")

    return supabaseResponse;
}
