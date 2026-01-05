import { createSignal, For, Show } from 'solid-js';

import { createFieldValidation, createFormValidation } from 'valora/adapters/solid';
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
};

export default function App() {
  const { adapter, validateAll, resetAll, getValues } = createFormValidation(schema, {
    validationMode: 'onSubmit',
  });

  const username = createFieldValidation(adapter, 'username');
  const email = createFieldValidation(adapter, 'email');
  const password = createFieldValidation(adapter, 'password');
  const terms = createFieldValidation(adapter, 'terms');

  const [result, setResult] = createSignal<string | null>(null);
  const [submitted, setSubmitted] = createSignal(false);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    setSubmitted(true);

    // Touch tất cả fields để hiện errors
    (Object.keys(schema) as Array<keyof typeof schema>).forEach((field) => {
      adapter.touchField(field);
    });

    const validation = validateAll();

    if (validation.success) {
      setResult(JSON.stringify(getValues(), null, 2));
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    resetAll();
    setResult(null);
    setSubmitted(false);
  };

  // Helper function to handle input with validation after submit
  const createInputHandler = <T,>(
    fieldValidation: { onInput: (value: T) => void },
    field: keyof typeof schema,
  ) => {
    return (value: T) => {
      fieldValidation.onInput(value);
      if (submitted()) {
        adapter.validateField(field);
      }
    };
  };

  return (
    <div class="page">
      <header class="hero">
        <p class="eyebrow">Solid + Valora</p>
        <h1>SolidJS adapter demo</h1>
      </header>

      <main class="card">
        <form class="form" onSubmit={handleSubmit}>
          <div class="field">
            <label for="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username.value() ?? ''}
              onInput={(event) =>
                createInputHandler(username, 'username')(event.currentTarget.value)
              }
              onBlur={username.onBlur}
              classList={{ error: username.shouldShowError() }}
              placeholder="Enter username"
            />
            <Show when={username.shouldShowError()}>
              <ul class="errors">
                <For each={username.errorMessages()}>{(msg) => <li>{msg}</li>}</For>
              </ul>
            </Show>
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email.value() ?? ''}
              onInput={(event) => createInputHandler(email, 'email')(event.currentTarget.value)}
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
              onInput={(event) =>
                createInputHandler(password, 'password')(event.currentTarget.value)
              }
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
              onInput={(event) => createInputHandler(terms, 'terms')(event.currentTarget.checked)}
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
            <button type="submit">Submit</button>
            <button type="button" class="secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

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
