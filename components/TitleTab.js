import React, { useState,useCallback } from 'react';
import {Card, Tabs, DataTable,Link, Spinner} from '@shopify/polaris';
import ProductList from './ProductList';
import TestProductList from './TestList';
import Sandbox from './sandbox';
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import SandboxF from './sandboxF';

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
  const [filter, setFilter] = useState('');
   
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
  console.log('tabs:',tabs);

  let tabSelected;
  if (selected==0) {
    tabSelected=<Sandbox/>
  }
  else{
    // tabSelected=<TestProductList/>
    tabSelected=<SandboxF filterQuery={tabs[selected].content}/>
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
    id: 'ALL',
    content: 'ALL',  
    accessibilityLabel: 'ALL',  
    panelID: 'ALL',  
    }  
];
let savedtabs=[];
items.map(
  (item) => savedtabs.push({
      id:item.node.id,
      content:item.node.query,
      accessibilityLabel:item.node.name,
      panelID:item.node.name,
    }) 
)
  tabs = [...tabs,...savedtabs]
  // console.log(tabs);
  return tabs;
}

}

export default TitleTab;