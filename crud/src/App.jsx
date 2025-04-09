import "./App.css";
import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const [editID, setEditId] = useState("");
  const [editname, setEditName] = useState("");
  const [editnumber, setEditNumber] = useState("");
  const [editemail, setEditEmail] = useState("");

  // const empdata = [
  //   {
  //     id: 1,
  //     name: "yash",
  //     phone: "900000111",
  //     email: "yash@gmail.com",
  //   },
  // ];

  const [data, setData] = useState([]);

  useEffect(() => {
    getdata();
  }, []);

  const getdata = () => {
    axios
      .get("https://localhost:7059/api/Employee")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7059/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditNumber(result.data.phone);
        setEditEmail(result.data.email);
        setEditId(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you want to delete this employee") == true) {
      axios
        .delete(`https://localhost:7059/api/Employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Employee has been deleted");
            getdata();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7059/api/Employee/${editID}`;
    const data = {
      id: editID,
      name: editname,
      phone: editnumber,
      email: editemail,
    };
    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getdata();
        clear();
        toast.success("Employee has been updated");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7059/api/Employee";
    const data = {
      name: name,
      phone: number,
      email: email,
    };
    axios
      .post(url, data)
      .then((result) => {
        getdata();
        clear();
        toast.success("Employee has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setName("");
    setNumber("");
    setEmail("");
    setEditName("");
    setEditNumber("");
    setEditEmail("");
    setEditId("");
  };
  return (
    <Fragment>
      <ToastContainer />
      <h1>Employee Form</h1><br/>
      <Container>
        <Row>
          <Col>
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <label>Phone Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Col>
          <Col>
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col>
            <br></br>
            <button className="btn btn-primary" onClick={(e) => handleSave(e)}>
              Save
            </button>
          </Col>
        </Row>
      </Container>
      <br />
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td colSpan={2}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </button>{" "}
                    &nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={editname}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <label>Phone Number</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Phone Number"
                value={editnumber}
                onChange={(e) => setEditNumber(e.target.value)}
              />
            </Col>
            <Col>
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={editemail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default App;