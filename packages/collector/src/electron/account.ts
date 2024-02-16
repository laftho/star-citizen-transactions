import { Profile } from "./profile.js";
import { Ledger } from "./ledger.js";

export class Account {
  public readonly profile: Profile;
  public readonly ledger: Ledger;

  constructor(profile: Profile) {
    this.profile = profile;
  }
}
