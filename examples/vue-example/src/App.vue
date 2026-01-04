<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <span class="shield-icon">🛡️</span>
        <h1>Valora</h1>
        <p class="app-subtitle">The modern validation framework for Vue 3</p>
      </div>
      <div class="feature-badges">
        <span class="badge">TypeScript First</span>
        <span class="badge">Reactive State</span>
        <span class="badge">Composition API</span>
        <span class="badge">Zero Deps</span>
      </div>
    </header>
    <main>
      <ComprehensiveDemo />
    </main>
    <footer class="app-footer">
      <p>Built with ❤️ using Valora & Vue 3</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ComprehensiveDemo from './components/ComprehensiveDemo.vue';
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 4rem 2rem 2rem;
  text-align: center;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.header-content {
  margin-bottom: 2rem;
}

.shield-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 6px rgba(99, 102, 241, 0.2));
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.app-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.feature-badges {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.4rem 1rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
}

.badge:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  transform: translateY(-1px);
}

.app-footer {
  margin-top: auto;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 3rem 1rem 1.5rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  .app-subtitle {
    font-size: 1.1rem;
  }
}
</style>
