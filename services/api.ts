// Local stand-in for Inventory's Odoo-backed `api` client. AIBoard has no
// Odoo/Snabbb backend, so the session lookup in PetRoom's handlePlay
// resolves to nulls instead of real partner/session info.
export const api = {
  post: async (_path: string, _body?: unknown) => ({
    data: { result: { partner_id: null, uid: null } },
  }),
};
