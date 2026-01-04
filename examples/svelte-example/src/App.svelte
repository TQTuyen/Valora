<script lang="ts">
  import { createFieldValidation, createFormValidation } from 'valora/adapters/svelte';
  import { boolean, string } from '@tqtos/valora/validators';

  const schema = {
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
    validationMode: 'onBlur',
  });

  const email = createFieldValidation(adapter, 'email');
  const password = createFieldValidation(adapter, 'password');
  const terms = createFieldValidation(adapter, 'terms');

  const emailValue = email.value;
  const emailShouldShowError = email.shouldShowError;
  const emailErrorMessages = email.errorMessages;

  const passwordValue = password.value;
  const passwordShouldShowError = password.shouldShowError;
  const passwordErrorMessages = password.errorMessages;

  const termsValue = terms.value;
  const termsShouldShowError = terms.shouldShowError;
  const termsErrorMessages = terms.errorMessages;

  const formCanSubmit = formState.canSubmit;
  const formTouched = formState.touched;
  const formValid = formState.isValid;
  const formValidating = formState.validating;

  let result: string | null = null;

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const validation = validateAll();

    if (validation.success) {
      result = JSON.stringify(getValues(), null, 2);
    } else {
      result = 'Please fix the highlighted fields.';
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

      <label class="checkbox">
        <input
          type="checkbox"
          checked={$termsValue ?? false}
          on:input={(event) => terms.onInput(event.currentTarget.checked)}
          on:blur={terms.onBlur}
        />
        <span>I agree to the terms</span>
      </label>
      {#if $termsShouldShowError}
        <div class="errors">
          {#each $termsErrorMessages as msg}
            <div>{msg}</div>
          {/each}
        </div>
      {/if}

      <div class="actions">
        <button type="submit" disabled={!$formCanSubmit || !$formTouched}>
          {$formValidating ? 'Validating…' : 'Submit'}
        </button>
        <button type="button" class="secondary" on:click={handleReset}> Reset </button>
      </div>
    </form>

    <section class="status">
      <div>
        <p class="label">Form valid</p>
        <p class="value">{$formValid ? 'Yes' : 'No'}</p>
      </div>
      <div>
        <p class="label">Touched</p>
        <p class="value">{$formTouched ? 'Yes' : 'No'}</p>
      </div>
      <div>
        <p class="label">Validating</p>
        <p class="value">{$formValidating ? 'Yes' : 'No'}</p>
      </div>
    </section>

    {#if result}
      <section class="result">
        <p class="label">Result</p>
        <pre>{result}</pre>
      </section>
    {/if}
  </main>
</div>
