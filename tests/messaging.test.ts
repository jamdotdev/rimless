import { describe, it, expect, vi, afterEach } from "vitest";

// Utility to load helpers fresh for each test when needed
async function loadHelpers() {
  return await import("../src/helpers");
}

describe("isIframe", () => {
  const originalSelf = window.self;
  const originalTop = window.top;

  afterEach(() => {
    window.self = originalSelf;
    window.top = originalTop;
  });

  it("returns true when window.self and window.top differ", async () => {
    const helpers = await loadHelpers();
    window.self = {} as any;
    window.top = {} as any;
    expect(helpers.isIframe()).toBe(true);
  });

  it("returns false when window.self equals window.top", async () => {
    const helpers = await loadHelpers();
    const same = {} as any;
    window.self = same;
    window.top = same;
    expect(helpers.isIframe()).toBe(false);
  });
});

// Tests for isNodeWorker and isWorkerLike

describe("isNodeWorker and isWorkerLike", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unmock("worker_threads");
  });

  it("detects Web Worker instances", async () => {
    class FakeWorker {
      postMessage() {}
    }
    (global as any).Worker = FakeWorker as any;
    const helpers = await loadHelpers();
    const worker = new FakeWorker();
    expect(helpers.isWorkerLike(worker as any)).toBe(true);
    delete (global as any).Worker;
  });

  it("returns false for regular objects", async () => {
    const helpers = await loadHelpers();
    expect(helpers.isWorkerLike({} as any)).toBe(false);
  });
});

describe("isSharedWorker", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("returns false (without throwing) when SharedWorker is not defined", async () => {
    const original = (globalThis as any).SharedWorker;
    delete (globalThis as any).SharedWorker;
    try {
      const helpers = await loadHelpers();
      expect(() => helpers.isSharedWorker({} as any)).not.toThrow();
      expect(helpers.isSharedWorker({} as any)).toBe(false);
    } finally {
      if (original !== undefined) {
        (globalThis as any).SharedWorker = original;
      }
    }
  });

  it("detects SharedWorker instances when the global is present", async () => {
    class FakeSharedWorker {
      port = {};
    }
    (globalThis as any).SharedWorker = FakeSharedWorker as any;
    try {
      const helpers = await loadHelpers();
      expect(helpers.isSharedWorker(new FakeSharedWorker() as any)).toBe(true);
      expect(helpers.isSharedWorker({} as any)).toBe(false);
    } finally {
      delete (globalThis as any).SharedWorker;
    }
  });
});

describe("generateId", () => {
  it("creates ids of requested length", async () => {
    const helpers = await loadHelpers();
    expect(helpers.generateId(15)).toHaveLength(15);
  });

  it("creates unique ids", async () => {
    const helpers = await loadHelpers();
    expect(helpers.generateId()).not.toBe(helpers.generateId());
  });
});

