import React, { useEffect, useState } from "react";
import axios from "axios";

function Table() {
  const [data, setData] = useState([]);
  const [editId, setEdit] = useState(-1);
  const [uname, usetName] = useState("");
  const [udob, usetDob] = useState("");
  const [uhometown, usetHometown] = useState("");
  const [errors, setErrors] = useState({});

  function checkValidDob({ udob }) {
    const format = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!format.test(udob)) {
      console.log("lỗi 1");
      return false;
    }
    const [ngay, thang, nam] = udob.split("/").map(Number);

    if (isNaN(ngay) || isNaN(thang) || isNaN(nam)) {
      console.log("lỗi 2");
      return false;
    }
    if (thang > 12 || thang < 1) {
      return false;
    }
    if (
      thang === 1 ||
      thang === 3 ||
      thang === 5 ||
      thang === 7 ||
      thang === 8 ||
      thang === 10 ||
      thang === 12
    ) {
      if (ngay > 31) return false;
    } else if (thang === 2) {
      if ((nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0) {
        if (ngay > 29) return false;
      } else if (ngay > 28) return false;
    } else if (ngay > 30) return false;

    if (ngay < 1) return false;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (
      nam > currentYear ||
      (thang > currentMonth && nam >= currentYear) ||
      nam < 1950
    )
      return false;

    return true;
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setData(res.data))
      .catch((er) => console.log(er));
  }, []);

  const handleEdit = (id) => {
    axios
      .get("http://localhost:3000/users/" + id)
      .then((res) => {
        console.log(res.data);
        usetName(res.data.name);
        usetDob(res.data.dob);
        usetHometown(res.data.hometown);
      })
      .catch((er) => console.log(er));
    setEdit(id);
  };

  const handleUpdate = () => {
    // Sai
    if (!uname) {
      setErrors((prev) => ({
        ...prev,
        name: "Họ và tên không được để trống!",
      }));
    }
    if (data.filter((sv) => sv.id !== editId).find((sv) => sv.name === uname)) {
      setErrors((prev) => ({ ...prev, name: "Họ tên đã tồn tại!" }));
    }
    if (uname.length > 100) {
      setErrors((prev) => ({
        ...prev,
        name: "Họ tên có độ dài quá 100 ký tự!",
      }));
    }
    if (data.filter((sv) => sv.id !== editId).find((sv) => sv.hometown === uhometown)) {
      setErrors((prev) => ({ ...prev, hometown: "Quê quán đã tồn tại!" }));
    }
    if (!uhometown) {
      setErrors((prev) => ({
        ...prev,
        hometown: "Quê quán không được để trống!",
      }));
    }
    if (uhometown.length > 100) {
      setErrors((prev) => ({
        ...prev,
        hometown: "Quê quán có độ dài quá 100 ký tự!",
      }));
    }
    if (!checkValidDob(udob)) {
      setErrors((prev) => ({ ...prev, dob: "Ngày sinh không hợp lệ!" }));
    }
    if (!udob) {
      setErrors((prev) => ({ ...prev, dob: "Ngày sinh không được để trống!" }));
    }

    // Đúng
    if (
      uname.length > 0 &&
      uname.length <= 100 &&
      !data.filter((sv) => sv.id !== editId).find((sv) => sv.name === uname)
    ) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
    if (
      uhometown.length > 0 &&
      uhometown.length <= 100 &&
      !data.filter((sv) => sv.id !== editId).find((sv) => sv.hometown === uhometown)
    ) {
      setErrors((prev) => ({ ...prev, hometown: "" }));
    }
    if (checkValidDob({ udob })) {
      setErrors((prev) => ({ ...prev, dob: "" }));
    }

    if (
      uname.length > 0 &&
      uname.length <= 100 &&
      !data.filter((sv) => sv.id !== editId).find((sv) => sv.name === uname) &&
      uhometown.length > 0 &&
      uhometown.length <= 100 &&
      !data.filter((sv) => sv.id !== editId).find((sv) => sv.hometown === uhometown) &&
      checkValidDob({ udob })
    ) {
      axios
        .put("http://localhost:3000/users/" + editId, {
          id: editId,
          name: uname,
          dob: udob,
          hometown: uhometown,
        })
        .then((res) => {
          console.log(res);
          window.location.reload();
          setEdit(-1);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/users/" + id)
      .then((res) => {
        window.location.reload();
      })
      .catch((er) => console.log(er));
    setEdit(id);
  };

  return (
    <div className="container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>TT</th>
            <th>Mã SV</th>
            <th>Họ và tên</th>
            <th>Ngày sinh</th>
            <th>Quê quán</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {data.map((users, index) =>
            users.id === editId ? (
              <tr>
                <td>{index + 1}</td>
                <td>{users.id}</td>
                <td>
                  <input
                    type="text"
                    value={uname}
                    onChange={(e) => usetName(e.target.value
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" "))}
                  />
                  <br />
                  {errors.name && <span className="error">{errors.name}</span>}
                </td>
                <td>
                  <input
                    type="text"
                    value={udob}
                    onChange={(e) => usetDob(e.target.value)}
                  />
                  <br />
                  {errors.dob && <span className="error">{errors.dob}</span>}
                </td>
                <td>
                  <input
                    type="text"
                    value={uhometown}
                    onChange={(e) => usetHometown(e.target.value
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" "))}
                  />
                  <br />
                  {errors.hometown && <span className="error">{errors.hometown}</span>}
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUpdate()}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={users.id}>
                <td>{index + 1}</td>
                <td>{users.id}</td>
                <td>{users.name}</td>
                <td>{users.dob}</td>
                <td>{users.hometown}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(users.id)}
                  >
                    Sửa
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(users.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
