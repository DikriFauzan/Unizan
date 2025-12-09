export const AdminBillingController = {
    stats(req, res) {
        res.json({ ok: true, used: 0, quota: 10000 });
    }
};
