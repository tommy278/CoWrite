# Supabase Auth Foundation

A production-ready React/TanStack project foundation focused on authentication with Supabase. Includes email/password auth, OAuth login, password reset, and protected routes, along with a flexible structure to build on for your projects.

---

## Features

- **Email/password authentication**  
- **OAuth login**: Google & GitHub (extendable to more providers)  
- **Protected dashboard** with `_authed` layout  
- **Password reset/update** functionality  
- **User context** for easy access to authenticated user information  
- **Server functions** for consistent auth handling  
- **HTTP-only cookie persistence** for sessions  

---

## Usage

- **Login:** `/auth/login`  
- **Register:** `/auth/register`  
- **Dashboard:** `/dashboard` (requires authentication)  
- **OAuth login:** Google/GitHub buttons on the login page  
- **Password reset/update:** Form available under `/auth/reset-password`  

---

## How to Extend

1. Use `UserContext` to access user info anywhere in your app.  
2. Wrap new pages with the `_authed` layout for route protection.  
3. Add additional OAuth providers by extending `supabase.auth.signInWithOAuth()`.  
4. Customize UI without affecting the authentication logic.  

---

## Notes

- OAuth and email/password authentication use different session handling, but both are persisted in **HTTP-only cookies**.  
- Server functions are used to ensure consistent auth handling across your app.  
- This foundation focuses on **authentication and project structure**; UI/UX can be adapted freely.  
- Ideal for bootstrapping new projects with secure authentication out-of-the-box.  

---

## License

MIT License – feel free to use, modify, and build upon this foundation for personal or professional projects.

    
