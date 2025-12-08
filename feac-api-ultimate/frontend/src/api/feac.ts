import api from "./client";

export const FEAC = {
    auth: {
        login: (email: string, pass: string) =>
            api.post("/auth/login", { email, pass }),
        register: (email: string, pass: string) =>
            api.post("/auth/register", { email, pass }),
        me: () => api.get("/auth/me")
    },

    billing: {
        quota: () => api.get("/billing/quota"),
        stripeSync: () => api.post("/billing/sync"),
    },

    build: {
        start: (platform: string) =>
            api.post("/build/start", { platform }),
        status: (buildId: string) =>
            api.get(`/build/status/${buildId}`)
    },

    rights: {
        get: () => api.get("/rights/list"),
        update: (data: any) => api.post("/rights/update", data)
    }
};
