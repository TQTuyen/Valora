import { createSignal, For, Show, createEffect } from 'solid-js';

import { createFieldValidation, createFormValidation } from '@tqtos/valora/adapters/solid';
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
  confirmPassword: string()
    .required({ message: 'Please confirm your password' })
    .custom((value, context) => {
      if (value !== context.values.password) {
        return { success: false, errors: [{ message: 'Passwords do not match' }] };
      }
      return { success: true };
    }, 'Passwords do not match'),
  terms: boolean()
    .required({ message: 'You must accept terms' })
    .isTrue({ message: 'Please accept the terms' }),
};

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
  

 
  const [characterCounterText, setCharacterCounterText] = createSignal('10-500 characters required');
  const [characterCounterClass, setCharacterCounterClass] = createSignal('');

  // Character counter effect
  createEffect(() => {
    const currentLength = contactMessage.value()?.length || 0;
    const maxLength = 500;
    const remaining = maxLength - currentLength;

    if (currentLength >= 10) {
      setCharacterCounterText(`${currentLength}/500 characters (${remaining} remaining)`);
      setCharacterCounterClass('success-hint');
    } else if (contactMessage.touched()) {
      setCharacterCounterText(`${currentLength}/500 characters (minimum 10 required)`);
      setCharacterCounterClass('error-hint');
    } else {
      setCharacterCounterText('10-500 characters required');
      setCharacterCounterClass('');
    }
  });

  
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
              onBlur={() => { username.onBlur(); username.validate(); }}
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
              onBlur={() => { email.onBlur(); email.validate(); }}
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
              onBlur={() => { password.onBlur(); password.validate(); }}
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
              onBlur={() => { terms.onBlur(); terms.validate(); }}
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

      {/* Contact Us Section */}
      <main class="card">
        <h2>Contact Us</h2>
        <p class="section-description">
          Demonstrating character counter using field subscriptions
        </p>

        <form class="form" onSubmit={handleContactSubmit}>
          <div class="field">
            <label for="contact-name">
              Name <span class="required">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={contactName.value() ?? ''}
              onInput={(event) =>
                createContactInputHandler(contactName, 'name')(event.currentTarget.value)
              }
              onBlur={() => {
                contactName.onBlur();
                contactName.validate();
              }}
              classList={{ error: contactName.shouldShowError() }}
              placeholder="Your name"
            />
            <Show when={contactName.shouldShowError()}>
              <ul class="errors">
                <For each={contactName.errorMessages()}>{(msg) => <li>{msg}</li>}</For>
              </ul>
            </Show>
          </div>

          <div class="field">
            <label for="contact-email">
              Email <span class="required">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={contactEmail.value() ?? ''}
              onInput={(event) =>
                createContactInputHandler(contactEmail, 'email')(event.currentTarget.value)
              }
              onBlur={() => {
                contactEmail.onBlur();
                contactEmail.validate();
              }}
              classList={{ error: contactEmail.shouldShowError() }}
              placeholder="your@email.com"
            />
            <Show when={contactEmail.shouldShowError()}>
              <ul class="errors">
                <For each={contactEmail.errorMessages()}>{(msg) => <li>{msg}</li>}</For>
              </ul>
            </Show>
          </div>

          <div class="field">
            <label for="contact-message">
              Message <span class="required">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              value={contactMessage.value() ?? ''}
              onInput={(event) =>
                createContactInputHandler(contactMessage, 'message')(event.currentTarget.value)
              }
              onBlur={() => {
                contactMessage.onBlur();
                contactMessage.validate();
              }}
              classList={{ error: contactMessage.shouldShowError() }}
              placeholder="Your message here..."
            />
            <small class="hint" classList={{ [characterCounterClass()]: !!characterCounterClass() }}>
              {characterCounterText()}
            </small>
            <Show when={contactMessage.shouldShowError()}>
              <ul class="errors">
                <For each={contactMessage.errorMessages()}>{(msg) => <li>{msg}</li>}</For>
              </ul>
            </Show>
          </div>

          <div class="actions">
            <button type="submit">Send Message</button>
            <button type="button" class="secondary" onClick={handleContactReset}>
              Clear
            </button>
          </div>
        </form>

        <Show when={contactResult()}>
          <section class="result">
            <p class="label">Contact Result</p>
            <pre>{contactResult()}</pre>
          </section>
        </Show>
      </main>
    </div>
  );
}
