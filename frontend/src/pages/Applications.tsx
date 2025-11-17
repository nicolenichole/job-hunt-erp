import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'

interface Application {
  id: number
  job_title: string
  status: string
  company_id: number
  company?: { name: string }
  applied_date: string | null
  job_url: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId)
    return company?.name || 'Unknown Company'
  }
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [formData, setFormData] = useState({
    job_title: '',
    job_description: '',
    job_url: '',
    status: 'saved',
    company_id: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    applied_date: '',
  })

  useEffect(() => {
    fetchApplications()
    fetchCompanies()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/')
      setApplications(response.data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies/')
      setCompanies(response.data)
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        company_id: parseInt(formData.company_id),
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        applied_date: formData.applied_date || null,
      }

      if (editing) {
        await axios.put(`/api/applications/${editing.id}`, payload)
      } else {
        await axios.post('/api/applications/', payload)
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchApplications()
    } catch (error) {
      console.error('Failed to save application:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    try {
      await axios.delete(`/api/applications/${id}`)
      fetchApplications()
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  const handleEdit = (app: Application) => {
    setEditing(app)
    setFormData({
      job_title: app.job_title,
      job_description: '',
      job_url: app.job_url || '',
      status: app.status,
      company_id: app.company_id.toString(),
      salary_min: app.salary_min?.toString() || '',
      salary_max: app.salary_max?.toString() || '',
      salary_currency: app.salary_currency,
      applied_date: app.applied_date ? format(new Date(app.applied_date), 'yyyy-MM-dd') : '',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      job_title: '',
      job_description: '',
      job_url: '',
      status: 'saved',
      company_id: '',
      salary_min: '',
      salary_max: '',
      salary_currency: 'USD',
      applied_date: '',
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your job applications</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditing(null)
              resetForm()
              setShowModal(true)
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.map((app) => (
            <li key={app.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {app.job_title}
                        </p>
                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="truncate">{getCompanyName(app.company_id)}</span>
                        {app.salary_min && (
                          <span className="ml-4">
                            {app.salary_currency} {app.salary_min}
                            {app.salary_max && ` - ${app.salary_max}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'offer' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                    {app.applied_date && (
                      <span className="text-sm text-gray-500">
                        {format(new Date(app.applied_date), 'MMM d, yyyy')}
                      </span>
                    )}
                    <button
                      onClick={() => handleEdit(app)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editing ? 'Edit Application' : 'New Application'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.job_title}
                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <select
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.company_id}
                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                      >
                        <option value="">Select a company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="phone_screen">Phone Screen</option>
                        <option value="interview">Interview</option>
                        <option value="final_interview">Final Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Job URL</label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.job_url}
                        onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.salary_min}
                          onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Salary</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.salary_max}
                          onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.applied_date}
                        onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditing(null)
                      resetForm()
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

