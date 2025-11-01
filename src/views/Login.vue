<template>
  <div class="login-container">
    <div class="background-image"></div>
    <div class="background-overlay"></div>
    
    <div class="modal-card">
      <button 
        @click="$router.push('/')"
        class="close-button"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h2 class="heading-text">
        Connectez-vous ou inscrivez-vous pour profiter de tous les services Tecnocasa
      </h2>
      
      <div class="space-y-3 mb-6">
        <button 
          type="button"
          class="social-button facebook-button"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
        
        <button 
          type="button"
          class="social-button google-button"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        
        <button 
          type="button"
          class="social-button apple-button"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Apple
        </button>
      </div>
      
      <div class="divider">
        <div class="divider-line"></div>
        <span class="divider-text">ou</span>
        <div class="divider-line"></div>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="form-input"
            placeholder="E-mail"
          />
        </div>
        
        <div>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="form-input"
            placeholder="Mot de passe"
          />
        </div>
        
        <div class="text-right">
          <a href="#" class="forgot-password-link">
            Mot de passe oublié?
          </a>
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="submit-button"
        >
          {{ isLoading ? 'Connexion...' : 'login' }}
        </button>
      </form>
      
      <p class="register-link">
        Pas encore de compte?
        <router-link to="/register" class="register-link-text">
          Inscrivez-vous
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, isLoading } = useAuth()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''
  
  const result = await login({
    email: form.value.email,
    password: form.value.password
  })
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error || 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.background-image {
  position: absolute;
  inset: 0;
  background-image: url('/assets/images/landingPhoto.webp');
  background-size: cover;
  background-position: center;
  filter: blur(3px);
}

.background-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-card {
  position: relative;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #9ca3af;
  transition: color 0.2s;
}

.close-button:hover {
  color: #4b5563;
}

.heading-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
  padding-right: 2rem;
}

.social-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
}

.facebook-button {
  background-color: #4267B2;
  color: white;
}

.facebook-button:hover {
  background-color: #365899;
}

.google-button {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.google-button:hover {
  background-color: #f9fafb;
}

.apple-button {
  background-color: black;
  color: white;
}

.apple-button:hover {
  background-color: #111827;
}

.divider {
  position: relative;
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider-line {
  flex-grow: 1;
  border-top: 1px solid #d1d5db;
}

.divider-text {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #111827;
  outline: none;
  transition: all 0.2s;
}

.form-input::placeholder {
  color: #6b7280;
}

.form-input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px #00A896;
}

.forgot-password-link {
  font-size: 0.875rem;
  color: #00A896;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password-link:hover {
  color: #008c7a;
}

.submit-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  color: #374151;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
}

.submit-button:hover:not(:disabled) {
  background-color: #f9fafb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.register-link-text {
  color: #00A896;
  font-weight: 500;
  margin-left: 0.25rem;
  transition: color 0.2s;
}

.register-link-text:hover {
  color: #008c7a;
}
</style>
