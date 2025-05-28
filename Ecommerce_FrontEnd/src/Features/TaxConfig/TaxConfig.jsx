

"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import api from "../../api"

//
export default function TaxConfiguration() {
  const [taxList, setTaxList] = useState([])
  const [formData, setFormData] = useState({ id: null, name: "", percentage: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTaxes()
  }, [])

  const fetchTaxes = async () => {
    setLoading(true)
    try {
      const response = await api.get("cartapp/taxes/")
      setTaxList(response.data)
      setError(null)
    } catch (err) {
      const errorMessage = "Failed to fetch taxes"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError(null)
  }

  const handleAddOrUpdate = async () => {
    if (!formData.name || !formData.percentage) {
      const errorMessage = "Please fill all fields"
      setError(errorMessage)
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(formData.percentage) < 0 || Number.parseFloat(formData.percentage) > 100) {
      const errorMessage = "Tax rate must be between 0 and 100"
      setError(errorMessage)
      toast({
        title: "Invalid Rate",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        const response = await api.patch(`cartapp/taxes/${formData.id}/`, {
          name: formData.name,
          percentage: formData.percentage,
        })
        setTaxList((prev) => prev.map((tax) => (tax.id === formData.id ? response.data : tax)))
        setIsEditing(false)
        toast({
          title: "Tax Updated",
          description: `${formData.name} has been updated successfully`,
        })
      } else {
        const response = await api.post("cartapp/taxes/", {
          name: formData.name,
          percentage: formData.percentage,
        })
        setTaxList([...taxList, response.data])
        toast({
          title: "Tax Added",
          description: `${formData.name} has been added successfully`,
        })
      }
      setFormData({ id: null, name: "", percentage: "" })
      setError(null)
    } catch (err) {
      const errorMessage = "Failed to save tax"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (tax) => {
    setFormData({ id: tax.id, name: tax.name, percentage: tax.percentage })
    setIsEditing(true)
    setError(null)
  }

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`cartapp/taxes/${id}/`)
      setTaxList(taxList.filter((tax) => tax.id !== id))
      setError(null)
      toast({
        title: "Tax Deleted",
        description: `${name} has been removed successfully`,
      })
    } catch (err) {
      const errorMessage = "Failed to delete tax"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
    }
  }

  const handleCancel = () => {
    setFormData({ id: null, name: "", percentage: "" })
    setIsEditing(false)
    setError(null)
  }

  const handleRefresh = () => {
    fetchTaxes()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#7a2828" }}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#7a2828" }}>
              Tax Configuration
            </h1>
          </div>
          <p className="text-gray-600">Manage your tax rates and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 sticky top-4">
              {/* Form Header */}
              <div
                className="text-white rounded-t-xl p-6"
                style={{ background: "linear-gradient(135deg, #7a2828 0%, #8b3030 100%)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isEditing ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                  <h2 className="text-lg font-semibold">{isEditing ? "Edit Tax" : "Add New Tax"}</h2>
                </div>
                <p className="text-red-100 text-sm">{isEditing ? "Update tax details" : "Enter tax information"}</p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "#7a2828" }}>
                      Tax Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., VAT, GST, Sales Tax"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        focusRingColor: "#7a2828",
                        borderColor: "#d1d5db",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7a2828")}
                      onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "#7a2828" }}>
                      Tax Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="percentage"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.percentage}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{
                          focusRingColor: "#7a2828",
                          borderColor: "#d1d5db",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#7a2828")}
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                      />
                      <svg
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleAddOrUpdate}
                      className="w-full text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#7a2828" }}
                    >
                      {isEditing ? (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Update Tax
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add Tax
                        </>
                      )}
                    </button>

                    {isEditing && (
                      <button
                        onClick={() => {
                          setFormData({ id: null, name: "", percentage: "" })
                          setIsEditing(false)
                          setError(null)
                        }}
                        className="w-full mt-2 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax List */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0">
              {/* List Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Tax Configurations ({taxList.length})
                    </h2>
                    <p className="text-gray-600 text-sm">Manage your existing tax configurations</p>
                  </div>
                </div>
              </div>

              {/* List Content */}
              <div className="p-0">
                {taxList.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center"
                      style={{ backgroundColor: "#fef2f2" }}
                    >
                      <svg className="h-8 w-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2" style={{ color: "#7a2828" }}>
                      No Tax Configurations
                    </h3>
                    <p className="text-gray-500">Get started by adding your first tax configuration.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead>
                          <tr
                            className="border-b border-gray-100"
                            style={{ backgroundColor: "rgba(122, 40, 40, 0.05)" }}
                          >
                            <th className="text-left py-4 px-6 font-semibold" style={{ color: "#7a2828" }}>
                              Tax Name
                            </th>
                            <th className="text-left py-4 px-6 font-semibold" style={{ color: "#7a2828" }}>
                              Rate
                            </th>
                            <th className="text-right py-4 px-6 font-semibold" style={{ color: "#7a2828" }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxList.map((tax, index) => (
                            <tr
                              key={tax.id}
                              className="border-b border-gray-50 hover:bg-red-50/30 transition-colors duration-200"
                            >
                              <td className="py-4 px-6 font-medium" style={{ color: "#7a2828" }}>
                                {tax.name}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: "#7a2828" }}
                                >
                                  {tax.percentage}%
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleEdit(tax)}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                    style={{ color: "#7a2828", borderColor: "#d1a3a3" }}
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(tax.id)}
                                    className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden p-4 space-y-4">
                      {taxList.map((tax) => (
                        <div key={tax.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold" style={{ color: "#7a2828" }}>
                              {tax.name}
                            </h3>
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: "#7a2828" }}
                            >
                              {tax.percentage}%
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(tax)}
                              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-2"
                              style={{ color: "#7a2828", borderColor: "#d1a3a3" }}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(tax.id)}
                              className="flex-1 py-2 px-3 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
