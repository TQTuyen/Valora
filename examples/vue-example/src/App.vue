<template>
  <div class="container">
    <h1>🛡️ Valora Validation Framework - Vue Demo</h1>
    
    <p style="text-align: center; font-size: 1.2em; opacity: 0.9;">
      Demo đầy đủ các tính năng validation framework cho Vue 3
    </p>

    <!-- Feature 1: Basic Validation -->
    <BasicValidation />

    <!-- Feature 2: Custom Validation -->
    <CustomValidation />

    <!-- Feature 3: Combined Validators -->
    <CombinedValidators />

    <!-- Feature 4: Regular Expression -->
    <RegexValidation />

    <!-- Feature 5: Complex Form -->
    <ComplexForm />

    <!-- Feature 6: Declarative Validation -->
    <DeclarativeValidation />

    <!-- Feature 7: Real-time Validation -->
    <RealtimeValidation />
  </div>
</template>

<script setup lang="ts">
import BasicValidation from './components/BasicValidation.vue';
import CustomValidation from './components/CustomValidation.vue';
import CombinedValidators from './components/CombinedValidators.vue';
import RegexValidation from './components/RegexValidation.vue';
import ComplexForm from './components/ComplexForm.vue';
import DeclarativeValidation from './components/DeclarativeValidation.vue';
import RealtimeValidation from './components/RealtimeValidation.vue';
</script>
