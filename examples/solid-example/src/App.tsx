import { createSignal, For, Show } from 'solid-js';

import { createFieldValidation, createFormValidation } from 'valora/adapters/solid';
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
};

export default function App() {
  const { adapter, formState, validateAll, resetAll, getValues } = createFormValidation(schema, {
    validationMode: 'onChange',
  });

  const email = createFieldValidation(adapter, 'email');
  const password = createFieldValidation(adapter, 'password');
  const terms = createFieldValidation(adapter, 'terms');

  const [result, setResult] = createSignal<string | null>(null);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const validation = validateAll();

    if (validation.success) {
      setResult(JSON.stringify(getValues(), null, 2));
    } else {
      setResult('Please fix the highlighted fields.');
    }
  };

  const handleReset = () => {
    resetAll();
    setResult(null);
  };

  return (
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Solid + Valora</p>
        <h1>SolidJS adapter demo</h1>
        <p class="lede">
          Reactive form validation powered by Valora. Built with the Solid adapter so signals stay
          in sync with validation state.
        </p>
      </header>

      <main class="card">
        <form class="form" onSubmit={handleSubmit}>
          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email.value() ?? ''}
              onInput={(event) => email.onInput(event.currentTarget.value)}
              onBlur={email.onBlur}
              classList={{ error: email.shouldShowError() }}
              placeholder="you@example.com"
            />
            <Show when={email.shouldShowError()}>
              <ul class="errors">
                <For each={email.errorMessages()}>{(msg) => <li>{msg}</li>}</For>
              </ul>
            </Show>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password.value() ?? ''}
              onInput={(event) => password.onInput(event.currentTarget.value)}
              onBlur={password.onBlur}
              classList={{ error: password.shouldShowError() }}
              placeholder="At least 8 characters"
            />
            <Show when={password.shouldShowError()}>
              <ul class="errors">
                <For each={password.errorMessages()}>{(msg) => <li>{msg}</li>}</For>
              </ul>
            </Show>
          </div>

          <label class="checkbox">
            <input
              type="checkbox"
              checked={terms.value() ?? false}
              onInput={(event) => terms.onInput(event.currentTarget.checked)}
              onBlur={terms.onBlur}
            />
            <span>I agree to the terms</span>
          </label>
          <Show when={terms.shouldShowError()}>
            <div class="errors">
              <For each={terms.errorMessages()}>{(msg) => <div>{msg}</div>}</For>
            </div>
          </Show>

          <div class="actions">
            <button type="submit" disabled={!formState.canSubmit() || !formState.touched()}>
              Submit
            </button>
            <button type="button" class="secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        <section class="status">
          <div>
            <p class="label">Form valid</p>
            <p class="value">{formState.isValid() ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p class="label">Touched</p>
            <p class="value">{formState.touched() ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p class="label">Validating</p>
            <p class="value">{formState.validating() ? 'Yes' : 'No'}</p>
          </div>
        </section>

        <Show when={result()}>
          <section class="result">
            <p class="label">Result</p>
            <pre>{result()}</pre>
          </section>
        </Show>
      </main>
    </div>
  );
}
