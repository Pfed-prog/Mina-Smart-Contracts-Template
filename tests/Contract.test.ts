import { Mina, MerkleMap, Field } from 'o1js';

const proofsEnabled: boolean = false;
const enforceTransactionLimits: boolean = true;

async function startLocalBlockchainClient(
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
  const map: MerkleMap = new MerkleMap();

  it('test accounts length', async () => {
    const testAccounts = await startLocalBlockchainClient(
      proofsEnabled,
      enforceTransactionLimits
    );
    expect(testAccounts.length).toBe(10);
  });

  it('test merkle map default root', async () => {
    expect(map.getRoot()).toStrictEqual(
      Field(
        '22731122946631793544306773678309960639073656601863129978322145324846701682624'
      )
    );
  });
});
