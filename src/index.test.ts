import Option, {Some, None} from './index'

describe('isSome', () => {
  test('returns true if option is some', () => {
    const option: Option<number> = Some(2)

    expect(option.isSome()).toBe(true)
  })

  test('returns false if option is none', () => {
    const option: Option<number> = None

    expect(option.isSome()).toBe(false)
  })
})

describe('isNone', () => {
  test('returns true if option is none', () => {
    const option: Option<number> = None

    expect(option.isNone()).toBe(true)
  })

  test('returns false if option is none', () => {
    const option: Option<number> = Some(2)

    expect(option.isNone()).toBe(false)
  })
})

describe('unwrap', () => {
  test('unwraps option if some', () => {
    const option: Option<string> = Some('air')

    expect(option.unwrap()).toBe('air')
  })

  test('throws exception if none', () => {
    const option: Option<number> = None

    try {
      expect(option.unwrap())
      fail()
    } catch (e) {
    }
  })
})

describe('unwrapNone', () => {
  test('unwraps option if none and returns nothing', () => {
    const option: Option<number> = None

    expect(option.unwrapNone()).toBe(undefined)
  })

  test('throws exception if some', () => {
    const option: Option<string> = Some('air')

    try {
      expect(option.unwrapNone())
      fail()
    } catch (e) {
    }
  })
})

describe('unwrapOr', () => {
  test('unwraps option if some', () => {
    const option: Option<string> = Some('car')

    expect(option.unwrapOr('bike')).toBe('car')
  })

  test('returns provided value if none', () => {
    const option: Option<string> = None

    expect(option.unwrapOr('bike')).toBe('bike')
  })
})

describe('unwrapOrElse', () => {
  test('unwraps option if some', () => {
    const option: Option<number> = Some(4)

    expect(option.unwrapOrElse(() => 20)).toBe(4)
  })

  test('returns provided value if none', () => {
    const option: Option<number> = None

    expect(option.unwrapOrElse(() => 20)).toBe(20)
  })
})

describe('expect', () => {
  test('unwraps option if some', () => {
    const option: Option<string> = Some('value')

    expect(option.expect('fruits are healthy')).toBe('value')
  })

  test('throws an error with provided message if none', () => {
    const option: Option<string> = None
    const message = 'vegetables are healthy too'

    try {
      option.expect(message)
      fail()
    } catch (e) {
      expect(e.message).toEqual(message)
    }
  })
})

describe('expectNone', () => {
  test('throws an error with provided message if some', () => {
    const option: Option<string> = Some('chocolate')
    const message = 'chocolate is not quite healthy'

    try {
      option.expectNone(message)
      fail()
    } catch (e) {
      expect(e.message).toEqual(message)
    }
  })

  test('throws an error with provided message if none', () => {
    const option: Option<string> = None

    expect(option.expectNone('sugar is harmful')).toBe(undefined)
  })
})

describe('or', () => {
  const assertOr = <T>(option1: Option<T>, option2: Option<T>, expected: Option<T>): void => {
    const result: Option<T> = option1.or(option2)

    expect(result).toEqual(expected)
  }

  test('returns some if one of options is some, none otherwise', () => {
    assertOr(None, None, None)
    assertOr(None, Some(2), Some(2))
    assertOr(Some(1), None, Some(1))
    assertOr(Some(1), Some(2), Some(1))
  })
})

describe('orElse', () => {
  test('returns option if it contains a value, otherwise calls provided function and returns the result', () => {
    const nobody = (): Option<string> => None
    const vikings = (): Option<string> => Some('vikings')

    expect(Some('barbarians').orElse(vikings)).toEqual(Some('barbarians'))
    expect(None.orElse(vikings)).toEqual(Some('vikings'))
    expect(None.orElse(nobody)).toEqual(None)
  })
})

describe('and', () => {
  const assertAnd = <T>(option1: Option<T>, option2: Option<T>, expected: Option<T>): void => {
    const result: Option<T> = option1.and(option2)

    expect(result).toEqual(expected)
  }

  test('returns some if one of options is some, none otherwise', () => {
    assertAnd(None, None, None)
    assertAnd(None, Some(2), None)
    assertAnd(Some(1), None, None)
    assertAnd(Some(1), Some(2), Some(2))
  })
})

