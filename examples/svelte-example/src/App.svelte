<script lang="ts">
  import { createFieldValidation, createFormValidation } from 'valora/adapters/svelte';
  import { boolean, string } from '@tqtos/valora/validators';
  import { derived } from 'svelte/store';

  const schema = {
    username: string()
      .required({ message: 'Username is required' })
      .minLength(3, { message: 'At least 3 characters' })
      .maxLength(20, { message: 'Maximum 20 characters' }),
    email: string()
      .required({ message: 'Email is required' })
      .email({ message: 'Use a valid email address' }),
    password: string()
      .required({ message: 'Password is required' })
      .minLength(8, { message: 'At least 8 characters' }),
    terms: boolean()
      .required({ message: 'You must accept terms' })
      .isTrue({ message: 'Please accept the terms' }),
  } as const;

  // Contact form schema
  const contactSchema = {
    name: string()
      .required({ message: 'Name is required' })
      .minLength(2, { message: 'Name must be at least 2 characters' })
      .maxLength(100, { message: 'Name is too long' }),
    email: string()
      .required({ message: 'Email is required' })
      .email({ message: 'Valid email address is required' }),
    message: string()
      .required({ message: 'Message is required' })
      .minLength(10, { message: 'Message must be at least 10 characters' })
      .maxLength(500, { message: 'Message must not exceed 500 characters' }),
  } as const;

  const { adapter, formState, validateAll, resetAll, getValues } = createFormValidation(schema, {
    validationMode: 'onChange',
  });

  // Initialize with empty values to avoid type validation errors
  adapter.setFieldValue('username', '');
  adapter.setFieldValue('email', '');
  adapter.setFieldValue('password', '');
  adapter.setFieldValue('terms', false);

  const username = createFieldValidation(adapter, 'username');
  const email = createFieldValidation(adapter, 'email');
  const password = createFieldValidation(adapter, 'password');
  const terms = createFieldValidation(adapter, 'terms');

  const usernameValue = username.value;
  const usernameShouldShowError = username.shouldShowError;
  const usernameErrorMessages = username.errorMessages;

  const emailValue = email.value;
  const emailShouldShowError = email.shouldShowError;
  const emailErrorMessages = email.errorMessages;

  const passwordValue = password.value;
  const passwordShouldShowError = password.shouldShowError;
  const passwordErrorMessages = password.errorMessages;

  const termsValue = terms.value;
  const termsShouldShowError = terms.shouldShowError;
  const termsErrorMessages = terms.errorMessages;

  const formValid = formState.isValid;
  const formTouched = formState.isTouched;
  const formValidating = formState.isValidating;

  let result: string | null = null;

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    
    // Touch all fields to show errors
    username.touch();
    email.touch();
    password.touch();
    terms.touch();
    
    const validation = validateAll();

    if (validation.success) {
      result = JSON.stringify(getValues(), null, 2);
    } else {
      result = null;
    }
  };

  const handleReset = () => {
    resetAll();
    result = null;
  };

  // Contact form setup
  const {
    adapter: contactAdapter,
    formState: contactFormState,
    validateAll: validateContact,
    resetAll: resetContact,
    getValues: getContactValues,
  } = createFormValidation(contactSchema, {
    validationMode: 'onChange',
  });

  // Initialize contact form with empty values
  contactAdapter.setFieldValue('name', '');
  contactAdapter.setFieldValue('email', '');
  contactAdapter.setFieldValue('message', '');

  const contactName = createFieldValidation(contactAdapter, 'name');
  const contactEmail = createFieldValidation(contactAdapter, 'email');
  const contactMessage = createFieldValidation(contactAdapter, 'message');

  const contactNameValue = contactName.value;
  const contactNameShouldShowError = contactName.shouldShowError;
  const contactNameErrorMessages = contactName.errorMessages;

  const contactEmailValue = contactEmail.value;
  const contactEmailShouldShowError = contactEmail.shouldShowError;
  const contactEmailErrorMessages = contactEmail.errorMessages;

  const contactMessageValue = contactMessage.value;
  const contactMessageShouldShowError = contactMessage.shouldShowError;
  const contactMessageErrorMessages = contactMessage.errorMessages;

  const contactFormValid = contactFormState.isValid;
  const contactFormTouched = contactFormState.isTouched;
  const contactFormValidating = contactFormState.isValidating;

  let contactResult: string | null = null;

  // Character counter for message field
  const characterCounterText = derived(contactMessageValue, ($value) => {
    const currentLength = $value?.length || 0;
    const maxLength = 500;
    const remaining = maxLength - currentLength;

    if (currentLength >= 10) {
      return `${currentLength}/500 characters (${remaining} remaining)`;
    } else {
      return `${currentLength}/500 characters (minimum 10 required)`;
    }
  });

  const characterCounterClass = derived(
    [contactMessageValue, contactMessage.touched],
    ([$value, $touched]) => {
      const currentLength = $value?.length || 0;

      if (currentLength >= 10) {
        return 'success-hint';
      } else if ($touched) {
        return 'error-hint';
      } else {
        return '';
      }
    }
  );

  const handleContactSubmit = (event: Event) => {
    event.preventDefault();

    // Touch all fields to show errors
    contactName.touch();
    contactEmail.touch();
    contactMessage.touch();

    const validation = validateContact();

    if (validation.success) {
      contactResult = JSON.stringify(getContactValues(), null, 2);
    } else {
      contactResult = null;
    }
  };

  const handleContactReset = () => {
    resetContact();
    contactResult = null;
  };
