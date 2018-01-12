import Account from "@account";
import { sleep } from "@utils/Time";
import ScriptAction, { ScriptActionResults } from "../ScriptAction";

export default class StorageGetAutoRegenStoreAction extends ScriptAction {
  public items: number[];
  public store: number;

  constructor(items: number[], store: number) {
    super();
    this.items = items;
    this.store = store;
  }

  public async process(account: Account): Promise<ScriptActionResults> {
    let store = this.store;
    for (let i = 0; i < this.items.length && store > 0; i++) {
      // We'll have to get the items manually instead of using Storage.GetItem()
      const obj = account.game.storage.objects.FirstOrDefault((o) => o.gid === this.items[i]);
      if (!obj) {
        continue;
      }
      // Get the quantity we can actually take
      const validQty = Math.min(store, obj.quantity);
      if (!account.game.storage.getItem(this.items[i], validQty)) {
        continue;
      }
      store -= validQty;
      await sleep(800);
    }
    if (store > 0) {
      account.logger.logWarning("Scripts", "Warning, you don't have anymore required items for AUTO_REGEN");
    }
    return ScriptActionResults.DONE;
  }
}
