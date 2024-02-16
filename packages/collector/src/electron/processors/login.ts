import { Context } from "../context.js";
import { Processor } from "../processor.js";
import { Profile } from "../profile.js";
import { EventEmitter } from "node:events";
import { spaced } from "../parse-util.js";

export class LoginProcessor extends EventEmitter implements Processor {
  private currentProfile: Profile;

  constructor() {
    super();
  }

  get name(): string {
    return "login";
  }

  process(line: string, context: Context): void {
    const [time, notice, event, ...parts] = line.split(" ");

    if (event !== "<AccountLoginCharacterStatus_Character>") {
      return;
    }

    const obj = spaced(parts);

    const profile = new Profile(
      obj.get("geid"),
      obj.get("accountId"),
      obj.get("name"),
      obj.get("dna"),
      obj.get("sex"),
      obj.get("race")
    );

    if (this.currentProfile && this.currentProfile.geid === profile.geid) {
      return;
    }

    this.currentProfile = profile;
    context.set("profile", profile);
    this.emit("login", profile);
  }
}
