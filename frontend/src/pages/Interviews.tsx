import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Interview {
  id: number
  application_id: number
  application?: { job_title: string; company?: { name: string } }
  interview_type: string | null
  scheduled_at: string
  location: string | null
  interviewer_name: string | null
  interviewer_email: string | null
  notes: string | null
  feedback: string | null
  result: string | null
}

export default function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const getApplicationInfo = (applicationId: number) => {
    const app = applications.find(a => a.id === applicationId)
    if (!app) return { job_title: 'Unknown Position', company_name: null }
    const company = companies.find(c => c.id === app.company_id)
    return {
      job_title: app.job_title || 'Unknown Position',
      company_name: company?.name || null
    }
  }
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Interview | null>(null)
  const [formData, setFormData] = useState({
    application_id: '',
    interview_type: '',
    scheduled_at: '',
    location: '',
    interviewer_name: '',
    interviewer_email: '',
    notes: '',
    feedback: '',
    result: '',
  })

  useEffect(() => {
    fetchInterviews()
    fetchApplications()
    fetchCompanies()
  }, [])
  
  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies/')
      setCompanies(response.data)
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('/api/interviews/')
      setInterviews(response.data)
    } catch (error) {
      console.error('Failed to fetch interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications/')
      setApplications(response.data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        application_id: parseInt(formData.application_id),
        interview_type: formData.interview_type || null,
        location: formData.location || null,
        interviewer_name: formData.interviewer_name || null,
        interviewer_email: formData.interviewer_email || null,
        notes: formData.notes || null,
        feedback: formData.feedback || null,
        result: formData.result || null,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
      }

      if (editing) {
        await axios.put(`/api/interviews/${editing.id}`, payload)
      } else {
        await axios.post('/api/interviews/', payload)
      }
      setShowModal(false)
      setEditing(null)
      resetForm()
      fetchInterviews()
    } catch (error) {
      console.error('Failed to save interview:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this interview?')) return
    try {
      await axios.delete(`/api/interviews/${id}`)
      fetchInterviews()
    } catch (error) {
      console.error('Failed to delete interview:', error)
    }
  }

  const handleEdit = (interview: Interview) => {
    setEditing(interview)
    const scheduledDate = new Date(interview.scheduled_at)
    const localDateTime = new Date(scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    
    setFormData({
      application_id: interview.application_id.toString(),
      interview_type: interview.interview_type || '',
      scheduled_at: localDateTime,
      location: interview.location || '',
      interviewer_name: interview.interviewer_name || '',
      interviewer_email: interview.interviewer_email || '',
      notes: interview.notes || '',
      feedback: interview.feedback || '',
      result: interview.result || '',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      application_id: '',
      interview_type: '',
      scheduled_at: '',
      location: '',
      interviewer_name: '',
      interviewer_email: '',
      notes: '',
      feedback: '',
      result: '',
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="mt-2 text-sm text-gray-600">Schedule and track your interviews</p>
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
            New Interview
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {interviews.map((interview) => (
            <li key={interview.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      {(() => {
                        const appInfo = getApplicationInfo(interview.application_id)
                        return (
                          <>
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {appInfo.job_title}
                            </p>
                            {appInfo.company_name && (
                              <p className="text-sm text-gray-500">{appInfo.company_name}</p>
                            )}
                          </>
                        )
                      })()}
                      <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                        <span>{format(new Date(interview.scheduled_at), 'MMM d, yyyy h:mm a')}</span>
                        {interview.interview_type && (
                          <span className="truncate">{interview.interview_type}</span>
                        )}
                        {interview.location && (
                          <span className="truncate">{interview.location}</span>
                        )}
                        {interview.interviewer_name && (
                          <span className="truncate">with {interview.interviewer_name}</span>
                        )}
                        {interview.result && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            interview.result === 'passed' ? 'bg-green-100 text-green-800' :
                            interview.result === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {interview.result}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(interview)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(interview.id)}
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
                    {editing ? 'Edit Interview' : 'New Interview'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application</label>
                      <select
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.application_id}
                        onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
                      >
                        <option value="">Select an application</option>
                        {applications.map((app) => {
                          const company = companies.find(c => c.id === app.company_id)
                          return (
                            <option key={app.id} value={app.id}>
                              {app.job_title} - {company?.name || 'Unknown'}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
                      <input
                        type="datetime-local"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interview Type</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Phone, Video, Onsite"
                        value={formData.interview_type}
                        onChange={(e) => setFormData({ ...formData, interview_type: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interviewer Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.interviewer_name}
                        onChange={(e) => setFormData({ ...formData, interviewer_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interviewer Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.interviewer_email}
                        onChange={(e) => setFormData({ ...formData, interviewer_email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Result</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.result}
                        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                      >
                        <option value="">Pending</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Feedback</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.feedback}
                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
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

