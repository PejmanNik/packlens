import { clientPrefix } from "../Utils/logger";

export class PageLoader {
  public enabled: boolean;
  public isLoading: boolean;
  private loadingPromise?: Promise<void>;
  private resolvers: Map<number, () => void>;
  requestPageLoad: (pageNumber: number) => void;

  constructor(requestPageLoad: (pageNumber: number) => void) {
    this.requestPageLoad = requestPageLoad;
    this.enabled = false;
    this.isLoading = false;
    this.loadingPromise = undefined;
    this.resolvers = new Map<number, () => void>();
  }

  public setEnabled() {
    const pageNumber = 1;
    this.enabled = true;
    this.isLoading = true;
    this.loadingPromise = new Promise<void>((resolve) => {
      this.resolvers.set(pageNumber, resolve);
    });
  }

  public resolveLoading(pageNumber: number) {
    if (!this.resolvers.has(pageNumber)) {
      return;
    }

    console.debug(clientPrefix, "page load completed", { pageNumber });
    this.isLoading = false;
    this.resolvers.get(pageNumber)?.();
    this.resolvers.delete(pageNumber);
  }

  public async loadPage(pageNumber: number): Promise<void> {
    if (!this.enabled || this.resolvers.has(pageNumber)) {
      return;
    }

    this.loadingPromise ??= Promise.resolve();

    const nextPage = Promise.withResolvers<void>();

    this.resolvers.set(pageNumber, nextPage.resolve);

    this.loadingPromise = this.loadingPromise.then(() => {
      console.debug(clientPrefix, "loading page", { pageNumber });
      this.isLoading = true;
      this.requestPageLoad(pageNumber);
      return nextPage.promise;
    });
  }
}
