import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "../assets/styles/Dashboard.module.css";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData("products"); // Fetch products by default
  }, []);

  const fetchData = async (tab) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${tab}`);
      setData(response.data);
      setSelectedTab(tab);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
    }
  };

  const tabs = ["products", "users", "suppliers", "categories"];

  return (
    <div className={classes.dashboard}>
      <nav className={classes.nav}>
        <ul className={classes.ul}>
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`${tab === selectedTab ? classes.selected : ""}`}
              onClick={() => fetchData(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
      <main className={classes.main}>
        {error ? (
          <div className={classes.error}>{error}</div>
        ) : (
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                {selectedTab &&
                  Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
