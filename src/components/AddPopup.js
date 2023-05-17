import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddPopup.css";

function AddPopup() {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [hometown, setHometown] = useState("");
  const [errors, setErrors] = useState({});

  const triggerModal = () => {
    setModal(!modal);
    resetData();
  };

  const resetData = () => {
    setId("");
    setName("");
    setDob("");
    setHometown("");
    setErrors({});
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setData(res.data))
      .catch((er) => console.log(er));
  }, []);

  function checkValidDob({ dob }) {
    const format = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!format.test(dob)) {
      return false;
    }
    const [ngay, thang, nam] = dob.split("/").map(Number);

    if (isNaN(ngay) || isNaN(thang) || isNaN(nam)) {
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

  const handelSubmit = (event) => {
    event.preventDefault();

    // Sai
    if (id.length < 8 && id.length > 0) {
      setErrors((prev) => ({
        ...prev,
        id: "Mã sinh viên không có đủ 8 chữ số!",
      }));
    }
    if (id.length > 8) {
      setErrors((prev) => ({ ...prev, id: "Mã sinh viên chỉ có 8 chữ số!" }));
    }
    if (isNaN(id)) {
      setErrors((prev) => ({ ...prev, id: "Mã sinh viên không hợp lệ" }));
    }
    if (data.find((sv) => sv.id === id)) {
      setErrors((prev) => ({ ...prev, id: "Mã sinh viên đã tồn tại!" }));
    }
    if (!id) {
      setErrors((prev) => ({
        ...prev,
        id: "Mã sinh viên không được để trống!",
      }));
    }
    if (!name) {
      setErrors((prev) => ({
        ...prev,
        name: "Họ và tên không được để trống!",
      }));
    }
    if (data.find((sv) => sv.name === name)) {
      setErrors((prev) => ({ ...prev, name: "Họ tên đã tồn tại!" }));
    }
    if (name.length > 100) {
      setErrors((prev) => ({
        ...prev,
        name: "Họ tên có độ dài quá 100 ký tự!",
      }));
    }
    if (data.find((sv) => sv.hometown === hometown)) {
      setErrors((prev) => ({ ...prev, hometown: "Quê quán đã tồn tại!" }));
    }
    if (!hometown) {
      setErrors((prev) => ({
        ...prev,
        hometown: "Quê quán không được để trống!",
      }));
    }
    if (hometown.length > 100) {
      setErrors((prev) => ({
        ...prev,
        hometown: "Quê quán có độ dài quá 100 ký tự!",
      }));
    }
    if (!checkValidDob(dob)) {
      setErrors((prev) => ({ ...prev, dob: "Ngày sinh không hợp lệ!" }));
    }
    if (!dob) {
      setErrors((prev) => ({ ...prev, dob: "Ngày sinh không được để trống!" }));
    }

    // Đúng
    if (id.length === 8 && !isNaN(id) && !data.find((sv) => sv.id === id)) {
      setErrors((prev) => ({ ...prev, id: "" }));
    }
    if (
      name.length > 0 &&
      name.length <= 100 &&
      !data.find((sv) => sv.name === name)
    ) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
    if (
      hometown.length > 0 &&
      hometown.length <= 100 &&
      !data.find((sv) => sv.name === hometown)
    ) {
      setErrors((prev) => ({ ...prev, hometown: "" }));
    }
    if (checkValidDob({ dob })) {
      setErrors((prev) => ({ ...prev, dob: "" }));
    }

    if (
      id.length === 8 &&
      !isNaN(id) &&
      !data.find((sv) => sv.id === id) &&
      name.length > 0 &&
      name.length <= 100 &&
      !data.find((sv) => sv.name === name) &&
      hometown.length > 0 &&
      hometown.length <= 100 &&
      !data.find((sv) => sv.hometown === hometown) &&
      checkValidDob({ dob })
    ) {
      axios
        .post("http://localhost:3000/users", {
          id: id,
          name: name,
          dob: dob,
          hometown: hometown,
        })
        .then((res) => {
          window.location.reload();
        })
        .catch((er) => console.log(er));
    }
  };

  return (
    <div className="container">
      <button
        type="button"
        class="btn btn-primary"
        onClick={triggerModal}
        style={{ margin: "20px 0" }}
      >
        <span class="material-symbols-outlined" style={{ fontSize: "14px" }}>
          add
        </span>{" "}
        Thêm sinh viên
      </button>

      {modal && (
        <div>
          <div className="popup">
            <div onClick={triggerModal} className="overlay"></div>
            <div className="modal-content">
              <form onSubmit={handelSubmit} className="form">
                <h2 className="title">Thêm sinh viên</h2>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Mã SV</label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="text"
                      //   placeholder="VD: 20020000"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                    {errors.id && <span className="error">{errors.id}</span>}
                  </div>
                </div>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Họ và tên</label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="text"
                      //   placeholder="VD: Nguyễn Văn A"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        )
                      }
                    />
                    {errors.name && (
                      <span className="error">{errors.name}</span>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Ngày sinh</label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />{" "}
                    {errors.dob && <span className="error">{errors.dob}</span>}
                  </div>
                </div>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Quê quán</label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="text"
                      //   placeholder="Quê quán"
                      value={hometown}
                      onChange={(e) =>
                        setHometown(
                          e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        )
                      }
                    />
                    {errors.hometown && (
                      <span className="error">{errors.hometown}</span>
                    )}
                  </div>
                </div>
                <div className="popup-buttons">
                  <button
                    type="button"
                    class="btn btn-secondary popup-button"
                    onClick={triggerModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary popup-button"
                    onClick={handelSubmit}
                  >
                    Thêm mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPopup;
