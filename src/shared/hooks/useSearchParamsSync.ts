import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSearchParamsStore } from "@/store/searchStore";

export const useSearchParamsSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const syncWithUrl = useSearchParamsStore((state) => state.syncWithUrl);
  const getSearchParamsString = useSearchParamsStore(
    (state) => state.getSearchParamsString
  );
  const searchQuery = useSearchParamsStore((state) => state.searchQuery);
  const sortKey = useSearchParamsStore((state) => state.sortKey);
  const sortOrder = useSearchParamsStore((state) => state.sortOrder);
  const page = useSearchParamsStore((state) => state.page);

  useEffect(() => {
    syncWithUrl(location.search);
  }, [location.search, syncWithUrl]);

  useEffect(() => {
    const searchString = getSearchParamsString();
    const newUrl = searchString ? `?${searchString}` : "";

    navigate(newUrl, { replace: true });
  }, [searchQuery, sortKey, sortOrder, page, getSearchParamsString, navigate]);
};
