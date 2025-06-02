import { describe, it, expect } from 'vitest';
import interpAuthLevel from './authLevel';

describe('interpAuthLevel', () => {
  it('should return 6 for Wizard', () => {
    expect(interpAuthLevel('Wizard')).toBe(6);
  });

  it('should return 5 for HeadGM', () => {
    expect(interpAuthLevel('HeadGM')).toBe(5);
  });

  it('should return 4 for SecondGM', () => {
    expect(interpAuthLevel('SecondGM')).toBe(4);
  });

  it('should return 3 for Approver', () => {
    expect(interpAuthLevel('Approver')).toBe(3);
  });

  it('should return 2 for Writer', () => {
    expect(interpAuthLevel('Writer')).toBe(2);
  });

  it('should return 1 for Reader', () => {
    expect(interpAuthLevel('Reader')).toBe(1);
  });

  it('should return 0 for unknown auth level', () => {
    expect(interpAuthLevel('Unknown')).toBe(0);
    expect(interpAuthLevel('')).toBe(0);
    expect(interpAuthLevel(null)).toBe(0);
    expect(interpAuthLevel(undefined)).toBe(0);
  });
});