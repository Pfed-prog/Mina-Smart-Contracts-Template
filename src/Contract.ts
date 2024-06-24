import {
  SmartContract,
  DeployArgs,
  Field,
  State,
  state,
  PublicKey,
  Permissions,
  UInt64,
  MerkleMap,
  AccountUpdate,
  method,
} from 'o1js';

export class Contract extends SmartContract {
  @state(PublicKey) admin = State<PublicKey>();
  @state(Field) root = State<Field>();
  @state(Field) totalInited = State<Field>();
  @state(Field) maxSupply = State<Field>();
  @state(UInt64) fee = State<UInt64>();
  @state(UInt64) totalSupply = State<UInt64>();

  async deploy(args?: DeployArgs) {
    await super.deploy(args);

    const permissionToEdit = Permissions.proof();

    this.account.permissions.set({
      ...Permissions.default(),
      editState: permissionToEdit,
      setTokenSymbol: permissionToEdit,
      setZkappUri: permissionToEdit,
      send: permissionToEdit,
      receive: permissionToEdit,
    });
  }

  @method async init() {
    super.init();
    const { sender } = this.verifySenderSignature();
    this.admin.set(sender);
    const emptyMerkleMapRoot: Field = new MerkleMap().getRoot();
    this.root.set(emptyMerkleMapRoot);
    this.account.tokenSymbol.set('PINSAV');
    this.account.zkappUri.set('https://pinsave.app/uri.json');
  }

  private verifySenderSignature(): {
    senderUpdate: AccountUpdate;
    sender: PublicKey;
  } {
    const sender: PublicKey = this.sender.getUnconstrained();
    const senderUpdate: AccountUpdate = AccountUpdate.create(sender);
    senderUpdate.requireSignature();
    return { senderUpdate: senderUpdate, sender: sender };
  }
}
