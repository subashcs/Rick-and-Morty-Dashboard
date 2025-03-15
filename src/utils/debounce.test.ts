import { debounce } from './debounce'; // Adjust path if necessary

describe('debounce', () => {
  it('should call the function after the specified delay', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled(); // Should not be called immediately

    await new Promise((resolve) => setTimeout(resolve, 250)); // Wait for execution

    expect(mockFn).toHaveBeenCalledTimes(1); // Should be called once
  });

  it('should cancel previous calls if invoked within the delay', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 200);

    // Multiple calls within 200ms
    debouncedFn();
    debouncedFn();
    debouncedFn();

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(mockFn).toHaveBeenCalledTimes(1); // Should be called only once
  });

  it('should be called with the correct arguments', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn('Hello', 42);

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(mockFn).toHaveBeenCalledWith('Hello', 42);
  });

  it('should reset the timer if called again before the delay', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('q');
    await new Promise((resolve) => setTimeout(resolve, 150));
    debouncedFn('w'); // Call again before delay expires

    // Wait for next 300 seconds for final execution
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Only one last call should execute
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
