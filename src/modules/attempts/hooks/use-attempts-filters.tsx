import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

import { InterviewStatus } from "@/generated/prisma/enums";

export const useAttemptsFilters = () => {
  return useQueryStates({
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(InterviewStatus)).withOptions({
      clearOnDefault: true,
    }),
    interviewId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
