// Mock Supabase client to allow UI to compile during migration to Express backend
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: { id: "test-user", email: "test@example.com" } }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
    signUp: async () => ({ data: { session: null, user: null }, error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: {}, error: null })
      }),
      order: async () => ({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: {}, error: null })
      })
    }),
    upsert: async () => ({ error: null }),
    update: () => ({
      eq: async () => ({ error: null })
    }),
    delete: () => ({
      eq: async () => ({ error: null })
    })
  })
};
