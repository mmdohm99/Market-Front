import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { getActiveCategories } from "@/store/admin/category-slice";
import { getActiveBrands } from "@/store/admin/brand-slice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search, ArrowUpDownIcon } from "lucide-react";

function createSearchParamsHelper(keyword, filterParams) {
  const queryParams = [`keyword=${encodeURIComponent(keyword)}`];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const prevFiltersRef = useRef({});

  // Initialize categories and brands on mount
  useEffect(() => {
    dispatch(getActiveCategories());
    dispatch(getActiveBrands());
  }, [dispatch]);

  // Sync filters and keyword from URL params - URL is the source of truth
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    const urlCategory = searchParams.get("category");
    const urlBrand = searchParams.get("brand");

    // Update keyword from URL
    if (urlKeyword !== null) {
      setKeyword(urlKeyword);
    }

    // Sync filters from URL - this ensures checkboxes reflect URL state
    const urlFilters = {};
    if (urlCategory) {
      urlFilters.category = urlCategory.split(",");
    }
    if (urlBrand) {
      urlFilters.brand = urlBrand.split(",");
    }

    // Always sync filters from URL to ensure checkboxes match URL state
    // Compare with previous filters to avoid unnecessary updates
    const filtersChanged =
      JSON.stringify(urlFilters) !== JSON.stringify(prevFiltersRef.current);

    if (filtersChanged) {
      prevFiltersRef.current = urlFilters;
      setFilters(urlFilters);
    }

    // Perform search if keyword exists
    if (urlKeyword && urlKeyword.trim().length > 0) {
      dispatch(
        getSearchResults({
          keyword: urlKeyword,
          filterParams: urlFilters,
          sortParams: sort,
        }),
      );
      setHasSearched(true);
    } else if (!urlKeyword) {
      setHasSearched(false);
    }
  }, [searchParams, dispatch, sort]);

  // Update URL when filters or sort change from user action
  useEffect(() => {
    // Only update if filters actually changed and it's a user action (not from URL sync)
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);

    if (filtersChanged && hasSearched && keyword && keyword.trim().length > 0) {
      prevFiltersRef.current = filters;
      const queryString = createSearchParamsHelper(keyword, filters);
      setSearchParams(new URLSearchParams(queryString));
      dispatch(
        getSearchResults({
          keyword: keyword.trim(),
          filterParams: filters,
          sortParams: sort,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  function handleSearch() {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 0) {
      const queryString = createSearchParamsHelper(keyword.trim(), filters);
      setSearchParams(new URLSearchParams(queryString));
      dispatch(
        getSearchResults({
          keyword: keyword.trim(),
          filterParams: filters,
          sortParams: sort,
        }),
      );
      setHasSearched(true);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
      setHasSearched(false);
    }
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);

      if (cpyFilters[getSectionId].length === 0) {
        delete cpyFilters[getSectionId];
      }
    }

    setFilters(cpyFilters);
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId,
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        product: productList.find(
          (item) =>
            item._id === getCurrentProductId || item.id === getCurrentProductId,
        ),
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center gap-2">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            onKeyPress={handleKeyPress}
            className="py-6"
            placeholder="Search Products..."
          />
          <Button onClick={handleSearch} size="lg" className="py-6 px-8">
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
      {hasSearched ? (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
          <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Search Results</h2>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {searchResults?.length || 0} Products
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ArrowUpDownIcon className="h-4 w-4" />
                      <span>Sort by</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={handleSort}
                    >
                      {sortOptions.map((sortItem) => (
                        <DropdownMenuRadioItem
                          value={sortItem.id}
                          key={sortItem.id}
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {!searchResults.length ? (
              <div className="p-8 text-center">
                <h1 className="text-5xl font-extrabold">No result found!</h1>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {searchResults.map((item) => (
                  <ShoppingProductTile
                    key={item._id}
                    handleAddtoCart={handleAddtoCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Enter a keyword to search for products
          </p>
        </div>
      )}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
