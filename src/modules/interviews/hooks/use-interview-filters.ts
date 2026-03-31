import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useInterviewsFilters = () => {
  return useQueryStates({
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
