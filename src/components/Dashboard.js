import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "../assets/styles/Dashboard.module.css";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData("Users"); // Fetch products by default
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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchData(selectedTab);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        let idFieldName;
        switch (selectedTab) {
          case "Products":
            idFieldName = "productId";
            break;
          case "Categories":
            idFieldName = "categoryId";
            break;
          default:
            console.error("Invalid tab selected");
            return;
        }
        const itemId = selectedItem[idFieldName];
        if (itemId) {
          await axios.put(
            `http://localhost:5000/api/${selectedTab.toLowerCase()}/${itemId}`,
            formData
          );
        } else {
          console.error(`Invalid ID for ${selectedTab}`);
        }
      } else {
        await axios.post(`http://localhost:5000/api/${selectedTab.toLowerCase()}`, formData);
      }
      fetchData(selectedTab);
      setModalOpen(false);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const tabs = ["Users", "Products", "Categories", "Suppliers"];

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
          <>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  {selectedTab &&
                    data.length > 0 &&
                    Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.productId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={
                      data.length > 0 ? Object.keys(data[0]).length + 1 : 1
                    }
                  >
                    <button className="btn btn-success" onClick={handleAdd}>
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            {modalOpen && (
              <div
                className={`${classes.modal} modal fade show`}
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
              >
                <div
                  className={`${classes.modalContent} modal-dialog`}
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Item</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setModalOpen(false)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleSubmit}>
                        {selectedItem &&
                          Object.keys(selectedItem).map((key) => (
                            <div key={key}>
                              <label htmlFor={key}>{key}</label>
                              <input
                                type="text"
                                id={key}
                                name={key}
                                value={formData[key] || selectedItem[key]}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          ))}
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {addModalOpen && (
              <div
                className={`${classes.modal} modal fade show`}
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
              >
                <div
                  className={`${classes.modalContent} modal-dialog`}
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Item</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setAddModalOpen(false)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleSubmit}>
                        {data.length > 0 &&
                          Object.keys(data[0]).map((key) => (
                            <div key={key}>
                              <label htmlFor={key}>{key}</label>
                              <input
                                type="text"
                                id={key}
                                name={key}
                                value={formData[key] || ""}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          ))}
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
