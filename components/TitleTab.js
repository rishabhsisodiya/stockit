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
  const [selected, setSelected] = useState(0);
  const { loading, error, data,refetch } = useQuery(savedSearch);
  const [filter, setFilter] = useState([]);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [selected]
  );

  console.log("tab rendering..");
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
        <Spinner accessibilityLabel="loading" />
      </div>
    );
  if (error) {
    if (error.message == "GraphQL error: Throttled") {
      console.log("Reached GraphQl Limit, Wait for some seconds");
      setTimeout(() => {
        refetch();
      }, 7000);
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
          <Spinner accessibilityLabel="loading" />
        </div>
      );
    }
    return <div>{"Reload the App, press f5" + error.message}</div>;
  }
  console.log(data);
  const { tabs, queryData } = renderTabs(data.productSavedSearches.edges);
  
  // useEffect(() => {
  //   let tabs = [
  //     {
  //       id: "ALL",
  //       content: "ALL",
  //       accessibilityLabel: "ALL",
  //       panelID: "ALL",
  //     },
  //   ];
  //   let savedtabs = [];
  //   let queryData = [];
  //   items.map((item, id) => {
  //     savedtabs.push({
  //       id: item.node.id,
  //       content: item.node.name,
  //       accessibilityLabel: item.node.name,
  //       panelID: item.node.id,
  //     });
  //     queryData.push({ query: item.node.query });
  //   });
  //   tabs = [...tabs, ...savedtabs];
  // }, [data])

  let tabSelected;
  if (selected == 0) {
    tabSelected = <Sandbox callback={refetch}/>;
  } else {
    // tabSelected=<TestProductList/>
    tabSelected = <SandboxF filterData={queryData[selected - 1]} callback={refetch}/>;
  }
  // if (selected==2) {
  //   tabSelected=<ProductList/>
  // }
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
      queryData.push({ id:item.node.id,name:item.node.name,query: item.node.query });
    });
    tabs = [...tabs, ...savedtabs];
    // console.log(tabs);
    return { tabs, queryData };
  }
};

export default TitleTab;
