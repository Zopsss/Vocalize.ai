import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const filtersSearchParams = {
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const loadFiltersSearchParams = createLoader(filtersSearchParams);
