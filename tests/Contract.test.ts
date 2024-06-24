import { Mina } from 'o1js';

const proofsEnabled: boolean = false;
const enforceTransactionLimits: boolean = true;

export async function startLocalBlockchainClient(
  proofsEnabled: boolean = false,
  enforceTransactionLimits: boolean = false
) {
  const Local = await Mina.LocalBlockchain({
    proofsEnabled: proofsEnabled,
    enforceTransactionLimits: enforceTransactionLimits,
  });
  Mina.setActiveInstance(Local);
  const accounts = Local.testAccounts;
  return accounts;
}

describe('Testing contract', () => {
  it('test accounts length', async () => {
    const testAccounts = await startLocalBlockchainClient(
      proofsEnabled,
      enforceTransactionLimits
    );
    expect(testAccounts.length).toBe(10);
  });
});
