import { Command } from './Command';
import { Enable } from './Enable';
import { Remind } from './Remind';
import { Subscribe } from './Subscribe';
import { Unsubscribe } from './Unsubscribe';

export const Commands: Command[] = [Remind, Subscribe, Unsubscribe, Enable];
