/**
 * Simple wrapper to represent return value
 * plus transferable objects
 */
export function withTransferables(value: unknown, transferables: Transferable[]) {

  if (!transferables || !(Array.isArray(transferables))) {
    throw new Error("missing transferables array");
  }

  return new _WithTransferables(value, transferables);
}

export function isWithTransferables(value: unknown): value is WithTransferables {
  return value instanceof _WithTransferables;
}

class _WithTransferables {
  private value: unknown;
  private transferables: Transferable[];

  constructor(value: unknown, transferables: Transferable[]) {
    this.value = value;
    this.transferables = transferables;
  }

  unwrap() {
    return { value: this.value, transferables: this.transferables };
  }
}

export type WithTransferables =  _WithTransferables;