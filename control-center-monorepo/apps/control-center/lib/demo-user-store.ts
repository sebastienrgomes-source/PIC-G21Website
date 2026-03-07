export interface DemoUserRecord {
  email: string;
  fullName: string;
  password: string;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const demoUsers = new Map<string, DemoUserRecord>([
  [
    normalizeEmail('sebastienrgomes@gmail.com'),
    {
      email: 'sebastienrgomes@gmail.com',
      fullName: 'S\u00e9bastien R\u00e9gnier Gomes',
      password: '1234567890',
    },
  ],
]);

export const getDemoUserByEmail = (email: string): DemoUserRecord | null => {
  return demoUsers.get(normalizeEmail(email)) ?? null;
};

export const createDemoUser = (input: DemoUserRecord): DemoUserRecord | null => {
  const key = normalizeEmail(input.email);
  if (demoUsers.has(key)) return null;

  const user: DemoUserRecord = {
    email: input.email.trim(),
    fullName: input.fullName.trim(),
    password: input.password,
  };

  demoUsers.set(key, user);
  return user;
};

export const validateDemoCredentials = (email: string, password: string): DemoUserRecord | null => {
  const user = getDemoUserByEmail(email);
  if (!user) return null;
  return user.password === password ? user : null;
};