</script>

<div class="page">
  <header class="hero">
    <p class="eyebrow">Svelte + Valora</p>
    <h1>Svelte adapter demo</h1>
    <p class="lede">
      Reactive form validation powered by Valora. Uses the Svelte adapter so stores stay in sync
      with validation state.
    </p>
  </header>

  <main class="card">
    <form class="form" on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={$usernameValue ?? ''}
          on:input={(event) => username.onInput(event.currentTarget.value)}
          on:blur={username.onBlur}
          class:error={$usernameShouldShowError}
          placeholder="Enter username"
        />
        {#if $usernameShouldShowError}
          <ul class="errors">
            {#each $usernameErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={$emailValue ?? ''}
          on:input={(event) => email.onInput(event.currentTarget.value)}
          on:blur={email.onBlur}
          class:error={$emailShouldShowError}
          placeholder="you@example.com"
        />
        {#if $emailShouldShowError}
          <ul class="errors">
            {#each $emailErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={$passwordValue ?? ''}
          on:input={(event) => password.onInput(event.currentTarget.value)}
          on:blur={password.onBlur}
          class:error={$passwordShouldShowError}
          placeholder="At least 8 characters"
        />
        {#if $passwordShouldShowError}
          <ul class="errors">
            {#each $passwordErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="field checkbox-field">
        <label>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={$termsValue ?? false}
            on:change={(event) => terms.onInput(event.currentTarget.checked)}
            on:blur={terms.onBlur}
          />
          <span>I agree to the terms and conditions</span>
        </label>
        {#if $termsShouldShowError}
          <ul class="errors">
            {#each $termsErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="actions">
        <button type="submit">
          {$formValidating ? 'Validating…' : 'Submit'}
        </button>
        <button type="button" class="secondary" on:click={handleReset}>
          Reset
        </button>
      </div>
    </form>

    {#if result}
      <section class="result">
        <p class="label">Result</p>
        <pre>{result}</pre>
      </section>
    {/if}
  </main>

  <!-- Contact Us Section -->
  <main class="card">
    <h2>Contact Us</h2>
    <p class="section-description">
      Demonstrating character counter using field subscriptions
    </p>

    <form class="form" on:submit|preventDefault={handleContactSubmit}>
      <div class="field">
        <label for="contact-name">
          Name <span class="required">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={$contactNameValue ?? ''}
          on:input={(event) => contactName.onInput(event.currentTarget.value)}
          on:blur={contactName.onBlur}
          class:error={$contactNameShouldShowError}
          placeholder="Your name"
        />
        {#if $contactNameShouldShowError}
          <ul class="errors">
            {#each $contactNameErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="field">
        <label for="contact-email">
          Email <span class="required">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={$contactEmailValue ?? ''}
          on:input={(event) => contactEmail.onInput(event.currentTarget.value)}
          on:blur={contactEmail.onBlur}
          class:error={$contactEmailShouldShowError}
          placeholder="your@email.com"
        />
        {#if $contactEmailShouldShowError}
          <ul class="errors">
            {#each $contactEmailErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="field">
        <label for="contact-message">
          Message <span class="required">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows="5"
          value={$contactMessageValue ?? ''}
          on:input={(event) => contactMessage.onInput(event.currentTarget.value)}
          on:blur={contactMessage.onBlur}
          class:error={$contactMessageShouldShowError}
          placeholder="Your message here..."
        />
        <small class="hint {$characterCounterClass}">
          {$characterCounterText}
        </small>
        {#if $contactMessageShouldShowError}
          <ul class="errors">
            {#each $contactMessageErrorMessages as msg}
              <li>{msg}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="actions">
        <button type="submit">
          {$contactFormValidating ? 'Sending…' : 'Send Message'}
        </button>
        <button type="button" class="secondary" on:click={handleContactReset}>
          Clear
        </button>
      </div>
    </form>

    {#if contactResult}
      <section class="result">
        <p class="label">Contact Result</p>
        <pre>{contactResult}</pre>
      </section>
    {/if}
  </main>
</div>
