import React, { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users'

const Users = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'INSURANCE',
    password: '',
  })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchUsers = async () => {
      try {
        const res = await getUsers()
        if (mounted) setUsers(res.data)
      } catch (err) {
        console.error('Error loading users:', err)
      }
    }
    fetchUsers()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await updateUser(editId, form)
      } else {
        await createUser(form)
      }
      setForm({
        username: '',
        fullName: '',
        email: '',
        role: 'INSURANCE',
        password: '',
      })
      setEditId(null)
      // reload users after save
      const res = await getUsers()
      setUsers(res.data)
    } catch (err) {
      console.error('Error saving user:', err)
    }
  }

  const handleEdit = (u) => {
    setEditId(u.id)
    setForm({
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      password: '',
    })
  }

  const handleDelete = async (id) => {
    if (globalThis.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id)
        const res = await getUsers()
        setUsers(res.data)
      } catch (err) {
        console.error('Error deleting user:', err)
      }
    }
  }

  return (
    <div className="container mt-4">
      <h2>Users Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="ADMIN">ADMIN</option>
          <option value="INSURANCE">INSURANCE</option>
          <option value="AUDITOR">AUDITOR</option>
          <option value="PROVIDER">PROVIDER</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
      </form>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
