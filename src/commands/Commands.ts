import { Command } from "./Command";
import { Enable } from "./Enable";
import { Remind } from "./Remind";
import { RemindMe } from "./RemindMe";
import { Unsubscribe } from "./Unsubscribe";

export const Commands: Command[] = [Remind, RemindMe, Unsubscribe, Enable];
