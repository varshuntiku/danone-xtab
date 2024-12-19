import { fireEvent, render, screen, waitFor } from '@testing-library/preact';
import Popover from '../../../../src/component/shared/popover/Popover';
import { useEffect, useRef, useState } from 'preact/hooks';
import { act } from 'preact/test-utils';

describe('Popover test', () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.close = function() {this.open = false};
      });
    test('component should render', () => {
        const { container } = render(<Popover open={true}>
            <div><h1>Hello</h1></div>
        </Popover>);
        expect(container.textContent).toMatch("Hello");
    });

    test('component should render: anchor resize', async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });
    test("component should render: anchor resize : anchorOrigin.vertical == 'center', anchorOrigin.horizontal == 'center'", async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} anchorOrigin={{vertical:"center", horizontal: "center"}}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : anchorOrigin.vertical == 'buttom', anchorOrigin.horizontal == 'right'", async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} anchorOrigin={{vertical:"bottom", horizontal: "right"}}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : transformOrigin.vertical == 'center', transformOrigin.horizontal == 'center'", async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} transformOrigin={{vertical:"center", horizontal: "center"}}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : transformOrigin.vertical == 'bottom', transformOrigin.horizontal == 'right'", async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} transformOrigin={{vertical:"bottom", horizontal: "right"}}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : anchorPosition", async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} anchorPosition={{top:0, left: 0}}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : window.innerWidth > 768)", async () => {
        window.innerWidth = 700;
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} anchorPosition={{top:0, left: 0}}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        Button.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : popover resize", async () => {
        // window.innerWidth = 700;
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        const popover = screen.getByLabelText("popover");
        popover.dispatchEvent(
            new Event('resize', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : backdrop onClick", async () => {
        // window.innerWidth = 700;
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const onClose = jest.fn();
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} onClose={onClose}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        const popover = screen.getByLabelText("popover");
        popover.dispatchEvent(
            new Event('click', { bubbles: true })
        )
        expect(onClose).toBeCalled();
    });

    test("component should render: anchor resize : backdrop onClick no onClose", async () => {
        // window.innerWidth = 700;
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} >
                <div><h1>Hello</h1></div>
            </Popover></>);
        const popover = screen.getByLabelText("popover");
        popover.dispatchEvent(
            new Event('click', { bubbles: true })
        )
        expect(container.textContent).toMatch("Hello");
    });

    test("component should render: anchor resize : open = false", async () => {
        // window.innerWidth = 700;
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<PopoverCloseTest />);
        /** @type HTMLDialogElement */
        const popover = screen.getByLabelText("popover");
        await waitFor(() => {
            expect(popover.open).toBeFalsy();
        }, {timeout: 300})
    });

    test('component should render: set timeout', async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} >
                <div><h1>Hello</h1></div>
            </Popover></>);
        act(() => {
            jest.runOnlyPendingTimers();
        })
        await waitFor(() => {
            expect(container.textContent).toMatch("Hello");
        },  {timeout: 300})
    });

    test('component should render: fullscreen', async () => {
        const Button = document.createElement("button");
        Button.innerHTML = "Anchor Btn";
        const { container } = render(<>
            {Button}
            <Popover open={true} anchorEle={Button} fullscreen={true}>
                <div><h1>Hello</h1></div>
            </Popover></>);
        act(() => {
            jest.runOnlyPendingTimers();
        })
        await waitFor(() => {
            expect(container.textContent).toMatch("Hello");
        },  {timeout: 300})
        expect(container.textContent).toMatch("Hello");
        // expect(container.querySelector("MinervaPopover-fullscreen")).toBeTruthy();
    });
});

function PopoverCloseTest(){
    const Button = document.createElement("button");
    Button.innerHTML = "Anchor Btn";
    const [open, setOpen] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setOpen(false)
        }, 100);
    })
    return (<>
        {Button}
        <Popover open={open} anchorEle={Button} >
            <div><h1>Hello</h1></div>
        </Popover></>);
}