type OptionSome<T> = {
  readonly kind: 'some'
  readonly value: T
}

type OptionNone = {
  readonly kind: 'none'
}

type OptionType<T> = OptionSome<T> |
  OptionNone

const isSome = <T>(value: OptionType<T>): value is OptionSome<T> => {
  return value.kind === 'some'
}

const isNone = <T>(value: OptionType<T>): value is OptionNone => {
  return value.kind === 'none'
}

export class Option<T> {
  private readonly value: OptionType<T>

  constructor(value: OptionType<T>) {
    this.value = value
  }

  static some<T>(value: T): Option<T> {
    return new Option({
      kind: 'some',
      value,
    })
  }

  static none<T>(): Option<T> {
    return new Option({
      kind: 'none',
    })
  }

  isSome(): boolean {
    return isSome(this.value)
  }

  isNone(): boolean {
    return isNone(this.value)
  }

  unwrap(): T {
    if (isSome(this.value)) {
      return this.value.value
    } else {
      throw new Error('Option.unwrap(): Unwrap of none value.')
    }
  }

  unwrapNone(): void {
    if (isSome(this.value)) {
      throw new Error('Option.unwrapNone(): Expected none.')
    }
  }

  unwrapOr(defaultValue: T): T {
    if (isSome(this.value)) {
      return this.value.value
    } else {
      return defaultValue
    }
  }

  unwrapOrElse(f: () => T): T {
    if (isSome(this.value)) {
      return this.value.value
    } else {
      return f()
    }
  }

  expect(s: string): T {
    if (isSome(this.value)) {
      return this.value.value
    } else {
      throw new Error(s)
    }
  }

  expectNone(s: string): void {
    if (isSome(this.value)) {
      throw new Error(s)
    }
  }

  or(value2: Option<T>): Option<T> {
    if (isNone(this.value)) {
      return value2
    } else {
      return this
    }
  }

  orElse(f: () => Option<T>): Option<T> {
    if (isNone(this.value)) {
      return f()
    } else {
      return this
    }
  }

  and<T2>(value2: Option<T2>): Option<T2> {
    if (isSome(this.value)) {
      return value2
    } else {
      return Option.none()
    }
  }

  andThen<T2>(f: (value: T) => Option<T2>): Option<T2> {
    if (isSome(this.value)) {
      return f(this.value.value)
    } else {
      return Option.none()
    }
  }

  xor(another: Option<T>): Option<T> {
    if (isSome(this.value) && isNone(another.value)) {
      return this
    }

    if (isNone(this.value) && isSome(another.value)) {
      return another
    }

    return Option.none()
  }

  map<T2>(f: (value: T) => T2): Option<T2> {
    if (isSome(this.value)) {
      return Option.some(f(this.value.value))
    } else {
      return Option.none()
    }
  }

  mapOr<T2>(f: (value: T) => T2, defaultValue: T2): T2 {
    if (isSome(this.value)) {
      return f(this.value.value)
    } else {
      return defaultValue
    }
  }

  mapOrElse<T2>(f: (value: T) => T2, defaultValueConstructor: () => T2): T2 {
    if (isSome(this.value)) {
      return f(this.value.value)
    } else {
      return defaultValueConstructor()
    }
  }

  filter(predicate: (t: T) => boolean): Option<T> {
    if (isNone(this.value)) {
      return Option.none()
    }

    if (predicate(this.value.value)) {
      return this
    } else {
      return Option.none()
    }
  }

  zip<T2>(another: Option<T2>): Option<[T, T2]> {
    if (isSome(this.value) && isSome(another.value)) {
      return Option.some([this.value.value, another.value.value])
    } else {
      return Option.none()
    }
  }

  zipWith<T2, T3>(another: Option<T2>, f: (v1: T, v2: T2) => T3): Option<T3> {
    if (isSome(this.value) && isSome(another.value)) {
      return Option.some(f(this.value.value, another.value.value))
    } else {
      return Option.none()
    }
  }
}

export const Some = <T>(value: T): Option<T> => Option.some(value)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const None: Option<any> = Option.none()

export default Option
