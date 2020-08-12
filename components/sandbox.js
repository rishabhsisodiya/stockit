import React, { useState, useCallback } from "react";
import {
  Stack,
  Avatar,
  TextStyle,
  Heading,
  ResourceList,
  ResourceItem,
  Checkbox
} from "@shopify/polaris";

function Sandbox() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => {
    
    setChecked(newChecked);
    let ids=newChecked? items.map(item=>item.id) : [];
    setSelectedItems(ids);
  }, []);
  const items=[
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
  console.log(selectedItems)
  return (
    <div>
      <Heading>
        <ResourceItem>
          <Stack>
            <Stack.Item>
              <Checkbox checked={checked} onChange={handleChange} />
            </Stack.Item>
            <Stack.Item>Title</Stack.Item>
            <Stack.Item>Availabilty</Stack.Item>
            <Stack.Item>Price</Stack.Item>
            <Stack.Item>Edit Availabilty</Stack.Item>
          </Stack>
        </ResourceItem>
      </Heading>
      <ResourceList
        resourceName={{ singular: "customer", plural: "customers" }}
        items={items}
        renderItem={(item) => {
          const { id, url, name, location } = item;
          const media = <Avatar customer size="medium" name={name} />;

          return (
            <ResourceItem
              id={id}
              url={url}
              media={media}
              accessibilityLabel={`View details for ${name}`}
            >
              <h3>
                <TextStyle variation="strong">{name}</TextStyle>
              </h3>
              <div>{location}</div>
            </ResourceItem>
          );
        }}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        showHeader={false}
      />
    </div>
  );
}

export default Sandbox;