describe('andThen', () => {
  const square = (value: number): Option<number> => Some(value * value)
  const nope = (): Option<number> => None

  test('returns none if option is none, otherwise calls provided function with the wrapped value and returns the result.', () => {
    expect(Some(2).andThen(square).andThen(square)).toEqual(Some(16))
    expect(Some(2).andThen(square).andThen(nope)).toEqual(None)
    expect(Some(2).andThen(nope).andThen(square)).toEqual(None)
    expect(None.andThen(square).andThen(square)).toEqual(None)
  })
})

describe('xor', () => {
  const assertXor = (option1: Option<number>, option2: Option<number>, expected: Option<number>): void => {
    const result: Option<number> = option1.xor(option2)

    expect(result).toEqual(expected)
  }

  test('returns some if exactly one of options is some, otherwise returns none', () => {
    assertXor(None, None, None)
    assertXor(None, Some(2), Some(2))
    assertXor(Some(1), None, Some(1))
    assertXor(Some(1), Some(2), None)
  })
})

describe('map', () => {
  const assertMap = <T1, T2>(option: Option<T1>, f: (value: T1) => T2, expected: Option<T2>): void => {
    const result: Option<T2> = option.map(f)

    expect(result).toEqual(expected)
  }
  const square = (value: number): number => value * value

  test('maps Option<T> to Option<T2> by applying a provided function', () => {
    assertMap(Some(2), square, Some(4))
    assertMap(None, square, None)
  })
})

describe('mapOr', () => {
  const assertMapOr = <T1, T2>(
    option: Option<T1>,
    f: (value: T1) => T2,
    defaultValue: T2,
    expected: T2,
  ): void => {
    const result: T2 = option.mapOr(f, defaultValue)

    expect(result).toEqual(expected)
  }

  const square = (value: number): number => value * value

  test('applies a function to the contained value (if any), or returns the provided default (if not)', () => {
    assertMapOr(Some(2), square, 3, 4)
    assertMapOr(None, square, 3, 3)
  })
})

describe('mapOrElse', () => {
  const assertMapOrElse = <T1, T2>(
    option: Option<T1>,
    f: (value: T1) => T2,
    defaultValueConstructor: () => T2,
    expected: T2,
  ): void => {
    const result: T2 = option.mapOrElse(f, defaultValueConstructor)

    expect(result).toEqual(expected)
  }

  const square = (value: number): number => value * value

  test('applies a function to the contained value (if any), or returns the provided default (if not)', () => {
    assertMapOrElse(Some(2), square, () => 3, 4)
    assertMapOrElse(None, square, () => 3, 3)
  })
})

describe('filter', () => {
  const assertFilter = <T>(
    option: Option<T>,
    p: (value: T) => boolean,
    expected: Option<T>,
  ): void => {
    const result: Option<T> = option.filter(p)

    expect(result).toEqual(expected)
  }

  const isEven = (value: number): boolean => value % 2 === 0

  test('Returns None if the option is None, otherwise calls predicate with the wrapped value and returns Some if predicate returns true, otherwise returns none', () => {
    assertFilter(None, isEven, None)
    assertFilter(Some(3), isEven, None)
    assertFilter(Some(4), isEven, Some(4))
  })
})

describe('zip', () => {
  const assertZip = <T1, T2>(
    option1: Option<T1>,
    option2: Option<T2>,
    expected: Option<[T1, T2]>,
  ): void => {
    const result: Option<[T1, T2]> = option1.zip(option2)

    expect(result).toEqual(expected)
  }

  test('zips self with another Option', () => {
    assertZip(None, None, None)
    assertZip(None, Some(2), None)
    assertZip(Some('1'), None, None)
    assertZip(Some('1'), Some(2), Some(['1', 2]))
  })
})

describe('zipWith', () => {
  const assertZipWith = <T1, T2, T3>(
    option1: Option<T1>,
    option2: Option<T2>,
    f: (v1: T1, v2: T2) => T3,
    expected: Option<T3>,
  ): void => {
    const result: Option<T3> = option1.zipWith(option2, f)

    expect(result).toEqual(expected)
  }

  const concat = (value1: string, value2: number): string => value1 + value2

  test('zips self with another Option', () => {
    assertZipWith(None, None, concat, None)
    assertZipWith(None, Some(2), concat, None)
    assertZipWith(Some('1'), None, concat, None)
    assertZipWith(Some('1'), Some(2), concat, Some('12'))
  })
})
