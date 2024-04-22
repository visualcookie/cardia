# cardia

**cardia** is a blood pressure documentation application built with Next.js, using Drizzle as an ORM, and Supabase for authentication and database management. It allows users to easily add and track their blood pressure records.

## Getting Started

To set up cardia locally, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/visualcookie/cardia.git

   OR

   gh repo clone visualcookie/cardia
   ```

2. Navigate to the project directory:

   ```bash
   cd cardia
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Set up your Supabase project:

   - Sign up or log in to [Supabase](https://supabase.io/).
   - Create a new project and database.
   - Set up authentication and obtain your Supabase URL and public key.

5. Configure environment variables:

   Create a `.env.local` file in the root directory and add the following:

   ```plaintext
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-public-key
   ```

6. Run the development server:

   ```bash
   bun run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to access cardia.

## TODO

- [ ] Add data visualization for blood pressure records.
- [ ] Implement reminders or notifications for regular blood pressure checks.
- [ ] Improve the export.

## License

This project is licensed under the "The Unlicense" license. See the [LICENSE.md](LICENSE.md) file for details.
