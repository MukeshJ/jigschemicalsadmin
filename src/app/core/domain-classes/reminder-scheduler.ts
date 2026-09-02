import { ApplicationEnums } from "./application.enum";

export interface ReminderScheduler {
  id: string;
  subject: string;
  message: string;
  createdDate: Date
  referenceId?: string;
  applicationEnums?: ApplicationEnums;
  application?: number;
  duration?: Date | string;
  userName?: string;
}
