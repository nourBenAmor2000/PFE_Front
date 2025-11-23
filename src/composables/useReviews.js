import { defineStore } from 'pinia'
import { useApi } from './useApi'

export const useReviews = defineStore('reviews', {
  state: () => ({
    reviews: [],
    isLoading: false,
    error: null
  }),

  actions: {
    // ✅ Fetch all reviews
    async fetchReviews() {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('reviews')
        const response = await api.get(endpoint)
        const data = extractData(response)
        this.reviews = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Failed to fetch reviews:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to fetch reviews'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Add a new review
    async addReview(payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('reviews')
        const response = await api.post(endpoint, payload)
        const data = extractData(response)
        this.reviews.push(data)
        return data
      } catch (err) {
        console.error('Failed to add review:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to add review'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update review by ID
    async updateReview(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint, extractData } = useApi()
        const endpoint = getEndpoint('reviews')
        const response = await api.put(`${endpoint}/${id}`, payload)
        const data = extractData(response)
        const index = this.reviews.findIndex(review => review._id === id || review.id === id)
        if (index !== -1) {
          this.reviews[index] = data
        }
        return data
      } catch (err) {
        console.error('Failed to update review:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to update review'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Delete review by ID
    async deleteReview(id) {
      this.isLoading = true
      this.error = null
      try {
        const { api, getEndpoint } = useApi()
        const endpoint = getEndpoint('reviews')
        await api.delete(`${endpoint}/${id}`)
        this.reviews = this.reviews.filter(review => (review._id !== id && review.id !== id))
      } catch (err) {
        console.error('Failed to delete review:', err.response?.data || err.message)
        this.error = err.response?.data?.message || err.message || 'Failed to delete review'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})

