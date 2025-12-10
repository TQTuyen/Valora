/**
 * Factory Pattern - Validator Factory
 * Singleton pattern for creating and registering validators
 * @module core/factory
 */

import type { IValidator, IValidatorFactory, ValidatorRegistration } from '#types/index';

/**
 * Validator Factory for creating and registering validators
 */
export class ValidatorFactory implements IValidatorFactory {
  private static instance: ValidatorFactory | null = null;
  private registry: Map<string, ValidatorRegistration> = new Map();

  private constructor() {}

  static getInstance(): ValidatorFactory {
    ValidatorFactory.instance ??= new ValidatorFactory();
    return ValidatorFactory.instance;
  }

  static resetInstance(): void {
    ValidatorFactory.instance = null;
  }

  register<T extends IValidator>(registration: ValidatorRegistration<T>): void {
    if (this.registry.has(registration.name)) {
      throw new Error(`[Valora] Validator "${registration.name}" is already registered`);
    }
    this.registry.set(registration.name, registration);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  create<T extends IValidator>(name: string): T | undefined {
    const registration = this.registry.get(name);
    if (!registration) {
      return undefined;
    }
    return registration.factory() as T;
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  getAll(): ValidatorRegistration[] {
    return Array.from(this.registry.values());
  }

  clear(): void {
    this.registry.clear();
  }
}
