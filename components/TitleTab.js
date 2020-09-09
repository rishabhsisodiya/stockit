import React, { useState, useCallback, useEffect } from "react";
import { Card, Tabs, DataTable, Link, Spinner } from "@shopify/polaris";
import Sandbox from "./sandbox";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import SandboxF from "./sandboxF";

const savedSearch = gql`
  query {
    productSavedSearches(first: 10) {
      edges {
        node {
          id
          name
          query
          resourceType
          filters {
            key
            value
          }
          searchTerms
        }
      }
    }
  }
`;

const TitleTab = () => {
  console.log("tab rendering..");
  const [selected, setSelected] = useState(0);
  const { loading, error, data, refetch } = useQuery(savedSearch, {
    pollInterval: 5000,
  });
  const [tabs, setTabs] = useState([
    {
      id: "ALL",
      content: "ALL",
      accessibilityLabel: "ALL",
      panelID: "ALL",
    },
  ]);
  const [filter, setFilter] = useState([
    {
      id: "All",
      name: "All",
      query: "",
    },
  ]);

  const handleTabChange = (selectedTabIndex) => setSelected(selectedTabIndex);

  useEffect(() => {
    if (data) {
      let savedtabs = [
        {
          id: "ALL",
          content: "ALL",
          accessibilityLabel: "ALL",
          panelID: "ALL",
        },
      ];
      let queryData = [
        {
          id: "All",
          name: "All",
          query: "",
        },
      ];

      data.productSavedSearches.edges.map((item) => {
        savedtabs.push({
          id: item.node.id,
          content: item.node.name,
          accessibilityLabel: item.node.name,
          panelID: item.node.id,
        });
        queryData.push({
          id: item.node.id,
          name: item.node.name,
          query: item.node.query,
        });
      });
      setTabs(savedtabs);
      setFilter(queryData);
    }
  }, [data]);

  // Loading
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spinner accessibilityLabel="loading" />
      </div>
    );

  // Error
  if (error) {
    if (error.message == "GraphQL error: Throttled") {
      console.log("Reached GraphQl Limit, Wait for some seconds");
      setTimeout(() => {
        refetch();
      }, 5000);
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner accessibilityLabel="loading" />
        </div>
      );
    }
    return (
      <div>
        <p style={{ color: "red" }}>
          Unexpected Error uncountered Please Report
        </p>
        {error.message}
      </div>
    );
  }
  console.log(data);
  console.log('Tabs:',tabs);
  console.log('Filter:',filter);
  // const { tabs, queryData } = renderTabs(data.productSavedSearches.edges);
  if (selected>=tabs.length) {
    setSelected(0);
  }
  let tabSelected;
  if (selected == 0) {
    tabSelected = <Sandbox callback={refetch} />;
  } else {
    // tabSelected=<TestProductList/>
    tabSelected = <SandboxF filterData={filter[selected]} callback={refetch} />;
  }
  return (
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        {tabSelected}
      </Tabs>
    </Card>
  );

  function renderTabs(items) {
    let tabs = [
      {
        id: "ALL",
        content: "ALL",
        accessibilityLabel: "ALL",
        panelID: "ALL",
      },
    ];
    let savedtabs = [];
    let queryData = [];

    items.map((item, id) => {
      savedtabs.push({
        id: item.node.id,
        content: item.node.name,
        accessibilityLabel: item.node.name,
        panelID: item.node.id,
      });
      queryData.push({
        id: item.node.id,
        name: item.node.name,
        query: item.node.query,
      });
    });
    tabs = [...tabs, ...savedtabs];
    // console.log(tabs);
    return { tabs, queryData };
  }
};

export default TitleTab;
