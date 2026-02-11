import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

/**
 * Run accessibility checks on the main content area, excluding header and footer
 * This focuses on the application content between the nav-dekoratoren header and footer
 *
 * Note: svg-img-alt rule is disabled as the violations come from @navikt/ds-react button icons
 * which are part of the design system and outside the scope of this application's accessibility tests
 */
export async function checkAccessibility(page: Page) {
    return new AxeBuilder({ page })
        .include("#maincontent") // Only include the main content area
        .analyze();
}
