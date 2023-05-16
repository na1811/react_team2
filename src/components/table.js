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

    useEffect(()=> {
        axios.get('http://localhost:3000/users')
        .then(res => setData(res.data))
        .catch(er => console.log(er));
    }, [])

    const handelSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/users', {id: id, name: name, dob: dob, hometown: hometown})
        .then(res => {
            window.location.reload();
        })
        .catch(er => console.log(er));
    }

    const handleEdit = (id) => {
        axios.get('http://localhost:3000/users/'+id)
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
        axios.put('http://localhost:3000/users/'+editId, {id: editId, name: uname, dob: udob, hometown: uhometown})
        .then(res => {
            console.log(res);
            window.location.reload();
            setEdit(-1);
        }).catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        axios.delete('http://localhost:3000/users/'+id)
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
                        <input type="text" placeholder="Mã SV" onChange={e => setId(e.target.value)}/>
                        <input type="text" placeholder="Họ và tên" onChange={e => setName(e.target.value)}/>
                        <input type="text" placeholder="Ngày sinh" onChange={e => setDob(e.target.value)}/>
                        <input type="text" placeholder="Quê quán" onChange={e => setHometown(e.target.value)}/>
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
                            data.map( (users, index)=>(
                                users.id === editId ?
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{users.id}</td>
                                        <td><input type="text" value={uname} onChange={e => usetName(e.target.value)}/></td>
                                        <td><input type="text" value={udob} onChange={e => usetDob(e.target.value)}/></td>
                                        <td><input type="text" value={uhometown} onChange={e => usetHometown(e.target.value)}/></td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={() => handleUpdate()}>Update</button>
                                        </td>
                                    </tr>
                                :
                                <tr key={users.id}>
                                    <td>{ index+1}</td>
                                    <td>{ users.id}</td>
                                    <td>{ users.name}</td>
                                    <td>{ users.dob}</td>
                                    <td>{ users.hometown}</td>
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