import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import React, { useCallback, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Stack,
  Thumbnail,
  Card,
  Filters,
  ResourceItem,
  ResourceList,
  TextField,
  TextStyle,
  Heading,
  Checkbox,
  Link,
  ChoiceList,
  Pagination,
  Toast,
  Popover,
  ActionList,
  Spinner,
  Loading,
  FormLayout,
} from "@shopify/polaris";
import EditQuantity from "./EditQuantity";
import emailjs from "emailjs-com";
import axios from "axios";

const SAVED_SEARCH_CREATE = gql`
  mutation savedSearchCreate($input: SavedSearchCreateInput!) {
    savedSearchCreate(input: $input) {
      savedSearch {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const SAVED_SEARCH_DELETE = gql`
  mutation savedSearchDelete($input: SavedSearchDeleteInput!) {
    savedSearchDelete(input: $input) {
      deletedSavedSearchId
      shop {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const SAVED_SEARCH_UPDATE = gql`
  mutation savedSearchUpdate($input: SavedSearchUpdateInput!) {
    savedSearchUpdate(input: $input) {
      savedSearch {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_All_PRODUCTS = gql`
  query getAllProducts(
    $numProducts: Int!
    $cursor: String
    $sort: ProductSortKeys!
    $reverse: Boolean!
    $query: String
  ) {
    shop {
      url
    }
    products(
      first: $numProducts
      after: $cursor
      sortKey: $sort
      reverse: $reverse
      query: $query
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          title
          id
          images(first: 1) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 6) {
            edges {
              node {
                title
                id
                sku
                inventoryQuantity
                inventoryItem {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Sandbox = (props) => {
  console.log("Sandbox rendering..");

  const saveFilterHandler = () => {
    createSavedSearch({
      variables: {
        input: {
          resourceType: "PRODUCT",
          name: filterValue,
          query: query,
        },
      },
    });
    togglePopoverActive();
    handleFiltersClearAll();
    props.callback();
  };

  const [popoverActive, setPopoverActive] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleFilterValueChange = useCallback(
    (value) => setFilterValue(value),
    []
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Save Filter
    </Button>
  );

  const [createSavedSearch, { cLoading, cError, cData }] = useMutation(
    SAVED_SEARCH_CREATE
  );
  // const [ deleteSavedSearch, {dLoading,dError,dData} ] = useMutation(SAVED_SEARCH_DELETE);
  // const [ updateSavedSearch, {uLoading,uError,uData} ] = useMutation(SAVED_SEARCH_UPDATE);
  // const [filterName, setFilterName] = useState('Custom Filter');
  // console.log("Error in saved Search", cError);
  // console.log("Data in saved Search", cData);
  // createSavedSearch({ variables: {
  //   input: {
  //     resourceType:"Product",
  //     name: "saved search name",
  //     query: "query",
  //   }
  // } });
  // deleteSavedSearch({ variables: {
  //   input: {
  //     id:"search id",
  //   }
  // } });
  // updateSavedSearch({ variables: {
  //   input: {
  //     id:"search id",
  //     resourceType:"Product",
  //     name: "saved search name",
  //     query: "query",
  //   }
  // } });

  //-----------GraphQl query state variable-------------START-------------
  // pagination
  const [cursor, setCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState([]);
  // console.log(prevCursor);
  //sort graphql query
  const [sort, setSort] = useState("INVENTORY_TOTAL");
  const [reverse, setReverse] = useState(false);
  //filter
  const [query, setQuery] = useState("");
  console.log("Active query:", query);
  //-----------GraphQl query state variable--------------END------------
  const { loading, error, data, refetch } = useQuery(GET_All_PRODUCTS, {
    variables: { numProducts: 20, cursor, sort, reverse, query },
    pollInterval: 5000,
  });
  //Sorting Resource List options
  const [sortValue, setSortValue] = useState("INVENTORY_TOTAL-ASC");
  const sortOptions = [
    { label: "Available (ascending)", value: "INVENTORY_TOTAL-ASC" },
    { label: "Available (descending)", value: "INVENTORY_TOTAL-DESC" },
    { label: "Title (ascending)", value: "TITLE-ASC" },
    { label: "Title (descending)", value: "TITLE-DESC" },
    { label: "Updated (ascending)", value: "UPDATED_AT-ASC" },
    { label: "Updated (descending)", value: "UPDATED_AT-DESC" },
  ];
  //Select All options
  const [selectedItems, setSelectedItems] = useState([]);
  //Popover for product variants list
  const [selectKey, setselectKey] = useState(0);
  const [selectValue, setselectValue] = useState("Select");
  const selectHandler = useCallback((event) => {
    setselectKey(event.target.selectedIndex);
    setselectValue(event.target.value);
  }, []);

  //Toast after updating quantity
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => {
    setActive((active) => !active);
    refetch();
  }, []);

  const toastMarkup = active ? (
    <Toast
      content="Inventory Updated!"
      onDismiss={toggleActive}
      duration={10000}
    />
  ) : null;

  //------------Filters----------------------------------
  const [availability, setAvailability] = useState([]);
  const [productType, setProductType] = useState([]);
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");
  const [queryTimeout, setQueryTimeout] = useState(0);

  const handleAvailabilityChange = useCallback((value) => {
    setAvailability(value);
  }, []);

  const handleProductTypeChange = useCallback((value) => {
    setProductType(value);
  }, []);

  const handleTaggedWithChange = useCallback((value) => {
    setTaggedWith(value);
  }, []);

  const handleFiltersQueryChange = useCallback(
    (value) => {
      clearTimeout(queryTimeout);
      setQueryValue(value);
      setQueryTimeout(
        setTimeout(() => {
          let qStr = query + " AND " + value;
          setQuery(qStr);
        }, 3000)
      );
    },
    [query, queryTimeout]
  );

  // Filter remove methods
  const handleAvailabilityRemove = useCallback(() => {
    let queryStr = query
      .split("AND")
      .filter((str) => !str.includes("published_status"))
      .join("AND");
    //console.log(queryStr);
    setQuery(queryStr);
    setAvailability([]);
  }, [query]);
  const handleProductTypeRemove = useCallback(() => {
    let queryStr = query
      .split("AND")
      .filter((str) => !str.includes("product_type"))
      .join("AND");
    //console.log(queryStr);
    setQuery(queryStr);
    setProductType([]);
  }, [query]);
  const handleTaggedWithRemove = useCallback(() => {
    let queryStr = query
      .split("AND")
      .filter((str) => !str.includes("tag"))
      .join("AND");
    //console.log(queryStr);
    setQuery(queryStr);
    setTaggedWith("");
  }, [query]);
  const handleQueryValueRemove = useCallback(() => {
    //get query , split it , separate all quey value and
    // remove the condition one and join it again.
    let queryStr = query
      .split("AND")
      .filter((str) => str.includes(":"))
      .join("AND");
    //console.log(queryStr);
    setQuery(queryStr);
    setQueryValue("");
  }, [query]);
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();
    handleProductTypeRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
    setQuery("");
  }, [
    handleAvailabilityRemove,
    handleQueryValueRemove,
    handleProductTypeRemove,
    handleTaggedWithRemove,
  ]);

  const handleAvailabilityValue = useCallback(() => {
    if (availability.length > 0) {
      let qStr = query;
      availability.map((val) => {
        qStr = qStr + " AND " + "published_status:" + val;
      });
      setQuery(qStr);
    }
  }, [query, availability, handleAvailabilityRemove]);

  const handleProductTypeValue = useCallback(() => {
    if (productType.length > 0) {
      let qStr = query;
      productType.map((val) => {
        qStr = qStr + " AND " + "product_type:" + val;
      });
      setQuery(qStr);
    }
  }, [query, productType]);

  const handleTaggedValue = useCallback(() => {
    if (taggedWith) {
      let qStr = query + " AND " + "tag:" + taggedWith;
      setQuery(qStr);
    }
  }, [query, taggedWith]);

  //DEfine all filters
  const filters = [
    {
      key: "availability",
      label: "Availability",
      filter: (
        <div>
          <ChoiceList
            title="Availability"
            titleHidden
            choices={[
              { label: "Online Store", value: "Online Store" },
              { label: "Point of Sale", value: "Point of Sale" },
            ]}
            selected={availability || []}
            onChange={handleAvailabilityChange}
            allowMultiple
          />
          <Button
            onClick={handleAvailabilityValue}
            plain
            disabled={!availability.length}
          >
            Done
          </Button>
        </div>
      ),
      shortcut: true,
    },
    {
      key: "productType",
      label: "Product type",
      filter: (
        <div>
          <ChoiceList
            title="Product type"
            titleHidden
            choices={[
              { label: "T-Shirt", value: "T-Shirt" },
              { label: "Accessory", value: "Accessory" },
              { label: "Suit Set", value: "Suit-Set" },
            ]}
            selected={productType || []}
            onChange={handleProductTypeChange}
            allowMultiple
          />
          <Button
            onClick={handleProductTypeValue}
            plain
            disabled={!productType.length}
          >
            Done
          </Button>
        </div>
      ),
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <div>
          <TextField
            label="Tagged with"
            value={taggedWith}
            onChange={handleTaggedWithChange}
            labelHidden
          />
          <Button onClick={handleTaggedValue} plain disabled={!taggedWith}>
            Done
          </Button>
        </div>
      ),
    },
  ];

  //Check which filter is selected and then push into appliedfilters whichever is available
  const appliedFilters = [];
  if (!isEmpty(availability)) {
    const key = "availability";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }
  if (!isEmpty(productType)) {
    const key = "productType";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, productType),
      onRemove: handleProductTypeRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleFiltersClearAll}
    >
      <div>
        <Popover
          active={popoverActive}
          activator={activator}
          onClose={togglePopoverActive}
          ariaHaspopup={false}
          sectioned
        >
          <FormLayout>
            <TextField
              label="Save as"
              value={filterValue}
              onChange={handleFilterValueChange}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button size="slim" onClick={togglePopoverActive}>
                Cancel
              </Button>
              <Button size="slim" onClick={saveFilterHandler}>
                Save
              </Button>
            </div>
          </FormLayout>
        </Popover>
      </div>
    </Filters>
  );

  const promotedBulkActions = [
    {
      content: "Edit customers",
      onAction: () => console.log("Todo: implement bulk edit"),
    },
  ];

  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      content: "Delete customers",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  useEffect(() => {
    // console.log("useEffect:", data);
    let alert = 5;
    let outOfStock = [];
    // let shop=data.shop.url;
    if (data) {
      data.products.edges.map((item) => {
        const prodTitle = item.node.title;

        item.node.variants.edges.map((varItem) => {
          const availableQuantity = varItem.node.inventoryQuantity;
          const varTitle =
            varItem.node.title !== "Default Title" ? varItem.node.title : "";

          const completeTitle = prodTitle + " " + varTitle;
          if (availableQuantity <= alert) {
            outOfStock.push({
              title: completeTitle,
              quantity: availableQuantity,
            });
          }
        });
      });
    }

    if (outOfStock.length) {
      axios.post('https://shopifystockit.herokuapp.com/send',{
          name: 'Rishabh',
          email: 'whatspptest1@gmail.com',
          messageHtml: 'Sample Mail',
      }).then( (response) =>{
        console.log('axios response:', response);
      }).catch((error) =>{
        console.log('Error in axios:',error);
      })
    //  axios({
    //     method: "POST",
    //     url: "https://shopifystockit.herokuapp.com/send",
    //     data: {
    //       name: 'Rishabh',
    //       email: 'whatspptest1@gmail.com',
    //       messageHtml: 'Sample Mail',
    //     },
    //   }).then((response) => {
    //     console.log('Response from axios:'+response);
    //     if (response.data.msg === "success") {
    //       console.info("Email sent, awesome!");
    //     } else if (response.data.msg === "fail") {
    //       console.error("Oops, something went wrong. Try again");
    //     }
    //   });
      // emailjs.sendForm('service_Rish123', 'template_3tyh07s', {message:outOfStock}, 'user_vBk9y4XIaEL5tzwT88IuZ')
      // .then((result) => {
      //     console.log(result.text);
      // }, (error) => {
      //     console.log(error.text);
      // });
      console.log("Email sent:", outOfStock);
    }
  }, [data]);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spinner accessibilityLabel="loading" />
      </div>
    );
  if (error) {
    if (error.message == "GraphQL error: Throttled") {
      console.log("Reached GraphQl Limit, Wait for some seconds");
      setTimeout(() => {
        refetch();
      }, 7000);
      return <Spinner accessibilityLabel="Throttled Error Spinner" />;
    }
    return <div>{"Reload the App, press f5" + error.message}</div>;
  }
  console.log(data);
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  return (
    <Card>
      {toastMarkup}
      <ResourceList
        resourceName={resourceName}
        items={data.products.edges}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        // promotedBulkActions={promotedBulkActions}
        // bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={sortOptions}
        onSortChange={(selected) => {
          let [sortingValue, orderString] = selected.split("-");
          let order = orderString === "DESC";
          setSortValue(selected);
          setSort(sortingValue);
          setReverse(order);
        }}
        filterControl={filterControl}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          hasPrevious={data.products.pageInfo.hasPreviousPage}
          onPrevious={() => {
            // console.log('Previous');
            setCursor(prevCursor.pop());
            refetch();
          }}
          hasNext={data.products.pageInfo.hasNextPage}
          onNext={() => {
            // console.log('Next');
            let lastCursor = data.products.edges[19].cursor;

            if (data.products.pageInfo.hasPreviousPage) {
              setPrevCursor([...prevCursor, lastCursor]);
            }
            setCursor(lastCursor);
            refetch();
          }}
        />
      </div>
    </Card>
  );

  function renderItem(item) {
    const media = (
      <Thumbnail
        source={
          item.node.images.edges[0]
            ? item.node.images.edges[0].node.originalSrc
            : ""
        }
        alt={item.node.images.edges[0] ? item.node.images.edges[0].altText : ""}
      />
    );
    let variantKey = selectKey;
    const shopUrl = data.shop.url;
    const productId = item.node.id.split("//shopify/Product")[1];
    const productTitle = item.node.title;
    if (item.node.variants.edges.length <= variantKey) {
      variantKey = 0;
    }
    //Variants
    const variantId = item.node.variants.edges[variantKey].node.id;
    const variantTitle =
      item.node.variants.edges[variantKey].node.title !== "Default Title"
        ? item.node.variants.edges[variantKey].node.title
        : "";
    // console.log(variantTitle);
    const selectVariantList = item.node.variants.edges.map((variantItem) => {
      return variantItem.node.title !== "Default Title"
        ? variantItem.node.title
        : "";
    });
    const variantTitleTag =
      selectVariantList.length > 1 ? (
        <div>
          <select value={selectValue} onChange={selectHandler}>
            {selectVariantList.map((title, id) => {
              return (
                <option id={id} key={id} value={title}>
                  {title}
                </option>
              );
            })}
          </select>
        </div>
      ) : (
        variantTitle
      );
    const productVariantUrl =
      shopUrl +
      "/admin/products" +
      productId +
      "/variants" +
      variantId.split("//shopify/ProductVariant")[1];
    const inventoryItemId =
      item.node.variants.edges[variantKey].node.inventoryItem.id;
    // const price = item.node.variants.edges[variantKey].node.price;
    const sku = item.node.variants.edges[variantKey].node.sku;
    const inventoryQuantity =
      item.node.variants.edges[variantKey].node.inventoryQuantity;
    const style = { display: "grid", gridTemplateColumns: "30% 20% 10% 40%" };
    return (
      <ResourceItem
        verticalAlignment="center"
        id={item.node.id}
        media={media}
        accessibilityLabel={`View details for ${item.node.title}`}
      >
        <div style={style}>
          <div style={{ display: "grid", gridTemplateRows: "50% 50%" }}>
            <div>
              <a
                href={productVariantUrl}
                target="_blank"
                style={{ textDecoration: "none", color: "blue" }}
              >
                {productTitle}
              </a>
            </div>
            <div>{variantTitleTag}</div>
          </div>
          <div>
            <p>{sku}</p>
          </div>
          <div>
            <p>{inventoryQuantity}</p>
          </div>
          <div>
            <EditQuantity
              key={variantId}
              inventoryId={inventoryItemId}
              callback={toggleActive}
            />
          </div>
        </div>
      </ResourceItem>
    );
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      case "availability":
        return value.map((val) => `Available on ${val}`).join(", ");
      case "productType":
        return value.join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
};

export default Sandbox;
