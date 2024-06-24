import {
  Mina,
  MerkleMap,
  Field,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'o1js';

import { Contract } from '../src/Contract';

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

  let testAccounts: any;

  it('test accounts length', async () => {
    testAccounts = await startLocalBlockchainClient(
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

  it('deploys app with admin key', async () => {
    if (proofsEnabled) {
      await Contract.compile();
    }

    const ContractPrivateKey: PrivateKey = PrivateKey.random();
    const zkAppAddress: PublicKey = ContractPrivateKey.toPublicKey();
    const zkAppInstance: Contract = new Contract(zkAppAddress);

    const pubKey: PublicKey = testAccounts[0];

    let initialBalance = 10_000_000_000;

    const deployTx = await Mina.transaction(pubKey, async () => {
      AccountUpdate.fundNewAccount(pubKey).send({
        to: pubKey,
        amount: initialBalance,
      });
      await zkAppInstance.deploy();
    });

    await deployTx.prove();
    await deployTx.sign([testAccounts[0].key, ContractPrivateKey]).send();
    expect(zkAppInstance.admin.get().toBase58()).toBe(
      testAccounts[0].toBase58()
    );
  });
});
