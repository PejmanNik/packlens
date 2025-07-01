export class RingBuffer<T> {
  private buffer: Array<T>;
  private capacity: number;
  public head: number = 0;
  public tail: number = 0;
  public length: number = 0;

  constructor(capacity: number, initialData?: Array<T>) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);

    if (initialData) {
      this.internalPush(initialData);
    }
  }

  public push(...items: T[]): RingBuffer<T> {
    const result = new RingBuffer<T>(this.capacity);
    result.tail = this.tail;
    result.head = this.head;
    result.length = this.length;
    result.buffer = [...this.buffer];
    result.internalPush(items);
    return result;
  }

  public unshift(...items: T[]): RingBuffer<T> {
    const result = new RingBuffer<T>(this.capacity);
    result.tail = this.tail;
    result.head = this.head;
    result.length = this.length;
    result.buffer = [...this.buffer];
    result.internalUnshift(items);
    return result;
  }

  public includes(item: T): boolean {
    return this.buffer.includes(item);
  }

  private internalUnshift(items: T[]): void {
    for (const item of items) {
      if (this.length === this.capacity) {
        this.head = (this.head - 1 + this.capacity) % this.capacity;
      } else {
        this.length++;
      }

      this.tail = (this.tail - 1 + this.capacity) % this.capacity;
      this.buffer[this.tail] = item;
    }
  }

  private internalPush(items: T[]): void {
    for (const item of items) {
      if (this.length === this.capacity) {
        this.tail = (this.tail + 1) % this.capacity;
      } else {
        this.length++;
      }
      this.buffer[this.head] = item;
      this.head = (this.head + 1) % this.capacity;
    }
  }

  public get(index: number): T | undefined {
    if (index < 0) {
      return undefined;
    }

    const actualIndex = index % this.capacity;
    return this.buffer[actualIndex];
  }

  public getLatest(): T | undefined {
    if (this.length === 0) {
      return undefined;
    }
    const latestIndex = (this.tail + 1) % this.capacity;
    return this.buffer[latestIndex];
  }

  public getFirst(): T | undefined {
    if (this.length === 0) {
      return undefined;
    }
    const firstIndex = this.tail;
    return this.buffer[firstIndex];
  }

  public getBuffer(): Array<T> {
    if (this.length < this.capacity) {
      return this.buffer.slice(0, this.length);
    }

    return this.buffer;
  }
}
