import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import Tabs from "../../../../src/component/shared/tabs/Tabs";

class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe() {
    this.callback([{ isIntersecting: true }], this);
  }

  unobserve() {}

  disconnect() {}

  get root() {
    return null;
  }

  get rootMargin() {
    return "0px";
  }

  get thresholds() {
    return [0];
  }

  takeRecords() {
    return [];
  }
}

global.IntersectionObserver = IntersectionObserver;

describe("Tabs Component", () => {
  const renderTabs = (props) => {
    return render(
      <Tabs {...props}>
        <div>Tab 1</div>
        <div>Tab 2</div>
        <div>Tab 3</div>
      </Tabs>
    );
  };

  test("renders tabs with horizontal orientation by default", () => {
    const { container } = renderTabs({});
    const tabsContainer = container.querySelector(".MinervaTabsContainer");
    expect(tabsContainer.className).toContain("MinervaHorizontalTabsContainer");
  });

  test("renders tabs with vertical orientation when specified", () => {
    const { container } = renderTabs({ orientation: "vertical" });
    const tabsContainer = container.querySelector(".MinervaTabsContainer");
    expect(tabsContainer.className).toContain("MinervaVerticalTabsContainer");
  });

  test("does not show scroll buttons when content does not overflow", () => {
    const { container } = renderTabs({ scrollable: false });
    const leftButton = container.querySelector(".MinervaIconButton");
    const rightButton = container.querySelector(".MinervaIconButton:last-of-type");
    expect(leftButton).toBeNull();
    expect(rightButton).toBeNull();
  });

  test("scrolls right when right button is clicked", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "horizontal",
    });
    const rightButton = container.querySelector(".MinervaIconButton:last-of-type");
    const tabsContainer = container.querySelector(".MinervaTabs");

    if (rightButton && tabsContainer) {
      fireEvent.click(rightButton);
      await waitFor(() => {
        expect(tabsContainer.scrollLeft).toBeGreaterThan(0);
      });
    }
  });

  test("scrolls left when left button is clicked", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "horizontal",
    });
    const leftButton = container.querySelector(".MinervaIconButton");
    const tabsContainer = container.querySelector(".MinervaTabs");

    if (leftButton && tabsContainer) {
      fireEvent.click(leftButton);
      await waitFor(() => {
        expect(tabsContainer.scrollLeft).toBeLessThan(tabsContainer.scrollWidth);
      });
    }
  });

  test("scrolls down when down button is clicked (vertical)", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "vertical",
    });
    const downButton = container.querySelector(".MinervaIconButton:last-of-type");
    const tabsContainer = container.querySelector(".MinervaTabs");

    if (downButton && tabsContainer) {
      fireEvent.click(downButton);
      await waitFor(() => {
        expect(tabsContainer.scrollTop).toBeGreaterThan(0);
      });
    }
  });

  test("scrolls up when up button is clicked (vertical)", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "vertical",
    });
    const upButton = container.querySelector(".MinervaIconButton");
    const tabsContainer = container.querySelector(".MinervaTabs");

    if (upButton && tabsContainer) {
      fireEvent.click(upButton);
      await waitFor(() => {
        expect(tabsContainer.scrollTop).toBeLessThan(tabsContainer.scrollHeight);
      });
    }
  });

  test("hides scroll buttons when scrolled to the beginning (horizontal)", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "horizontal",
    });
    const tabsContainer = container.querySelector(".MinervaTabs");
    tabsContainer.scrollLeft = 0;

    const leftButton = container.querySelector(".MinervaIconButton");
    expect(leftButton).toBeNull();
  });

  test("hides scroll buttons when scrolled to the end (horizontal)", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "horizontal",
    });
    const tabsContainer = container.querySelector(".MinervaTabs");
    tabsContainer.scrollLeft = tabsContainer.scrollWidth;

    const rightButton = container.querySelector(".MinervaIconButton:last-of-type");
    expect(rightButton).toBeNull();
  });

  test("hides scroll buttons when scrolled to the top (vertical)", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "vertical",
    });
    const tabsContainer = container.querySelector(".MinervaTabs");
    tabsContainer.scrollTop = 0;

    const upButton = container.querySelector(".MinervaIconButton");
    expect(upButton).toBeNull();
  });

  test("hides scroll buttons when scrolled to the bottom (vertical)", async () => {
    const { container } = renderTabs({
      scrollable: true,
      orientation: "vertical",
    });
    const tabsContainer = container.querySelector(".MinervaTabs");
    tabsContainer.scrollTop = tabsContainer.scrollHeight;

    const downButton = container.querySelector(".MinervaIconButton:last-of-type");
    expect(downButton).toBeNull();
  });
});
