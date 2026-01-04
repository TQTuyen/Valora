<script lang="ts">
  import { createFieldValidation, createFormValidation } from 'valora/adapters/svelte';
  import { boolean, string } from '@tqtos/valora/validators';

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
</div>
