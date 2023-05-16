import React, { useEffect, useState } from "react";
import axios from 'axios';

function Table() {
    const [data, setData] = useState([])
    const [editId, setEdit] = useState(-1)
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [dob, setDob] = useState('')
    const [hometown, setHometown] = useState('')
    const [uname, usetName] = useState('')
    const [udob, usetDob] = useState('')
    const [uhometown, usetHometown] = useState('')
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3000/users')
            .then(res => setData(res.data))
            .catch(er => console.log(er));
    }, [])

    function checkValidDob({ dob }) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(dob)) {
            return false;
        }
        const [ngay, thang, nam] = dob.split('/').map(Number);

        if (isNaN(ngay) || isNaN(thang) || isNaN(nam)) {
            return false;
        }
        if (thang > 12 || thang < 1) {
            return false;
        }
        if (thang === 1 || thang === 3 || thang === 5 || thang === 7 || thang === 8 || thang === 10 || thang === 12) {
            if (ngay > 31) return false;
        } else if (thang === 2) {
            if ((nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0) {
                if (ngay > 29) return false;
            } else if (ngay > 28) return false;
        } else if (ngay > 30) return false;

        if (ngay < 1) return false;

        const currentYear = new Date().getFullYear();
        if (nam > currentYear || nam < 1950) return false;

        return true;
    }

    const handelSubmit = (event) => {
        event.preventDefault();

        // Sai
        if (id.length < 8 && id.length > 0) {
            setErrors((prev) => ({ ...prev, id: "Mã sinh viên không có đủ 8 chữ số!" }));
        }
        if (id.length > 8) {
            setErrors((prev) => ({ ...prev, id: "Mã sinh viên chỉ có 8 chữ số!" }));
        }
        if (isNaN(id)) {
            setErrors((prev) => ({ ...prev, id: "Mã sinh viên không hợp lệ" }));
        }
        if (data.find(sv => sv.id === id)) {
            setErrors((prev) => ({ ...prev, id: "Mã sinh viên đã tồn tại!" }));
        }
        if (!id) {
            setErrors((prev) => ({ ...prev, id: "Mã sinh viên không được để trống!" }));
        }
        if (!name) {
            setErrors((prev) => ({ ...prev, name: "Họ và tên không được để trống!" }));
        }
        if (data.find(sv => sv.name === name)) {
            setErrors((prev) => ({ ...prev, name: "Họ tên đã tồn tại!" }));
        }
        if (name.length > 100) {
            setErrors((prev) => ({ ...prev, name: "Họ tên có độ dài quá 100 ký tự!" }));
        }
        if (data.find(sv => sv.hometown === hometown)) {
            setErrors((prev) => ({ ...prev, hometown: "Quê quán đã tồn tại!" }));
        }
        if (!hometown) {
            setErrors((prev) => ({ ...prev, hometown: "Quê quán không được để trống!" }));
        }
        if (hometown.length > 100) {
            setErrors((prev) => ({ ...prev, hometown: "Quê quán có độ dài quá 100 ký tự!" }));
        }
        if (!(checkValidDob(dob))) {
            setErrors((prev) => ({ ...prev, dob: "Ngày sinh không hợp lệ!" }));
        }
        if (!dob) {
            setErrors((prev) => ({ ...prev, dob: "Ngày sinh không được để trống!" }));
        }

        // Đúng
        if ((id.length === 8 && !isNaN(id) && !data.find(sv => sv.id === id))) {
            setErrors((prev) => ({ ...prev, id: "" }));
        }
        if ((name.length > 0 && name.length <= 100 && !data.find(sv => sv.name === name))) {
            setErrors((prev) => ({ ...prev, name: "" }));
        }
        if ((hometown.length > 0 && hometown.length <= 100 && !data.find(sv => sv.name === hometown))) {
            setErrors((prev) => ({ ...prev, hometown: "" }));
        }
        if (checkValidDob({ dob })) {
            setErrors((prev) => ({ ...prev, dob: "" }));
        }

        if ((id.length === 8 && !isNaN(id) && !data.find(sv => sv.id === id)) && (name.length > 0 && name.length <= 100 && !data.find(sv => sv.name === name))
            && (hometown.length > 0 && hometown.length <= 100 && !data.find(sv => sv.name === hometown)) && checkValidDob({ dob })) {
            console.log("Thêm");
            axios.post('http://localhost:3000/users', { id: id, name: name, dob: dob, hometown: hometown })
                .then(res => {
                    window.location.reload();
                })
                .catch(er => console.log(er));
        }
    }

    const handleEdit = (id) => {
        axios.get('http://localhost:3000/users/' + id)
            .then(res => {
                console.log(res.data)
                usetName(res.data.name)
                usetDob(res.data.dob)
                usetHometown(res.data.hometown)
            })
            .catch(er => console.log(er));
        setEdit(id)
    }

    const handleUpdate = () => {
        axios.put('http://localhost:3000/users/' + editId, { id: editId, name: uname, dob: udob, hometown: uhometown })
            .then(res => {
                console.log(res);
                window.location.reload();
                setEdit(-1);
            }).catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        axios.delete('http://localhost:3000/users/' + id)
            .then(res => {
                window.location.reload();
            })
            .catch(er => console.log(er));
        setEdit(id)
    }

    return (
        <div className="container">
            <div>
                <form onSubmit={handelSubmit}>
                    <div>
                        <input type="text" placeholder="Mã SV" value={id} onChange={e => setId(e.target.value)} />
                        {errors.id && <span>{errors.id}</span>}
                        <br />
                    </div>
                    <div>
                        <input type="text" placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "))} />
                        {errors.name && <span>{errors.name}</span>}
                        <br />
                    </div>
                    <div>
                        <input type="text" placeholder="Ngày sinh" value={dob} onChange={e => setDob(e.target.value)} />
                        {errors.dob && <span>{errors.dob}</span>}
                        <br />
                    </div>
                    <div>
                        <input type="text" placeholder="Quê quán" value={hometown} onChange={e => setHometown(e.target.value)} />
                        {errors.hometown && <span>{errors.hometown}</span>}
                        <br />
                    </div>
                    <button>Thêm mới</button>
                </form>
            </div>
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
                    {
                        data.map((users, index) => (
                            users.id === editId ?
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{users.id}</td>
                                    <td><input type="text" value={uname} onChange={e => usetName(e.target.value)} /></td>
                                    <td><input type="text" value={udob} onChange={e => usetDob(e.target.value)} /></td>
                                    <td><input type="text" value={uhometown} onChange={e => usetHometown(e.target.value)} /></td>
                                    <td>
                                        <button className="btn btn-success btn-sm" onClick={() => handleUpdate()}>Update</button>
                                    </td>
                                </tr>
                                :
                                <tr key={users.id}>
                                    <td>{index + 1}</td>
                                    <td>{users.id}</td>
                                    <td>{users.name}</td>
                                    <td>{users.dob}</td>
                                    <td>{users.hometown}</td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(users.id)}>Sửa</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(users.id)}>Xóa</button>
                                    </td>
                                </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table;