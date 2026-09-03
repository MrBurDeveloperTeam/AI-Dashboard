// Local stand-in for Inventory's Odoo credit-deduction call. AIBoard has no
// credit system, so mini-games are always allowed.
export async function consumeGameCredit(
  _odooPartnerId: number,
  _userId: string,
  _sessionId: string
): Promise<boolean> {
  return true;
}
