import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValorComDebounce } from './useValorComDebounce';

describe('useValorComDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('mantém o valor antigo até o atraso passar', () => {
    const { result, rerender } = renderHook(({ valor }) => useValorComDebounce(valor, 400), {
      initialProps: { valor: 'a' },
    });

    rerender({ valor: 'ab' });
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab');
  });

  it('reinicia a contagem a cada novo valor', () => {
    const { result, rerender } = renderHook(({ valor }) => useValorComDebounce(valor, 400), {
      initialProps: { valor: 'a' },
    });

    rerender({ valor: 'ab' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ valor: 'abc' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });
});