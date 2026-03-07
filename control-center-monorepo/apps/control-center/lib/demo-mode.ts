export const DEMO_AUTH_COOKIE = 'pic_demo_auth';
export const DEMO_EMAIL_COOKIE = 'pic_demo_email';
export const DEMO_NAME_COOKIE = 'pic_demo_name';
export const DEMO_AUTH_VALUE = '1';

export const isDemoMode = (): boolean => process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
