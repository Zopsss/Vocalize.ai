/* eslint-disable @typescript-eslint/no-namespace */
import { ResumeSchemaType } from "./constants";

declare global {
  namespace PrismaJson {
    type ResumeObjectType = ResumeSchemaType;
  }
}

export {};
