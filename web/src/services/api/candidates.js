import api from "@/services/api"

const list = async ({ jobVacancyId }) => {
  try {
    return await api.get(`/job_vacancies/${jobVacancyId}/candidates`)
  } catch (error) {
    console.error("Error fetching candidates:", error)
    throw error
  }
}

const create = async ({ jobVacancyId, ...rest }) => {
  try {
    return await api.post(`/job_vacancies/${jobVacancyId}/candidates`, rest)
  } catch (error) {
    console.error("Error creating candidate:", error)
    throw error
  }
}

const show = async ({ id }) => {
  try {
    return await api.get(`/candidates/${id}`)
  } catch (error) {
    console.error("Error fetching candidate:", error)
    throw error
  }
}

const meet = async ({ id }) => {
  try {
    return await api.get(`/candidates/${id}/meet`)
  } catch (error) {
    console.error("Error fetching candidate meet data:", error)
    throw error
  }
}

export default {
  list,
  create,
  show,
  meet,
}
