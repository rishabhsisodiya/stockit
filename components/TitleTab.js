import React, { useState,useCallback } from 'react';
import {Card, Tabs, DataTable,Link, Spinner} from '@shopify/polaris';
import ProductList from './ProductList';
import TestProductList from './TestList';
import Sandbox from './sandbox';
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';

const savedSearch = gql`
query{
  productSavedSearches(first:10){
   edges{
     node{
       id
       name
       query
       resourceType
       filters{
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
  const { loading, error, data } = useQuery(savedSearch);
   
    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [selected],
    );
      
    // const tabs = [
    //     {
    //     id: 'Dev',
    //     content: 'Dev',  
    //     accessibilityLabel: 'Dev',  
    //     panelID: 'Dev',  
    //     },  
    //     {  
    //     id: 'Pre-Prod',  
    //     content: 'Pre-Prod',
    //     accessibilityLabel: 'Pre-Prod',  
    //     panelID: 'Pre-Prod',  
    //     }, 
    //     {  
    //     id: 'Prod',  
    //     content: 'Prod', 
    //     accessibilityLabel: 'Prod', 
    //     panelID: 'Prod',  
    //     },   
    // ];

    let tabSelected;
if (selected==0) {
  tabSelected=<Sandbox/>
}
if (selected==1) {
  tabSelected=<TestProductList/>
}
if (selected==2) {
  tabSelected=<ProductList/>
}
console.log('tab rendering..');
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
  const tabs= [...renderTabs(data.productSavedSearches.edges)];
return (
  <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      <Sandbox />
    </Tabs>
  </Card>
); 

function renderTabs(nodes) {
  const tabs = [
    {
    id: 'Dev',
    content: 'Dev',  
    accessibilityLabel: 'Dev',  
    panelID: 'Dev',  
    }  
];
let savedtabs=[];
// console.log(nodes);
// savedtabs.push({
//   id:tab.node.id,
//   content:tab.node.name,
//   accessibilityLabel:tab.node.name,
//   panelID:tab.node.name,
// })
nodes.map(
  (node) => console.log(node) 
)
  tabs = [...tabs,...savedtabs]
  // console.log(tabs);
  return tabs;
}

}

export default TitleTab;