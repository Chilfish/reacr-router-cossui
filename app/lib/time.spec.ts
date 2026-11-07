import { describe, expect, it } from 'vitest'
import {
  createMinuteOptions,
  formatTime,
  normalizeMinuteStep,
  normalizeTime,
  parseTime,
  stepTime,
} from './time'

describe('parseTime', () => {
  it('withColon_returnsMinutes', () => {
    expect(parseTime('09:30')).toBe(570)
    expect(parseTime('9.30')).toBe(570)
  })

  it('withCompactDigits_infersHoursAndMinutes', () => {
    expect(parseTime('930')).toBe(570)
    expect(parseTime('1500')).toBe(900)
  })

  it('withSingleHour_defaultsToZeroMinutes', () => {
    expect(parseTime('9')).toBe(540)
  })

  it('withTwelveHourPeriod_convertsTo24Hour', () => {
    expect(parseTime('12am')).toBe(0)
    expect(parseTime('12pm')).toBe(720)
    expect(parseTime('1:30pm')).toBe(810)
    expect(parseTime('9 a.m.')).toBe(540)
  })

  it('withChineseWords_parses', () => {
    expect(parseTime('下午3点30分')).toBe(930)
    expect(parseTime('晚上8点')).toBe(1200)
    expect(parseTime('上午9时')).toBe(540)
    expect(parseTime('中午12点')).toBe(720)
  })

  it('withFullWidthDigits_parses', () => {
    expect(parseTime('０９：３０')).toBe(570)
  })

  it('withInvalidHour_returnsNull', () => {
    expect(parseTime('24:00')).toBeNull()
    expect(parseTime('13pm')).toBeNull()
  })

  it('withInvalidMinutes_returnsNull', () => {
    expect(parseTime('9:60')).toBeNull()
  })

  it('withUnknownInput_returnsNull', () => {
    expect(parseTime('abc')).toBeNull()
    expect(parseTime('   ')).toBeNull()
  })
})

describe('formatTime', () => {
  it('hour24_padsHoursAndMinutes', () => {
    expect(formatTime(5)).toBe('00:05')
    expect(formatTime(570)).toBe('09:30')
  })

  it('hour12_appendsPeriod', () => {
    expect(formatTime(0, true)).toBe('12:00 AM')
    expect(formatTime(720, true)).toBe('12:00 PM')
    expect(formatTime(13 * 60 + 5, true)).toBe('1:05 PM')
  })

  it('outOfRangeMinutes_wrapWithinDay', () => {
    expect(formatTime(1445)).toBe('00:05')
    expect(formatTime(-30)).toBe('23:30')
  })
})

describe('normalizeTime', () => {
  it('withValidInput_returnsCanonicalTime', () => {
    expect(normalizeTime('930')).toBe('09:30')
    expect(normalizeTime('下午3点')).toBe('15:00')
  })

  it('withInvalidInput_returnsNull', () => {
    expect(normalizeTime('abc')).toBeNull()
  })
})

describe('stepTime', () => {
  it('increment_wrapsAtMidnight', () => {
    expect(stepTime(23 * 60 + 50, 15, 1)).toBe(5)
  })

  it('decrement_wrapsBeforeMidnight', () => {
    expect(stepTime(5, 15, -1)).toBe(1430)
  })

  it('withZeroStep_usesOneMinute', () => {
    expect(stepTime(0, 0, 1)).toBe(1)
  })
})

describe('normalizeMinuteStep', () => {
  it('withDivisorOfSixty_returnsStep', () => {
    expect(normalizeMinuteStep(10)).toBe(10)
    expect(normalizeMinuteStep(15)).toBe(15)
    expect(normalizeMinuteStep(30)).toBe(30)
  })

  it('withNonDivisor_fallsBackToTen', () => {
    expect(normalizeMinuteStep(7)).toBe(10)
    expect(normalizeMinuteStep(0)).toBe(10)
    expect(normalizeMinuteStep(90)).toBe(10)
  })
})

describe('createMinuteOptions', () => {
  it('default_returnsTenMinuteOptions', () => {
    expect(createMinuteOptions()).toEqual([
      '00',
      '10',
      '20',
      '30',
      '40',
      '50',
    ])
  })

  it('withStep_returnsExpectedInterval', () => {
    expect(createMinuteOptions(15)).toEqual(['00', '15', '30', '45'])
  })

  it('withNonDivisor_fallsBackToTenMinutes', () => {
    expect(createMinuteOptions(7)).toHaveLength(6)
  })
})
