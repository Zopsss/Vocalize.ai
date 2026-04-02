import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useAttemptsFilters = () => {
  return useQueryStates({
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
