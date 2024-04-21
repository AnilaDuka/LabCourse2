import classes from "../assets/styles/Dashboard.module.css";
import { useState } from "react";
import { initialTabs as tabs } from "./Tabs";

export default function Dashbaord() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className={classes.dashboard}>
      <nav className={classes.nav}>
        <ul className={classes.ul}>
          {tabs.map((item) => (
            <li
              id={classes.li}
              key={item.name}
              className={`${item === selectedTab ? classes.selected : ""}`}
              onClick={() => setSelectedTab(item)}
            >
              {`${item.name}`}
              {item === selectedTab ? (
                <div className={classes.underline} />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <main></main>
    </div>
  );
}
