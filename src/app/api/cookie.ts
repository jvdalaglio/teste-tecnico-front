"use server";

import { cookies } from "next/headers";

const cookieService = {
  getAccessToken: async (token: string) => {
    const cookieStore = cookies();
    cookies().get(token);
  },
  setAccessToken: async (tokenName: string, token: string, params: any) => {
    return cookies().set(tokenName, token, params);
  },
};

export default cookieService;
