export interface TOCConfig {
  contentSelector: string;
  linkSelector: string;
  headingSelector: string;
  activeClasses: string[];
  inactiveClasses: string[];
  rootMargin: string;
  threshold: number[];
  scrollOffset: string;
}

export class TableOfContents {
  private config: TOCConfig;
  private wrappingElement: Element | null = null;
  private observer: IntersectionObserver | null = null;
  private headings: NodeListOf<Element> | null = null;
  private lastVisibleHeading: string | null = null;

  constructor(config: Partial<TOCConfig> = {}) {
    this.config = {
      contentSelector: ".prose",
      linkSelector: ".toc-link",
      headingSelector: "h1, h2, h3",
      activeClasses: ["font-medium", "text-blue-400"],
      inactiveClasses: ["text-gray-300"],
      rootMargin: "0px 0px -80% 0px",
      threshold: [0, 0.1],
      scrollOffset: "scroll-mt-24",
      ...config,
    };
  }

  private updateLinkStyles(link: Element, isActive: boolean) {
    const classesToRemove = isActive
      ? this.config.inactiveClasses
      : this.config.activeClasses;
    const classesToAdd = isActive
      ? this.config.activeClasses
      : this.config.inactiveClasses;

    link.classList.remove(...classesToRemove);
    link.classList.add(...classesToAdd);
  }

  private resetAllLinks(): void {
    const links = document.querySelectorAll(this.config.linkSelector);
    links.forEach((link) => this.updateLinkStyles(link, false));
  }

  private findTargetLink(headingId: string): Element | null {
    return document.querySelector(
      `a[href="#${headingId}"]${this.config.linkSelector}`
    );
  }

  private findMostVisibleHeading(
    entries: IntersectionObserverEntry[]
  ): IntersectionObserverEntry | null {
    let mostVisible: IntersectionObserverEntry | null = null;
    let maxVisibility = 0;

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
        mostVisible = entry;
        maxVisibility = entry.intersectionRatio;
      }
    });

    return mostVisible;
  }

  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    const mostVisible = this.findMostVisibleHeading(entries);

    // Reset all links
    this.resetAllLinks();

    if (mostVisible) {
      const target = mostVisible.target as HTMLElement;
      if (target?.id) {
        this.lastVisibleHeading = target.id;
        const targetLink = this.findTargetLink(target.id);
        if (targetLink) {
          this.updateLinkStyles(targetLink, true);
        }
      }
    } else if (this.lastVisibleHeading) {
      // Keep last visible heading highlighted
      const targetLink = this.findTargetLink(this.lastVisibleHeading);
      if (targetLink) {
        this.updateLinkStyles(targetLink, true);
      }
    }
  };

  public init(): boolean {
    try {
      this.wrappingElement = document.querySelector(this.config.contentSelector);

      if (!this.wrappingElement) {
        console.warn(`TOC: ${this.config.contentSelector} element not found`);
        return false;
      }

      this.headings = this.wrappingElement.querySelectorAll(
        this.config.headingSelector
      );

      if (this.headings.length === 0) {
        console.warn(
          `TOC: No headings found in ${this.config.contentSelector}`
        );
        return false;
      }

      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: this.config.rootMargin,
        threshold: this.config.threshold,
      };

      this.observer = new IntersectionObserver(this.handleIntersection, options);

      this.headings.forEach((heading) => {
        heading.classList.add(this.config.scrollOffset);
        this.observer!.observe(heading);
      });


      return true;
    } catch (error) {
      console.error("TOC: Failed to initialize", error);
      return false;
    }
  }

  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.lastVisibleHeading = null;
    this.headings = null;
    this.wrappingElement = null;
  }

  public reinitialize(): void {
    this.cleanup();
    this.init();
  }
}

// Auto-initialize TOC
let tocInstance: TableOfContents | null = null;

function initTOC(): void {
  if (tocInstance) {
    tocInstance.cleanup();
  }
  tocInstance = new TableOfContents();
  tocInstance.init();
}

// Initialize on page load
initTOC();



// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (tocInstance) {
    tocInstance.cleanup();
  }
});
