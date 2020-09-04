import { Page, Layout, Frame } from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { Card, Tabs } from "@shopify/polaris";
import ProductList from "../components/ProductList";
import TestProductList from "../components/TestList";
import Sandbox from "../components/sandbox";

class Index extends React.Component {
  // Frame for displaying toast
  render() {
    console.log("index rendering");
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [selected]
    );

    const tabs = [
      {
        id: "Dev",
        content: "Dev",
        accessibilityLabel: "Dev",
        panelID: "Dev",
      },
      {
        id: "Pre-Prod",
        content: "Pre-Prod",
        accessibilityLabel: "Pre-Prod",
        panelID: "Pre-Prod",
      },
      {
        id: "Prod",
        content: "Prod",
        accessibilityLabel: "Prod",
        panelID: "Prod",
      },
    ];

    let tabSelected;
    if (selected == 0) {
      tabSelected = <Sandbox />;
    }
    if (selected == 1) {
      tabSelected = <TestProductList />;
    }
    if (selected == 2) {
      tabSelected = <ProductList />;
    }
    return (
      <Frame>
        <Page>
          <Layout>
            <Layout.Section>
              <Card>
                <Tabs
                  tabs={tabs}
                  selected={selected}
                  onSelect={handleTabChange}
                >
                  {tabSelected}
                </Tabs>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }
}

export default Index;
