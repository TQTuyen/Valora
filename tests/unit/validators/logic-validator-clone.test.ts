/**
 * Logic Validator — clone() and checkType() coverage
 */

import { LogicValidator } from '@validators/logic/validator';
import { AndStrategy } from '@validators/logic/strategies/and';
import { string } from '@validators/string';
import { describe, expect, it } from 'vitest';

import { createContext } from '../../helpers/test-utils';

describe('LogicValidator', () => {
  const ctx = createContext();

  it('should have _type = logic', () => {
    const v = new LogicValidator();
    expect(v._type).toBe('logic');
  });

  it('checkType() should succeed for any value (pass-through)', () => {
    const v = new LogicValidator();
    expect(v.validate('anything', ctx).success).toBe(true);
    expect(v.validate(42, ctx).success).toBe(true);
    expect(v.validate(null, ctx).success).toBe(true);
  });

  it('clone() should preserve strategies', () => {
    const v = new LogicValidator<string, string>();
    v['strategies'] = [new AndStrategy([string().minLength(3)])];
    const cloned = v.optional();
    // should work for undefined (optional) and pass strategy
    expect(cloned.validate(undefined, ctx).success).toBe(true);
    expect(cloned.validate('abc', ctx).success).toBe(true);
    expect(cloned.validate('ab', ctx).success).toBe(false);
  });

  it('clone() should preserve isRequired', () => {
    const v = new LogicValidator<string, string>();
    v['isRequired'] = true;
    const cloned = v['clone']();
    expect(cloned['isRequired']).toBe(true);
  });

  it('clone() should preserve customMessage', () => {
    const v = new LogicValidator<string, string>();
    v['customMessage'] = 'custom msg';
    const cloned = v['clone']();
    expect(cloned['customMessage']).toBe('custom msg');
  });

  it('clone() should NOT copy undefined customMessage', () => {
    const v = new LogicValidator<string, string>();
    const cloned = v['clone']();
    expect(cloned['customMessage']).toBeUndefined();
  });
});
