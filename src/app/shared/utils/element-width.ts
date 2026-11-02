import { afterNextRender, DestroyRef, ElementRef, inject, Signal, signal } from '@angular/core';

// Tracks the host element's width as a signal. Must be called in an injection context
// (a field initializer or constructor), like any other inject()-based helper.
// `fallback` is used until the first measurement and wherever ResizeObserver is missing (jsdom).
export function injectElementWidth(fallback = 600): Signal<number> {
  const host = inject<ElementRef<HTMLElement>>(ElementRef);
  const destroyRef = inject(DestroyRef);
  const width = signal(fallback);

  // afterNextRender only runs in the browser, after the element is in the DOM
  afterNextRender(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const measured = Math.round(entry.contentRect.width);
      if (measured > 0) width.set(measured);
    });
    observer.observe(host.nativeElement);
    destroyRef.onDestroy(() => observer.disconnect());
  });

  return width.asReadonly();
}
