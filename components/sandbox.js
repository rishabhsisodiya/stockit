import React, { useState, useCallback } from "react";
import {
  Stack,
  Card,
  Button,
  TextField,
  Avatar,
  TextStyle,
  Heading,
  ResourceList,
  ResourceItem,
  Checkbox,
  Filters
} from "@shopify/polaris";

function App() {
  const items = [
    {
      id: 341,
      url: "customers/341",
      name: "Mae Jemison",
      location: "Decatur, USA"
    },
    {
      id: 256,
      url: "customers/256",
      name: "Ellen Ochoa",
      location: "Los Angeles, USA"
    }
  ];
  const [sortValue, setSortValue] = useState("DATE_MODIFIED_DESC");
  const [selectedItems, setSelectedItems] = useState([]);
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback(
    (newChecked) => {
      setChecked(newChecked);
      let ids = newChecked ? items.map((item) => item.id) : [];

      setSelectedItems(ids);
    },
    [items]
  );
  const promotedBulkActions = [
    {
      content: "Edit customers",
      onAction: () => console.log("Todo: implement bulk edit")
    }
  ];

  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags")
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags")
    },
    {
      content: "Delete customers",
      onAction: () => console.log("Todo: implement bulk delete")
    }
  ];

  //Filters
  const [taggedWith, setTaggedWith] = useState("VIP");
  const [queryValue, setQueryValue] = useState(null);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      ),
      shortcut: true
    }
  ];

  // const appliedFilters = !isEmpty(taggedWith)
  //   ? [
  //       {
  //         key: "taggedWith",
  //         label: disambiguateLabel("taggedWith", taggedWith),
  //         onRemove: handleTaggedWithRemove
  //       }
  //     ]
  //   : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      // appliedFilters={appliedFilters}
      onQueryChange={setQueryValue}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      {/* <div style={{paddingLeft: '8px'}}>
        <Button onClick={() => console.log('New filter saved')}>Save</Button>
      </div> */}
    </Filters>
  );
  return (
    <Card>
      {/* <ResourceList.Item>
        <Heading>
          <Stack>
            <div>
              <Checkbox checked={checked} onChange={handleChange} />
            </div>
            <div></div>
            <div>Title</div>
            <div>Availabilty</div>
            <div>Price</div>
            <div>Edit Availabilty</div>
          </Stack>
        </Heading>
      </ResourceList.Item> */}
      <ResourceList
        resourceName={{ singular: "customer", plural: "customers" }}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          { label: "Newest update", value: "DATE_MODIFIED_DESC" },
          { label: "Oldest update", value: "DATE_MODIFIED_ASC" }
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
        filterControl={filterControl}
      />
    </Card>
  );
  function renderItem(item) {
    const { id, url, name, location } = item;
    const media = <Avatar customer size="medium" name={name} />;

    return (
      <ResourceItem
        id={id}
        url={url}
        media={media}
        accessibilityLabel={`View details for ${name}`}
        
      >
        <Stack>
          <h3>
            <TextStyle variation="strong">{name}</TextStyle>
          </h3>
          <div>{location}</div>
          <div>
            <TextField type="number" />
          </div>
          <div>
            <Button>Save</Button>
          </div>
        </Stack>
      </ResourceItem>
    );
  }

  // For the Applied Filter
  // function disambiguateLabel(key, value) {
  //   switch (key) {
  //     case "taggedWith":
  //       return `Tagged with ${value}`;
  //     default:
  //       return value;
  //   }
  // }

  // function isEmpty(value) {
  //   if (Array.isArray(value)) {
  //     return value.length === 0;
  //   } else {
  //     return value === "" || value == null;
  //   }
  // }

}

export default App;
