import { render } from '@testing-library/preact';
import TabPanel from '../../../../src/component/shared/tabs/TabPanel';

describe('TabPanel', () => {
    it('should render children correctly and apply active class when activeTabIndex matches index', () => {
        const { container } = render(
            <TabPanel activeTabIndex={1} index={1}>
                <div>Test Content</div>
            </TabPanel>
        );

        const content = container.querySelector('div');
        expect(content).not.toBeNull();
        expect(content.textContent).toBe('Test Content');

        const tabPanel = container.querySelector('.MinervaTabPanel');
        expect(tabPanel).not.toBeNull();
        expect(tabPanel.className.includes('MinervaActiveTabPanel')).toBe(true);
    });

    it('should not apply active class when activeTabIndex does not match index', () => {
        const { container } = render(
            <TabPanel activeTabIndex={0} index={1}>
                <div>Test Content</div>
            </TabPanel>
        );

        const content = container.querySelector('div');
        expect(content).not.toBeNull();
        expect(content.textContent).toBe('Test Content');

        const tabPanel = container.querySelector('.MinervaTabPanel');
        expect(tabPanel).not.toBeNull();
        expect(tabPanel.className.includes('MinervaActiveTabPanel')).toBe(false);
    });
});
